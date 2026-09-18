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
      <section className="border-b border-slate-200 bg-gradient-to-b from-violet-50/60 to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-[12px] font-semibold text-violet-600">
            ● API v1 — stable
          </span>
          <h1 className="mt-5 max-w-2xl text-[38px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[44px]">
            Everything you need to build commerce into your product.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-slate-500">
            Cartly is a developer-first API for products, carts, checkout, payments, and order
            management. Explore guides, the full API reference, and ready-to-run examples.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quickstart"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Start the quickstart
            </Link>
            <Link
              to="/api-products"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Browse API reference
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">
              Create a product and take a payment in one request
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">
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

      <section className="border-t border-slate-200 bg-slate-50/60 py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">
            Explore the docs
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <span
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-[16px] ${c.accent}`}
                >
                  {c.icon}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{c.description}</p>
                <span className="mt-3 text-[13px] font-semibold text-violet-600 opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">
          Full index
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.group}>
              <h3 className="text-[13.5px] font-semibold text-slate-900">{g.group}</h3>
              <ul className="mt-2 space-y-1.5">
                {g.pages.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/${p.slug}`} className="text-[13.5px] text-slate-500 hover:text-violet-600">
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
