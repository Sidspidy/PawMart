import { Router } from 'express';
import { 
  getDashboardStats, 
  getRevenueByDate, 
  getTopProducts, 
  getCustomers, 
  toggleUserStatus,
  getSettings,
  updateSettings
} from '../../controllers/admin/dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff, isAdmin } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueByDate);
router.get('/top-products', getTopProducts);
router.get('/customers', getCustomers);
router.patch('/customers/:id/toggle', isAdmin, toggleUserStatus);

router.get('/settings', getSettings);
router.patch('/settings', isAdmin, updateSettings);

export default router;

