import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Key,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../api/apiClient';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Countdown timer effect for OTP expiry
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Request OTP from server
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.post('/auth/send-otp', { email });
      if (res && res.success) {
        setStep('otp');
        setCountdown(300); // 5 minutes timer
        setSuccessMsg('🎉 A cozy 6-digit login code has been sent!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP from server
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.post('/auth/verify-otp', { email, otp });
      if (res && res.data) {
        const { user, tokens } = res.data;

        // Ensure user has administrative privileges
        const isAdminStaff = ['super_admin', 'admin', 'manager', 'staff'].includes(user.role);
        if (!isAdminStaff) {
          throw new Error('⛔ Access Denied: Authorized administrative staff only.');
        }

        // Save session credentials
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('adminUser', JSON.stringify(user));

        setSuccessMsg('🎉 Access Granted! Redirecting…');
        setTimeout(() => {
          onLoginSuccess(tokens.accessToken, user);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect OTP code. Please verify.');
    } finally {
      setLoading(false);
    }
  };

  // Back to email step
  const handleGoBack = () => {
    setStep('email');
    setOtp('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#caaef6] flex items-center justify-center p-4 relative overflow-hidden font-['Nunito',sans-serif]">

      {/* Decorative Warm Glowing Orbs for cozy glassmorphism atmosphere */}
      <div className="absolute w-[350px] h-[350px] bg-[#ffdce0]/70 rounded-full blur-[100px] top-[-10%] left-[-10%] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#e2d9ff]/70 rounded-full blur-[120px] bottom-[-15%] right-[-10%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-[#faf6f0] border-[4px] border-white rounded-[36px] p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_30px_70px_rgba(100,50,200,0.15)] relative overflow-hidden"
      >
        {/* Claymorphic Embossed Mascot Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white border-[3px] border-white rounded-3xl flex items-center justify-center text-4xl shadow-clay-card animate-float select-none">
            🐾
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
            PawMart Admin Console <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 font-extrabold mt-1.5 uppercase tracking-wider">
            Secure Passwordless Staff Portal
          </p>
        </div>

        {/* Status Alerts */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 text-xs font-black mb-6 flex gap-2.5 items-center shadow-inner"
            >
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-xs font-black mb-6 flex gap-2.5 items-center shadow-inner animate-pulse"
            >
              <span>✨</span>
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-step form card */}
        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              onSubmit={handleRequestOtp}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">
                  Administrative Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@pawmart.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 clay-input text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full clay-btn clay-btn-purple py-3.5 text-xs gap-2 shadow-md shrink-0 active:scale-95"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Get Login Code</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    6-Digit Verification Code
                  </label>
                  {countdown > 0 ? (
                    <span className="text-[10px] text-amber-500 font-extrabold">
                      ⏰ Expiry in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-500 font-extrabold">
                      ⏰ Expired
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-4 py-3.5 clay-input text-xs font-black tracking-[4px] text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full clay-btn clay-btn-purple py-3.5 text-xs gap-2 shadow-md active:scale-95"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Verify & Access Console</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center px-1 pt-1">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 stroke-[2.5]" /> Re-enter Email
                  </button>
                  {countdown === 0 && (
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-[10px] text-[#8e78f5] hover:text-[#7d67e5] font-black uppercase tracking-wider transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Cozy Note */}
        <div className="bg-[#e2d9ff]/20 border border-[#e2d9ff]/40 rounded-2xl p-4 text-[10px] text-[#523d85] font-black leading-relaxed mt-6 flex gap-2">
          <span>🛡️</span>
          <span>Security Notice: OTP requests are securely rate-limited. Look at the server startup logs to retrieve development codes instantly.</span>
        </div>
      </motion.div>
    </div>
  );
}
