import { Customer } from '../models/Customer.model';
import { Points, PointsTransactionType } from '../models/Points.model';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/AppError';

// 1 point = ₹0.25 redemption value; earn 1 point per ₹10 spent
export const POINTS_PER_RUPEE_SPENT = 0.1; // 1 point per ₹10
export const POINTS_RUPEE_VALUE = 0.25; // ₹0.25 per point

export const calculateEarnedPoints = (orderTotal: number): number =>
  Math.floor(orderTotal * POINTS_PER_RUPEE_SPENT);

export const pointsToRupees = (points: number): number =>
  parseFloat((points * POINTS_RUPEE_VALUE).toFixed(2));

/**
 * Credit points to a user and log the transaction.
 */
export const creditPoints = async (
  userId: string,
  points: number,
  type: PointsTransactionType,
  description: string,
  reference?: mongoose.Types.ObjectId,
  referenceModel?: 'Order' | 'SpinResult',
  session?: mongoose.ClientSession
): Promise<void> => {
  const user = await Customer.findByIdAndUpdate(
    userId,
    { $inc: { pointsBalance: points } },
    { new: true, session }
  );
  if (!user) return;

  await Points.create(
    [
      {
        user: userId,
        type,
        points,
        balanceAfter: user.pointsBalance,
        reference,
        referenceModel,
        description,
      },
    ],
    { session }
  );
};

/**
 * Debit points from a user. Throws if insufficient balance.
 */
export const debitPoints = async (
  userId: string,
  points: number,
  type: PointsTransactionType,
  description: string,
  reference?: mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<void> => {
  const user = await Customer.findById(userId).session(session ?? null);
  if (!user) return;
  if (user.pointsBalance < points) {
    throw new BadRequestError(`Insufficient points. Balance: ${user.pointsBalance}`);
  }

  user.pointsBalance -= points;
  await user.save({ session });

  await Points.create(
    [
      {
        user: userId,
        type,
        points: -points,
        balanceAfter: user.pointsBalance,
        reference,
        description,
      },
    ],
    { session }
  );
};

/**
 * Reward points after a delivered order. Called from order service.
 */
export const rewardOrderPoints = async (
  userId: string,
  orderId: mongoose.Types.ObjectId,
  orderTotal: number
): Promise<number> => {
  // Prevent duplicate point rewards for the same order
  const existing = await Points.findOne({
    user: userId,
    type: PointsTransactionType.EARNED_ORDER,
    reference: orderId,
  });
  if (existing) {
    return 0;
  }

  const earned = calculateEarnedPoints(orderTotal);
  if (earned === 0) return 0;

  await creditPoints(
    userId,
    earned,
    PointsTransactionType.EARNED_ORDER,
    `Points earned for order ₹${orderTotal}`,
    orderId,
    'Order'
  );

  // Unlock a spin attempt for every 100 points earned
  const spinsToAdd = Math.floor(earned / 100);
  if (spinsToAdd > 0) {
    await Customer.findByIdAndUpdate(userId, { $inc: { totalSpins: spinsToAdd } });
  }

  return earned;
};
