import path from "node:path";
import {
  Project,
  SyntaxKind,
  type ImportDeclaration,
  type JsxAttribute,
  type Node,
  type SourceFile,
} from "ts-morph";

import type { Route } from "../types.js";

// Re-exported so consumers that still import `Route` from this module keep
// compiling while they migrate to `../types.js`.
export type { Route } from "../types.js";

type ElementDescription = {
  component: string | undefined;
  guards: string[];
};

export function analyzeRoutes(
  project: Project,
  targetProject: string
): Route[] {
  const routes: Route[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const routeElements = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement
    );

    for (const element of routeElements) {
      if (element.getTagNameNode().getText() !== "Route") {
        continue;
      }

      const pathAttribute = element.getAttribute("path");
      if (!pathAttribute) {
        continue;
      }

      const pathInitializer = pathAttribute
        .asKind(SyntaxKind.JsxAttribute)
        ?.getInitializer();

      if (!pathInitializer) {
        continue;
      }

      const routePath = pathInitializer.isKind(SyntaxKind.StringLiteral)
        ? pathInitializer.getLiteralValue()
        : pathInitializer.getText().replace(/^["']|["']$/g, "");

      const elementAttribute = element
        .getAttribute("element")
        ?.asKind(SyntaxKind.JsxAttribute);

      const description: ElementDescription = elementAttribute
        ? describeElement(elementAttribute)
        : { component: undefined, guards: [] };

      const component =
        description.component ??
        (routePath === "*" ? "ErrorPage" : undefined);

      const route: Route = {
        path: routePath,
        guards: description.guards,
        stores: resolveStores(project, targetProject, description.guards),
        sourceFile: path.relative(
          targetProject,
          sourceFile.getFilePath()
        ),
        line: element.getStartLineNumber(),
      };

      if (elementAttribute) {
        route.element = elementAttribute.getText();
      }

      if (component) {
        route.component = component;
      }

      routes.push(route);
    }
  }

  return routes;
}

/**
 * Pull the rendered component and any wrapping guards out of the
 * `element={<...>}` attribute. The attribute initializer is a JsxExpression
 * wrapping either a bare JsxSelfClosingElement or a JsxElement whose children
 * hold the innermost component.
 */
function describeElement(
  attribute: JsxAttribute
): ElementDescription {
  const initializer = attribute.getInitializer();
  const expression = initializer?.asKind(SyntaxKind.JsxExpression);
  const inner = expression?.getExpression();

  if (!inner) {
    return { component: undefined, guards: [] };
  }

  return describeJsx(inner);
}

function describeJsx(node: Node): ElementDescription {
  if (node.isKind(SyntaxKind.JsxSelfClosingElement)) {
    return {
      component: node.getTagNameNode().getText(),
      guards: [],
    };
  }

  if (node.isKind(SyntaxKind.JsxElement)) {
    const guard = node.getOpeningElement().getTagNameNode().getText();
    const inner = firstJsxChild(node.getJsxChildren());

    if (inner) {
      const described = describeJsx(inner);
      return {
        component: described.component,
        guards: [guard, ...described.guards],
      };
    }

    return { component: undefined, guards: [guard] };
  }

  if (node.isKind(SyntaxKind.JsxFragment)) {
    const inner = firstJsxChild(node.getJsxChildren());
    if (inner) {
      return describeJsx(inner);
    }
    return { component: undefined, guards: [] };
  }

  return { component: undefined, guards: [] };
}

function firstJsxChild(children: Node[]): Node | undefined {
  for (const child of children) {
    if (
      child.isKind(SyntaxKind.JsxSelfClosingElement) ||
      child.isKind(SyntaxKind.JsxElement) ||
      child.isKind(SyntaxKind.JsxFragment)
    ) {
      return child;
    }
  }

  return undefined;
}

/**
 * Resolve each guard to the zustand persist key whose state gates it.
 * Resolution is best-effort: any failure yields no key for that guard.
 */
function resolveStores(
  project: Project,
  targetProject: string,
  guards: string[]
): string[] {
  const keys: string[] = [];

  for (const guard of guards) {
    const key = resolveGuardPersistKey(project, targetProject, guard);
    if (key && !keys.includes(key)) {
      keys.push(key);
    }
  }

  return keys;
}

function resolveGuardPersistKey(
  project: Project,
  targetProject: string,
  guardName: string
): string | undefined {
  try {
    const guardFile = findGuardFile(project, targetProject, guardName);
    if (!guardFile) {
      return undefined;
    }

    const storeHook = findStoreHook(guardFile);
    if (!storeHook) {
      return undefined;
    }

    const storeFile = resolveImportFile(
      project,
      targetProject,
      guardFile,
      storeHook
    );

    if (!storeFile) {
      return undefined;
    }

    return findPersistName(storeFile);
  } catch {
    return undefined;
  }
}

function findGuardFile(
  project: Project,
  targetProject: string,
  guardName: string
): SourceFile | undefined {
  for (const sourceFile of project.getSourceFiles()) {
    const relative = toPosixPath(
      path.relative(targetProject, sourceFile.getFilePath())
    );

    const match = /^src\/components\/([^/]+)\.(?:tsx?|jsx?)$/.exec(relative);
    if (match && match[1] === guardName) {
      return sourceFile;
    }
  }

  return undefined;
}

function findStoreHook(sourceFile: SourceFile): string | undefined {
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    const name = call.getExpression().getText();
    if (/^use[A-Za-z0-9_]*Store$/.test(name)) {
      return name;
    }
  }

  return undefined;
}

function resolveImportFile(
  project: Project,
  targetProject: string,
  sourceFile: SourceFile,
  importName: string
): SourceFile | undefined {
  for (const declaration of sourceFile.getImportDeclarations()) {
    const importsName = declaration
      .getNamedImports()
      .some((specifier) => specifier.getName() === importName);

    if (!importsName) {
      continue;
    }

    const resolved = resolveModuleSourceFile(
      project,
      targetProject,
      declaration
    );

    if (resolved) {
      return resolved;
    }
  }

  return undefined;
}

function resolveModuleSourceFile(
  project: Project,
  targetProject: string,
  declaration: ImportDeclaration
): SourceFile | undefined {
  try {
    const viaTsMorph = declaration.getModuleSpecifierSourceFile();
    if (viaTsMorph) {
      return viaTsMorph;
    }
  } catch {
    // Fall through to manual resolution below.
  }

  const specifier = declaration.getModuleSpecifierValue();
  if (specifier.startsWith("@/")) {
    const target = toPosixPath(path.join("src", specifier.slice(2)));

    for (const sourceFile of project.getSourceFiles()) {
      const relative = toPosixPath(
        path.relative(targetProject, sourceFile.getFilePath())
      ).replace(/\.(?:tsx?|jsx?)$/, "");

      if (relative === target) {
        return sourceFile;
      }
    }
  }

  return undefined;
}

function findPersistName(sourceFile: SourceFile): string | undefined {
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getText() !== "persist") {
      continue;
    }

    const optionsArg = call.getArguments()[1];
    const options = optionsArg?.asKind(SyntaxKind.ObjectLiteralExpression);
    if (!options) {
      continue;
    }

    const nameProperty = options.getProperty("name");
    const assignment = nameProperty?.asKind(SyntaxKind.PropertyAssignment);
    const initializer = assignment?.getInitializer();
    const stringLiteral = initializer?.asKind(SyntaxKind.StringLiteral);

    if (stringLiteral) {
      return stringLiteral.getLiteralValue();
    }
  }

  return undefined;
}

function toPosixPath(p: string): string {
  return p.split(path.sep).join("/");
}
