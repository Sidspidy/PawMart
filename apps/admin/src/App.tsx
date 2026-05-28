import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from './components/layout/AdminLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
const ProductForm = lazy(() => import('./pages/products/ProductForm'));
const CategoryManager = lazy(() => import('./pages/categories/CategoryManager'));
const OrderList = lazy(() => import('./pages/orders/OrderList'));
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'));
const CustomerList = lazy(() => import('./pages/customers/CustomerList'));
const CouponManager = lazy(() => import('./pages/coupons/CouponManager'));
const SpinConfig = lazy(() => import('./pages/spin/SpinConfig'));
const Roles = lazy(() => import('./pages/settings/Roles'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/coupons" element={<CouponManager />} />
          <Route path="/spin" element={<SpinConfig />} />
          <Route path="/settings/roles" element={<Roles />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
