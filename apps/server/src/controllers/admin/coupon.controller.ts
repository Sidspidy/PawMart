import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';
import { NotFoundError } from '../../utils/AppError';
import { createCouponSchema } from '../../utils/validators';
import { Coupon } from '../../models/Coupon.model';

// POST /api/admin/coupons
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const data = createCouponSchema.parse(req.body);
  const coupon = await Coupon.create({ ...data, createdBy: req.user!._id });
  sendCreated(res, coupon, 'Coupon created');
});

// GET /api/admin/coupons
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
  sendSuccess(res, coupons, 'Coupons fetched');
});

// PATCH /api/admin/coupons/:id
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new NotFoundError('Coupon not found');
  sendSuccess(res, coupon, 'Coupon updated');
});

// DELETE /api/admin/coupons/:id
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new NotFoundError('Coupon not found');
  sendSuccess(res, null, 'Coupon deleted successfully');
});
