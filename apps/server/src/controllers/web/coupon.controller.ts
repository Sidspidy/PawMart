import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { NotFoundError, BadRequestError } from '../../utils/AppError';
import { Coupon, CouponType, CouponScope } from '../../models/Coupon.model';

// POST /api/coupons/validate
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

  // Verify user applicability if scope is user
  if (coupon.scope === CouponScope.USER && !coupon.applicableUsers.some(u => u.toString() === req.user!._id.toString())) {
    throw new BadRequestError('This coupon is not valid for your account');
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new BadRequestError('Coupon usage limit reached');
  }
  if (orderTotal < coupon.minOrderValue) {
    throw new BadRequestError(`Minimum order value ₹${coupon.minOrderValue} required`);
  }

  let discount = 0;
  if (coupon.type === CouponType.PERCENTAGE) {
    discount = (orderTotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === CouponType.FLAT) {
    discount = Math.min(coupon.value, orderTotal);
  } else if (coupon.type === CouponType.FREE_SHIPPING) {
    discount = 0;
  }

  sendSuccess(res, { coupon: { _id: coupon._id, code: coupon.code, type: coupon.type, value: coupon.value }, discount }, 'Coupon valid');
});

// GET /api/coupons
export const getWebCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find({
    isActive: true,
    startsAt: { $lte: new Date() },
    expiresAt: { $gte: new Date() },
    $or: [
      { scope: { $ne: CouponScope.USER } },
      { scope: CouponScope.USER, applicableUsers: req.user!._id }
    ]
  }).sort({ createdAt: -1 });

  sendSuccess(res, coupons, 'Coupons fetched');
});
