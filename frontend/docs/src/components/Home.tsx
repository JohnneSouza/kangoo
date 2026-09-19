import { Link } from "react-router-dom";
import CodeBlock from "./CodeBlock";
import { getGroupedNav } from "../data/pages";

const cards = [
  {
    title: "Getting started",
    description: "Authenticate, understand the object model, and complete your first checkout.",
    to: "/introduction",
    icon: "🚀",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Guides",
    description: "In-depth walkthroughs for products, checkout, payments, orders, and webhooks.",
    to: "/guide-checkout",
    icon: "📘",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "API reference",
    description: "Full parameter and response documentation for every resource and endpoint.",
    to: "/api-products",
    icon: "🧩",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Examples",
    description: "Copy-pasteable, real-world integrations: checkout flows, sync jobs, storefronts.",
    to: "/example-checkout-flow",
    icon: "⚡",
    accent: "from-amber-500 to-orange-500",
  },
];

export default function Home() {
  const groups = getGroupedNav();

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-violet-50/60 to-white dark:from-violet-500/5 dark:to-transparent">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-surface px-3 py-1 text-xs font-semibold text-link">
            ● API v1 — stable
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl">
            Everything you need to build commerce into your product.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
            Cartly is a developer-first API for products, carts, checkout, payments, and order
            management. Explore guides, the full API reference, and ready-to-run examples.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quickstart"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
            >
              Start the quickstart
            </Link>
            <Link
              to="/api-products"
              className="rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-fg-body transition hover:bg-surface-hover"
            >
              Browse API reference
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              Create a product and take a payment in one request
            </h2>
            <p className="mt-2 text-md leading-relaxed text-fg-muted">
              Every Cartly resource is available over a single, consistent REST API. Toggle the
              language above any snippet across the whole site — it's remembered as you browse.
            </p>
          </div>
          <CodeBlock
            code={{
              curl: `curl https://api.cartly.dev/v1/checkouts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "line_items": [{ "variant": "var_8mQ2p1", "quantity": 1 }],\n    "payment_method": "pm_card_visa",\n    "email": "ada@example.com"\n  }'`,
              node: `import Cartly from "@cartly/node";\nconst cartly = new Cartly("sk_test_51Hn8...vX2");\n\nconst order = await cartly.checkouts.complete({\n  lineItems: [{ variant: "var_8mQ2p1", quantity: 1 }],\n  paymentMethod: "pm_card_visa",\n  email: "ada@example.com",\n});`,
              python: `import cartly\ncartly.api_key = "sk_test_51Hn8...vX2"\n\norder = cartly.Checkout.complete(\n    line_items=[{"variant": "var_8mQ2p1", "quantity": 1}],\n    payment_method="pm_card_visa",\n    email="ada@example.com",\n)`,
            }}
            response={`{ "id": "order_7Zc9Ke", "object": "order", "status": "paid", "total": 1800 }`}
          />
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/60 py-12">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
            Explore the docs
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-black/40"
              >
                <span
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-base ${c.accent}`}
                >
                  {c.icon}
                </span>
                <h3 className="text-md font-semibold text-fg">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{c.description}</p>
                <span className="mt-3 text-sm font-semibold text-link opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
          Full index
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.group}>
              <h3 className="text-sm font-semibold text-fg">{g.group}</h3>
              <ul className="mt-2 space-y-1.5">
                {g.pages.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/${p.slug}`} className="text-sm text-fg-muted hover:text-link">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
