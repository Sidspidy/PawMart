import { Router } from 'express';
import { createOrder, getMyOrders, getMyOrderById } from '../../controllers/web/order.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getMyOrderById);

export default router;
