import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { FloatingCart } from './components/FloatingCart';
import { CartDrawer } from './components/CartDrawer';
import { PageTransition } from './components/PageTransition';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
        <Route path="/product/:productId" element={<PageTransition><ProductPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/ingredients" element={<PageTransition><IngredientsPage /></PageTransition>} />
        <Route path="/returns" element={<PageTransition><ReturnsPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/order-success" element={<PageTransition><OrderSuccessPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col relative">
        <Navigation />
        <main className="flex-grow relative z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
        <FloatingCart onClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}