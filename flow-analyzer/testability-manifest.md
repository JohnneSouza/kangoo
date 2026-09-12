# Testability Manifest

Analyzed: `/home/johnnes/Projects/kangoo/frontend`

Companion to [application-flow.md](./application-flow.md). Machine-readable form: [testability-manifest.json](./testability-manifest.json).

## Routes

| Path | Component | Guards | Gating stores | Source |
|---|---|---|---|---|
| `/` | HomePage | — | — | `../frontend/src/App.tsx:106` |
| `/activation-success` | ActivationSuccessPage | — | — | `../frontend/src/App.tsx:123` |
| `/product/:productId/reviews` | ProductReviewsPage | — | — | `../frontend/src/App.tsx:127` |
| `/orders` | OrdersPage | `ProtectedRoute` | `auth-storage` | `../frontend/src/App.tsx:131` |
| `/orders/:orderId` | OrderDetailPage | — | — | `../frontend/src/App.tsx:139` |
| `/profile` | ProfilePage | `ProtectedRoute` | `auth-storage` | `../frontend/src/App.tsx:143` |
| `/favorites` | FavoritesPage | `ProtectedRoute` | `auth-storage` | `../frontend/src/App.tsx:151` |
| `/checkout` | CheckoutPage | — | — | `../frontend/src/App.tsx:159` |
| `*` | ErrorPage | — | — | `../frontend/src/App.tsx:164` |

## Navigation edges

| # | From | To | Type | Locator | Precondition | Source |
|---|---|---|---|---|---|---|
| 1 | AppContent | `/` | navigate | — | isProtectedPath && !isAuthenticated | `../frontend/src/App.tsx:59` |
| 2 | AppContent | `/` | navigate | — | always rendered | `../frontend/src/App.tsx:76` |
| 3 | AppContent | `/` | navigate | — | always rendered | `../frontend/src/App.tsx:83` |
| 4 | CartSidebar | `/checkout` | navigate | getByTestId(`cart-checkout-button`) | always rendered | `../frontend/src/components/CartSidebar.tsx:19` |
| 5 | Header | `/` | navigate | getByTestId(`header-logout`) | always rendered | `../frontend/src/components/Header.tsx:54` |
| 6 | Header | `/` | Link | getByTestId(`header-logo`) | always rendered | `../frontend/src/components/Header.tsx:86` |
| 7 | Header | `/orders` | Link | getByTestId(`header-nav-orders`) | isUserMenuOpen | `../frontend/src/components/Header.tsx:208` |
| 8 | Header | `/profile` | Link | getByTestId(`header-nav-profile`) | isUserMenuOpen | `../frontend/src/components/Header.tsx:220` |
| 9 | Header | `/favorites` | Link | getByTestId(`header-nav-favorites`) | isUserMenuOpen | `../frontend/src/components/Header.tsx:232` |
| 10 | ProtectedRoute | `/` | Navigate | — | !isAuthenticated | `../frontend/src/components/ProtectedRoute.tsx:12` |
| 11 | QuickViewModal | `/product/${product.id}/reviews` | navigate | — | product | `../frontend/src/components/QuickViewModal.tsx:67` |
| 12 | ActivationSuccessPage | `/` | navigate | getByTestId(`activation-continue`) | always rendered | `../frontend/src/pages/ActivationSuccessPage.tsx:96` |
| 13 | ActivationSuccessPage | `/` | navigate | getByRole(`button`, { name: `Fazer Login` }) | always rendered | `../frontend/src/pages/ActivationSuccessPage.tsx:110` |
| 14 | CheckoutPage | `/orders/${order.id}` | navigate | getByTestId(`checkout-place-order-button`) | always rendered | `../frontend/src/pages/CheckoutPage.tsx:242` |
| 15 | CheckoutPage | `/` | Link | getByTestId(`checkout-empty-back`) | items.length === 0 | `../frontend/src/pages/CheckoutPage.tsx:262` |
| 16 | CheckoutPage | `/` | Link | getByTestId(`checkout-back`) | !(items.length === 0) | `../frontend/src/pages/CheckoutPage.tsx:280` |
| 17 | ErrorPage | `-1` | navigate | getByTestId(`error-back`) | always rendered | `../frontend/src/pages/ErrorPage.tsx:50` |
| 18 | ErrorPage | `/` | navigate | getByTestId(`error-home`) | always rendered | `../frontend/src/pages/ErrorPage.tsx:63` |
| 19 | FavoritesPage | `/` | Link | getByTestId(`favorites-empty-cta`) | favorites.length === 0 | `../frontend/src/pages/FavoritesPage.tsx:51` |
| 20 | OrderDetailPage | `/orders` | Link | getByTestId(`orderdetail-notfound-back`) | !order | `../frontend/src/pages/OrderDetailPage.tsx:44` |
| 21 | OrderDetailPage | `/orders` | Link | getByTestId(`orderdetail-back`) | order | `../frontend/src/pages/OrderDetailPage.tsx:64` |
| 22 | OrdersPage | `/` | Link | getByTestId(`orders-empty-cta`) | orders.length === 0 | `../frontend/src/pages/OrdersPage.tsx:45` |
| 23 | OrdersPage | `/orders/${order.id}` | Link | getByTestId(`order-card-${order.id}`) | !(orders.length === 0) | `../frontend/src/pages/OrdersPage.tsx:56` |
| 24 | ProductReviewsPage | `/` | navigate | getByTestId(`reviews-back`) | !product | `../frontend/src/pages/ProductReviewsPage.tsx:105` |
| 25 | ProductReviewsPage | `/?product=${productId}` | navigate | getByTestId(`reviews-view-product`) | product | `../frontend/src/pages/ProductReviewsPage.tsx:177` |

## Locators needing disambiguation

None — every edge resolves to a unique locator.

## Fixtures

### coupon — `coupons`

- Module: `src/data/coupons.ts`
- Identifier field: `code`
- Ids (5): `BEMVINDO10`, `PROMO20`, `FRETE50`, `SUPER30`, `DESC25`
- Sample:

  ```json
  {
    "code": "BEMVINDO10",
    "discountType": "percentage",
    "description": "10% de desconto na primeira compra"
  }
  ```

### product — `products`

- Module: `src/data/products.ts`
- Identifier field: `id`
- Ids (20): `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`
- Sample:

  ```json
  {
    "id": "1",
    "name": "Tênis Branco Clássico",
    "description": "Tênis confortável para o dia a dia com couro premium e sola acolchoada para conforto durante todo o dia.",
    "category": "fashion",
    "subcategory": "shoes"
  }
  ```

## Route assertions

`Transient feedback` entries are shown as `react-hot-toast` toasts, which mount outside the component tree. Assert them with `getByRole('status')` — that role is applied by the library, so no source change is required — scoped with `.filter({ hasText: ... })` because the role is shared by all toasts. The Toaster is configured with `duration: 4000` (`src/main.tsx`), so the assertion must land inside that window.

### `/`

- Heading: `Descubra Seu Estilo`
- State dependent: yes — assertions vary with store/param state
- Landmarks:
  - `Explore nossa coleção exclusiva de produtos premium projetados para a vida moderna`
  - `Ordenar por:`

### `/activation-success`

- Heading: `Conta Ativada com Sucesso!`
- State dependent: no
- Landmarks:
  - `Parabéns! Sua conta foi verificada e ativada.`
  - `Agora você pode fazer login e aproveitar todos os recursos da nossa plataforma, incluindo compras, favoritos e acompanhamento de pedidos.`
  - `Com sua conta você pode:`
  - `Explorar Produtos`
  - `Fazer Login`

### `/product/:productId/reviews`

- State dependent: yes — assertions vary with store/param state
- Landmarks:
  - `Voltar para a página inicial`
  - `Voltar ao Produto`
  - `avaliações)`
  - `Resumo das Avaliações`
  - `avaliações`
  - `Mais Recentes`
  - `Mais Antigas`
  - `Maior Nota`
  - `Menor Nota`

### `/orders`

- Heading: `Meus Pedidos`
- State dependent: yes — assertions vary with store/param state
- Landmarks: none extracted

### `/orders/:orderId`

- Heading: `Pedido`
- State dependent: yes — assertions vary with store/param state
- Landmarks:
  - `Pedido não encontrado`
  - `Voltar para Pedidos`
  - `Pedido Confirmado!`
  - `Obrigado pela sua compra. Seu pedido foi realizado com sucesso.`
  - `Realizado em`
  - `Itens (`
  - `Endereço de Entrega`
  - `Resumo do Pedido`
  - `Subtotal`
  - `Frete`
  - `Grátis`
  - `Total`

### `/profile`

- Heading: `Meu Perfil`
- State dependent: yes — assertions vary with store/param state
- Landmarks: none extracted
- Transient feedback (assert via `getByRole('status')`, not page content):
  - `Conta excluída com sucesso`
  - `Endereço adicionado com sucesso`
  - `Cartão adicionado com sucesso`
  - `Preencha todos os campos do cartão`
  - `Chave PIX adicionada com sucesso`
  - `Informe a chave PIX`
  - `Forma de pagamento adicionada`
  - `Perfil atualizado com sucesso`
  - `Endereço removido`
  - `Forma de pagamento removida`

### `/favorites`

- Heading: `Meus Favoritos`
- State dependent: yes — assertions vary with store/param state
- Landmarks: none extracted

### `/checkout`

- Heading: `Finalizar Compra`
- State dependent: yes — assertions vary with store/param state
- Landmarks:
  - `Seu carrinho está vazio`
  - `Ver Produtos`
  - `Continuar Comprando`
  - `Método de Entrega`
  - `Forma de Pagamento`
  - `Resumo do Pedido`
  - `Cupom de Desconto`
  - `Subtotal`
  - `Frete`
  - `Grátis`
  - `Total`
  - `Finalizar Pedido`
- Transient feedback (assert via `getByRole('status')`, not page content):
  - `Cupom inválido`
  - `Cupom removido`
  - `Por favor, informe seu nome`
  - `Por favor, informe um e-mail válido`
  - `Por favor, informe seu telefone`
  - `Por favor, informe o endereço`
  - `Por favor, informe a cidade`
  - `Por favor, informe o estado`
  - `Por favor, informe o CEP`
  - `Por favor, selecione um endereço de entrega`
  - `Por favor, selecione a data e horário da entrega`
  - `Pedido realizado com sucesso!`

### `*`

- Heading: `404`
- State dependent: no
- Landmarks:
  - `Página Não Encontrada`
  - `Desculpe, a página que você está procurando não existe ou foi movida. Verifique se o endereço está correto ou volte para a página inicial.`
  - `Voltar`
  - `Página Inicial`

## App-level feedback

Surfaced by components mounted alongside the router rather than inside any route (`AuthModal`, `Header`). These carry no route of their own, so they are not reachable via `Route assertions` — but authentication, the gateway to every guarded route, reports its outcome here and nowhere else. Same toast locator rules as above.

- `Por favor, preencha todos os campos`
- `Bem-vindo de volta!`
- `Conta criada com sucesso!`
- `Ocorreu um erro`
