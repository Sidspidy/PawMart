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
  const { gateway, amount, currency = 'INR', receipt } = input;

  switch (gateway) {
    case PaymentGateway.RAZORPAY:
      return createRazorpayOrder(amount, currency, receipt);
    case PaymentGateway.STRIPE:
      return createStripeIntent(amount, currency);
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
