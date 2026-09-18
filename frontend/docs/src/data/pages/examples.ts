import type { DocPage } from "../types";

const GROUP = "Examples";

export const examplePages: DocPage[] = [
  {
    slug: "example-checkout-flow",
    group: GROUP,
    title: "Build a checkout flow",
    description: "A complete end-to-end example: cart, discount, checkout, and webhook confirmation.",
    blocks: [
      {
        type: "paragraph",
        text:
          "This example wires up a minimal server-side checkout route for an e-commerce backend. It creates a cart from a request body, applies an optional discount code, completes the checkout with a tokenized payment method, and returns the resulting order to the client.",
      },
      {
        type: "code",
        title: "server.js — Express checkout route",
        code: {
          node: `import express from "express";\nimport Cartly from "@cartly/node";\n\nconst app = express();\napp.use(express.json());\nconst cartly = new Cartly(process.env.CARTLY_SECRET_KEY);\n\napp.post("/checkout", async (req, res) => {\n  const { items, discountCode, paymentMethod, email } = req.body;\n\n  try {\n    const cart = await cartly.carts.create({\n      lineItems: items.map((i) => ({ variant: i.variantId, quantity: i.qty })),\n    });\n\n    if (discountCode) {\n      await cartly.carts.applyDiscount(cart.id, { code: discountCode });\n    }\n\n    const order = await cartly.checkouts.complete(\n      { cart: cart.id, paymentMethod, email },\n      { idempotencyKey: req.headers["x-request-id"] }\n    );\n\n    res.status(201).json({ orderId: order.id, status: order.status, total: order.total });\n  } catch (err) {\n    if (err.type === "card_error") {\n      return res.status(402).json({ error: err.message });\n    }\n    console.error(err);\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});\n\napp.listen(3000, () => console.log("Listening on :3000"));`,
          python: `from flask import Flask, request, jsonify\nimport cartly\n\napp = Flask(__name__)\ncartly.api_key = "sk_test_51Hn8...vX2"\n\n@app.route("/checkout", methods=["POST"])\ndef checkout():\n    body = request.get_json()\n    cart = cartly.Cart.create(\n        line_items=[{"variant": i["variantId"], "quantity": i["qty"]} for i in body["items"]]\n    )\n\n    if body.get("discountCode"):\n        cartly.Cart.apply_discount(cart.id, code=body["discountCode"])\n\n    try:\n        order = cartly.Checkout.complete(\n            cart=cart.id,\n            payment_method=body["paymentMethod"],\n            email=body["email"],\n        )\n        return jsonify(orderId=order.id, status=order.status, total=order.total), 201\n    except cartly.error.CardError as e:\n        return jsonify(error=str(e)), 402`,
        },
      },
      {
        type: "code",
        title: "Client-side: submit the checkout form",
        code: {
          node: `async function submitCheckout(items, cardPaymentMethod, email) {\n  const res = await fetch("/checkout", {\n    method: "POST",\n    headers: { "Content-Type": "application/json", "X-Request-Id": crypto.randomUUID() },\n    body: JSON.stringify({\n      items,\n      paymentMethod: cardPaymentMethod.id,\n      email,\n    }),\n  });\n\n  if (!res.ok) {\n    const { error } = await res.json();\n    throw new Error(error);\n  }\n\n  return res.json();\n}`,
        },
      },
      {
        type: "callout",
        variant: "info",
        text:
          "Because the checkout route forwards a client-generated request id as the idempotency key, retrying the fetch after a dropped connection never double-charges the customer.",
      },
    ],
  },
  {
    slug: "example-inventory-sync",
    group: GROUP,
    title: "Sync inventory from a warehouse system",
    description: "Reconcile stock levels from an external WMS on a schedule using the Variants API.",
    blocks: [
      {
        type: "paragraph",
        text:
          "If stock is managed in an external warehouse management system (WMS), you can periodically push counts into Cartly so your storefront never oversells. This example fetches counts by SKU and sets absolute inventory levels.",
      },
      {
        type: "code",
        title: "sync-inventory.ts",
        code: {
          node: `import Cartly from "@cartly/node";\nimport { fetchWarehouseCounts } from "./wms.js";\n\nconst cartly = new Cartly(process.env.CARTLY_SECRET_KEY);\n\nasync function syncInventory() {\n  const counts = await fetchWarehouseCounts(); // [{ sku, quantity }]\n\n  for (const { sku, quantity } of counts) {\n    const { data: variants } = await cartly.variants.list({ sku });\n    if (!variants.length) continue;\n\n    const variant = variants[0];\n    if (variant.inventory !== quantity) {\n      await cartly.variants.setInventory(variant.id, { quantity });\n      console.log(\`Updated \${sku}: \${variant.inventory} -> \${quantity}\`);\n    }\n  }\n}\n\nsyncInventory().catch(console.error);`,
          python: `import cartly\nfrom wms import fetch_warehouse_counts\n\ncartly.api_key = "sk_test_51Hn8...vX2"\n\ndef sync_inventory():\n    for row in fetch_warehouse_counts():\n        variants = cartly.Variant.list(sku=row["sku"]).data\n        if not variants:\n            continue\n        variant = variants[0]\n        if variant.inventory != row["quantity"]:\n            cartly.Variant.set_inventory(variant.id, quantity=row["quantity"])\n            print(f"Updated {row['sku']}: {variant.inventory} -> {row['quantity']}")\n\nif __name__ == "__main__":\n    sync_inventory()`,
        },
      },
      {
        type: "callout",
        variant: "warning",
        text:
          "Run this on a schedule (e.g. every 5 minutes via cron or a queue worker), and prefer webhook-driven decrements from order.paid for real-time accuracy between syncs.",
      },
      { type: "heading", level: 2, text: "Reacting to low stock in real time", id: "low-stock" },
      {
        type: "code",
        title: "Low-stock webhook handler",
        code: {
          node: `app.post("/webhooks/cartly", express.raw({ type: "application/json" }), (req, res) => {\n  const event = cartly.webhooks.constructEvent(\n    req.body,\n    req.headers["cartly-signature"],\n    process.env.CARTLY_WEBHOOK_SECRET\n  );\n\n  if (event.type === "inventory.low_stock") {\n    const { sku, inventory } = event.data.object;\n    notifyPurchasingTeam(sku, inventory);\n  }\n\n  res.json({ received: true });\n});`,
        },
      },
    ],
  },
  {
    slug: "example-react-storefront",
    group: GROUP,
    title: "React storefront add-to-cart",
    description: "A minimal React hook and component for adding products to a Cartly cart.",
    blocks: [
      {
        type: "paragraph",
        text:
          "Storefronts typically keep a cart id in local storage and call your backend (which holds the secret key) rather than the Cartly API directly from the browser. This example shows a small `useCart` hook and an add-to-cart button.",
      },
      {
        type: "code",
        title: "useCart.ts",
        code: {
          node: `import { useCallback, useEffect, useState } from "react";\n\nexport function useCart() {\n  const [cart, setCart] = useState(null);\n\n  useEffect(() => {\n    const cartId = localStorage.getItem("cartId");\n    if (cartId) {\n      fetch(\`/api/cart/\${cartId}\`).then((r) => r.json()).then(setCart);\n    }\n  }, []);\n\n  const addItem = useCallback(async (variantId, quantity = 1) => {\n    const res = await fetch("/api/cart/add", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ cartId: cart?.id, variantId, quantity }),\n    });\n    const updated = await res.json();\n    localStorage.setItem("cartId", updated.id);\n    setCart(updated);\n  }, [cart]);\n\n  return { cart, addItem };\n}`,
        },
      },
      {
        type: "code",
        title: "AddToCartButton.tsx",
        code: {
          node: `import { useCart } from "./useCart";\n\nexport function AddToCartButton({ variantId }: { variantId: string }) {\n  const { addItem } = useCart();\n  const [loading, setLoading] = useState(false);\n\n  return (\n    <button\n      disabled={loading}\n      onClick={async () => {\n        setLoading(true);\n        await addItem(variantId, 1);\n        setLoading(false);\n      }}\n    >\n      {loading ? "Adding..." : "Add to cart"}\n    </button>\n  );\n}`,
        },
      },
      {
        type: "code",
        title: "api/cart/add.js — backend route used above",
        code: {
          node: `import Cartly from "@cartly/node";\nconst cartly = new Cartly(process.env.CARTLY_SECRET_KEY);\n\nexport default async function handler(req, res) {\n  const { cartId, variantId, quantity } = req.body;\n\n  const cart = cartId\n    ? await cartly.carts.addLineItem(cartId, { variant: variantId, quantity })\n    : await cartly.carts.create({ lineItems: [{ variant: variantId, quantity }] });\n\n  res.status(200).json(cart);\n}`,
        },
      },
      {
        type: "callout",
        variant: "success",
        text:
          "Because the cart id is opaque and stored client-side, the same pattern works for logged-out guest carts that later get attached to a customer at checkout.",
      },
    ],
  },
];
