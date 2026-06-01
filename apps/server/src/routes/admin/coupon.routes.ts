import { Router } from 'express';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../controllers/admin/coupon.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/', getCoupons);
router.post('/', createCoupon);
router.patch('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
