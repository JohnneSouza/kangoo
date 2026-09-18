import type { DocPage } from "../types";

const GROUP = "Guides";

export const guidePages: DocPage[] = [
  {
    slug: "guide-products",
    group: GROUP,
    title: "Products & inventory",
    description: "Model your catalog with products, variants, and real-time inventory tracking.",
    blocks: [
      {
        type: "paragraph",
        text:
          "A Product represents something you sell — a T-shirt, a course, a subscription box. A product rarely has just one purchasable form, so Cartly splits the sellable unit out into Variants, each with its own SKU, price, and stock count.",
      },
      { type: "heading", level: 2, text: "Products vs. variants", id: "products-vs-variants" },
      {
        type: "list",
        items: [
          "Product — shared metadata: name, description, images, category, tags.",
          "Variant — the actual purchasable thing: price, currency, SKU, option values (e.g. Size: M, Color: Black), and inventory.",
          "Every product must have at least one variant, even if it has no real options.",
        ],
      },
      {
        type: "code",
        title: "Create a product with multiple variants",
        code: {
          curl: `curl https://api.cartly.dev/v1/products \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Classic Tee",\n    "options": ["Size", "Color"],\n    "variants": [\n      { "name": "S / Black", "price": 2500, "sku": "TEE-S-BLK", "inventory": 40, "option_values": { "Size": "S", "Color": "Black" } },\n      { "name": "M / Black", "price": 2500, "sku": "TEE-M-BLK", "inventory": 65, "option_values": { "Size": "M", "Color": "Black" } }\n    ]\n  }'`,
          node: `const product = await cartly.products.create({\n  name: "Classic Tee",\n  options: ["Size", "Color"],\n  variants: [\n    { name: "S / Black", price: 2500, sku: "TEE-S-BLK", inventory: 40, optionValues: { Size: "S", Color: "Black" } },\n    { name: "M / Black", price: 2500, sku: "TEE-M-BLK", inventory: 65, optionValues: { Size: "M", Color: "Black" } },\n  ],\n});`,
          python: `product = cartly.Product.create(\n    name="Classic Tee",\n    options=["Size", "Color"],\n    variants=[\n        {"name": "S / Black", "price": 2500, "sku": "TEE-S-BLK", "inventory": 40,\n         "option_values": {"Size": "S", "Color": "Black"}},\n        {"name": "M / Black", "price": 2500, "sku": "TEE-M-BLK", "inventory": 65,\n         "option_values": {"Size": "M", "Color": "Black"}},\n    ],\n)`,
        },
        response: `{\n  "id": "prod_QwMk21",\n  "object": "product",\n  "name": "Classic Tee",\n  "variants": [\n    { "id": "var_a1", "sku": "TEE-S-BLK", "inventory": 40 },\n    { "id": "var_a2", "sku": "TEE-M-BLK", "inventory": 65 }\n  ]\n}`,
      },
      { type: "heading", level: 2, text: "Tracking inventory", id: "tracking-inventory" },
      {
        type: "paragraph",
        text:
          "Set `inventory_policy` on a variant to control what happens at zero stock. `deny` blocks further sales; `continue` allows overselling (useful for made-to-order items). Inventory is decremented automatically when an order is created, and restored if the order is later canceled or refunded.",
      },
      {
        type: "code",
        title: "Adjust stock manually",
        code: {
          curl: `curl https://api.cartly.dev/v1/variants/var_a1/inventory \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "adjustment": -5, "reason": "damaged_in_warehouse" }'`,
          node: `await cartly.variants.adjustInventory("var_a1", {\n  adjustment: -5,\n  reason: "damaged_in_warehouse",\n});`,
          python: `cartly.Variant.adjust_inventory("var_a1", adjustment=-5, reason="damaged_in_warehouse")`,
        },
      },
      {
        type: "callout",
        variant: "info",
        text:
          "Subscribe to the inventory.low_stock webhook event to get notified when a variant drops below its configured threshold.",
      },
      { type: "heading", level: 2, text: "Archiving vs. deleting", id: "archiving" },
      {
        type: "paragraph",
        text:
          "Products referenced by past orders can never be deleted, to preserve historical order data. Instead, set `active: false` to hide a product from listing endpoints and your storefront while keeping it fully intact for reporting.",
      },
    ],
  },
  {
    slug: "guide-customers",
    group: GROUP,
    title: "Customers & accounts",
    description: "Store shopper profiles, addresses, and payment methods for faster repeat checkout.",
    blocks: [
      {
        type: "paragraph",
        text:
          "A Customer object represents a shopper. Attaching a customer to a cart or order lets you save addresses, view order history, and store reusable payment methods for one-click future purchases. Customers are optional — guest checkout works without ever creating one.",
      },
      {
        type: "code",
        title: "Create a customer",
        code: {
          curl: `curl https://api.cartly.dev/v1/customers \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "email": "ada@example.com",\n    "name": "Ada Lovelace",\n    "shipping_address": {\n      "line1": "12 King St", "city": "London", "postal_code": "WC2E", "country": "GB"\n    }\n  }'`,
          node: `const customer = await cartly.customers.create({\n  email: "ada@example.com",\n  name: "Ada Lovelace",\n  shippingAddress: {\n    line1: "12 King St",\n    city: "London",\n    postalCode: "WC2E",\n    country: "GB",\n  },\n});`,
          python: `customer = cartly.Customer.create(\n    email="ada@example.com",\n    name="Ada Lovelace",\n    shipping_address={"line1": "12 King St", "city": "London", "postal_code": "WC2E", "country": "GB"},\n)`,
        },
        response: `{\n  "id": "cus_5aRk9c",\n  "object": "customer",\n  "email": "ada@example.com",\n  "name": "Ada Lovelace",\n  "default_payment_method": null\n}`,
      },
      { type: "heading", level: 2, text: "Saving a payment method for later", id: "saved-payment-methods" },
      {
        type: "paragraph",
        text:
          "Pass `save_payment_method: true` on a checkout to attach the card used to the customer for future purchases, then reference it directly on the next checkout to skip re-entering card details.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/checkouts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "cart": "cart_9Pz1",\n    "customer": "cus_5aRk9c",\n    "payment_method": "pm_card_visa",\n    "save_payment_method": true\n  }'`,
          node: `await cartly.checkouts.complete({\n  cart: "cart_9Pz1",\n  customer: "cus_5aRk9c",\n  paymentMethod: "pm_card_visa",\n  savePaymentMethod: true,\n});`,
        },
      },
      { type: "heading", level: 2, text: "Looking up a customer's orders", id: "customer-orders" },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/orders?customer=cus_5aRk9c" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const orders = await cartly.orders.list({ customer: "cus_5aRk9c" });`,
          python: `orders = cartly.Order.list(customer="cus_5aRk9c")`,
        },
      },
      {
        type: "callout",
        variant: "warning",
        text:
          "Emails aren't required to be unique. If you rely on email as a lookup key, search first with GET /customers?email= before creating a new record to avoid duplicates.",
      },
    ],
  },
  {
    slug: "guide-checkout",
    group: GROUP,
    title: "Carts & checkout",
    description: "Build a cart, apply discounts and shipping, then convert it into a paid order.",
    blocks: [
      {
        type: "paragraph",
        text:
          "A Cart is a mutable, temporary object that holds line items while a shopper is browsing. Carts expire automatically after 14 days of inactivity. Once a shopper is ready to pay, you complete a Checkout, which validates stock, calculates totals, charges a payment method, and produces an immutable Order.",
      },
      { type: "heading", level: 2, text: "1. Build the cart", id: "build-cart" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "line_items": [{ "variant": "var_a1", "quantity": 1 }] }'`,
          node: `const cart = await cartly.carts.create({\n  lineItems: [{ variant: "var_a1", quantity: 1 }],\n});`,
        },
      },
      { type: "heading", level: 2, text: "2. Update quantities or add items", id: "update-cart" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1/line_items \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "variant": "var_a2", "quantity": 2 }'`,
          node: `await cartly.carts.addLineItem("cart_9Pz1", { variant: "var_a2", quantity: 2 });`,
        },
      },
      { type: "heading", level: 2, text: "3. Apply a discount code", id: "apply-discount" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1/discounts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "code": "WELCOME10" }'`,
          node: `await cartly.carts.applyDiscount("cart_9Pz1", { code: "WELCOME10" });`,
        },
      },
      { type: "heading", level: 2, text: "4. Set shipping method", id: "set-shipping" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1 \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "shipping_method": "ship_standard" }'`,
          node: `await cartly.carts.update("cart_9Pz1", { shippingMethod: "ship_standard" });`,
        },
      },
      { type: "heading", level: 2, text: "5. Complete checkout", id: "complete-checkout" },
      {
        type: "paragraph",
        text:
          "Completing a checkout is atomic: if payment fails, the cart is left untouched so the shopper can try another payment method. On success, the cart is closed and an Order is created with a snapshot of prices, quantities, and addresses at the time of purchase.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/checkouts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "cart": "cart_9Pz1", "payment_method": "pm_card_visa", "email": "ada@example.com" }'`,
          node: `const order = await cartly.checkouts.complete({\n  cart: "cart_9Pz1",\n  paymentMethod: "pm_card_visa",\n  email: "ada@example.com",\n});`,
        },
        response: `{ "id": "order_7Zc9Ke", "object": "order", "status": "paid", "total": 4300 }`,
      },
      {
        type: "callout",
        variant: "info",
        text:
          "Prefer a hosted page? POST /checkout_sessions returns a `url` you can redirect shoppers to — Cartly hosts the entire payment form for you and redirects back to your success_url on completion.",
      },
    ],
  },
  {
    slug: "guide-orders",
    group: GROUP,
    title: "Orders & fulfillment",
    description: "Track order status from payment through shipment and delivery.",
    blocks: [
      {
        type: "paragraph",
        text:
          "An Order is created once a checkout completes successfully and is immutable with respect to pricing — but its `status` and `fulfillment_status` evolve as you pack and ship items.",
      },
      { type: "heading", level: 2, text: "Order lifecycle", id: "order-lifecycle" },
      {
        type: "table",
        headers: ["status", "Meaning"],
        rows: [
          ["pending", "Payment is processing (e.g. bank redirect methods)."],
          ["paid", "Payment succeeded; ready to fulfill."],
          ["fulfilled", "All items have shipped."],
          ["canceled", "Order was canceled before fulfillment."],
          ["refunded", "Payment was fully refunded."],
        ],
      },
      { type: "heading", level: 2, text: "Creating a fulfillment", id: "creating-fulfillment" },
      {
        type: "paragraph",
        text:
          "Create a fulfillment when you ship some or all of an order's line items. Include a carrier and tracking number so Cartly can send shipment notification emails and expose tracking to the customer.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke/fulfillments \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "line_items": [{ "variant": "var_a1", "quantity": 1 }],\n    "carrier": "ups",\n    "tracking_number": "1Z999AA10123456784"\n  }'`,
          node: `await cartly.orders.createFulfillment("order_7Zc9Ke", {\n  lineItems: [{ variant: "var_a1", quantity: 1 }],\n  carrier: "ups",\n  trackingNumber: "1Z999AA10123456784",\n});`,
          python: `cartly.Order.create_fulfillment(\n    "order_7Zc9Ke",\n    line_items=[{"variant": "var_a1", "quantity": 1}],\n    carrier="ups",\n    tracking_number="1Z999AA10123456784",\n)`,
        },
        response: `{ "id": "ful_2mQpz", "object": "fulfillment", "status": "shipped", "tracking_url": "https://track.example/1Z999AA10123456784" }`,
      },
      { type: "heading", level: 2, text: "Cancellations & refunds", id: "cancellations-refunds" },
      {
        type: "paragraph",
        text:
          "Canceling an unfulfilled order automatically voids or refunds its payment and restocks inventory. To refund only part of an order (e.g. one damaged item), create a partial refund instead.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke/refunds \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "amount": 1800, "reason": "requested_by_customer" }'`,
          node: `await cartly.orders.refund("order_7Zc9Ke", {\n  amount: 1800,\n  reason: "requested_by_customer",\n});`,
        },
      },
      {
        type: "callout",
        variant: "info",
        text:
          "Listen for order.fulfilled and order.refunded webhook events to keep your own systems (email, ERP, analytics) in sync without polling.",
      },
    ],
  },
  {
    slug: "guide-payments",
    group: GROUP,
    title: "Payments",
    description: "Collect card payments and wallets with PaymentIntents and Cartly.js.",
    blocks: [
      {
        type: "paragraph",
        text:
          "Cartly handles the full payment lifecycle through the PaymentIntent object, which tracks a payment attempt from creation through authorization, capture, and potential failure. Most integrations never touch PaymentIntents directly — the Checkout API creates and confirms one automatically — but they're available for custom flows.",
      },
      { type: "heading", level: 2, text: "Tokenizing card details client-side", id: "tokenizing" },
      {
        type: "paragraph",
        text:
          "Never send raw card numbers to your server. Use Cartly.js in the browser with your publishable key to exchange card details for a single-use payment method token.",
      },
      {
        type: "code",
        title: "Cartly.js in the browser",
        code: {
          node: `import { loadCartly } from "@cartly/js";\n\nconst cartly = await loadCartly("pk_test_51Hn8...aB3");\nconst elements = cartly.elements();\nconst card = elements.create("card");\ncard.mount("#card-element");\n\nconst { paymentMethod, error } = await cartly.createPaymentMethod({\n  type: "card",\n  card,\n});`,
        },
      },
      { type: "heading", level: 2, text: "Creating and confirming manually", id: "manual-payment-intent" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/payment_intents \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "amount": 4300, "currency": "usd", "payment_method": "pm_1Nk3aB", "confirm": true }'`,
          node: `const intent = await cartly.paymentIntents.create({\n  amount: 4300,\n  currency: "usd",\n  paymentMethod: "pm_1Nk3aB",\n  confirm: true,\n});`,
          python: `intent = cartly.PaymentIntent.create(\n    amount=4300, currency="usd", payment_method="pm_1Nk3aB", confirm=True\n)`,
        },
        response: `{ "id": "pi_3Nk29d", "object": "payment_intent", "status": "succeeded", "amount": 4300 }`,
      },
      { type: "heading", level: 2, text: "Handling 3D Secure / additional authentication", id: "3ds" },
      {
        type: "paragraph",
        text:
          "Some cards require step-up authentication. When this happens the PaymentIntent's status is `requires_action` and includes a `next_action.redirect_url`. Redirect the shopper there, then poll or wait for a webhook to confirm the final status.",
      },
      {
        type: "table",
        headers: ["status", "Meaning"],
        rows: [
          ["requires_payment_method", "No payment method attached yet, or the last attempt failed."],
          ["requires_action", "Additional customer action needed, such as 3D Secure."],
          ["processing", "Payment is being processed (common for bank debits)."],
          ["succeeded", "Funds have been captured."],
          ["canceled", "The intent was canceled before completion."],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text:
          "Test 3D Secure flows with the card number 4000 0025 0000 3155, which always triggers a challenge in test mode.",
      },
    ],
  },
  {
    slug: "guide-webhooks",
    group: GROUP,
    title: "Webhooks",
    description: "Receive real-time notifications when orders, payments, and inventory change.",
    blocks: [
      {
        type: "paragraph",
        text:
          "Webhooks let Cartly push events to your server the moment something happens, instead of you polling the API. Register an endpoint URL in the dashboard (or via the API), select which event types you care about, and Cartly will POST a JSON payload for each one.",
      },
      { type: "heading", level: 2, text: "Registering an endpoint", id: "registering-endpoint" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/webhook_endpoints \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "url": "https://example.com/webhooks/cartly",\n    "enabled_events": ["order.paid", "order.fulfilled", "inventory.low_stock"]\n  }'`,
          node: `const endpoint = await cartly.webhookEndpoints.create({\n  url: "https://example.com/webhooks/cartly",\n  enabledEvents: ["order.paid", "order.fulfilled", "inventory.low_stock"],\n});`,
        },
        response: `{ "id": "we_2pQmXa", "object": "webhook_endpoint", "secret": "whsec_9f8e...c1", "status": "enabled" }`,
      },
      { type: "heading", level: 2, text: "Verifying signatures", id: "verifying-signatures" },
      {
        type: "paragraph",
        text:
          "Every webhook request includes a `Cartly-Signature` header. Always verify it using your endpoint's signing secret before trusting the payload, to protect against spoofed requests.",
      },
      {
        type: "code",
        title: "Express.js webhook handler",
        code: {
          node: `import express from "express";\nimport { cartly } from "./cartly.js";\n\nconst app = express();\n\napp.post(\n  "/webhooks/cartly",\n  express.raw({ type: "application/json" }),\n  (req, res) => {\n    const signature = req.headers["cartly-signature"];\n    let event;\n    try {\n      event = cartly.webhooks.constructEvent(\n        req.body,\n        signature,\n        process.env.CARTLY_WEBHOOK_SECRET\n      );\n    } catch (err) {\n      return res.status(400).send('Webhook Error: ' + err.message);\n    }\n\n    if (event.type === "order.paid") {\n      console.log("Order paid:", event.data.object.id);\n    }\n\n    res.json({ received: true });\n  }\n);`,
          python: `import cartly\nfrom flask import Flask, request\n\napp = Flask(__name__)\n\n@app.route("/webhooks/cartly", methods=["POST"])\ndef webhook():\n    payload = request.data\n    sig = request.headers.get("Cartly-Signature")\n    try:\n        event = cartly.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)\n    except ValueError:\n        return "Invalid payload", 400\n\n    if event["type"] == "order.paid":\n        print("Order paid:", event["data"]["object"]["id"])\n\n    return "", 200`,
        },
      },
      { type: "heading", level: 2, text: "Common event types", id: "common-events" },
      {
        type: "table",
        headers: ["Event", "Description"],
        rows: [
          ["cart.created", "A new cart was started."],
          ["order.paid", "An order's payment succeeded."],
          ["order.fulfilled", "All line items on an order have shipped."],
          ["order.refunded", "An order was fully or partially refunded."],
          ["payment_intent.payment_failed", "A payment attempt failed."],
          ["inventory.low_stock", "A variant fell below its low-stock threshold."],
          ["customer.created", "A new customer record was created."],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text:
          "Endpoints must respond with a 2xx status within 10 seconds. Cartly retries failed deliveries with exponential backoff for up to 3 days.",
      },
    ],
  },
];
