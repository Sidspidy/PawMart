import { Router } from 'express';
import { getCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items', updateCartItem);
router.delete('/', clearCart);

export default router;
