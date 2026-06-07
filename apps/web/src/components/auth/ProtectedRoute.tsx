import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('Please login first to access this page 🐾', 'warning');
    }
  }, [isAuthenticated, addToast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
