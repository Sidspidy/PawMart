/**
 * Gateway-agnostic payment service.
 * Each method delegates to the appropriate provider based on the method enum.
 * Actual SDK calls go inside provider-specific helpers (to be expanded).
 */

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  CASHFREE = 'cashfree',
  COD = 'cod',
}

export interface CreatePaymentOrderInput {
  gateway: PaymentGateway;
  amount: number; // in rupees (converted to paise/cents inside)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  customerId?: string;
  customerPhone?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  keyId?: string; // Razorpay public key
  clientSecret?: string; // Stripe payment intent client secret
}

export const createPaymentOrder = async (
  input: CreatePaymentOrderInput
): Promise<PaymentOrderResult> => {
  const { gateway, amount, currency = 'INR', receipt, customerId, customerPhone } = input;

  switch (gateway) {
    case PaymentGateway.RAZORPAY:
      return createRazorpayOrder(amount, currency, receipt);
    case PaymentGateway.STRIPE:
      return createStripeIntent(amount, currency);
    case PaymentGateway.CASHFREE:
      return createCashfreeOrder(amount, currency, receipt, customerId, customerPhone);
    case PaymentGateway.COD:
      return { orderId: `COD-${Date.now()}`, amount, currency, gateway: PaymentGateway.COD };
    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
};

// ── Razorpay ──────────────────────────────────────────────────────────────────
const createRazorpayOrder = async (
  amount: number,
  currency: string,
  receipt?: string
): Promise<PaymentOrderResult> => {
  // Lazy import to avoid crash if Razorpay env vars missing
  const Razorpay = (await import('razorpay' as string)).default;
  const { env } = await import('../config/env');
  const rzp = new (Razorpay as any)({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
  const order = await rzp.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: receipt ?? `rcpt_${Date.now()}`,
  });
  const { env: e } = await import('../config/env');
  return {
    orderId: order.id,
    amount,
    currency,
    gateway: PaymentGateway.RAZORPAY,
    keyId: e.RAZORPAY_KEY_ID,
  };
};

// ── Stripe ────────────────────────────────────────────────────────────────────
const createStripeIntent = async (
  amount: number,
  currency: string
): Promise<PaymentOrderResult> => {
  const Stripe = (await import('stripe' as string)).default;
  const { env } = await import('../config/env');
  const stripe = new (Stripe as any)(env.STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });
  return {
    orderId: intent.id,
    amount,
    currency,
    gateway: PaymentGateway.STRIPE,
    clientSecret: intent.client_secret,
    keyId: env.STRIPE_PUBLISHABLE_KEY,
  };
};

const createCashfreeOrder = async (
  amount: number,
  currency: string,
  receipt?: string,
  customerId?: string,
  customerPhone?: string
): Promise<PaymentOrderResult> => {
  const { env } = await import('../config/env');
  const isSandbox = !env.NODE_ENV || env.NODE_ENV !== 'production';
  const url = isSandbox
    ? 'https://sandbox.cashfree.com/pg/orders'
    : 'https://api.cashfree.com/pg/orders';

  const body = {
    order_amount: amount,
    order_currency: currency,
    order_id: receipt ?? `order_${Date.now()}`,
    customer_details: {
      customer_id: customerId ?? `cust_${Date.now()}`,
      customer_phone: customerPhone ?? '9999999999',
    },
    order_meta: {
      return_url: `${env.CLIENT_ORIGIN}/checkout/confirmation?order_id={order_id}`,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-client-id': env.CASHFREE_APP_ID ?? '',
      'x-client-secret': env.CASHFREE_SECRET_KEY ?? '',
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data: any = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Cashfree order creation failed');
  }

  return {
    orderId: data.order_id,
    amount,
    currency,
    gateway: PaymentGateway.CASHFREE,
    clientSecret: data.payment_session_id,
  };
};

export const verifyRazorpaySignature = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  const crypto = await import('crypto');
  const { env } = await import('../config/env');
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET ?? '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};
