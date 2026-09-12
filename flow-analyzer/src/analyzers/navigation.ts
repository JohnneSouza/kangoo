import path from "node:path";
import {
  Project,
  SyntaxKind,
  VariableDeclarationKind,
} from "ts-morph";
import type {
  Node,
  SourceFile,
  JsxElement,
  JsxSelfClosingElement,
  JsxAttribute,
  CallExpression,
  IfStatement,
  Block,
} from "ts-morph";
import type {
  Navigation,
  Locator,
  EdgeCondition,
} from "../types.js";

interface ComponentRef {
  name: string;
  body: Block | undefined;
}

interface Candidate {
  node: Node;
  loc: string;
  testId?: string;
  role?: string;
  name: string;
  text: string;
}

interface RawEdge {
  type: Navigation["type"];
  from: string;
  to: string;
  sourceFile: string;
  line: number;
  trigger: JsxElement | JsxSelfClosingElement | undefined;
  condition: EdgeCondition;
}

/** Tag name -> implied ARIA role, for locator + collision detection. */
const ROLE_BY_TAG: Record<string, string> = {
  Link: "link",
  a: "link",
  button: "button",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  img: "img",
  input: "textbox",
  textarea: "textbox",
  select: "combobox",
  nav: "navigation",
  main: "main",
};

/** Positional containment (same source file). */
function contains(container: Node, node: Node): boolean {
  return (
    container.getStart() <= node.getStart() &&
    node.getEnd() <= container.getEnd()
  );
}

function isSameNode(a: Node, b: Node): boolean {
  if (a === b) return true;
  return (
    a.getSourceFile() === b.getSourceFile() &&
    a.getStart() === b.getStart() &&
    a.getEnd() === b.getEnd()
  );
}

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Mechanical negation used to distinguish sibling branches. */
function negateCondition(text: string): string {
  const trimmed = text.trim();
  if (
    trimmed.startsWith("!") &&
    !trimmed.startsWith("!=") &&
    !trimmed.startsWith("!==")
  ) {
    return trimmed.slice(1).trim();
  }
  return `!(${trimmed})`;
}

function getTagName(
  el: JsxElement | JsxSelfClosingElement
): string {
  if (el.isKind(SyntaxKind.JsxSelfClosingElement)) {
    return el.getTagNameNode().getText();
  }
  return el.getOpeningElement().getTagNameNode().getText();
}

/**
 * Target as written: strip quotes from string literals, keep template
 * literals (with placeholders) verbatim, otherwise raw text.
 */
function getTargetText(node: Node): string {
  if (node.isKind(SyntaxKind.StringLiteral)) {
    return node.getLiteralText();
  }
  if (node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
    return node.getLiteralText();
  }
  return node.getText();
}

function getAttributeNode(
  el: JsxElement | JsxSelfClosingElement,
  name: string
): JsxAttribute | undefined {
  const attr = el.isKind(SyntaxKind.JsxSelfClosingElement)
    ? el.getAttribute(name)
    : el.getOpeningElement().getAttribute(name);
  if (!attr || !attr.isKind(SyntaxKind.JsxAttribute)) {
    return undefined;
  }
  return attr;
}

function getStringAttribute(
  el: JsxElement | JsxSelfClosingElement,
  name: string
): string | undefined {
  const attr = getAttributeNode(el, name);
  if (!attr) return undefined;
  const init = attr.getInitializer();
  if (!init) return undefined;
  if (init.isKind(SyntaxKind.StringLiteral)) {
    return init.getLiteralText();
  }
  if (init.isKind(SyntaxKind.JsxExpression)) {
    const expr = init.getExpression();
    if (!expr) return undefined;
    return getTargetText(expr);
  }
  return init.getText();
}

function getTextContent(node: Node, out: string[]): void {
  if (node.isKind(SyntaxKind.JsxText)) {
    out.push(node.getText());
    return;
  }
  if (node.isKind(SyntaxKind.JsxExpression)) {
    const expr = node.getExpression();
    if (expr && expr.isKind(SyntaxKind.StringLiteral)) {
      out.push(expr.getLiteralText());
    } else if (
      expr &&
      expr.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
    ) {
      out.push(expr.getLiteralText());
    }
    return;
  }
  node.forEachChild((child) => getTextContent(child, out));
}

function getCollapsedText(
  el: JsxElement | JsxSelfClosingElement
): string {
  const parts: string[] = [];
  getTextContent(el, parts);
  return collapse(parts.join(""));
}

function getRole(
  el: JsxElement | JsxSelfClosingElement
): string | undefined {
  return ROLE_BY_TAG[getTagName(el)];
}

/** Accessible name: aria-label, then title, then literal text content. */
function getAccessibleName(
  el: JsxElement | JsxSelfClosingElement
): string {
  const ariaLabel = getStringAttribute(el, "aria-label");
  if (ariaLabel) return ariaLabel;
  const title = getStringAttribute(el, "title");
  if (title) return title;
  return getCollapsedText(el);
}

/**
 * Nearest enclosing component (function declaration, class, or top-level
 * const arrow). Local handlers are skipped.
 */
function findComponent(node: Node): ComponentRef | undefined {
  let current: Node | undefined = node.getParent();
  while (current) {
    if (current.isKind(SyntaxKind.FunctionDeclaration)) {
      const body = current.getBody();
      return {
        name: current.getName() ?? "anonymous",
        body: body && body.isKind(SyntaxKind.Block) ? body : undefined,
      };
    }
    if (current.isKind(SyntaxKind.ClassDeclaration)) {
      return {
        name: current.getName() ?? "anonymous",
        body: undefined,
      };
    }
    if (current.isKind(SyntaxKind.VariableDeclaration)) {
      const init = current.getInitializer();
      const stmt = current.getVariableStatement();
      const isConst =
        stmt?.getDeclarationKind() === VariableDeclarationKind.Const;
      const isTopLevel =
        stmt?.getParent()?.isKind(SyntaxKind.SourceFile) === true;
      if (isConst && isTopLevel) {
        if (init && init.isKind(SyntaxKind.ArrowFunction)) {
          const body = init.getBody();
          return {
            name: current.getName(),
            body: body.isKind(SyntaxKind.Block) ? body : undefined,
          };
        }
        if (init && init.isKind(SyntaxKind.FunctionExpression)) {
          const body = init.getBody();
          return {
            name: current.getName(),
            body: body && body.isKind(SyntaxKind.Block) ? body : undefined,
          };
        }
      }
    }
    current = current.getParent();
  }
  return undefined;
}

function returnsFromThen(ifStmt: IfStatement): boolean {
  const then = ifStmt.getThenStatement();
  if (then.isKind(SyntaxKind.ReturnStatement)) return true;
  if (then.isKind(SyntaxKind.Block)) {
    return then
      .getStatements()
      .some((s) => s.isKind(SyntaxKind.ReturnStatement));
  }
  return false;
}

/** Edge in the fall-through of a component-level early-returning if. */
function findEarlyReturn(
  node: Node,
  body: Block
): EdgeCondition | undefined {
  const statements = body.getStatements();
  let edgeIndex = -1;
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (stmt && contains(stmt, node)) {
      edgeIndex = i;
      break;
    }
  }
  if (edgeIndex <= 0) return undefined;
  for (let i = edgeIndex - 1; i >= 0; i--) {
    const stmt = statements[i];
    if (!stmt || !stmt.isKind(SyntaxKind.IfStatement)) continue;
    const ifStmt = stmt.asKind(SyntaxKind.IfStatement)!;
    if (returnsFromThen(ifStmt)) {
      const condText = ifStmt.getExpression().getText();
      return {
        kind: "early-return",
        expression: condText,
        description: negateCondition(condText),
        line: ifStmt.getStartLineNumber(),
      };
    }
  }
  return undefined;
}

function findCondition(
  node: Node,
  componentBody: Block | undefined
): EdgeCondition {
  let current: Node | undefined = node.getParent();
  while (current) {
    if (current.isKind(SyntaxKind.ConditionalExpression)) {
      const condText = current.getCondition().getText();
      if (contains(current.getWhenTrue(), node)) {
        return {
          kind: "ternary",
          expression: condText,
          description: condText,
          line: current.getStartLineNumber(),
        };
      }
      if (contains(current.getWhenFalse(), node)) {
        return {
          kind: "ternary",
          expression: condText,
          description: negateCondition(condText),
          line: current.getStartLineNumber(),
        };
      }
    } else if (current.isKind(SyntaxKind.BinaryExpression)) {
      if (current.getOperatorToken().getText() === "&&") {
        const left = current.getLeft();
        if (!contains(left, node)) {
          const leftText = left.getText();
          return {
            kind: "logical-and",
            expression: leftText,
            description: leftText,
            line: current.getStartLineNumber(),
          };
        }
      }
    } else if (current.isKind(SyntaxKind.IfStatement)) {
      const condText = current.getExpression().getText();
      if (contains(current.getThenStatement(), node)) {
        return {
          kind: "guard",
          expression: condText,
          description: condText,
          line: current.getStartLineNumber(),
        };
      }
      const elseStmt = current.getElseStatement();
      if (elseStmt && contains(elseStmt, node)) {
        return {
          kind: "guard",
          expression: condText,
          description: negateCondition(condText),
          line: current.getStartLineNumber(),
        };
      }
    }
    current = current.getParent();
  }
  if (componentBody) {
    const early = findEarlyReturn(node, componentBody);
    if (early) return early;
  }
  return { kind: "none", description: "always rendered" };
}

function getEnclosingHandlerName(
  call: CallExpression
): string | undefined {
  let current: Node | undefined = call.getParent();
  while (current) {
    if (
      current.isKind(SyntaxKind.ArrowFunction) ||
      current.isKind(SyntaxKind.FunctionExpression)
    ) {
      const parent = current.getParent();
      if (parent && parent.isKind(SyntaxKind.VariableDeclaration)) {
        return parent.getName() || undefined;
      }
      return undefined;
    }
    if (current.isKind(SyntaxKind.FunctionDeclaration)) {
      return current.getName() || undefined;
    }
    current = current.getParent();
  }
  return undefined;
}

function getEnclosingJsxElement(
  node: Node
): JsxElement | JsxSelfClosingElement | undefined {
  let current: Node | undefined = node.getParent();
  while (current) {
    if (current.isKind(SyntaxKind.JsxSelfClosingElement)) {
      return current;
    }
    if (current.isKind(SyntaxKind.JsxOpeningElement)) {
      const parent = current.getParent();
      if (parent && parent.isKind(SyntaxKind.JsxElement)) {
        return parent;
      }
      return undefined;
    }
    current = current.getParent();
  }
  return undefined;
}

function findOnClickReference(
  sourceFile: SourceFile,
  handlerName: string
): JsxElement | JsxSelfClosingElement | undefined {
  for (const attr of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxAttribute
  )) {
    const name = attr.getNameNode().getText();
    if (name !== "onClick" && name !== "onSubmit") continue;
    const init = attr.getInitializer();
    if (!init || !init.isKind(SyntaxKind.JsxExpression)) continue;
    const expr = init.getExpression();
    if (!expr || !expr.isKind(SyntaxKind.Identifier)) continue;
    if (expr.getText() !== handlerName) continue;
    const el = getEnclosingJsxElement(attr);
    if (el) return el;
  }
  return undefined;
}

/** Resolve the clickable trigger element for an imperative navigate() call. */
function findTriggerElement(
  call: CallExpression,
  sourceFile: SourceFile
): JsxElement | JsxSelfClosingElement | undefined {
  let current: Node | undefined = call.getParent();
  while (current) {
    if (current.isKind(SyntaxKind.JsxAttribute)) {
      const name = current.getNameNode().getText();
      if (name === "onClick" || name === "onSubmit") {
        const el = getEnclosingJsxElement(current);
        if (el) return el;
      }
    }
    current = current.getParent();
  }
  const handlerName = getEnclosingHandlerName(call);
  if (handlerName) {
    return findOnClickReference(sourceFile, handlerName);
  }
  return undefined;
}

function pushCandidate(
  map: Map<string, Candidate[]>,
  key: string,
  candidate: Candidate
): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(candidate);
  } else {
    map.set(key, [candidate]);
  }
}

function makeCandidate(
  el: JsxElement | JsxSelfClosingElement,
  relPath: string
): Candidate {
  const testId = getStringAttribute(el, "data-testid");
  const role = getRole(el);
  const name = getAccessibleName(el);
  const text = getCollapsedText(el);
  const candidate: Candidate = {
    node: el,
    loc: `${relPath}:${el.getStartLineNumber()}`,
    name,
    text,
  };
  if (testId !== undefined) candidate.testId = testId;
  if (role !== undefined) candidate.role = role;
  return candidate;
}

function othersFor(
  matches: Candidate[] | undefined,
  self: Node
): string[] {
  if (!matches) return [];
  const others: string[] = [];
  for (const match of matches) {
    if (isSameNode(match.node, self)) continue;
    others.push(match.loc);
  }
  return others;
}

function computeLocator(
  el: JsxElement | JsxSelfClosingElement,
  roleMap: Map<string, Candidate[]>,
  textMap: Map<string, Candidate[]>,
  testIdMap: Map<string, Candidate[]>
): Locator | undefined {
  const testId = getStringAttribute(el, "data-testid");
  if (testId) {
    const others = othersFor(testIdMap.get(testId), el);
    return {
      strategy: "testid",
      testId,
      ambiguous: others.length > 0,
      ...(others.length > 0 ? { collisions: others } : {}),
    };
  }
  const role = getRole(el);
  const name = getAccessibleName(el);
  if (role && name) {
    const others = othersFor(roleMap.get(`${role}|${name}`), el);
    return {
      strategy: "role",
      role,
      name,
      ambiguous: others.length > 0,
      ...(others.length > 0 ? { collisions: others } : {}),
    };
  }
  const text = getCollapsedText(el);
  if (text) {
    const others = othersFor(textMap.get(text), el);
    return {
      strategy: "text",
      name: text,
      ambiguous: others.length > 0,
      ...(others.length > 0 ? { collisions: others } : {}),
    };
  }
  if (role) {
    const others = othersFor(roleMap.get(`${role}|`), el);
    return {
      strategy: "role",
      role,
      ambiguous: others.length > 0,
      ...(others.length > 0 ? { collisions: others } : {}),
    };
  }
  return undefined;
}

export function analyzeNavigation(
  project: Project,
  targetProject: string
): Navigation[] {
  const rawEdges: RawEdge[] = [];

  // Pass 1: discover every navigation edge and its trigger element.
  for (const sourceFile of project.getSourceFiles()) {
    const relPath = path.relative(
      targetProject,
      sourceFile.getFilePath()
    );

    sourceFile.forEachDescendant((node) => {
      if (
        node.isKind(SyntaxKind.JsxElement) ||
        node.isKind(SyntaxKind.JsxSelfClosingElement)
      ) {
        const el = node.asKind(SyntaxKind.JsxSelfClosingElement)
          ? node.asKind(SyntaxKind.JsxSelfClosingElement)!
          : node.asKind(SyntaxKind.JsxElement)!;
        const tag = getTagName(el);
        if (tag !== "Link" && tag !== "Navigate") return;

        const to = getStringAttribute(el, "to");
        if (!to) return;

        const comp = findComponent(node);
        rawEdges.push({
          type: tag === "Link" ? "Link" : "Navigate",
          from: comp?.name ?? "unknown",
          to,
          sourceFile: relPath,
          line: node.getStartLineNumber(),
          trigger: tag === "Link" ? el : undefined,
          condition: findCondition(node, comp?.body),
        });
        return;
      }

      if (node.isKind(SyntaxKind.CallExpression)) {
        const call = node.asKind(SyntaxKind.CallExpression)!;
        const callee = call.getExpression().getText();
        if (callee !== "navigate" && callee !== "redirect") return;

        const args = call.getArguments();
        const arg = args[0];
        if (!arg) return;

        const comp = findComponent(node);
        rawEdges.push({
          type: callee as "navigate" | "redirect",
          from: comp?.name ?? "unknown",
          to: getTargetText(arg),
          sourceFile: relPath,
          line: node.getStartLineNumber(),
          trigger: findTriggerElement(call, sourceFile),
          condition: findCondition(node, comp?.body),
        });
      }
    });
  }

  // Pass 2: collect every JSX element for whole-project collision detection.
  const roleMap = new Map<string, Candidate[]>();
  const textMap = new Map<string, Candidate[]>();
  const testIdMap = new Map<string, Candidate[]>();

  for (const sourceFile of project.getSourceFiles()) {
    const relPath = path.relative(
      targetProject,
      sourceFile.getFilePath()
    );

    for (const el of sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxElement
    )) {
      const candidate = makeCandidate(el, relPath);
      if (candidate.testId) {
        pushCandidate(testIdMap, candidate.testId, candidate);
      }
      if (candidate.role && candidate.name) {
        pushCandidate(
          roleMap,
          `${candidate.role}|${candidate.name}`,
          candidate
        );
      }
      if (candidate.text) {
        pushCandidate(textMap, candidate.text, candidate);
      }
    }

    for (const el of sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement
    )) {
      const candidate = makeCandidate(el, relPath);
      if (candidate.testId) {
        pushCandidate(testIdMap, candidate.testId, candidate);
      }
      if (candidate.role && candidate.name) {
        pushCandidate(
          roleMap,
          `${candidate.role}|${candidate.name}`,
          candidate
        );
      }
      if (candidate.text) {
        pushCandidate(textMap, candidate.text, candidate);
      }
    }
  }

  // Pass 3: assemble final Navigation objects with locators + collisions.
  const navigations: Navigation[] = [];
  for (const edge of rawEdges) {
    let locator: Locator | undefined;
    if (edge.trigger) {
      locator = computeLocator(
        edge.trigger,
        roleMap,
        textMap,
        testIdMap
      );
    }
    navigations.push({
      type: edge.type,
      from: edge.from,
      to: edge.to,
      ...(locator ? { locator } : {}),
      condition: edge.condition,
      sourceFile: edge.sourceFile,
      line: edge.line,
    });
  }

  return navigations;
}
