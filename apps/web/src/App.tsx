import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useAuthStore } from './store/auth.store';
import { api } from './api';

// Layouts
import PageWrapper from './components/layout/PageWrapper';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ToastContainer from './components/layout/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Eagerly loaded pages
import Home from './pages/Home';

// Lazily loaded pages
const Login    = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail  = lazy(() => import('./pages/ProductDetail'));
const Cart             = lazy(() => import('./pages/Cart'));
const AddressPage      = lazy(() => import('./pages/checkout/Address'));
const PaymentPage      = lazy(() => import('./pages/checkout/Payment'));
const OrderConfirmationPage = lazy(() => import('./pages/checkout/OrderConfirmation'));

// Category pages
const Dogs      = lazy(() => import('./pages/category/Dogs'));
const Cats      = lazy(() => import('./pages/category/Cats'));
const Fish      = lazy(() => import('./pages/category/Fish'));
const Birds     = lazy(() => import('./pages/category/Birds'));
const SmallPets = lazy(() => import('./pages/category/SmallPets'));

// Dashboard pages
const DashOrders      = lazy(() => import('./pages/dashboard/Orders'));
const DashOrderDetail = lazy(() => import('./pages/dashboard/OrderDetail'));
const DashWishlist    = lazy(() => import('./pages/dashboard/Wishlist'));
const DashProfile     = lazy(() => import('./pages/dashboard/Profile'));
const DashPoints      = lazy(() => import('./pages/dashboard/Points'));
const DashSpin        = lazy(() => import('./pages/dashboard/SpinWheel'));
const DashCoupons     = lazy(() => import('./pages/dashboard/Coupons'));

// Smooth scroll to top on path changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

export default function App() {
  const { isAuthenticated, updateUser } = useAuthStore();
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    api.get('/settings/public').then(res => {
      if (res.data?.success && res.data.data) {
        setMaintenance(res.data.data.maintenanceMode === true);
      }
    }).catch(err => {
      console.error('Failed to fetch store settings:', err);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/auth/me').then(res => {
        if (res.data?.success && res.data.data) {
          updateUser(res.data.data);
        }
      }).catch(err => {
        console.error('Failed to sync user profile:', err);
      });
    }
  }, [isAuthenticated, updateUser]);

  if (maintenance) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#caaef6',
        fontFamily: "'Nunito', sans-serif",
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          backgroundColor: '#faf6f0',
          border: '4px solid #ffffff',
          borderRadius: '40px',
          padding: '3rem 2rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>🐾</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#3b2b5c', marginBottom: '1rem', letterSpacing: '-0.03em' }}>System Upgrades in Progress</h1>
          <p style={{ fontSize: '0.95rem', color: '#523d85', fontWeight: 700, lineHeight: '1.6', marginBottom: '2rem' }}>
            PawMart is currently receiving some love and system upgrades to bring you a better shopping experience for your pet. We will be back online shortly!
          </p>
          <div style={{
            display: 'inline-block',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#ffdce0',
            border: '2px solid #ffb076',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            color: '#c2410c',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            ⚡ Checkout & Store Temporarily Offline
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        {/* Auth standalone routes (no Navbar/Footer) */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PageWrapper />}>
          <Route path="/" element={<Home />} />

          {/* Categories */}
          <Route path="/dogs"       element={<Dogs />} />
          <Route path="/cats"       element={<Cats />} />
          <Route path="/fish"       element={<Fish />} />
          <Route path="/birds"      element={<Birds />} />
          <Route path="/small-pets" element={<SmallPets />} />

          {/* Products */}
          <Route path="/products"       element={<ProductListing />} />
          <Route path="/products/:slug" element={<ProductDetail />} />

          {/* Cart & Checkout */}
          <Route path="/cart"                   element={<Cart />} />

          {/* Secured Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout/address"       element={<AddressPage />} />
            <Route path="/checkout/payment"       element={<PaymentPage />} />
            <Route path="/checkout/confirmation"  element={<OrderConfirmationPage />} />

            {/* Customer Dashboard — shared sidebar layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/orders" replace />} />
              <Route path="orders"          element={<DashOrders />} />
              <Route path="orders/:orderId" element={<DashOrderDetail />} />
              <Route path="wishlist"        element={<DashWishlist />} />
              <Route path="profile"         element={<DashProfile />} />
              <Route path="points"          element={<DashPoints />} />
              <Route path="spin"            element={<DashSpin />} />
              <Route path="coupons"         element={<DashCoupons />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
