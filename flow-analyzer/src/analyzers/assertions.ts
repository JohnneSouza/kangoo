import path from "node:path";
import { SyntaxKind } from "ts-morph";
import type {
  JsxElement,
  JsxSelfClosingElement,
  Node,
  Project,
  SourceFile,
} from "ts-morph";

import type { Route, RouteAssertion } from "../types.js";

/**
 * Maximum number of landmarks extracted per route, in document order.
 */
const MAX_LANDMARKS = 12;

/**
 * Build a RouteAssertion for every route in `routes`, preserving order.
 *
 * Routes without a resolvable component get a thin entry (`landmarks: []`,
 * `stateDependent: true`) rather than being omitted — a missing entry is
 * worse for the generator than a thin one.
 */
export function analyzeAssertions(
  project: Project,
  targetProject: string,
  routes: Route[]
): RouteAssertion[] {
  const index = buildComponentIndex(project, targetProject);

  return routes.map((route) => analyzeRoute(route, index));
}

/**
 * Static feedback (toasts) surfaced by components rendered at the app level —
 * siblings of the router in `App.tsx` rather than children of any route
 * (`AuthModal`, `Header`, ...). These carry no route of their own but are the
 * only assertion surface for the auth gate in front of protected routes.
 */
export function analyzeAppLevelFeedback(
  project: Project,
  targetProject: string
): string[] {
  const index = buildComponentIndex(project, targetProject);
  const appFile = findAppComponentFile(project);

  if (!appFile) {
    return [];
  }

  return collectFeedbackFromRoots(collectAppLevelRoots(appFile, index), index);
}

function analyzeRoute(
  route: Route,
  index: Map<string, Node>
): RouteAssertion {
  const component = route.component;

  if (!component) {
    return { route: route.path, landmarks: [], stateDependent: true };
  }

  const node = index.get(component);

  if (!node) {
    return { route: route.path, landmarks: [], stateDependent: true };
  }

  const { heading, landmarks } = extractContent(node);
  const stateDependent = isStateDependent(node);
  const transientFeedback = collectTransientFeedback(node, index);

  return {
    route: route.path,
    landmarks,
    stateDependent,
    ...(heading !== undefined ? { heading } : {}),
    ...(transientFeedback.length > 0 ? { transientFeedback } : {}),
  };
}

/**
 * Index every exported component under `src/pages/` and `src/components/` by
 * name (pages first, first match wins). Matches `export function <Name>` and
 * `export const <Name>`.
 */
function buildComponentIndex(
  project: Project,
  targetProject: string
): Map<string, Node> {
  const index = new Map<string, Node>();

  for (const dir of ["src/pages", "src/components"]) {
    for (const sourceFile of project.getSourceFiles()) {
      const rel = path.relative(targetProject, sourceFile.getFilePath());

      if (rel !== dir && !rel.startsWith(`${dir}/`)) {
        continue;
      }

      for (const fn of sourceFile.getFunctions()) {
        const name = fn.getName();
        if (name && fn.isExported() && !index.has(name)) {
          index.set(name, fn);
        }
      }

      for (const declaration of sourceFile.getVariableDeclarations()) {
        const name = declaration.getName();
        if (
          name &&
          declaration.getVariableStatement()?.isExported() &&
          !index.has(name)
        ) {
          index.set(name, declaration);
        }
      }
    }
  }

  return index;
}

/**
 * The source file that renders the router's `<Routes>` element, i.e. the app
 * shell (`App.tsx`). Components rendered as siblings of `<Routes>` are the
 * app-level surface.
 */
function findAppComponentFile(
  project: Project
): SourceFile | undefined {
  for (const sourceFile of project.getSourceFiles()) {
    const hasRoutes = sourceFile
      .getDescendantsOfKind(SyntaxKind.JsxElement)
      .some((element) => jsxTagName(element) === "Routes");

    if (hasRoutes) {
      return sourceFile;
    }
  }

  return undefined;
}

/**
 * Components referenced in the app shell OUTSIDE `<Routes>`, in source order.
 * Deduped by tag name.
 */
function collectAppLevelRoots(
  appFile: SourceFile,
  index: Map<string, Node>
): Node[] {
  const routesElement = appFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .find((element) => jsxTagName(element) === "Routes");

  const roots: Node[] = [];
  const seenTags = new Set<string>();

  appFile.forEachDescendant((descendant) => {
    if (
      !descendant.isKind(SyntaxKind.JsxElement) &&
      !descendant.isKind(SyntaxKind.JsxSelfClosingElement)
    ) {
      return;
    }

    if (routesElement && isDescendantOf(descendant, routesElement)) {
      return; // inside <Routes> — route-scoped, not app-level
    }

    const element =
      descendant.asKind(SyntaxKind.JsxElement) ??
      descendant.asKind(SyntaxKind.JsxSelfClosingElement);
    if (!element) return;

    const tag = jsxTagName(element);
    const node = index.get(tag);

    if (node && !seenTags.has(tag)) {
      seenTags.add(tag);
      roots.push(node);
    }
  });

  return roots;
}

function isDescendantOf(node: Node, ancestor: Node): boolean {
  let current = node.getParent();
  while (current) {
    if (current === ancestor) {
      return true;
    }
    current = current.getParent();
  }
  return false;
}

/**
 * Walk a component and extract its primary h1 heading plus stable landmarks.
 *
 * A heading is only reported when at least one literal `<h1>` sits on the
 * unconditional render path. An `<h1>` inside an early-return or conditional
 * branch is a branch-specific message (`"Produto não encontrado"`), not the
 * page's heading — a test asserting it against a happy-path visit would fail.
 * `{}` expression subtrees are skipped entirely (not statically known).
 */
function extractContent(node: Node): {
  heading: string | undefined;
  landmarks: string[];
} {
  const headingCandidates: { text: string; unconditional: boolean }[] = [];
  const landmarks: string[] = [];
  const seen = new Set<string>();

  const pushLandmark = (raw: string): void => {
    const text = normalizeText(raw);
    if (!text) return;
    if (!/[A-Za-z0-9]/.test(text)) return; // pure punctuation/whitespace run
    if (text.length < 4) return;
    if (looksLikeCssUtility(text)) return;
    if (seen.has(text)) return;
    seen.add(text);
    landmarks.push(text);
  };

  const walk = (current: Node): void => {
    current.forEachChild((child) => {
      if (child.isKind(SyntaxKind.JsxExpression)) {
        return; // skip `{...}` — not statically known
      }

      if (
        child.isKind(SyntaxKind.JsxElement) ||
        child.isKind(SyntaxKind.JsxSelfClosingElement)
      ) {
        const element =
          child.asKind(SyntaxKind.JsxElement) ??
          child.asKind(SyntaxKind.JsxSelfClosingElement);

        if (!element) return;

        const tag = jsxTagName(element);

        if (tag === "h1") {
          const text = normalizeText(literalText(element));
          if (text) {
            headingCandidates.push({
              text,
              unconditional: isUnconditional(element, node),
            });
          }
          return;
        }

        if (tag === "h2" || tag === "h3") {
          // Each literal run is a separate candidate — never join across `{}`
          // (`Itens ({count})` -> "Itens (" and ")", not "Itens ()").
          for (const run of collectTextRuns(element)) {
            pushLandmark(run);
          }
          return;
        }

        walk(element);
        return;
      }

      if (child.isKind(SyntaxKind.JsxFragment)) {
        walk(child);
        return;
      }

      if (child.isKind(SyntaxKind.JsxText)) {
        pushLandmark(child.getText());
        return;
      }

      walk(child);
    });
  };

  walk(node);

  const heading = headingCandidates.find((c) => c.unconditional)?.text;

  return { heading, landmarks: landmarks.slice(0, MAX_LANDMARKS) };
}

/**
 * Collect each literal `JsxText` run in `node`'s subtree as a separate string,
 * in document order, skipping `JsxExpression` subtrees. Unlike `literalText`,
 * runs on either side of a `{}` interpolation are NOT joined — joining them
 * produces strings (`Itens ()`) that can never match rendered output.
 */
function collectTextRuns(node: Node): string[] {
  const runs: string[] = [];

  node.forEachChild((child) => {
    if (child.isKind(SyntaxKind.JsxExpression)) {
      return;
    }
    if (child.isKind(SyntaxKind.JsxText)) {
      runs.push(child.getText());
      return;
    }
    runs.push(...collectTextRuns(child));
  });

  return runs;
}

/**
 * True when `node` lies on the unconditional render path of `root`: no
 * `if`/ternary/switch/loop ancestor separates it from the component body.
 */
function isUnconditional(node: Node, root: Node): boolean {
  let current = node.getParent();

  while (current && current !== root) {
    const kind = current.getKind();

    if (
      kind === SyntaxKind.IfStatement ||
      kind === SyntaxKind.ConditionalExpression ||
      kind === SyntaxKind.SwitchStatement ||
      kind === SyntaxKind.CaseBlock ||
      kind === SyntaxKind.WhileStatement ||
      kind === SyntaxKind.ForStatement ||
      kind === SyntaxKind.ForOfStatement ||
      kind === SyntaxKind.ForInStatement
    ) {
      return false;
    }

    current = current.getParent();
  }

  return true;
}

/**
 * Static toast literals for a route component and any components it renders.
 */
function collectTransientFeedback(
  root: Node,
  index: Map<string, Node>
): string[] {
  return collectFeedbackFromRoots([root], index);
}

/**
 * Collect statically-known strings passed to `toast.*(...)` calls, in source
 * order and deduped, starting from a set of component roots and following the
 * components they render. These surface imperatively (into a portal), so a
 * test must assert them via the toast container rather than the page.
 *
 * Only string literals are captured:
 *  - direct literals (`toast.error('...')`),
 *  - literal fallback arms of `||` / `??` (`toast.error(result.error || 'X')`
 *    yields `"X"` while the runtime arm is skipped),
 *  - literal arms of ternaries (`cond ? 'A' : 'B'` yields both).
 * Template literals with interpolations and other expressions are skipped.
 */
function collectFeedbackFromRoots(
  roots: Node[],
  index: Map<string, Node>
): string[] {
  const feedback: string[] = [];
  const seen = new Set<string>();
  const visited = new Set<Node>();

  const push = (text: string): void => {
    if (seen.has(text)) return;
    seen.add(text);
    feedback.push(text);
  };

  const extractFromArg = (arg: Node | undefined): void => {
    if (!arg) return;

    if (arg.isKind(SyntaxKind.ParenthesizedExpression)) {
      extractFromArg(
        arg.asKindOrThrow(SyntaxKind.ParenthesizedExpression).getExpression()
      );
      return;
    }

    if (
      arg.isKind(SyntaxKind.StringLiteral) ||
      arg.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
    ) {
      push(arg.getLiteralText());
      return;
    }

    if (arg.isKind(SyntaxKind.BinaryExpression)) {
      const bin = arg.asKindOrThrow(SyntaxKind.BinaryExpression);
      const operator = bin.getOperatorToken().getText();
      if (operator === "||" || operator === "??") {
        extractFromArg(bin.getLeft());
        extractFromArg(bin.getRight());
      }
      return;
    }

    if (arg.isKind(SyntaxKind.ConditionalExpression)) {
      const cond = arg.asKindOrThrow(SyntaxKind.ConditionalExpression);
      extractFromArg(cond.getWhenTrue());
      extractFromArg(cond.getWhenFalse());
      return;
    }

    // Interpolated template literals, identifiers, calls, etc. — not static.
  };

  const visit = (node: Node): void => {
    if (visited.has(node)) return;
    visited.add(node);

    for (const call of node.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const expression = call.getExpression().getText();
      if (expression !== "toast" && !expression.startsWith("toast.")) {
        continue;
      }
      extractFromArg(call.getArguments()[0]);
    }

    node.forEachDescendant((descendant) => {
      if (
        descendant.isKind(SyntaxKind.JsxElement) ||
        descendant.isKind(SyntaxKind.JsxSelfClosingElement)
      ) {
        const element =
          descendant.asKind(SyntaxKind.JsxElement) ??
          descendant.asKind(SyntaxKind.JsxSelfClosingElement);
        if (!element) return;

        const child = index.get(jsxTagName(element));
        if (child) {
          visit(child);
        }
      }
    });
  };

  for (const root of roots) {
    visit(root);
  }

  return feedback;
}

/**
 * Concatenate all literal `JsxText` in an element's subtree, skipping
 * `JsxExpression` subtrees. ts-morph gives literal text as `JsxText` nodes;
 * the `{}` parts are `JsxExpression` nodes.
 */
function literalText(node: Node): string {
  let out = "";

  node.forEachChild((child) => {
    if (child.isKind(SyntaxKind.JsxExpression)) {
      return;
    }
    if (child.isKind(SyntaxKind.JsxText)) {
      out += child.getText();
      return;
    }
    out += literalText(child);
  });

  return out;
}

function jsxTagName(element: JsxElement | JsxSelfClosingElement): string {
  if (element.isKind(SyntaxKind.JsxElement)) {
    return element.getOpeningElement().getTagNameNode().getText();
  }
  return element.getTagNameNode().getText();
}

function normalizeText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

/**
 * Heuristic for Tailwind-style class tokens that sneak into literal text:
 * no spaces, but contains `-`, `:` or `/` (e.g. `text-gray-900`).
 */
function looksLikeCssUtility(text: string): boolean {
  if (/\s/.test(text)) {
    return false;
  }
  return /[-:/]/.test(text);
}

/**
 * True when the component renders differently per state: it calls a zustand
 * store hook (excluding the presentational theme store) or reads route state
 * via `useParams` / `useSearchParams` / `useLocation`.
 */
function isStateDependent(node: Node): boolean {
  for (const call of node.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const expression = call.getExpression().getText();

    if (
      expression === "useParams" ||
      expression === "useSearchParams" ||
      expression === "useLocation"
    ) {
      return true;
    }

    if (
      expression !== "useThemeStore" &&
      /^use[A-Za-z0-9_]*Store$/.test(expression)
    ) {
      return true;
    }
  }

  return false;
}
