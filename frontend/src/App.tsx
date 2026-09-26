import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UIModalProvider, useUIModal } from './context/UIModalContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductModal } from './components/product/ProductModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthAccountModal } from './components/account/AuthAccountModal';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { PolicyModal } from './components/common/PolicyModal';

import { Home } from './pages/Home';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCMS } from './pages/admin/AdminCMS';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { ScrollToTop } from './components/common/ScrollToTop';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      
      {/* Global In-Page Overlays & Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <AuthAccountModal />
      <WishlistDrawer />
      <PolicyModal />
    </div>
  );
};

// Adapter that allows legacy URL paths or direct links to trigger in-page modals/sections on the Single Page
const SinglePageAdapter: React.FC<{
  action?: 'shop' | 'cart' | 'checkout' | 'account' | 'wishlist' | 'login' | 'register' | 'about' | 'contact' | 'policies' | 'product';
}> = ({ action }) => {
  const { scrollToSection, openAuthModal, openWishlist, openCheckout, openPolicy, openProductModal } = useUIModal();
  const { setIsCartOpen } = useCart();
  const { id, type } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (!action) return;

    if (action === 'shop') {
      const searchParams = new URLSearchParams(location.search);
      const cat = searchParams.get('category') || undefined;
      const sale = searchParams.get('onSale') === 'true';
      scrollToSection('collection', cat, sale);
    } else if (action === 'cart') {
      setIsCartOpen(true);
    } else if (action === 'checkout') {
      openCheckout();
    } else if (action === 'account') {
      openAuthModal('account');
    } else if (action === 'login') {
      openAuthModal('login');
    } else if (action === 'register') {
      openAuthModal('register');
    } else if (action === 'wishlist') {
      openWishlist();
    } else if (action === 'about') {
      scrollToSection('about');
    } else if (action === 'contact') {
      scrollToSection('contact');
    } else if (action === 'policies') {
      openPolicy(type || 'shipping');
    } else if (action === 'product' && id) {
      openProductModal(Number(id));
    }
  }, [action, id, type, location.search]);

  return <Home />;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <UIModalProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                  {/* Customer Storefront: Single Page Architecture */}
                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/shop" element={<MainLayout><SinglePageAdapter action="shop" /></MainLayout>} />
                  <Route path="/product/:id" element={<MainLayout><SinglePageAdapter action="product" /></MainLayout>} />
                  <Route path="/cart" element={<MainLayout><SinglePageAdapter action="cart" /></MainLayout>} />
                  <Route path="/checkout" element={<MainLayout><SinglePageAdapter action="checkout" /></MainLayout>} />
                  <Route path="/account" element={<MainLayout><SinglePageAdapter action="account" /></MainLayout>} />
                  <Route path="/wishlist" element={<MainLayout><SinglePageAdapter action="wishlist" /></MainLayout>} />
                  <Route path="/login" element={<MainLayout><SinglePageAdapter action="login" /></MainLayout>} />
                  <Route path="/register" element={<MainLayout><SinglePageAdapter action="register" /></MainLayout>} />
                  <Route path="/about" element={<MainLayout><SinglePageAdapter action="about" /></MainLayout>} />
                  <Route path="/contact" element={<MainLayout><SinglePageAdapter action="contact" /></MainLayout>} />
                  <Route path="/policies/:type" element={<MainLayout><SinglePageAdapter action="policies" /></MainLayout>} />

                  {/* Role-Protected Admin Portal Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="cms" element={<AdminCMS />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                  </Route>
                </Routes>
              </Router>
            </UIModalProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
