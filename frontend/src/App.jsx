import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchDrawer } from './components/common/SearchDrawer';
import { BackToTop } from './components/common/BackToTop';
import { AiTryOnPopup } from './components/common/AiTryOnPopup';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiPopupOpen, setAiPopupOpen] = useState(false);

  React.useEffect(() => {
    // Show AI Try-On popup on every page refresh / visit after 700ms
    if (!isAdminRoute) {
      const timer = setTimeout(() => {
        setAiPopupOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAdminRoute]);

  React.useEffect(() => {
    const handleOpenPopup = () => setAiPopupOpen(true);
    window.addEventListener('open-ai-popup', handleOpenPopup);
    return () => window.removeEventListener('open-ai-popup', handleOpenPopup);
  }, []);

  return (
    <div className="app-root">
      {!isAdminRoute && (
        <>
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
          <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
      )}

      {children}

      {!isAdminRoute && (
        <>
          <Footer />
          <AiTryOnPopup isOpen={aiPopupOpen} onClose={() => setAiPopupOpen(false)} />
        </>
      )}
      <BackToTop />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
