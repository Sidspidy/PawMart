import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';

interface AuthContainerProps {
  initialMode: 'login' | 'register';
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email');

  // Form State variables
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  // Switch auth modes with sliding transitions
  const handleModeSwitch = (targetMode: 'login' | 'register' | 'forgot-password') => {
    if (targetMode === mode) return;
    setIsTransitioning(true);
    setError('');
    setSuccessMsg('');
    setOtpStep('email');
    setPassword('');
    setConfirmPassword('');
    setOtp('');

    setTimeout(() => {
      setMode(targetMode);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { user, tokens } = response.data.data;

        // Set Auth Store State
        setAuth(user, tokens.accessToken, tokens.refreshToken);
        addToast('Welcome back to PawMart! 🐾', 'success');
        setSuccessMsg('Login successful!');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(response.data?.message || 'Login failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/send-otp', { email });
      if (response.data?.success) {
        addToast(`OTP sent to ${email}! Check your console/email 🐾`, 'success');
        setSuccessMsg(`An OTP has been sent successfully to ${email}.`);
        setOtpStep('code');
      } else {
        setError(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/verify', {
        email,
        name,
        phone,
        password,
        otp,
      });

      if (response.data?.success) {
        const { user, tokens } = response.data.data;

        setAuth(user, tokens.accessToken, tokens.refreshToken);
        addToast('Welcome to the PawMart family! 🐾', 'success');
        setSuccessMsg('Registration successful!');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(response.data?.message || 'Invalid OTP code');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/send-otp', { email });
      if (response.data?.success) {
        addToast(`Reset OTP code sent to ${email}! 🐾`, 'success');
        setSuccessMsg(`A password reset code has been sent successfully to ${email}.`);
        setOtpStep('code');
      } else {
        setError(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Account not found or OTP failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/verify', {
        email,
        password,
        otp,
      });

      if (response.data?.success) {
        addToast('Password reset successful! 🐾', 'success');
        setSuccessMsg('Your password has been reset successfully. Please login.');
        setTimeout(() => {
          handleModeSwitch('login');
        }, 1500);
      } else {
        setError(response.data?.message || 'Invalid OTP code');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(circle at 50% 50%, #2a1e16 0%, #15110d 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Background Ambient Orbs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Floating Absolute Back to Home Button */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1.25rem',
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-3px)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }}
      >
        🐾 Back to Store
      </Link>

      {/* Outer Card Wrapper (Main static size card) */}
      <div
        style={{
          width: '100%',
          maxWidth: 980,
          height: mode === 'register' ? 620 : 540,
          background: 'rgba(26, 21, 16, 0.4)',
          borderRadius: 32,
          boxShadow: '0 25px 60px -12px rgba(249, 115, 22, 0.12), 0 0 0 1px rgba(249, 115, 22, 0.04)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 5,
          transition: 'height 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 1. FULL BACKGROUND BACKDROP (NEVER COMPRESSED OR SHRUNK) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          <img
            src="/images/footer.png"
            alt="PawMart Nature World"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
            }}
          />
          {/* Rich semi-transparent ambient gradient cover overlay for excellent contrast */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(26, 21, 16, 0.72) 0%, rgba(20, 16, 13, 0.85) 100%)',
          }} />
        </div>

        {/* 2. EXPOSED TEXT CONTENT PANELS (BEHIND SLIDING PANEL) */}
        {/* Left Welcome (Revealed when panel slides to the right / register mode) */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '48%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: mode === 'register' ? 1 : 0,
          transform: mode === 'register' ? 'translateX(0px)' : 'translateX(-20px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#fff',
            letterSpacing: '0.2em', textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: '0 0 1rem', paddingLeft: '0.2em'
          }}>
            WELCOME
          </h1>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#fff',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(26,21,16,0.65)',
            padding: '0.4rem 1.2rem', borderRadius: 9999, backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            🐾 PawMart
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', fontWeight: 600, maxWidth: 220,
            lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.3)', margin: '1rem 0 0', textAlign: 'center'
          }}>
            Create an account to track your orders, earn PawPoints, and play the Daily Spin Wheel!
          </p>
        </div>

        {/* Right Welcome (Revealed when panel slides to the left / login/forgot-password mode) */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '48%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: mode !== 'register' ? 1 : 0,
          transform: mode !== 'register' ? 'translateX(0px)' : 'translateX(20px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: '#fff',
            letterSpacing: '0.2em', textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: '0 0 1rem', paddingLeft: '0.2em'
          }}>
            HELLO!
          </h1>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#fff',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(26,21,16,0.65)',
            padding: '0.4rem 1.2rem', borderRadius: 9999, backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            🐾 PawMart
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', fontWeight: 600, maxWidth: 220,
            lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.3)', margin: '1rem 0 0', textAlign: 'center'
          }}>
            Sign in to access premium organic supplies, cozy pet furniture, and special member coupons!
          </p>
        </div>

        {/* 3. SLIDING GLASSMORPHIC FORM PANEL */}
        <motion.div
          animate={{
            x: mode === 'register' ? '92.3%' : '0%',
          }}
          transition={{ type: 'spring', stiffness: 90, damping: 17 }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '52%',
            height: '100%',
            background: 'rgba(28, 22, 17, 0.76)',
            backdropFilter: 'blur(20px)',
            borderRight: mode === 'register' ? 'none' : '1px solid rgba(255,255,255,0.08)',
            borderLeft: mode === 'register' ? '1px solid rgba(255,255,255,0.08)' : 'none',
            padding: mode === 'register' ? '1.8rem 2.8rem' : '2.5rem 3.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{
            filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(6px) scale(0.98)' : 'translateY(0px) scale(1)',
            transition: 'all 200ms ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}>
            {/* Header Titles */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 0.25rem',
              }}>
                {mode === 'login' && 'Welcome Back! 🐾'}
                {mode === 'register' && 'Hello Friend! 🐾'}
                {mode === 'forgot-password' && 'Reset Password 🐾'}
              </h2>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                fontWeight: 500,
              }}>
                {mode === 'login' && 'Sign in using your email and password'}
                {mode === 'register' && (otpStep === 'email' ? 'Create a secure client profile' : `Enter code sent to ${email}`)}
                {mode === 'forgot-password' && (otpStep === 'email' ? 'Send a recovery verification OTP' : `Enter OTP and set new password`)}
              </p>
            </div>

            {/* Error or Success Alerts */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)', border: '1.5px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 14, padding: '0.5rem 0.9rem', color: '#fca5a5', fontSize: '0.78rem',
                fontWeight: 600, marginBottom: '0.75rem',
              }}>
                ⚠️ {error}
              </div>
            )}
            {successMsg && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.12)', border: '1.5px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 14, padding: '0.5rem 0.9rem', color: '#86efac', fontSize: '0.78rem',
                fontWeight: 600, marginBottom: '0.75rem',
              }}>
                ✅ {successMsg}
              </div>
            )}

            {/* A. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label htmlFor="login-email" style={labelStyle}>Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="login-password" style={labelStyle}>Password</label>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot-password')}
                      style={{ background: 'none', border: 'none', color: '#fb923c', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>
                  {isLoading ? 'Processing...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* B. REGISTER FORM */}
            {mode === 'register' && (
              <form
                onSubmit={otpStep === 'email' ? handleRegisterOtpSubmit : handleRegisterVerifySubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
              >
                {otpStep === 'email' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="reg-name" style={labelStyle}>Your Name</label>
                        <input
                          id="reg-name"
                          type="text"
                          required
                          placeholder="Rahul"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="reg-phone" style={labelStyle}>Phone Number</label>
                        <input
                          id="reg-phone"
                          type="text"
                          required
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <label htmlFor="reg-email" style={labelStyle}>Email Address</label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="reg-pass" style={labelStyle}>Password</label>
                        <input
                          id="reg-pass"
                          type="password"
                          required
                          placeholder="Min 6 chars"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="reg-confirm" style={labelStyle}>Confirm</label>
                        <input
                          id="reg-confirm"
                          type="password"
                          required
                          placeholder="Confirm"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>
                      {isLoading ? 'Processing...' : 'Send Registration OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="reg-otp" style={labelStyle}>Enter 6-Digit OTP</label>
                        <button
                          type="button"
                          onClick={handleRegisterOtpSubmit}
                          style={{ background: 'none', border: 'none', color: '#fb923c', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Resend Code
                        </button>
                      </div>
                      <input
                        id="reg-otp"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="e.g. 123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.05rem', fontWeight: 800 }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>

                    <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>
                      {isLoading ? 'Processing...' : 'Verify & Sign Up'}
                    </button>
                  </>
                )}
              </form>
            )}

            {/* C. FORGOT PASSWORD FORM */}
            {mode === 'forgot-password' && (
              <form
                onSubmit={otpStep === 'email' ? handleForgotPasswordOtpSubmit : handleForgotPasswordVerifySubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {otpStep === 'email' ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label htmlFor="forgot-email" style={labelStyle}>Email Address</label>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        placeholder="Enter email to retrieve OTP"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>

                    <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>
                      {isLoading ? 'Processing...' : 'Send Recovery OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label htmlFor="forgot-otp" style={labelStyle}>6-Digit OTP Code</label>
                      <input
                        id="forgot-otp"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="e.g. 123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.05rem', fontWeight: 800 }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="forgot-pass" style={labelStyle}>New Password</label>
                        <input
                          id="forgot-pass"
                          type="password"
                          required
                          placeholder="Min 6 chars"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label htmlFor="forgot-confirm" style={labelStyle}>Confirm</label>
                        <input
                          id="forgot-confirm"
                          type="password"
                          required
                          placeholder="Confirm"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>
                      {isLoading ? 'Processing...' : 'Verify & Reset Password'}
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Footer Form Toggles */}
            <div style={{
              marginTop: '1.2rem',
              paddingTop: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              {otpStep === 'code' && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('email');
                    setError('');
                    setSuccessMsg('');
                    setOtp('');
                  }}
                  style={{ ...footerLinkStyle, color: '#fb923c', fontWeight: 700 }}
                >
                  ← Go back
                </button>
              )}

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  style={footerLinkStyle}
                >
                  Don't have an account? <strong style={{ color: '#fb923c' }}>Register</strong>
                </button>
              )}

              {mode === 'register' && (
                <button
                  type="button"
                  disabled={otpStep === 'code'}
                  onClick={() => handleModeSwitch('login')}
                  style={{ ...footerLinkStyle, opacity: otpStep === 'code' ? 0.4 : 1, cursor: otpStep === 'code' ? 'not-allowed' : 'pointer' }}
                >
                  Already have an account? <strong style={{ color: '#fb923c' }}>Login</strong>
                </button>
              )}

              {mode === 'forgot-password' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  style={footerLinkStyle}
                >
                  Back to <strong style={{ color: '#fb923c' }}>Login</strong>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Reusable styling tokens for labels
const labelStyle: React.CSSProperties = {
  fontSize: '0.74rem',
  color: 'rgba(255,255,255,0.7)',
  fontWeight: 600,
};

// Reusable styling tokens for input boxes
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.95rem',
  borderRadius: 20,
  border: '1.5px solid rgba(249, 115, 22, 0.2)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '0.82rem',
  fontWeight: 500,
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = '#f97316';
  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
  e.currentTarget.style.boxShadow = '0 0 10px rgba(249, 115, 22, 0.2)';
};

const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)';
  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
  e.currentTarget.style.boxShadow = 'none';
};

const submitButtonStyle = (isLoading: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.7rem',
  borderRadius: 20,
  border: 'none',
  background: isLoading
    ? 'rgba(255,255,255,0.1)'
    : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  color: isLoading ? 'rgba(255,255,255,0.4)' : '#fff',
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: '0.84rem',
  cursor: isLoading ? 'not-allowed' : 'pointer',
  boxShadow: isLoading ? 'none' : '0 4px 12px rgba(249,115,22,0.2)',
  transition: 'all 200ms ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.3rem',
});

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.76rem',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  transition: 'color 200ms ease',
};
