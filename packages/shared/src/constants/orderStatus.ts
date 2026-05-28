import { OrderStatus } from '../types/order.types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PACKED]: 'Packed',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PACKED,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

export const TERMINAL_STATUSES = [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED];
