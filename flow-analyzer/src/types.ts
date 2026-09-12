/**
 * Frozen shared contract for the flow-analyzer testability manifest.
 *
 * Every analyzer imports its output type from here and nothing else. Do not
 * change a shape in this file without updating every consumer — the analyzers
 * are developed in parallel and this file is the only interface between them.
 */

/** A route declared in the app's router. */
export type Route = {
  /** Route pattern as written, e.g. "/orders/:orderId". "*" for the catch-all. */
  path: string;
  /** Raw JSX of the element attribute, if present. */
  element?: string;
  /** Resolved component name the route renders, e.g. "OrdersPage". */
  component?: string;
  /**
   * Guard components wrapping the element, outermost first, e.g. ["ProtectedRoute"].
   * Empty when the route is rendered bare.
   */
  guards: string[];
  /**
   * zustand persist keys whose state gates this route, e.g. ["auth-storage"].
   * Derived from the guard's selector, not from the store list.
   */
  stores: string[];
  /** Path relative to the analyzed project root, e.g. "src/App.tsx". */
  sourceFile: string;
  /** 1-indexed line of the `<Route` element. */
  line: number;
};

/** How a Playwright test should locate an interactive element. */
export type Locator = {
  /**
   * Preferred strategy. "testid" when a data-testid is present, else "role"
   * when the element maps to an ARIA role with a usable name, else "text".
   */
  strategy: "testid" | "role" | "text";
  /** ARIA role implied by the element, e.g. "button", "link", "heading". */
  role?: string;
  /** Accessible name: text content, aria-label, or title, in that order. */
  name?: string;
  /** Value of data-testid when strategy is "testid". */
  testId?: string;
  /**
   * True when more than one element in the app resolves to the same
   * role+name or the same text. Generated tests must disambiguate these
   * rather than emitting a bare getByRole/getByText.
   */
  ambiguous: boolean;
  /** "file:line" of each other match, when ambiguous. */
  collisions?: string[];
};

/**
 * The precondition that selects one edge over its siblings.
 *
 * The navigation graph lists sibling edges from the same component as if all
 * fire unconditionally (OrdersPage -> "/orders/:id" AND OrdersPage -> "/").
 * In reality each sits inside a branch. Tests need to know which.
 */
export type EdgeCondition = {
  kind: "none" | "ternary" | "early-return" | "guard" | "logical-and";
  /** The conditional expression as written, when one exists. */
  expression?: string;
  /** Plain-language precondition, e.g. "orders.length === 0". */
  description: string;
  /** Line of the enclosing conditional, when one exists. */
  line?: number;
};

/** A single navigation edge. */
export type Navigation = {
  type: "Link" | "Navigate" | "navigate" | "redirect";
  /**
   * Owning component the edge lives in, e.g. "Header", "OrdersPage".
   * Used to group edges by origin in the generated graph.
   */
  from: string;
  /**
   * Target as written in source, e.g. "/orders" or `/orders/${order.id}`.
   * Template placeholders are preserved verbatim — do not interpolate.
   */
  to: string;
  /** How a test triggers this edge. Absent for redirects with no trigger element. */
  locator?: Locator;
  condition: EdgeCondition;
  /** Path relative to the analyzed project root. */
  sourceFile: string;
  line: number;
};

/** A seed-data entity a test needs in order to exercise a route. */
export type Fixture = {
  /** Module path relative to project root, e.g. "src/data/products.ts". */
  module: string;
  /** Name of the exported array, e.g. "products". */
  exportName: string;
  /** Singular entity name for test-fixture naming, e.g. "product". */
  entity: string;
  /** Field used as the identifier in route params, e.g. "id". */
  idField: string;
  /** All ids present in the seed data. */
  ids: string[];
  /** First entry reduced to string fields, for readable fixtures. */
  sample: Record<string, string>;
};

/** User-visible content a generated test can assert on for a route. */
export type RouteAssertion = {
  /** Route path this assertion set applies to. */
  route: string;
  /**
   * Primary heading text (h1), when the route renders an unconditional one whose
   * text is statically known. May be a PREFIX of the real heading when the
   * heading interpolates dynamic content — e.g. `Pedido {order.id}` yields
   * "Pedido". Safe for Playwright's substring `getByRole('heading', { name })`
   * matching, NOT safe for an exact text equality assertion.
   */
  heading?: string;
  /** Other stable user-visible strings, in document order. */
  landmarks: string[];
  /**
   * User-visible strings surfaced imperatively (toasts), not rendered as JSX
   * text. These mount into a portal OUTSIDE the component tree, so a test must
   * assert them via the toast container rather than via page content, and must
   * allow for auto-dismissal. Static string literals only.
   */
  transientFeedback?: string[];
  /** True when the route's content depends on store state, so assertions vary. */
  stateDependent: boolean;
};

/** Everything the analyzer produces. Consumed by output.ts. */
export type AnalysisResult = {
  targetProject: string;
  routes: Route[];
  navigations: Navigation[];
  fixtures: Fixture[];
  assertions: RouteAssertion[];
  /**
   * Feedback surfaced by components rendered at the app level — siblings of the
   * router rather than children of any route (AuthModal, Header). These carry no
   * route of their own but are the only assertion surface for flows that happen
   * outside routing, notably authentication.
   */
  appLevelFeedback: string[];
};
