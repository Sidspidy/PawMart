import { Router } from 'express';
import { getSpinPrizes, updateSpinPrizes } from '../../controllers/admin/spin.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { isStaff } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, isStaff);

router.get('/prizes', getSpinPrizes);
router.post('/prizes', updateSpinPrizes);

export default router;
