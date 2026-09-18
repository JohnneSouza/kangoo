import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { AuthModal } from '@/components/AuthModal';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CartSidebar } from '@/components/CartSidebar';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { ActivationSuccessPage } from '@/pages/ActivationSuccessPage';
import { ProductReviewsPage } from '@/pages/ProductReviewsPage';
import { cn } from '@/utils/cn';

function AppContent() {
  const { isDark } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showOnSale, setShowOnSale] = useState(false);

  // Pages where floating cart button should be hidden
  const hideCartButtonPages = ['/checkout', '/orders', '/activation-success'];
  const shouldHideCartButton = hideCartButtonPages.some(path => 
    location.pathname === path || location.pathname.startsWith('/orders/')
  );

  // Listen for custom event to open auth modal
  useEffect(() => {
    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuthModal);
  }, []);

  // Check for protected routes and redirect if not authenticated
  useEffect(() => {
    const protectedPaths = ['/orders', '/profile', '/favorites'];
    const isProtectedPath = protectedPaths.some(path => location.pathname === path);
    
    if (isProtectedPath && !isAuthenticated) {
      setIsAuthModalOpen(true);
      navigate('/', { replace: true });
    }
  }, [location.pathname, isAuthenticated, navigate]);

  // Apply dark mode class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark])

  const handleSelectCategory = (category: string | null, subcategory?: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || null);
    setShowOnSale(false);
    navigate('/');
  };

  const handleSelectSale = () => {
    setShowOnSale(true);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    navigate('/');
  };

  return (
    <div className={cn(
      'min-h-screen transition-colors',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <Header
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSearch={setSearchQuery}
        onOpenSidebar={() => setIsCategorySidebarOpen(true)}
      />

      {/* Category Sidebar */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => setIsCategorySidebarOpen(false)}
        onSelectCategory={handleSelectCategory}
        onSelectSale={handleSelectSale}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              searchQuery={searchQuery}
              onQuickView={setQuickViewProduct}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              showOnSale={showOnSale}
              onClearFilters={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setShowOnSale(false);
              }}
            />
          }
        />
        <Route
          path="/activation-success"
          element={<ActivationSuccessPage />}
        />
        <Route
          path="/product/:productId/reviews"
          element={<ProductReviewsPage />}
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={<OrderDetailPage />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage onQuickView={setQuickViewProduct} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />
        {/* 404 Error Page - Must be last */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {/* Floating Cart Button - Hidden on checkout, orders and activation pages */}
      {!shouldHideCartButton && (
        <FloatingCartButton onClick={() => setIsCartOpen(true)} />
      )}

      {/* Auth Modal - z-index 60 to appear above cart */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Cart Sidebar - z-index 50 */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
