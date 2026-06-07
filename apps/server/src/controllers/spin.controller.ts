import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { executeSpin, getWheelConfig } from '../services/spin.service';
import { SpinResult } from '../models/SpinResult.model';

// POST /api/points/spin
export const spin = asyncHandler(async (req: Request, res: Response) => {
  const result = await executeSpin(req.user!._id.toString());
  sendSuccess(res, result, 'Spin complete!');
});

// GET /api/points/spin/config  (public — for rendering the wheel)
export const getSpinConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await getWheelConfig();
  sendSuccess(res, config, 'Wheel config fetched');
});

// GET /api/points/spin/history
export const getSpinHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await SpinResult.find({ user: req.user!._id }).sort({ createdAt: -1 }).limit(20);
  sendSuccess(res, history, 'Spin history fetched');
});
