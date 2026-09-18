import type { DocPage } from "../types";

const GROUP = "Getting started";

export const gettingStartedPages: DocPage[] = [
  {
    slug: "introduction",
    group: GROUP,
    title: "Introduction",
    description:
      "Cartly is a commerce API for building storefronts, checkouts, and order management into any product.",
    blocks: [
      {
        type: "paragraph",
        text:
          "The Cartly API is a predictable, resource-oriented HTTP API for adding commerce to your product: products and inventory, carts and checkout, orders, payments, and customer accounts. It uses standard HTTP verbs, returns JSON, and authenticates with a simple API key — no SDK required, though official libraries are available for Node.js, Python, Ruby, and PHP.",
      },
      {
        type: "callout",
        variant: "info",
        text:
          "New to Cartly? Start with the Quickstart guide to create your first product and complete a test checkout in under ten minutes.",
      },
      { type: "heading", level: 2, text: "Base URL", id: "base-url" },
      {
        type: "paragraph",
        text:
          "All API requests are made over HTTPS to the following base URL. Requests made over plain HTTP will fail.",
      },
      {
        type: "code",
        code: {
          curl: `https://api.cartly.dev/v1`,
        },
      },
      { type: "heading", level: 2, text: "The Cartly object model", id: "object-model" },
      {
        type: "paragraph",
        text:
          "Every resource in Cartly is represented as a JSON object with a stable `id`, an `object` field describing its type, and a `created` Unix timestamp. Core resources you'll work with:",
      },
      {
        type: "table",
        headers: ["Resource", "Description"],
        rows: [
          ["Product", "A sellable item in your catalog, containing one or more variants."],
          ["Variant", "A specific purchasable version of a product (size, color, SKU, price, stock)."],
          ["Customer", "A shopper, with saved addresses and order history."],
          ["Cart", "A mutable collection of line items building up to a checkout."],
          ["Order", "An immutable record created once a cart is successfully checked out."],
          ["PaymentIntent", "Tracks the lifecycle of collecting payment for an order."],
          ["Discount", "A coupon or automatic promotion applied to carts and orders."],
          ["Event", "A webhook-delivered notification that something changed."],
        ],
      },
      { type: "heading", level: 2, text: "Client libraries", id: "libraries" },
      {
        type: "paragraph",
        text:
          "Official libraries wrap the HTTP API with idiomatic, typed helpers and automatic retries. Every code sample in these docs can be toggled between cURL, Node.js, Python, Ruby, and PHP using the language switcher above each snippet.",
      },
      {
        type: "code",
        title: "Install the SDK",
        code: {
          curl: `# The HTTP API works with any language.\n# No installation required — just an API key.`,
          node: `npm install @cartly/node`,
          python: `pip install cartly`,
          ruby: `gem install cartly`,
          php: `composer require cartly/cartly-php`,
        },
      },
      { type: "heading", level: 2, text: "Environments", id: "environments" },
      {
        type: "paragraph",
        text:
          "Every account has two modes: test and live. Test mode data is fully isolated from live mode — carts, orders, and payments created in test mode never touch real money and are periodically cleared. Toggle modes from the dashboard, or simply use a test (`sk_test_`) or live (`sk_live_`) API key.",
      },
    ],
  },
  {
    slug: "authentication",
    group: GROUP,
    title: "Authentication",
    description: "Authenticate requests to the Cartly API using your secret API key.",
    blocks: [
      {
        type: "paragraph",
        text:
          "The Cartly API uses API keys to authenticate requests. You can view and manage your keys in the dashboard under Developers → API keys. Keys are scoped to test or live mode, and can optionally be restricted to a subset of resources.",
      },
      {
        type: "callout",
        variant: "warning",
        text:
          "Your secret keys carry many privileges, so keep them safe. Never expose them in client-side code, mobile apps, or public repositories.",
      },
      { type: "heading", level: 2, text: "Making authenticated requests", id: "making-requests" },
      {
        type: "paragraph",
        text:
          "Provide your secret key in the `Authorization` header as a Bearer token on every request. Authentication is not performed via query string or cookies.",
      },
      {
        type: "code",
        title: "Fetch your account",
        code: {
          curl: `curl https://api.cartly.dev/v1/account \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `import Cartly from "@cartly/node";\n\nconst cartly = new Cartly("sk_test_51Hn8...vX2");\n\nconst account = await cartly.account.retrieve();\nconsole.log(account);`,
          python: `import cartly\n\ncartly.api_key = "sk_test_51Hn8...vX2"\n\naccount = cartly.Account.retrieve()\nprint(account)`,
          ruby: `require "cartly"\nCartly.api_key = "sk_test_51Hn8...vX2"\n\naccount = Cartly::Account.retrieve\nputs account`,
          php: `require_once "vendor/autoload.php";\n\\Cartly\\Cartly::setApiKey("sk_test_51Hn8...vX2");\n\n$account = \\Cartly\\Account::retrieve();\necho $account;`,
        },
        response: `{\n  "id": "acct_1Nk29d",\n  "object": "account",\n  "business_name": "Acme Supply Co.",\n  "mode": "test",\n  "default_currency": "usd"\n}`,
      },
      { type: "heading", level: 2, text: "Publishable vs. secret keys", id: "key-types" },
      {
        type: "table",
        headers: ["Key type", "Prefix", "Use case"],
        rows: [
          ["Secret key", "sk_test_ / sk_live_", "Server-side only. Full access to your account."],
          [
            "Publishable key",
            "pk_test_ / pk_live_",
            "Safe to embed in client-side code. Used with Cartly.js to tokenize card details.",
          ],
          [
            "Restricted key",
            "rk_test_ / rk_live_",
            "Secret key scoped to specific resources and read/write permissions.",
          ],
        ],
      },
      { type: "heading", level: 2, text: "Idempotent requests", id: "idempotency" },
      {
        type: "paragraph",
        text:
          "POST requests that create resources (carts, orders, payment intents) accept an `Idempotency-Key` header. Reusing the same key within 24 hours guarantees the operation is performed only once, which is essential when retrying requests after a network failure.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/orders \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Idempotency-Key: order-checkout-8f14e45"`,
          node: `await cartly.orders.create(\n  { cart: "cart_1P2q3R" },\n  { idempotencyKey: "order-checkout-8f14e45" }\n);`,
          python: `cartly.Order.create(\n    cart="cart_1P2q3R",\n    idempotency_key="order-checkout-8f14e45",\n)`,
          ruby: `Cartly::Order.create(\n  { cart: "cart_1P2q3R" },\n  { idempotency_key: "order-checkout-8f14e45" }\n)`,
          php: `\\Cartly\\Order::create(\n  ["cart" => "cart_1P2q3R"],\n  ["idempotency_key" => "order-checkout-8f14e45"]\n);`,
        },
      },
    ],
  },
  {
    slug: "quickstart",
    group: GROUP,
    title: "Quickstart",
    description: "Create a product, build a cart, and complete a test checkout in minutes.",
    blocks: [
      {
        type: "paragraph",
        text:
          "This guide walks through the smallest possible integration: creating a product, adding it to a cart, and turning that cart into a paid order using a test card. It assumes you already have a test-mode secret key.",
      },
      { type: "heading", level: 2, text: "1. Create a product", id: "create-product" },
      {
        type: "paragraph",
        text:
          "Products describe what you sell. Each product needs at least one variant, which holds the price and stock count.",
      },
      {
        type: "code",
        title: "Create a product with one variant",
        code: {
          curl: `curl https://api.cartly.dev/v1/products \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Aria Ceramic Mug",\n    "description": "350ml matte ceramic mug",\n    "variants": [\n      { "name": "Default", "price": 1800, "currency": "usd", "sku": "MUG-ARIA-01", "inventory": 120 }\n    ]\n  }'`,
          node: `const product = await cartly.products.create({\n  name: "Aria Ceramic Mug",\n  description: "350ml matte ceramic mug",\n  variants: [\n    { name: "Default", price: 1800, currency: "usd", sku: "MUG-ARIA-01", inventory: 120 },\n  ],\n});`,
          python: `product = cartly.Product.create(\n    name="Aria Ceramic Mug",\n    description="350ml matte ceramic mug",\n    variants=[\n        {"name": "Default", "price": 1800, "currency": "usd", "sku": "MUG-ARIA-01", "inventory": 120}\n    ],\n)`,
          ruby: `product = Cartly::Product.create(\n  name: "Aria Ceramic Mug",\n  description: "350ml matte ceramic mug",\n  variants: [\n    { name: "Default", price: 1800, currency: "usd", sku: "MUG-ARIA-01", inventory: 120 }\n  ]\n)`,
          php: `$product = \\Cartly\\Product::create([\n  "name" => "Aria Ceramic Mug",\n  "description" => "350ml matte ceramic mug",\n  "variants" => [[\n    "name" => "Default", "price" => 1800, "currency" => "usd",\n    "sku" => "MUG-ARIA-01", "inventory" => 120\n  ]]\n]);`,
        },
        response: `{\n  "id": "prod_NkX21a",\n  "object": "product",\n  "name": "Aria Ceramic Mug",\n  "variants": [\n    {\n      "id": "var_8mQ2p1",\n      "price": 1800,\n      "currency": "usd",\n      "sku": "MUG-ARIA-01",\n      "inventory": 120\n    }\n  ]\n}`,
      },
      { type: "heading", level: 2, text: "2. Create a cart and add a line item", id: "create-cart" },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/carts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "line_items": [{ "variant": "var_8mQ2p1", "quantity": 2 }]\n  }'`,
          node: `const cart = await cartly.carts.create({\n  lineItems: [{ variant: "var_8mQ2p1", quantity: 2 }],\n});`,
          python: `cart = cartly.Cart.create(\n    line_items=[{"variant": "var_8mQ2p1", "quantity": 2}]\n)`,
          ruby: `cart = Cartly::Cart.create(\n  line_items: [{ variant: "var_8mQ2p1", quantity: 2 }]\n)`,
          php: `$cart = \\Cartly\\Cart::create([\n  "line_items" => [["variant" => "var_8mQ2p1", "quantity" => 2]]\n]);`,
        },
        response: `{\n  "id": "cart_1P2q3R",\n  "object": "cart",\n  "status": "open",\n  "subtotal": 3600,\n  "currency": "usd",\n  "line_items": [\n    { "variant": "var_8mQ2p1", "quantity": 2, "amount": 3600 }\n  ]\n}`,
      },
      { type: "heading", level: 2, text: "3. Collect payment and complete checkout", id: "checkout" },
      {
        type: "paragraph",
        text:
          "Create a PaymentIntent for the cart's total, confirm it with a test card, then complete the checkout to turn the cart into a permanent order.",
      },
      {
        type: "code",
        code: {
          curl: `curl https://api.cartly.dev/v1/checkouts \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "cart": "cart_1P2q3R",\n    "payment_method": "pm_card_visa",\n    "email": "ada@example.com"\n  }'`,
          node: `const order = await cartly.checkouts.complete({\n  cart: "cart_1P2q3R",\n  paymentMethod: "pm_card_visa",\n  email: "ada@example.com",\n});`,
          python: `order = cartly.Checkout.complete(\n    cart="cart_1P2q3R",\n    payment_method="pm_card_visa",\n    email="ada@example.com",\n)`,
          ruby: `order = Cartly::Checkout.complete(\n  cart: "cart_1P2q3R",\n  payment_method: "pm_card_visa",\n  email: "ada@example.com"\n)`,
          php: `$order = \\Cartly\\Checkout::complete([\n  "cart" => "cart_1P2q3R",\n  "payment_method" => "pm_card_visa",\n  "email" => "ada@example.com"\n]);`,
        },
        response: `{\n  "id": "order_7Zc9Ke",\n  "object": "order",\n  "status": "paid",\n  "total": 3600,\n  "currency": "usd",\n  "customer_email": "ada@example.com"\n}`,
      },
      {
        type: "callout",
        variant: "success",
        text:
          "That's it — you've created a product and completed an end-to-end test purchase. Continue to Guides to learn about inventory, customers, discounts, and webhooks.",
      },
    ],
  },
  {
    slug: "errors",
    group: GROUP,
    title: "Errors",
    description: "Cartly uses conventional HTTP response codes and a consistent error object.",
    blocks: [
      {
        type: "paragraph",
        text:
          "Cartly returns standard HTTP status codes to indicate the success or failure of a request. Codes in the 2xx range indicate success; 4xx codes indicate an error caused by the request (missing parameters, invalid state, failed payment); 5xx codes indicate an error on Cartly's end.",
      },
      {
        type: "table",
        headers: ["Status", "Meaning"],
        rows: [
          ["200 OK", "The request succeeded."],
          ["201 Created", "The resource was created successfully."],
          ["400 Bad Request", "The request was unacceptable, often due to a missing or malformed parameter."],
          ["401 Unauthorized", "No valid API key was provided."],
          ["402 Payment Required", "The payment attempt failed (e.g. card declined)."],
          ["403 Forbidden", "The API key doesn't have permission to perform the request."],
          ["404 Not Found", "The requested resource doesn't exist."],
          ["409 Conflict", "The request conflicts with the current state of the resource (e.g. out of stock)."],
          ["429 Too Many Requests", "Too many requests hit the API too quickly."],
          ["500, 502, 503, 504", "Something went wrong on Cartly's servers."],
        ],
      },
      { type: "heading", level: 2, text: "The error object", id: "error-object" },
      {
        type: "code",
        title: "Example error response",
        code: {
          curl: `HTTP/1.1 402 Payment Required\nContent-Type: application/json`,
        },
        response: `{\n  "error": {\n    "type": "card_error",\n    "code": "card_declined",\n    "message": "Your card was declined.",\n    "param": "payment_method",\n    "request_id": "req_9fVc2m"\n  }\n}`,
      },
      {
        type: "table",
        headers: ["Type", "Description"],
        rows: [
          ["api_error", "An error on Cartly's servers. These are rare."],
          ["authentication_error", "Cartly could not authenticate the request."],
          ["card_error", "The card couldn't be charged for some reason."],
          ["invalid_request_error", "The request had invalid parameters."],
          ["idempotency_error", "The idempotency key was reused with a different request payload."],
          ["rate_limit_error", "Too many requests hit the API too quickly."],
        ],
      },
      { type: "heading", level: 2, text: "Handling errors in code", id: "handling-errors" },
      {
        type: "code",
        code: {
          node: `try {\n  await cartly.checkouts.complete({ cart: "cart_1P2q3R", paymentMethod: "pm_card_chargeDeclined" });\n} catch (err) {\n  if (err.type === "card_error") {\n    console.log("Declined:", err.message);\n  } else {\n    throw err;\n  }\n}`,
          python: `try:\n    cartly.Checkout.complete(cart="cart_1P2q3R", payment_method="pm_card_chargeDeclined")\nexcept cartly.error.CardError as e:\n    print("Declined:", e.user_message)`,
          ruby: `begin\n  Cartly::Checkout.complete(cart: "cart_1P2q3R", payment_method: "pm_card_chargeDeclined")\nrescue Cartly::CardError => e\n  puts "Declined: #{e.message}"\nend`,
          php: `try {\n  \\Cartly\\Checkout::complete(["cart" => "cart_1P2q3R", "payment_method" => "pm_card_chargeDeclined"]);\n} catch (\\Cartly\\Exception\\CardException $e) {\n  echo "Declined: " . $e->getMessage();\n}`,
        },
      },
      {
        type: "callout",
        variant: "info",
        text: "Every response includes a request_id. Include it when contacting support so we can pull up the exact request.",
      },
    ],
  },
  {
    slug: "pagination-rate-limits",
    group: GROUP,
    title: "Pagination & rate limits",
    description: "List endpoints are paginated with cursors; requests are subject to rate limits.",
    blocks: [
      { type: "heading", level: 2, text: "Cursor pagination", id: "cursor-pagination" },
      {
        type: "paragraph",
        text:
          "All top-level list endpoints (`/products`, `/orders`, `/customers`, ...) share a common pagination scheme, sorted by creation date, newest first. Pass `limit` (default 10, max 100) to control page size, and `starting_after` or `ending_before` with an object id to page forwards or backwards.",
      },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/orders?limit=3&starting_after=order_7Zc9Ke" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const page = await cartly.orders.list({ limit: 3, startingAfter: "order_7Zc9Ke" });`,
          python: `page = cartly.Order.list(limit=3, starting_after="order_7Zc9Ke")`,
          ruby: `page = Cartly::Order.list(limit: 3, starting_after: "order_7Zc9Ke")`,
          php: `$page = \\Cartly\\Order::all(["limit" => 3, "starting_after" => "order_7Zc9Ke"]);`,
        },
        response: `{\n  "object": "list",\n  "url": "/v1/orders",\n  "has_more": true,\n  "data": [ { "id": "order_8bYqLz", "object": "order" } ]\n}`,
      },
      { type: "heading", level: 2, text: "Rate limits", id: "rate-limits" },
      {
        type: "paragraph",
        text:
          "The API allows up to 100 read requests per second and 50 write requests per second per account in live mode (lower in test mode). Every response includes headers describing your current usage.",
      },
      {
        type: "table",
        headers: ["Header", "Description"],
        rows: [
          ["X-RateLimit-Limit", "The maximum number of requests permitted in the current window."],
          ["X-RateLimit-Remaining", "Requests remaining in the current window."],
          ["Retry-After", "Seconds to wait before retrying, present on 429 responses."],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text:
          "Implement exponential backoff when you receive a 429. All official client libraries do this automatically.",
      },
      { type: "heading", level: 2, text: "Expanding responses", id: "expanding" },
      {
        type: "paragraph",
        text:
          "Many endpoints return an id for related objects by default. Use the `expand` parameter to inline nested resources and avoid an extra round trip.",
      },
      {
        type: "code",
        code: {
          curl: `curl "https://api.cartly.dev/v1/orders/order_7Zc9Ke?expand[]=customer&expand[]=payment_intent" \\\n  -H "Authorization: Bearer sk_test_51Hn8...vX2"`,
          node: `const order = await cartly.orders.retrieve("order_7Zc9Ke", {\n  expand: ["customer", "payment_intent"],\n});`,
          python: `order = cartly.Order.retrieve("order_7Zc9Ke", expand=["customer", "payment_intent"])`,
          ruby: `order = Cartly::Order.retrieve("order_7Zc9Ke", expand: ["customer", "payment_intent"])`,
          php: `$order = \\Cartly\\Order::retrieve(["id" => "order_7Zc9Ke", "expand" => ["customer", "payment_intent"]]);`,
        },
      },
    ],
  },
];
