import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { getWheelConfig } from '../../services/spin.service';
import { SpinWheelConfig } from '../../models/SpinWheelConfig.model';

// GET /api/admin/spin/prizes
export const getSpinPrizes = asyncHandler(async (_req: Request, res: Response) => {
  const config = await getWheelConfig(false);
  sendSuccess(res, config, 'Spin prizes fetched successfully');
});

// POST /api/admin/spin/prizes
export const updateSpinPrizes = asyncHandler(async (req: Request, res: Response) => {
  const newConfig = req.body;
  
  // Clear old segments and save the newly calibrated admin list
  await SpinWheelConfig.deleteMany({});
  const saved = await SpinWheelConfig.create(newConfig);
  
  sendSuccess(res, saved, 'Spin prizes calibrated successfully');
});
