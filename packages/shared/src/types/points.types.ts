export enum PointsTransactionType {
  EARNED_ORDER = 'earned_order',
  EARNED_SPIN = 'earned_spin',
  REDEEMED_ORDER = 'redeemed_order',
  REDEEMED_COUPON = 'redeemed_coupon',
  ADMIN_CREDIT = 'admin_credit',
  ADMIN_DEBIT = 'admin_debit',
  EXPIRED = 'expired',
}

export interface IPointsTransaction {
  _id: string;
  user: string;
  type: PointsTransactionType;
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}
