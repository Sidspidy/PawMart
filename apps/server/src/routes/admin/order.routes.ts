import { Router } from 'express';
import { getOrders, getOrderById, updateOrderStatus } from '../../controllers/admin/order.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
