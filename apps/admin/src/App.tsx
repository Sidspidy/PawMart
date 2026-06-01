import React, { useState } from 'react';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CategoryManager from './pages/categories/CategoryManager';
import OrderList from './pages/orders/OrderList';
import CustomerList from './pages/customers/CustomerList';
import CouponManager from './pages/coupons/CouponManager';
import SpinConfig from './pages/spin/SpinConfig';
import Roles from './pages/settings/Roles';
import Settings from './pages/settings/Settings';
import Login from './pages/Login';
import { ToastProvider } from './components/common/Toast';


export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

function AppInner() {
  // Session Authentication state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [adminUser, setAdminUser] = useState<any>(() => {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  });

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Lifted Maintenance Mode state (sync to localStorage)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem('maintenanceMode') === 'true';
  });

  // Track initial filter state for Orders tab (e.g. Placed from notifications)
  const [ordersInitialFilter, setOrdersInitialFilter] = useState<'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered'>('All');

  const handleEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setIsAddingProduct(false);
    setActiveTab('Edit Product');
  };

  const handleAddProductTrigger = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
    setActiveTab('Add Product');
  };

  const handleSaveProduct = () => {
    setActiveTab('Products');
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleCancelProduct = () => {
    setActiveTab('Products');
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleBellClick = () => {
    setOrdersInitialFilter('Placed');
    setActiveTab('Orders');
  };

  const handleSidebarTabClick = (tab: string) => {
    if (tab === 'Orders') {
      // Clicking standard menu sidebar resets default filter to All
      setOrdersInitialFilter('All');
    }
    setActiveTab(tab);
  };

  // Perform session logout and redirect immediately
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdminUser(null);
    setActiveTab('Dashboard'); // reset view
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Products':
        return (
          <ProductList 
            onAddProduct={handleAddProductTrigger}
            onEditProduct={handleEditProduct}
          />
        );
      case 'Add Product':
        return (
          <ProductForm 
            product={null}
            onSave={handleSaveProduct}
            onCancel={handleCancelProduct}
          />
        );
      case 'Edit Product':
        return (
          <ProductForm 
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelProduct}
          />
        );
      case 'Categories':
        return <CategoryManager />;
      case 'Orders':
        return (
          <OrderList 
            initialFilter={ordersInitialFilter} 
            onFilterChange={setOrdersInitialFilter}
          />
        );
      case 'Customers':
        return <CustomerList />;
      case 'Coupons':
        return <CouponManager />;
      case 'Spin Wheel':
        return <SpinConfig />;
      case 'Roles & Staff':
        return <Roles />;
      case 'Settings':
        return (
          <Settings 
            maintenanceMode={maintenanceMode}
            setMaintenanceMode={(val) => {
              setMaintenanceMode(val);
              localStorage.setItem('maintenanceMode', val ? 'true' : 'false');
            }}
          />
        );
      default:
        return <Dashboard />;
    }
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

  const currentActiveSidebarTab = 
    activeTab === 'Edit Product' || activeTab === 'Add Product' 
      ? 'Products' 
      : activeTab;

  return (
    <AdminLayout 
      activeTab={currentActiveSidebarTab} 
      setActiveTab={handleSidebarTabClick}
      maintenanceMode={maintenanceMode}
      onBellClick={handleBellClick}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}
