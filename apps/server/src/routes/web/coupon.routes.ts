import { Router } from 'express';
import { validateCoupon } from '../../controllers/web/coupon.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/validate', authenticate, validateCoupon);

export default router;
