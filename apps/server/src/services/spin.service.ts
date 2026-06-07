import { Customer } from '../models/Customer.model';
import { SpinResult, PrizeType, ISpinResult } from '../models/SpinResult.model';
import { Points, PointsTransactionType } from '../models/Points.model';
import { SpinWheelConfig } from '../models/SpinWheelConfig.model';
import { creditPoints } from './points.service';
import { BadRequestError } from '../utils/AppError';
import { Coupon, CouponType, CouponScope } from '../models/Coupon.model';

// ── Prize configuration (default fallbacks) ───────────────────────
interface PrizeSegment {
  type: PrizeType;
  label: string;
  value?: number; // discount % or flat ₹ or bonus points
  probability: number; // 0–1, all must sum to 1
}

const PRIZE_WHEEL: PrizeSegment[] = [
  { type: PrizeType.POINTS, label: 'Bonus Points', value: 100, probability: 0.15 },
  { type: PrizeType.FREE_SHIPPING, label: 'Free Shipping', probability: 0.15 },
  { type: PrizeType.GIFT, label: 'Gift Product', probability: 0.10 },
  { type: PrizeType.COUPON, label: '10% Coupon', value: 10, probability: 0.20 },
  { type: PrizeType.COUPON, label: '20% Coupon', value: 20, probability: 0.10 },
  { type: PrizeType.GIFT, label: 'Mystery Reward', probability: 0.10 },
  { type: PrizeType.GIFT, label: 'Extra Spin', probability: 0.10 },
  { type: PrizeType.GIFT, label: 'Surprise Box', probability: 0.10 },
];

export const getWheelConfig = async (onlyActive = true): Promise<any[]> => {
  const totalCount = await SpinWheelConfig.countDocuments({});
  if (totalCount === 0) {
    // Seed default segments in database with pristine 8-slice layout
    await SpinWheelConfig.create(PRIZE_WHEEL);
  }
  return SpinWheelConfig.find(onlyActive ? { isActive: true } : {});
};

const selectPrize = (segments: any[]): any => {
  const rand = Math.random();
  let cumulative = 0;
  for (const segment of segments) {
    cumulative += segment.probability;
    if (rand <= cumulative) return segment;
  }
  return segments[segments.length - 1];
};

const generateCouponCode = (): string =>
  `SPIN${Date.now().toString(36).toUpperCase()}`;

/**
 * Execute a spin for a user. Deducts one spin attempt, logs result,
 * credits points/coupon if applicable.
 */
export const executeSpin = async (
  userId: string
): Promise<ISpinResult> => {
  const user = await Customer.findById(userId);
  if (!user) throw new BadRequestError('Customer not found');
  if (user.totalSpins <= 0) throw new BadRequestError('No spin attempts remaining');

  const segments = await getWheelConfig();
  const prize = selectPrize(segments);

  // Deduct spin
  user.totalSpins -= 1;
  await user.save();

  let couponCode: string | undefined;
  let pointsAwarded = 0;

  if (prize.type === PrizeType.POINTS && prize.value) {
    pointsAwarded = prize.value;
  } else if (prize.type === PrizeType.COUPON) {
    couponCode = generateCouponCode();
    await Coupon.create({
      code: couponCode,
      description: `Spin Wheel Reward: ${prize.label}`,
      type: CouponType.PERCENTAGE,
      scope: CouponScope.USER,
      value: prize.value || 10,
      minOrderValue: 0,
      usageLimit: 1,
      usagePerUser: 1,
      usedCount: 0,
      applicableUsers: [userId],
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  } else if (prize.type === PrizeType.FREE_SHIPPING) {
    couponCode = generateCouponCode();
    await Coupon.create({
      code: couponCode,
      description: `Spin Wheel Reward: Free Shipping`,
      type: CouponType.FREE_SHIPPING,
      scope: CouponScope.USER,
      value: 0,
      minOrderValue: 0,
      usageLimit: 1,
      usagePerUser: 1,
      usedCount: 0,
      applicableUsers: [userId],
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  const spinResult = await SpinResult.create({
    user: userId,
    prizeType: prize.type,
    prizeValue: prize.value,
    couponCode,
    pointsAwarded,
    description: prize.label,
    isClaimed: prize.type === PrizeType.POINTS, // points are auto-claimed
  });

  // Credit points immediately
  if (pointsAwarded > 0) {
    await creditPoints(
      userId,
      pointsAwarded,
      PointsTransactionType.EARNED_SPIN,
      `Spin wheel reward: ${prize.label}`,
      spinResult._id as any,
      'SpinResult'
    );
  }

  return spinResult;
};
