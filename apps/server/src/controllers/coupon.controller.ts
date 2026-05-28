import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import { createCouponSchema } from '../utils/validators';
import { Coupon, CouponType } from '../models/Coupon.model';

// POST /api/coupons  [Admin]
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const data = createCouponSchema.parse(req.body);
  const coupon = await Coupon.create({ ...data, createdBy: req.user!._id });
  sendCreated(res, coupon, 'Coupon created');
});

// GET /api/coupons  [Admin]
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
  sendSuccess(res, coupons, 'Coupons fetched');
});

// POST /api/coupons/validate  [Customer]
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderTotal } = req.body;
  if (!code) throw new BadRequestError('Coupon code required');

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startsAt: { $lte: new Date() },
    expiresAt: { $gte: new Date() },
  });

  if (!coupon) throw new NotFoundError('Invalid or expired coupon');
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new BadRequestError('Coupon usage limit reached');
  }
  if (orderTotal < coupon.minOrderValue) {
    throw new BadRequestError(`Minimum order value ₹${coupon.minOrderValue} required`);
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === CouponType.PERCENTAGE) {
    discount = (orderTotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === CouponType.FLAT) {
    discount = Math.min(coupon.value, orderTotal);
  } else if (coupon.type === CouponType.FREE_SHIPPING) {
    discount = 0; // handled at checkout
  }

  sendSuccess(res, { coupon: { _id: coupon._id, code: coupon.code, type: coupon.type, value: coupon.value }, discount }, 'Coupon valid');
});

// PATCH /api/coupons/:id  [Admin]
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new NotFoundError('Coupon not found');
  sendSuccess(res, coupon, 'Coupon updated');
});

// DELETE /api/coupons/:id  [Admin]
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!coupon) throw new NotFoundError('Coupon not found');
  sendSuccess(res, null, 'Coupon deactivated');
});
