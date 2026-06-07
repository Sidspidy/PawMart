import { Router } from 'express';
import { validateCoupon, getWebCoupons } from '../../controllers/web/coupon.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getWebCoupons);
router.post('/validate', authenticate, validateCoupon);

export default router;
