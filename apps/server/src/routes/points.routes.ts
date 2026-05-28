import { Router } from 'express';
import { getBalance, getPointsHistory } from '../controllers/points.controller';
import { spin, getSpinConfig, getSpinHistory } from '../controllers/spin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/config', getSpinConfig); // public — needed to render the wheel
router.use(authenticate);

router.get('/balance', getBalance);
router.get('/history', getPointsHistory);
router.post('/spin', spin);
router.get('/spin/history', getSpinHistory);

export default router;
