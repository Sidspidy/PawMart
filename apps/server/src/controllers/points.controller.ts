import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { buildPagination } from '../utils/apiResponse';
import { Points } from '../models/Points.model';
import { Customer } from '../models/Customer.model';

// GET /api/points/balance
export const getBalance = asyncHandler(async (req: Request, res: Response) => {
  const user = await Customer.findById(req.user!._id).select('pointsBalance totalSpins');
  sendSuccess(res, user, 'Points balance fetched');
});

// GET /api/points/history
export const getPointsHistory = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Points.find({ user: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Points.countDocuments({ user: req.user!._id }),
  ]);

  sendSuccess(res, transactions, 'Points history fetched', 200, buildPagination(page, limit, total));
});
