import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
};

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (options: MailOptions): Promise<void> => {
  await getTransporter().sendMail({
    from: env.EMAIL_FROM,
    ...options,
  });
};

// ── Email templates ───────────────────────────────────────────────────────────

export const sendOtpEmail = async (email: string, otp: string, name?: string): Promise<void> => {
  await sendMail({
    to: email,
    subject: `${otp} — Your PawMart login code`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:12px">
        <h1 style="color:#f97316;font-size:24px;margin-bottom:8px">🐾 PawMart</h1>
        <p style="color:#374151;font-size:16px">Hi ${name ?? 'there'}!</p>
        <p style="color:#374151;font-size:15px">Use the code below to sign in. It expires in <strong>${env.OTP_TTL_SECONDS / 60} minutes</strong>.</p>
        <div style="background:#fff7ed;border:2px solid #f97316;border-radius:10px;padding:20px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#ea580c">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:13px">Never share this code with anyone. PawMart will never ask for it.</p>
      </div>
    `,
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  total: number
): Promise<void> => {
  await sendMail({
    to: email,
    subject: `Order ${orderNumber} confirmed — PawMart`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px">
        <h1 style="color:#f97316">🐾 Order Confirmed!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <p>Total: <strong>₹${total.toLocaleString('en-IN')}</strong></p>
        <p>We'll send you another email when it ships. Thanks for shopping with PawMart!</p>
      </div>
    `,
  });
};

export const sendOrderStatusEmail = async (
  email: string,
  orderNumber: string,
  status: string
): Promise<void> => {
  await sendMail({
    to: email,
    subject: `Order ${orderNumber} update — PawMart`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px">
        <h1 style="color:#f97316">🐾 Order Update</h1>
        <p>Your order <strong>${orderNumber}</strong> status has been updated to:</p>
        <p style="font-size:20px;font-weight:700;color:#16a34a;text-transform:capitalize">${status.replace(/_/g, ' ')}</p>
      </div>
    `,
  });
};
