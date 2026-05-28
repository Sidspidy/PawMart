import { Router } from 'express';
import { createCoupon, getCoupons, validateCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/rbac.middleware';

const router = Router();

// Customer: validate a coupon code
router.post('/validate', authenticate, validateCoupon);
// Admin: full CRUD
router.get('/', authenticate, isAdmin, getCoupons);
router.post('/', authenticate, isAdmin, createCoupon);
router.patch('/:id', authenticate, isAdmin, updateCoupon);
router.delete('/:id', authenticate, isAdmin, deleteCoupon);

export default router;
