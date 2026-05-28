export enum CouponType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  FREE_SHIPPING = 'free_shipping',
}

export interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usagePerUser: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}
