import fs from "node:fs";
import path from "node:path";
import type {
  AnalysisResult,
  Fixture,
  Locator,
  Navigation,
  Route,
  RouteAssertion
} from "./types.js";

/**
 * Source paths are carried project-relative by the analyzers (e.g. "src/App.tsx").
 * The markdown artifacts live outside the analyzed project, so a reader needs the
 * path re-based on the doc's own directory to be able to click through. The JSON
 * manifest keeps the canonical project-relative form for tooling.
 *
 * This single re-basing is the fix for the doubled `path.relative` call that
 * previously produced a mixed `src/App.tsx` / `../frontend/src/App.tsx` doc.
 */
function docRelative(
  sourceFile: string,
  docPath: string,
  targetProject: string
): string {
  const absolute = path.resolve(
    targetProject,
    sourceFile
  );

  return path.relative(
    path.dirname(docPath),
    absolute
  );
}

/** Escape a value for use inside a markdown table cell. */
function cell(value: string): string {
  return value
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

/**
 * Render a value as inline code. Analyzers keep template literals verbatim
 * (`` `/orders/${id}` ``) so a reader can tell a dynamic target from a literal
 * one — those already carry their own backticks, so do not wrap them again.
 */
function code(value: string): string {
  const trimmed = value.trim();

  if (
    trimmed.length > 1 &&
    trimmed.startsWith("`") &&
    trimmed.endsWith("`")
  ) {
    return cell(trimmed);
  }

  return `\`${cell(trimmed)}\``;
}

/** Split a "file:line" location emitted by an analyzer into its parts. */
function splitLocation(
  location: string
): { file: string; line: string } {
  const match = /^(.*):(\d+)$/.exec(location);

  if (!match) {
    return { file: location, line: "" };
  }

  return {
    file: match[1] ?? location,
    line: match[2] ?? ""
  };
}

function describeLocator(
  locator: Locator | undefined
): string {
  if (!locator) return "—";

  if (locator.strategy === "testid") {
    return `getByTestId(${code(locator.testId ?? "?")})`;
  }

  if (locator.strategy === "role") {
    const name = locator.name
      ? `, { name: ${code(locator.name)} }`
      : "";
    return `getByRole(${code(locator.role ?? "?")}${name})`;
  }

  return locator.name
    ? `getByText(${code(locator.name)})`
    : "unresolved";
}

function describeFixture(fixture: Fixture): string[] {
  const lines: string[] = [];

  lines.push(
    `### ${fixture.entity} — ${code(fixture.exportName)}`
  );
  lines.push("");
  lines.push(
    `- Module: ${code(fixture.module)}`
  );
  lines.push(
    `- Identifier field: ${code(fixture.idField)}`
  );
  lines.push(
    `- Ids (${fixture.ids.length}): ${fixture.ids.map(code).join(", ")}`
  );

  const sampleEntries = Object.entries(
    fixture.sample
  );

  if (sampleEntries.length > 0) {
    lines.push("- Sample:");
    lines.push("");
    lines.push(
      "  ```json"
    );
    lines.push(
      `  ${JSON.stringify(fixture.sample, null, 2).split("\n").join("\n  ")}`
    );
    lines.push("  ```");
  }

  lines.push("");
  return lines;
}

function describeAssertions(
  assertion: RouteAssertion
): string[] {
  const lines: string[] = [];

  lines.push(`### ${code(assertion.route)}`);
  lines.push("");

  if (assertion.heading) {
    lines.push(
      `- Heading: ${code(assertion.heading)}`
    );
  }

  lines.push(
    `- State dependent: ${assertion.stateDependent ? "yes — assertions vary with store/param state" : "no"}`
  );

  if (assertion.landmarks.length > 0) {
    lines.push("- Landmarks:");
    for (const landmark of assertion.landmarks) {
      lines.push(`  - ${code(landmark)}`);
    }
  } else {
    lines.push(
      "- Landmarks: none extracted"
    );
  }

  const feedback = assertion.transientFeedback ?? [];

  if (feedback.length > 0) {
    lines.push(
      "- Transient feedback (assert via `getByRole('status')`, not page content):"
    );
    for (const message of feedback) {
      lines.push(`  - ${code(message)}`);
    }
  }

  lines.push("");
  return lines;
}

/** The human-facing flow document. Pages, then navigation edges. */
export function writeApplicationFlow(
  result: AnalysisResult,
  outputPath: string
): void {
  const lines: string[] = [];

  lines.push("# Application Flow");
  lines.push("");
  lines.push(
    `Analyzed: \`${result.targetProject}\``
  );
  lines.push("");
  lines.push("## Pages");
  lines.push("");

  for (const route of result.routes) {
    // The catch-all path is "*" — escape it so it does not close the bold marker.
    lines.push(
      `- **${route.path.replace(/\*/g, "\\*")}**`
    );

    if (route.component) {
      lines.push(
        `  - Component: ${route.component}`
      );
    }

    if (route.guards.length > 0) {
      lines.push(
        `  - Guards: ${route.guards.join(", ")}`
      );
    }

    if (route.stores.length > 0) {
      lines.push(
        `  - Gating stores: ${route.stores.join(", ")}`
      );
    }

    lines.push(
      `  - Source: ${docRelative(route.sourceFile, outputPath, result.targetProject)}:${route.line}`
    );

    lines.push("");
  }

  lines.push("## Navigation");
  lines.push("");

  for (const navigation of result.navigations) {
    lines.push(
      `- **${navigation.from}** → ${navigation.to}`
    );
    lines.push(
      `  - Type: ${navigation.type}`
    );
    lines.push(
      `  - Locator: ${describeLocator(navigation.locator)}`
    );
    lines.push(
      `  - Condition: ${navigation.condition.description}`
    );
    lines.push(
      `  - Source: ${docRelative(navigation.sourceFile, outputPath, result.targetProject)}:${navigation.line}`
    );

    lines.push("");
  }

  fs.writeFileSync(
    outputPath,
    lines.join("\n"),
    "utf8"
  );
}

/**
 * The machine-facing manifest. Everything a Playwright generator needs that a
 * navigation graph alone does not carry: locators, preconditions, seed data and
 * assertable content.
 */
export function writeTestabilityManifest(
  result: AnalysisResult,
  markdownPath: string,
  jsonPath: string
): void {
  const lines: string[] = [];

  lines.push("# Testability Manifest");
  lines.push("");
  lines.push(
    `Analyzed: \`${result.targetProject}\``
  );
  lines.push("");
  lines.push(
    "Companion to [application-flow.md](./application-flow.md). Machine-readable form: " +
      `[${path.basename(jsonPath)}](./${path.basename(jsonPath)}).`
  );
  lines.push("");

  lines.push("## Routes");
  lines.push("");
  lines.push(
    "| Path | Component | Guards | Gating stores | Source |"
  );
  lines.push("|---|---|---|---|---|");

  for (const route of result.routes) {
    lines.push(
      `| ${code(route.path)} | ${cell(route.component ?? "—")} | ${
        route.guards.length > 0
          ? route.guards.map(code).join(", ")
          : "—"
      } | ${
        route.stores.length > 0
          ? route.stores.map(code).join(", ")
          : "—"
      } | ${code(docRelative(route.sourceFile, markdownPath, result.targetProject) + ":" + route.line)} |`
    );
  }

  lines.push("");

  lines.push("## Navigation edges");
  lines.push("");
  lines.push(
    "| # | From | To | Type | Locator | Precondition | Source |"
  );
  lines.push("|---|---|---|---|---|---|---|");

  result.navigations.forEach((navigation: Navigation, index: number) => {
    lines.push(
      `| ${index + 1} | ${cell(navigation.from)} | ${code(navigation.to)} | ${
        navigation.type
      } | ${describeLocator(navigation.locator)} | ${
        cell(navigation.condition.description)
      } | ${code(docRelative(navigation.sourceFile, markdownPath, result.targetProject) + ":" + navigation.line)} |`
    );
  });

  lines.push("");

  const ambiguous = result.navigations.filter(
    (navigation) => navigation.locator?.ambiguous
  );

  lines.push("## Locators needing disambiguation");
  lines.push("");

  if (ambiguous.length === 0) {
    lines.push(
      "None — every edge resolves to a unique locator."
    );
  } else {
    lines.push(
      "These resolve to more than one element. A generated test must narrow them " +
        "(by role, by scoping to a container, or by adding a `data-testid`)."
    );
    lines.push("");

    for (const navigation of ambiguous) {
      const locator = navigation.locator;

      if (!locator) continue;

      lines.push(
        `- ${describeLocator(locator)} — from ${cell(navigation.from)} at ${code(
          docRelative(navigation.sourceFile, markdownPath, result.targetProject) + ":" + navigation.line
        )}`
      );

      for (const collision of locator.collisions ?? []) {
        const { file, line } = splitLocation(collision);

        lines.push(
          `  - also matches ${code(
            docRelative(file, markdownPath, result.targetProject) + ":" + line
          )}`
        );
      }
    }
  }

  lines.push("");

  lines.push("## Fixtures");
  lines.push("");

  if (result.fixtures.length === 0) {
    lines.push(
      "No seed-data modules detected."
    );
    lines.push("");
  } else {
    for (const fixture of result.fixtures) {
      lines.push(...describeFixture(fixture));
    }
  }

  lines.push("## Route assertions");
  lines.push("");
  lines.push(
    "`Transient feedback` entries are shown as `react-hot-toast` toasts, which mount " +
      "outside the component tree. Assert them with `getByRole('status')` — that role is " +
      "applied by the library, so no source change is required — scoped with " +
      "`.filter({ hasText: ... })` because the role is shared by all toasts. The Toaster is " +
      "configured with `duration: 4000` (`src/main.tsx`), so the assertion must land inside " +
      "that window."
  );
  lines.push("");

  for (const assertion of result.assertions) {
    lines.push(...describeAssertions(assertion));
  }

  lines.push("## App-level feedback");
  lines.push("");
  lines.push(
    "Surfaced by components mounted alongside the router rather than inside any " +
      "route (`AuthModal`, `Header`). These carry no route of their own, so they are " +
      "not reachable via `Route assertions` — but authentication, the gateway to every " +
      "guarded route, reports its outcome here and nowhere else. Same toast locator " +
      "rules as above."
  );
  lines.push("");

  if (result.appLevelFeedback.length === 0) {
    lines.push("None extracted.");
  } else {
    for (const message of result.appLevelFeedback) {
      lines.push(`- ${code(message)}`);
    }
  }

  lines.push("");

  fs.writeFileSync(
    markdownPath,
    lines.join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    jsonPath,
    JSON.stringify(result, null, 2),
    "utf8"
  );
}
