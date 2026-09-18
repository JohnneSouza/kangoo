import type { DocPage } from "../types";

const GROUP = "API reference";

export const apiReferencePages: DocPage[] = [
  {
    slug: "api-products",
    group: GROUP,
    title: "Products",
    description: "Create and manage catalog items and their variants.",
    blocks: [
      { type: "heading", level: 2, text: "The product object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with prod_."],
          ["name", "string", "Display name of the product."],
          ["description", "string", "Long-form description, supports plain text."],
          ["active", "boolean", "Whether the product is visible on listing endpoints."],
          ["options", "array", "Names of variant options, e.g. [\"Size\", \"Color\"]."],
          ["variants", "array", "Expandable list of variant objects."],
          ["images", "array", "List of image URLs."],
          ["created", "timestamp", "Time the product was created."],
        ],
      },
      { type: "heading", level: 2, text: "Create a product", id: "create" },
      {
        type: "paragraph",
        text: "POST /v1/products",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/products \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "name": "Aria Ceramic Mug", "variants": [{ "price": 1800, "currency": "usd", "inventory": 120 }] }'`,
          node: `const product = await cartly.products.create({\n  name: "Aria Ceramic Mug",\n  variants: [{ price: 1800, currency: "usd", inventory: 120 }],\n});`,
          python: `product = cartly.Product.create(\n    name="Aria Ceramic Mug",\n    variants=[{"price": 1800, "currency": "usd", "inventory": 120}],\n)`,
          ruby: `product = Cartly::Product.create(\n  name: "Aria Ceramic Mug",\n  variants: [{ price: 1800, currency: "usd", inventory: 120 }]\n)`,
          php: `$product = \\Cartly\\Product::create([\n  "name" => "Aria Ceramic Mug",\n  "variants" => [["price" => 1800, "currency" => "usd", "inventory" => 120]]\n]);`,
        },
        response: `{ "id": "prod_NkX21a", "object": "product", "name": "Aria Ceramic Mug", "active": true }`,
      },
      { type: "heading", level: 2, text: "Retrieve a product", id: "retrieve" },
      { type: "paragraph", text: "GET /v1/products/:id" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/products/prod_NkX21a \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const product = await cartly.products.retrieve("prod_NkX21a");`,
          python: `product = cartly.Product.retrieve("prod_NkX21a")`,
          ruby: `product = Cartly::Product.retrieve("prod_NkX21a")`,
          php: `$product = \\Cartly\\Product::retrieve("prod_NkX21a");`,
        },
      },
      { type: "heading", level: 2, text: "Update a product", id: "update" },
      { type: "paragraph", text: "POST /v1/products/:id" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/products/prod_NkX21a \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "active": false }'`,
          node: `await cartly.products.update("prod_NkX21a", { active: false });`,
          python: `cartly.Product.modify("prod_NkX21a", active=False)`,
        },
      },
      { type: "heading", level: 2, text: "List products", id: "list" },
      { type: "paragraph", text: "GET /v1/products" },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/products?limit=20&active=true" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const products = await cartly.products.list({ limit: 20, active: true });`,
          python: `products = cartly.Product.list(limit=20, active=True)`,
        },
        response: `{ "object": "list", "has_more": false, "data": [ { "id": "prod_NkX21a", "object": "product" } ] }`,
      },
      {
        type: "table",
        headers: ["Parameter", "Description"],
        rows: [
          ["limit", "Number of items to return (1-100, default 10)."],
          ["active", "Filter by active status."],
          ["category", "Filter by category slug."],
          ["starting_after / ending_before", "Cursor for pagination, see Pagination guide."],
        ],
      },
      { type: "heading", level: 2, text: "Delete a product", id: "delete" },
      {
        type: "paragraph",
        text:
          "DELETE /v1/products/:id — only allowed for products that have never been part of an order. Otherwise, archive with active: false.",
      },
      {
        type: "code",
        code: {
          curl: `curl -X DELETE https://api.cartly.dev/v1/products/prod_NkX21a \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.products.del("prod_NkX21a");`,
          python: `cartly.Product.delete("prod_NkX21a")`,
        },
      },
    ],
  },
  {
    slug: "api-customers",
    group: GROUP,
    title: "Customers",
    description: "Represent a shopper with saved addresses and payment methods.",
    blocks: [
      { type: "heading", level: 2, text: "The customer object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with cus_."],
          ["email", "string", "Customer's email address."],
          ["name", "string", "Full name."],
          ["shipping_address", "object", "Default shipping address."],
          ["default_payment_method", "string", "ID of the default saved payment method, if any."],
          ["created", "timestamp", "Time the customer was created."],
        ],
      },
      { type: "heading", level: 2, text: "Create a customer", id: "create" },
      { type: "paragraph", text: "POST /v1/customers" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/customers \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "email": "ada@example.com", "name": "Ada Lovelace" }'`,
          node: `const customer = await cartly.customers.create({ email: "ada@example.com", name: "Ada Lovelace" });`,
          python: `customer = cartly.Customer.create(email="ada@example.com", name="Ada Lovelace")`,
        },
        response: `{ "id": "cus_5aRk9c", "object": "customer", "email": "ada@example.com" }`,
      },
      { type: "heading", level: 2, text: "Retrieve a customer", id: "retrieve" },
      { type: "paragraph", text: "GET /v1/customers/:id" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/customers/cus_5aRk9c \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const customer = await cartly.customers.retrieve("cus_5aRk9c");`,
        },
      },
      { type: "heading", level: 2, text: "Update a customer", id: "update" },
      { type: "paragraph", text: "POST /v1/customers/:id" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/customers/cus_5aRk9c \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "name": "Ada K. Lovelace" }'`,
          node: `await cartly.customers.update("cus_5aRk9c", { name: "Ada K. Lovelace" });`,
        },
      },
      { type: "heading", level: 2, text: "List customers", id: "list" },
      { type: "paragraph", text: "GET /v1/customers" },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/customers?email=ada@example.com" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const customers = await cartly.customers.list({ email: "ada@example.com" });`,
        },
      },
    ],
  },
  {
    slug: "api-carts",
    group: GROUP,
    title: "Carts",
    description: "A mutable collection of line items building up to a checkout.",
    blocks: [
      { type: "heading", level: 2, text: "The cart object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with cart_."],
          ["status", "string", "open, completed, or expired."],
          ["line_items", "array", "Variant + quantity pairs."],
          ["subtotal", "integer", "Sum of line items before discounts, tax, and shipping, in cents."],
          ["total", "integer", "Final amount due, in cents."],
          ["currency", "string", "Three-letter ISO currency code."],
          ["discounts", "array", "Applied discount codes."],
        ],
      },
      { type: "heading", level: 2, text: "Create a cart", id: "create" },
      { type: "paragraph", text: "POST /v1/carts" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "line_items": [{ "variant": "var_a1", "quantity": 1 }] }'`,
          node: `const cart = await cartly.carts.create({ lineItems: [{ variant: "var_a1", quantity: 1 }] });`,
        },
        response: `{ "id": "cart_9Pz1", "object": "cart", "status": "open", "subtotal": 2500 }`,
      },
      { type: "heading", level: 2, text: "Add a line item", id: "add-line-item" },
      { type: "paragraph", text: "POST /v1/carts/:id/line_items" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1/line_items \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "variant": "var_a2", "quantity": 2 }'`,
          node: `await cartly.carts.addLineItem("cart_9Pz1", { variant: "var_a2", quantity: 2 });`,
        },
      },
      { type: "heading", level: 2, text: "Remove a line item", id: "remove-line-item" },
      { type: "paragraph", text: "DELETE /v1/carts/:id/line_items/:line_item_id" },
      {
        type: "code",
        code: {
          curl: `curl -X DELETE https://api.cartly.dev/v1/carts/cart_9Pz1/line_items/li_88x \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.carts.removeLineItem("cart_9Pz1", "li_88x");`,
        },
      },
      { type: "heading", level: 2, text: "Apply / remove a discount", id: "discounts" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1/discounts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "code": "WELCOME10" }'`,
          node: `await cartly.carts.applyDiscount("cart_9Pz1", { code: "WELCOME10" });`,
        },
      },
      { type: "heading", level: 2, text: "Retrieve a cart", id: "retrieve" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts/cart_9Pz1 \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const cart = await cartly.carts.retrieve("cart_9Pz1");`,
        },
      },
    ],
  },
  {
    slug: "api-orders",
    group: GROUP,
    title: "Orders",
    description: "Immutable records created once a cart is successfully checked out.",
    blocks: [
      { type: "heading", level: 2, text: "The order object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with order_."],
          ["status", "string", "pending, paid, fulfilled, canceled, or refunded."],
          ["fulfillment_status", "string", "unfulfilled, partial, or fulfilled."],
          ["total", "integer", "Total amount charged, in cents."],
          ["customer", "string | object", "Expandable reference to the customer."],
          ["payment_intent", "string | object", "Expandable reference to the payment intent."],
          ["line_items", "array", "Snapshot of purchased items and prices."],
        ],
      },
      { type: "heading", level: 2, text: "Retrieve an order", id: "retrieve" },
      { type: "paragraph", text: "GET /v1/orders/:id" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const order = await cartly.orders.retrieve("order_7Zc9Ke");`,
        },
      },
      { type: "heading", level: 2, text: "List orders", id: "list" },
      { type: "paragraph", text: "GET /v1/orders" },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/orders?status=paid&limit=10" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const orders = await cartly.orders.list({ status: "paid", limit: 10 });`,
        },
      },
      { type: "heading", level: 2, text: "Create a fulfillment", id: "create-fulfillment" },
      { type: "paragraph", text: "POST /v1/orders/:id/fulfillments" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke/fulfillments \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "carrier": "ups", "tracking_number": "1Z999AA10123456784" }'`,
          node: `await cartly.orders.createFulfillment("order_7Zc9Ke", {\n  carrier: "ups",\n  trackingNumber: "1Z999AA10123456784",\n});`,
        },
      },
      { type: "heading", level: 2, text: "Cancel an order", id: "cancel" },
      { type: "paragraph", text: "POST /v1/orders/:id/cancel" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke/cancel \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.orders.cancel("order_7Zc9Ke");`,
        },
      },
      { type: "heading", level: 2, text: "Refund an order", id: "refund" },
      { type: "paragraph", text: "POST /v1/orders/:id/refunds" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders/order_7Zc9Ke/refunds \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "amount": 1800 }'`,
          node: `await cartly.orders.refund("order_7Zc9Ke", { amount: 1800 });`,
        },
      },
    ],
  },
  {
    slug: "api-payments",
    group: GROUP,
    title: "Payment intents",
    description: "Track the lifecycle of collecting payment for a cart or order.",
    blocks: [
      { type: "heading", level: 2, text: "The payment intent object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with pi_."],
          ["amount", "integer", "Amount to collect, in cents."],
          ["currency", "string", "Three-letter ISO currency code."],
          [
            "status",
            "string",
            "requires_payment_method, requires_action, processing, succeeded, or canceled.",
          ],
          ["payment_method", "string", "ID of the attached payment method."],
          ["client_secret", "string", "Used by Cartly.js to confirm the payment client-side."],
        ],
      },
      { type: "heading", level: 2, text: "Create a payment intent", id: "create" },
      { type: "paragraph", text: "POST /v1/payment_intents" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/payment_intents \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "amount": 4300, "currency": "usd" }'`,
          node: `const intent = await cartly.paymentIntents.create({ amount: 4300, currency: "usd" });`,
        },
        response: `{ "id": "pi_3Nk29d", "object": "payment_intent", "status": "requires_payment_method", "client_secret": "pi_3Nk29d_secret_aE7" }`,
      },
      { type: "heading", level: 2, text: "Confirm a payment intent", id: "confirm" },
      { type: "paragraph", text: "POST /v1/payment_intents/:id/confirm" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/payment_intents/pi_3Nk29d/confirm \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "payment_method": "pm_1Nk3aB" }'`,
          node: `await cartly.paymentIntents.confirm("pi_3Nk29d", { paymentMethod: "pm_1Nk3aB" });`,
        },
      },
      { type: "heading", level: 2, text: "Capture a payment intent", id: "capture" },
      {
        type: "paragraph",
        text:
          "If you created the intent with capture_method: manual, funds are authorized but not captured. Call capture within 7 days to collect them.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/payment_intents/pi_3Nk29d/capture \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.paymentIntents.capture("pi_3Nk29d");`,
        },
      },
      { type: "heading", level: 2, text: "Cancel a payment intent", id: "cancel" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/payment_intents/pi_3Nk29d/cancel \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.paymentIntents.cancel("pi_3Nk29d");`,
        },
      },
    ],
  },
  {
    slug: "api-discounts",
    group: GROUP,
    title: "Discounts",
    description: "Coupons and automatic promotions applied to carts and orders.",
    blocks: [
      { type: "heading", level: 2, text: "The discount object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with disc_."],
          ["code", "string", "The code shoppers enter, e.g. WELCOME10."],
          ["type", "string", "percentage or fixed_amount."],
          ["value", "integer", "10 for 10%, or an amount in cents for fixed_amount."],
          ["max_redemptions", "integer", "Total number of times the code may be used."],
          ["expires_at", "timestamp", "When the discount stops being valid."],
        ],
      },
      { type: "heading", level: 2, text: "Create a discount", id: "create" },
      { type: "paragraph", text: "POST /v1/discounts" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/discounts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "code": "WELCOME10", "type": "percentage", "value": 10, "max_redemptions": 500 }'`,
          node: `const discount = await cartly.discounts.create({\n  code: "WELCOME10",\n  type: "percentage",\n  value: 10,\n  maxRedemptions: 500,\n});`,
        },
        response: `{ "id": "disc_1nQk", "object": "discount", "code": "WELCOME10", "value": 10 }`,
      },
      { type: "heading", level: 2, text: "Retrieve a discount", id: "retrieve" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/discounts/disc_1nQk \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const discount = await cartly.discounts.retrieve("disc_1nQk");`,
        },
      },
      { type: "heading", level: 2, text: "Delete a discount", id: "delete" },
      {
        type: "code",
        code: {
          curl: `curl -X DELETE https://api.cartly.dev/v1/discounts/disc_1nQk \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `await cartly.discounts.del("disc_1nQk");`,
        },
      },
    ],
  },
  {
    slug: "api-webhooks-events",
    group: GROUP,
    title: "Webhook endpoints & events",
    description: "Manage endpoints and inspect the events Cartly has sent.",
    blocks: [
      { type: "heading", level: 2, text: "The webhook endpoint object", id: "the-object" },
      {
        type: "table",
        headers: ["Attribute", "Type", "Description"],
        rows: [
          ["id", "string", "Unique identifier, prefixed with we_."],
          ["url", "string", "HTTPS URL events are POSTed to."],
          ["enabled_events", "array", "Event types this endpoint receives."],
          ["secret", "string", "Signing secret, only returned once on creation."],
          ["status", "string", "enabled or disabled."],
        ],
      },
      { type: "heading", level: 2, text: "Create an endpoint", id: "create" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/webhook_endpoints \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -d '{ "url": "https://example.com/webhooks/cartly", "enabled_events": ["order.paid"] }'`,
          node: `const endpoint = await cartly.webhookEndpoints.create({\n  url: "https://example.com/webhooks/cartly",\n  enabledEvents: ["order.paid"],\n});`,
        },
      },
      { type: "heading", level: 2, text: "List events", id: "list-events" },
      {
        type: "paragraph",
        text: "GET /v1/events — inspect recent events for debugging, independent of webhook delivery.",
      },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/events?type=order.paid&limit=5" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const events = await cartly.events.list({ type: "order.paid", limit: 5 });`,
        },
        response: `{ "object": "list", "data": [ { "id": "evt_5xQ2", "type": "order.paid", "created": 1719858213 } ] }`,
      },
      { type: "heading", level: 2, text: "Retrieve an event", id: "retrieve-event" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/events/evt_5xQ2 \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const event = await cartly.events.retrieve("evt_5xQ2");`,
        },
      },
    ],
  },
];
