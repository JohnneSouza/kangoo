# Application Flow

Analyzed: `/home/johnnes/Projects/kangoo/frontend`

## Pages

- **/**
  - Component: HomePage
  - Source: ../frontend/src/App.tsx:106

- **/activation-success**
  - Component: ActivationSuccessPage
  - Source: ../frontend/src/App.tsx:123

- **/product/:productId/reviews**
  - Component: ProductReviewsPage
  - Source: ../frontend/src/App.tsx:127

- **/orders**
  - Component: OrdersPage
  - Guards: ProtectedRoute
  - Gating stores: auth-storage
  - Source: ../frontend/src/App.tsx:131

- **/orders/:orderId**
  - Component: OrderDetailPage
  - Source: ../frontend/src/App.tsx:139

- **/profile**
  - Component: ProfilePage
  - Guards: ProtectedRoute
  - Gating stores: auth-storage
  - Source: ../frontend/src/App.tsx:143

- **/favorites**
  - Component: FavoritesPage
  - Guards: ProtectedRoute
  - Gating stores: auth-storage
  - Source: ../frontend/src/App.tsx:151

- **/checkout**
  - Component: CheckoutPage
  - Source: ../frontend/src/App.tsx:159

- **\***
  - Component: ErrorPage
  - Source: ../frontend/src/App.tsx:164

## Navigation

- **AppContent** → /
  - Type: navigate
  - Locator: —
  - Condition: isProtectedPath && !isAuthenticated
  - Source: ../frontend/src/App.tsx:59

- **AppContent** → /
  - Type: navigate
  - Locator: —
  - Condition: always rendered
  - Source: ../frontend/src/App.tsx:76

- **AppContent** → /
  - Type: navigate
  - Locator: —
  - Condition: always rendered
  - Source: ../frontend/src/App.tsx:83

- **CartSidebar** → /checkout
  - Type: navigate
  - Locator: getByTestId(`cart-checkout-button`)
  - Condition: always rendered
  - Source: ../frontend/src/components/CartSidebar.tsx:19

- **Header** → /
  - Type: navigate
  - Locator: getByTestId(`header-logout`)
  - Condition: always rendered
  - Source: ../frontend/src/components/Header.tsx:54

- **Header** → /
  - Type: Link
  - Locator: getByTestId(`header-logo`)
  - Condition: always rendered
  - Source: ../frontend/src/components/Header.tsx:86

- **Header** → /orders
  - Type: Link
  - Locator: getByTestId(`header-nav-orders`)
  - Condition: isUserMenuOpen
  - Source: ../frontend/src/components/Header.tsx:208

- **Header** → /profile
  - Type: Link
  - Locator: getByTestId(`header-nav-profile`)
  - Condition: isUserMenuOpen
  - Source: ../frontend/src/components/Header.tsx:220

- **Header** → /favorites
  - Type: Link
  - Locator: getByTestId(`header-nav-favorites`)
  - Condition: isUserMenuOpen
  - Source: ../frontend/src/components/Header.tsx:232

- **ProtectedRoute** → /
  - Type: Navigate
  - Locator: —
  - Condition: !isAuthenticated
  - Source: ../frontend/src/components/ProtectedRoute.tsx:12

- **QuickViewModal** → `/product/${product.id}/reviews`
  - Type: navigate
  - Locator: —
  - Condition: product
  - Source: ../frontend/src/components/QuickViewModal.tsx:67

- **ActivationSuccessPage** → /
  - Type: navigate
  - Locator: getByTestId(`activation-continue`)
  - Condition: always rendered
  - Source: ../frontend/src/pages/ActivationSuccessPage.tsx:96

- **ActivationSuccessPage** → /
  - Type: navigate
  - Locator: getByRole(`button`, { name: `Fazer Login` })
  - Condition: always rendered
  - Source: ../frontend/src/pages/ActivationSuccessPage.tsx:110

- **CheckoutPage** → `/orders/${order.id}`
  - Type: navigate
  - Locator: getByTestId(`checkout-place-order-button`)
  - Condition: always rendered
  - Source: ../frontend/src/pages/CheckoutPage.tsx:242

- **CheckoutPage** → /
  - Type: Link
  - Locator: getByTestId(`checkout-empty-back`)
  - Condition: items.length === 0
  - Source: ../frontend/src/pages/CheckoutPage.tsx:262

- **CheckoutPage** → /
  - Type: Link
  - Locator: getByTestId(`checkout-back`)
  - Condition: !(items.length === 0)
  - Source: ../frontend/src/pages/CheckoutPage.tsx:280

- **ErrorPage** → -1
  - Type: navigate
  - Locator: getByTestId(`error-back`)
  - Condition: always rendered
  - Source: ../frontend/src/pages/ErrorPage.tsx:50

- **ErrorPage** → /
  - Type: navigate
  - Locator: getByTestId(`error-home`)
  - Condition: always rendered
  - Source: ../frontend/src/pages/ErrorPage.tsx:63

- **FavoritesPage** → /
  - Type: Link
  - Locator: getByTestId(`favorites-empty-cta`)
  - Condition: favorites.length === 0
  - Source: ../frontend/src/pages/FavoritesPage.tsx:51

- **OrderDetailPage** → /orders
  - Type: Link
  - Locator: getByTestId(`orderdetail-notfound-back`)
  - Condition: !order
  - Source: ../frontend/src/pages/OrderDetailPage.tsx:44

- **OrderDetailPage** → /orders
  - Type: Link
  - Locator: getByTestId(`orderdetail-back`)
  - Condition: order
  - Source: ../frontend/src/pages/OrderDetailPage.tsx:64

- **OrdersPage** → /
  - Type: Link
  - Locator: getByTestId(`orders-empty-cta`)
  - Condition: orders.length === 0
  - Source: ../frontend/src/pages/OrdersPage.tsx:45

- **OrdersPage** → `/orders/${order.id}`
  - Type: Link
  - Locator: getByTestId(`order-card-${order.id}`)
  - Condition: !(orders.length === 0)
  - Source: ../frontend/src/pages/OrdersPage.tsx:56

- **ProductReviewsPage** → /
  - Type: navigate
  - Locator: getByTestId(`reviews-back`)
  - Condition: !product
  - Source: ../frontend/src/pages/ProductReviewsPage.tsx:105

- **ProductReviewsPage** → `/?product=${productId}`
  - Type: navigate
  - Locator: getByTestId(`reviews-view-product`)
  - Condition: product
  - Source: ../frontend/src/pages/ProductReviewsPage.tsx:177
