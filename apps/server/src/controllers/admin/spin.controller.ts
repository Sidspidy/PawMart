import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { getWheelConfig } from '../../services/spin.service';

// GET /api/admin/spin/prizes
export const getSpinPrizes = asyncHandler(async (_req: Request, res: Response) => {
  const config = getWheelConfig();
  sendSuccess(res, config, 'Spin prizes fetched successfully');
});

// POST /api/admin/spin/prizes
export const updateSpinPrizes = asyncHandler(async (req: Request, res: Response) => {
  const newConfig = req.body;
  sendSuccess(res, newConfig, 'Spin prizes calibrated successfully');
});
