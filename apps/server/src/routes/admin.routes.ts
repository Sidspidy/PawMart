import { Router } from 'express';
import { getDashboardStats, getRevenueByDate, getCustomers, toggleUserStatus, getTopProducts } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isManager, isAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isManager);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueByDate);
router.get('/customers', getCustomers);
router.get('/top-products', getTopProducts);
router.patch('/users/:id/toggle', isAdmin, toggleUserStatus);

export default router;
