import path from "node:path";
import { Node, Project, SyntaxKind } from "ts-morph";

import type {
  ArrayLiteralExpression,
  NoSubstitutionTemplateLiteral,
  ObjectLiteralExpression,
  PropertyAssignment,
  StringLiteral,
} from "ts-morph";

import type { Fixture } from "../types.js";

/** Longest string kept verbatim in a sample; longer values are ellipsized. */
const MAX_SAMPLE_STRING_LENGTH = 120;

/** Identifier-field preference order, before falling back to any string key. */
const ID_FIELD_CANDIDATES = ["id", "code", "slug"];

/**
 * Turn an export name into a singular, lower-kebab entity name.
 * Naive on purpose: strips a trailing plural and kebab-cases camelCase.
 *   products -> product, coupons -> coupon, productCategories -> product-category
 */
function entityName(exportName: string): string {
  const kebab = exportName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

  const segments = kebab.split("-");
  const last = segments[segments.length - 1];

  if (last !== undefined) {
    segments[segments.length - 1] = singularizeWord(last);
  }

  return segments.join("-");
}

/** Strip a trailing plural from a single lower-cased word. */
function singularizeWord(word: string): string {
  if (word.endsWith("ies") && word.length > 3) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("ses") && word.length > 3) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 1) {
    return word.slice(0, -1);
  }
  return word;
}

/** Property assignments of an object literal, ignoring methods/spreads/etc. */
function propertyAssignments(
  obj: ObjectLiteralExpression,
): PropertyAssignment[] {
  return obj
    .getProperties()
    .filter((p): p is PropertyAssignment => Node.isPropertyAssignment(p));
}

/**
 * The literal value of a string/template literal, or undefined for anything
 * else. Numbers, booleans, objects, arrays and computed expressions return
 * undefined so callers can skip them instead of guessing.
 */
function stringLiteralValue(node: Node | undefined): string | undefined {
  if (!node) return undefined;

  const kind = node.getKind();
  if (kind === SyntaxKind.StringLiteral) {
    return (node as StringLiteral).getLiteralValue();
  }
  if (kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
    return (node as NoSubstitutionTemplateLiteral).getLiteralValue();
  }
  return undefined;
}

/**
 * Pick the field that identifies a fixture entry. Prefer id/code/slug when the
 * object declares them; otherwise fall back to the first string-valued key.
 */
function pickIdField(props: PropertyAssignment[]): string {
  const names = props.map((p) => p.getName());

  for (const candidate of ID_FIELD_CANDIDATES) {
    if (names.includes(candidate)) return candidate;
  }

  const firstStringKey = props.find(
    (p) => stringLiteralValue(p.getInitializer()) !== undefined,
  );

  return firstStringKey?.getName() ?? "id";
}

/**
 * Read an entry's id as text. Only static string and numeric literals are
 * returned; computed/imported ids are skipped rather than guessed.
 */
function readIdValue(
  obj: ObjectLiteralExpression,
  idField: string,
): string | undefined {
  const prop = obj.getProperty(idField);
  if (!prop || !Node.isPropertyAssignment(prop)) return undefined;

  const initializer = prop.getInitializer();
  if (!initializer) return undefined;

  const kind = initializer.getKind();
  if (
    kind === SyntaxKind.StringLiteral ||
    kind === SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return stringLiteralValue(initializer);
  }
  if (kind === SyntaxKind.NumericLiteral) {
    return initializer.getText();
  }
  return undefined;
}

/** Reduce an object literal to its string-valued fields, truncating long ones. */
function stringSampleOf(obj: ObjectLiteralExpression): Record<string, string> {
  const sample: Record<string, string> = {};

  for (const prop of propertyAssignments(obj)) {
    const value = stringLiteralValue(prop.getInitializer());
    if (value === undefined) continue;

    sample[prop.getName()] =
      value.length > MAX_SAMPLE_STRING_LENGTH
        ? value.slice(0, MAX_SAMPLE_STRING_LENGTH) + "…"
        : value;
  }

  return sample;
}

/**
 * Build a Fixture from an exported array literal, or undefined when the array
 * holds no object literals (e.g. `const sizes = ["38", ...]`). Such arrays
 * carry no identifier field and no readable sample, so we skip them entirely.
 */
function fixtureFromArray(
  exportName: string,
  module: string,
  array: ArrayLiteralExpression,
): Fixture | undefined {
  const elements = array.getElements();

  const firstObject = elements
    .map((el) => el.asKind(SyntaxKind.ObjectLiteralExpression))
    .find((obj): obj is ObjectLiteralExpression => obj !== undefined);

  if (!firstObject) return undefined;

  const props = propertyAssignments(firstObject);
  const idField = pickIdField(props);

  const ids: string[] = [];
  for (const element of elements) {
    const obj = element.asKind(SyntaxKind.ObjectLiteralExpression);
    if (!obj) continue;

    const id = readIdValue(obj, idField);
    if (id !== undefined) ids.push(id);
  }

  return {
    module,
    exportName,
    entity: entityName(exportName),
    idField,
    ids,
    sample: stringSampleOf(firstObject),
  };
}

/**
 * Scan the analyzed project's seed-data modules (`src/data/`) for exported
 * arrays of object literals and describe each as a Fixture a test generator
 * can parameterize on.
 *
 * Returns [] (never throws) when there is no `src/data/` directory or no
 * matching exports. Functions and non-array exports (e.g. `validateCoupon`)
 * are ignored; only exported arrays of object literals produce a Fixture.
 */
export function analyzeFixtures(
  project: Project,
  targetProject: string,
): Fixture[] {
  const fixtures: Fixture[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();

    // Seed-data modules only: under a `/data/` directory, TypeScript/TSX.
    if (!filePath.includes("/data/")) continue;
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) continue;

    const module = path.relative(targetProject, filePath);

    for (const [exportName, declarations] of sourceFile.getExportedDeclarations()) {
      for (const declaration of declarations) {
        if (!Node.isVariableDeclaration(declaration)) continue;

        const initializer = declaration.getInitializer();
        if (
          !initializer ||
          initializer.getKind() !== SyntaxKind.ArrayLiteralExpression
        ) {
          continue;
        }

        const fixture = fixtureFromArray(
          exportName,
          module,
          initializer.asKindOrThrow(SyntaxKind.ArrayLiteralExpression),
        );

        if (fixture) fixtures.push(fixture);
      }
    }
  }

  return fixtures;
}
