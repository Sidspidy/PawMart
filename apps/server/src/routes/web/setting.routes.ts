import { Router } from 'express';
import { Setting } from '../../models/Setting.model';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/public', asyncHandler(async (_req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  sendSuccess(res, { 
    maintenanceMode: settings.maintenanceMode, 
    shopName: settings.shopName,
    currency: settings.currency 
  });
}));

export default router;
