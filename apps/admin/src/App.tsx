import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CategoryManager from './pages/categories/CategoryManager';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import CustomerList from './pages/customers/CustomerList';
import CouponManager from './pages/coupons/CouponManager';
import SpinConfig from './pages/spin/SpinConfig';
import Roles from './pages/settings/Roles';
import Settings from './pages/settings/Settings';
import Login from './pages/Login';
import { ToastProvider } from './components/common/Toast';
import { apiClient } from './api/apiClient';

function ProductFormWrapper({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState<any>(location.state?.product || null);

  useEffect(() => {
    if (!product && id) {
      apiClient.get(`/admin/products/${id}`).then(res => {
        if (res && res.data) {
          setProduct(res.data);
        }
      }).catch(err => console.error(err));
    }
  }, [id, product]);

  if (id && !product) {
    return (
      <div className="p-8 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
        Loading product details...
      </div>
    );
  }

  return <ProductForm product={product} onSave={onSave} onCancel={onCancel} />;
}

function OrderDetailWrapper() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  if (!orderId) return <Navigate to="/orders" replace />;

  return (
    <OrderDetail
      orderId={orderId}
      onBack={() => navigate('/orders')}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </BrowserRouter>
  );
}

function AppInner() {
  // Session Authentication state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [adminUser, setAdminUser] = useState<any>(() => {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [adminAvatar, setAdminAvatar] = useState<string>(() => {
    return localStorage.getItem('adminAvatar') || '/avatar_female.png';
  });

  const handleAvatarChange = (avatar: string) => {
    setAdminAvatar(avatar);
    localStorage.setItem('adminAvatar', avatar);
  };

  // Lifted Maintenance Mode state (sync to localStorage)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem('maintenanceMode') === 'true';
  });

  // Track initial filter state for Orders tab (e.g. Placed from notifications)
  const [ordersInitialFilter, setOrdersInitialFilter] = useState<'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered'>('All');

  const [placedCount, setPlacedCount] = useState(0);

  // Poll server for Placed (pending status) order count
  useEffect(() => {
    if (!token) return;
    
    async function fetchPlacedCount() {
      try {
        const res = await apiClient.get('/admin/orders?status=pending&limit=1');
        if (res && res.pagination) {
          setPlacedCount(res.pagination.total || 0);
        }
      } catch (err) {
        console.warn('Failed to load placed orders count:', err);
      }
    }

    fetchPlacedCount();
    const interval = setInterval(fetchPlacedCount, 15000); // 15 seconds polling
    return () => clearInterval(interval);
  }, [token]);

  // Listen for custom search events to navigate and inspect items
  useEffect(() => {
    const handleViewOrder = (e: Event) => {
      const orderId = (e as CustomEvent).detail;
      navigate(`/orders/${orderId}`);
    };
    const handleEditProductEvent = (e: Event) => {
      const product = (e as CustomEvent).detail;
      navigate(`/products/${product._id}`, { state: { product } });
    };

    window.addEventListener('admin-view-order', handleViewOrder);
    window.addEventListener('admin-edit-product', handleEditProductEvent);

    return () => {
      window.removeEventListener('admin-view-order', handleViewOrder);
      window.removeEventListener('admin-edit-product', handleEditProductEvent);
    };
  }, [navigate]);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNav = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'Add Product') {
        navigate('/products/add');
      } else if (detail === 'Products') {
        navigate('/products');
      } else if (detail === 'Categories') {
        navigate('/categories');
      } else if (detail === 'Orders') {
        navigate('/orders');
      } else if (detail === 'Customers') {
        navigate('/customers');
      } else if (detail === 'Coupons') {
        navigate('/coupons');
      } else if (detail === 'Spin Wheel') {
        navigate('/spin-wheel');
      } else if (detail === 'Roles & Staff' || detail === 'Roles') {
        navigate('/roles-staff');
      } else if (detail === 'Settings') {
        navigate('/settings');
      }
    };
    window.addEventListener('admin-nav', handleNav);
    return () => window.removeEventListener('admin-nav', handleNav);
  }, [navigate]);

  const handleEditProduct = (prod: any) => {
    navigate(`/products/${prod._id}`, { state: { product: prod } });
  };

  const handleAddProductTrigger = () => {
    navigate('/products/add');
  };

  const handleSaveProduct = () => {
    navigate('/products');
  };

  const handleCancelProduct = () => {
    navigate('/products');
  };

  const handleBellClick = () => {
    setOrdersInitialFilter('Placed');
    navigate('/orders');
  };

  const handleSidebarTabClick = (tab: string) => {
    if (tab === 'Dashboard') navigate('/');
    else if (tab === 'Products') navigate('/products');
    else if (tab === 'Categories') navigate('/categories');
    else if (tab === 'Orders') {
      setOrdersInitialFilter('All');
      navigate('/orders');
    }
    else if (tab === 'Customers') navigate('/customers');
    else if (tab === 'Coupons') navigate('/coupons');
    else if (tab === 'Spin Wheel') navigate('/spin-wheel');
    else if (tab === 'Roles & Staff') navigate('/roles-staff');
    else if (tab === 'Settings') navigate('/settings');
  };

  // Perform session logout and redirect immediately
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdminUser(null);
    navigate('/');
  };

  // Check authentication status first
  if (!token) {
    return (
      <Login 
        onLoginSuccess={(t, u) => {
          setToken(t);
          setAdminUser(u);
        }} 
      />
    );
  }

  const getActiveTabFromPath = (path: string) => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/categories')) return 'Categories';
    if (path.startsWith('/orders')) return 'Orders';
    if (path.startsWith('/customers')) return 'Customers';
    if (path.startsWith('/coupons')) return 'Coupons';
    if (path.startsWith('/spin-wheel')) return 'Spin Wheel';
    if (path.startsWith('/roles-staff')) return 'Roles & Staff';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const currentActiveSidebarTab = getActiveTabFromPath(location.pathname);

  return (
    <Routes>
      <Route element={
        <AdminLayout 
          activeTab={currentActiveSidebarTab} 
          setActiveTab={handleSidebarTabClick}
          maintenanceMode={maintenanceMode}
          onBellClick={handleBellClick}
          onLogout={handleLogout}
          adminAvatar={adminAvatar}
          onAvatarChange={handleAvatarChange}
          placedCount={placedCount}
        >
          <Outlet />
        </AdminLayout>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList onAddProduct={handleAddProductTrigger} onEditProduct={handleEditProduct} />} />
        <Route path="/products/add" element={<ProductForm product={null} onSave={handleSaveProduct} onCancel={handleCancelProduct} />} />
        <Route path="/products/:id" element={<ProductFormWrapper onSave={handleSaveProduct} onCancel={handleCancelProduct} />} />
        <Route path="/categories" element={<CategoryManager />} />
        <Route path="/orders" element={
          <OrderList
            initialFilter={ordersInitialFilter}
            onFilterChange={setOrdersInitialFilter}
            onViewDetail={(id) => navigate(`/orders/${id}`)}
          />
        } />
        <Route path="/orders/:orderId" element={<OrderDetailWrapper />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/coupons" element={<CouponManager />} />
        <Route path="/spin-wheel" element={<SpinConfig />} />
        <Route path="/roles-staff" element={<Roles />} />
        <Route path="/settings" element={
          <Settings 
            maintenanceMode={maintenanceMode}
            setMaintenanceMode={(val) => {
              setMaintenanceMode(val);
              localStorage.setItem('maintenanceMode', val ? 'true' : 'false');
            }}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
