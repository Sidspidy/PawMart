import { User } from '../models/User.model';
import { SpinResult, PrizeType } from '../models/SpinResult.model';
import { Points, PointsTransactionType } from '../models/Points.model';
import { creditPoints } from './points.service';
import { BadRequestError } from '../utils/AppError';

// ── Prize configuration (editable via admin in future) ───────────────────────
interface PrizeSegment {
  type: PrizeType;
  label: string;
  value?: number; // discount % or flat ₹ or bonus points
  probability: number; // 0–1, all must sum to 1
}

const PRIZE_WHEEL: PrizeSegment[] = [
  { type: PrizeType.POINTS, label: '50 Bonus Points', value: 50, probability: 0.30 },
  { type: PrizeType.COUPON, label: '10% Off', value: 10, probability: 0.20 },
  { type: PrizeType.FREE_SHIPPING, label: 'Free Shipping', probability: 0.15 },
  { type: PrizeType.POINTS, label: '100 Bonus Points', value: 100, probability: 0.12 },
  { type: PrizeType.COUPON, label: '20% Off', value: 20, probability: 0.10 },
  { type: PrizeType.GIFT, label: 'Mystery Gift', probability: 0.05 },
  { type: PrizeType.NO_PRIZE, label: 'Better luck next time', probability: 0.08 },
];

const selectPrize = (): PrizeSegment => {
  const rand = Math.random();
  let cumulative = 0;
  for (const segment of PRIZE_WHEEL) {
    cumulative += segment.probability;
    if (rand <= cumulative) return segment;
  }
  return PRIZE_WHEEL[PRIZE_WHEEL.length - 1];
};

const generateCouponCode = (): string =>
  `SPIN${Date.now().toString(36).toUpperCase()}`;

/**
 * Execute a spin for a user. Deducts one spin attempt, logs result,
 * credits points/coupon if applicable.
 */
export const executeSpin = async (
  userId: string
): Promise<SpinResult> => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');
  if (user.totalSpins <= 0) throw new BadRequestError('No spin attempts remaining');

  const prize = selectPrize();

  // Deduct spin
  user.totalSpins -= 1;
  await user.save();

  let couponCode: string | undefined;
  let pointsAwarded = 0;

  if (prize.type === PrizeType.POINTS && prize.value) {
    pointsAwarded = prize.value;
  } else if (prize.type === PrizeType.COUPON) {
    couponCode = generateCouponCode();
    // TODO: auto-create Coupon document here
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

export const getWheelConfig = (): PrizeSegment[] => PRIZE_WHEEL;
