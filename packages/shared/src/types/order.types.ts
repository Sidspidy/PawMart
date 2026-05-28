export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  CASHFREE = 'cashfree',
  COD = 'cod',
}

export interface IOrderItem {
  product: string;
  productName: string;
  productImage: string;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  pointsUsed: number;
  pointsEarned: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}
