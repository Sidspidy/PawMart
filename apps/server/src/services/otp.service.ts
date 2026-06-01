import crypto from 'crypto';
import { env } from '../config/env';

interface IOtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, IOtpEntry>();
const MAX_ATTEMPTS = 5;

/**
 * Generates a numeric OTP, stores it in memory with TTL.
 * Returns the OTP (to be emailed — never sent in API response).
 */
export const generateOtp = async (email: string): Promise<string> => {
  const normalizedEmail = email.toLowerCase();
  const otp = crypto.randomInt(10 ** (env.OTP_LENGTH - 1), 10 ** env.OTP_LENGTH).toString();
  const expiresAt = Date.now() + env.OTP_TTL_SECONDS * 1000;

  otpStore.set(normalizedEmail, {
    otp,
    expiresAt,
    attempts: 0
  });

  return otp;
};

/**
 * Verifies the OTP. Increments attempt counter.
 * Deletes OTP on successful verification (one-time use).
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ valid: boolean; reason?: string }> => {
  const normalizedEmail = email.toLowerCase();
  const entry = otpStore.get(normalizedEmail);

  if (!entry) {
    return { valid: false, reason: 'OTP expired or not found. Request a new one.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, reason: 'OTP expired or not found. Request a new one.' };
  }

  // Check attempt count
  if (entry.attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: 'Too many failed attempts. Request a new OTP.' };
  }

  if (entry.otp !== otp.trim()) {
    entry.attempts += 1;
    // Renew expiry timer
    entry.expiresAt = Date.now() + env.OTP_TTL_SECONDS * 1000;
    otpStore.set(normalizedEmail, entry);
    return { valid: false, reason: 'Incorrect OTP.' };
  }

  // Valid — clean up
  otpStore.delete(normalizedEmail);
  return { valid: true };
};

/** Check if an OTP is currently pending for an email (rate-limit guard). */
export const hasActiveotp = async (email: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase();
  const entry = otpStore.get(normalizedEmail);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return false;
  }
  return true;
};

/** Remaining TTL (seconds) for an OTP — useful for frontend countdown. */
export const otpTtl = async (email: string): Promise<number> => {
  const normalizedEmail = email.toLowerCase();
  const entry = otpStore.get(normalizedEmail);
  if (!entry) return 0;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return 0;
  }
  return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
};
