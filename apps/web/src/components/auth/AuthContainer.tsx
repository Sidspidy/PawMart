import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface AuthContainerProps {
  initialMode: 'login' | 'register' | 'forgot';
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email');

  // Form State variables
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Form errors
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Switch auth modes with blur and sliding layout transitions
  const handleModeSwitch = (targetMode: 'login' | 'register' | 'forgot') => {
    if (targetMode === mode) return;
    setIsTransitioning(true);
    setError('');
    setSuccessMsg('');
    
    // Step 1: Blur and fade out form content
    setTimeout(() => {
      // Step 2: Swap modes (which triggers Framer Motion's panel swap layout animation)
      setMode(targetMode);
      setOtpStep('email'); // Reset OTP step on transition
      
      // Step 3: Fade and unblur form content once layout slide finishes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 180);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setSuccessMsg('OTP code sent to ' + email + '! Check your inbox.');
    setOtpStep('code');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      if (!password) {
        setError('Please enter your password');
        return;
      }
      setSuccessMsg('Login successful! Welcome back to PawMart 🐾');
      setTimeout(() => navigate('/'), 1500);
    } else if (mode === 'register') {
      if (!name) return setError('Name is required');
      if (!email) return setError('Email is required');
      if (!password) return setError('Password is required');
      if (password !== confirmPassword) return setError('Passwords do not match');

      setSuccessMsg('Registration successful! Welcome to the PawMart family 🐾');
      setTimeout(() => handleModeSwitch('login'), 1800);
    } else if (mode === 'forgot') {
      if (otpStep === 'email') {
        if (!email) return setError('Please enter your email address');
        setSuccessMsg('Reset code sent! Check your inbox.');
        setOtpStep('code');
      } else {
        if (!otp || otp.length < 6) return setError('Please enter the 6-digit code');
        if (!password) return setError('Please enter a new password');
        setSuccessMsg('Password reset successful! You can now log in.');
        setTimeout(() => handleModeSwitch('login'), 1800);
      }
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
      {/* ── Decorative Background Ambient Orbs ────────────────── */}
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

      {/* ── Floating Absolute Back to Home Button ───────────── */}
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

      {/* ── Outer Card Wrapper ─────────────────────────────── */}
      <motion.div
        layout
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 980,
          height: mode === 'register' ? 620 : 600,
          background: 'rgba(26, 21, 16, 0.4)',
          borderRadius: 32,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px -12px rgba(249, 115, 22, 0.12), 0 0 0 1px rgba(249, 115, 22, 0.04)',
          display: 'flex',
          flexDirection: mode === 'register' ? 'row-reverse' : 'row', // Animates positions swapping!
          overflow: 'hidden',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* ── IMAGE PANEL (ARTISTIC BACKDROP) ── */}
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: '0 0 48%', // Stable fixed width!
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            background: '#251e18',
          }}
        >
          {/* Flat vector background illustration */}
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

          {/* Decorative sunset brand overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(26,21,16,0.45) 100%)',
          }} />

          {/* Large Stylized Logo and Welcome Info */}
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '10%',
            right: '10%',
            textAlign: 'center',
            zIndex: 3,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '0.3em',
              textShadow: '0 4px 20px rgba(26,21,16,0.4)',
              margin: 0,
              paddingLeft: '0.3em',
            }}>
              WELCOME
            </h1>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(26,21,16,0.45)',
              padding: '0.4rem 1.2rem',
              borderRadius: 9999,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              🐾 PawMart
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.85rem',
              fontWeight: 600,
              maxWidth: 240,
              lineHeight: 1.5,
              textShadow: '0 1px 8px rgba(0,0,0,0.2)',
              margin: 0,
            }}>
              Premium supplies for happy pets and happy homes.
            </p>
          </div>

          {/* Premium Wavy Divider Curve Overlay (Always positioned dynamically on the border side) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: mode === 'register' ? 'auto' : -1,
              left: mode === 'register' ? -1 : 'auto',
              width: '45px',
              height: '100%',
              fill: '#261e17', // Matches dark brand charcoal color of form panel
              zIndex: 4,
              transform: mode === 'register' ? 'scaleX(-1)' : 'none',
              transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'block',
            }}
          >
            <path d="M0,0 Q35,50 0,100 L100,100 L100,0 Z" />
          </svg>
        </motion.div>

        {/* ── FORM PANEL ── */}
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: '0 0 52%', // Stable fixed width!
            background: 'linear-gradient(135deg, #261e17 0%, #15110d 100%)',
            padding: mode === 'register' ? '2.25rem 3rem' : '3rem 3.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            height: '100%',
          }}
        >
          {/* Animated Form Content Container */}
          <div style={{
            filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(8px) scale(0.98)' : 'translateY(0px) scale(1)',
            transition: 'all 250ms ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            {/* Header Titles */}
            <div style={{ marginBottom: mode === 'register' ? '0.75rem' : '1.25rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 0.3rem',
                letterSpacing: '-0.01em',
              }}>
                {mode === 'login' && 'Welcome Back! 🐾'}
                {mode === 'register' && 'Hello!'}
                {mode === 'forgot' && 'Reset Password 🐾'}
              </h2>
              <p style={{
                fontSize: '0.92rem',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                fontWeight: 500,
              }}>
                {mode === 'login' && 'We are glad to see you :)'}
                {mode === 'register' && 'We are glad to see you :)'}
                {mode === 'forgot' && 'Enter your email to receive an OTP verification code'}
              </p>
            </div>

            {/* Social Logins (Only shown in Login and Register modes) */}
            {mode !== 'forgot' && (
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: mode === 'register' ? '1rem' : '1.5rem',
                alignItems: 'center',
              }}>
                <button
                  type="button"
                  style={{
                    flex: 1.8,
                    padding: '0.65rem 1rem',
                    borderRadius: 24,
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                
                {['f', 't'].map((social) => (
                  <button
                    key={social}
                    type="button"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {social === 'f' ? 'f' : 't'}
                  </button>
                ))}
              </div>
            )}

            {/* Form Divider */}
            {mode !== 'forgot' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: mode === 'register' ? '0 0 1rem' : '0 0 1.25rem',
              }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>
            )}

            {/* Error or Success Alerts */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 14,
                padding: '0.5rem 0.9rem',
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                ⚠️ {error}
              </div>
            )}
            {successMsg && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1.5px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 14,
                padding: '0.5rem 0.9rem',
                color: '#86efac',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                ✅ {successMsg}
              </div>
            )}

            {/* Authentication Form Inputs */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: mode === 'register' ? '0.65rem' : '0.88rem' }}>
              
              {/* REGISTER MODE: Name Field */}
              {mode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label htmlFor="name" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
                  />
                </div>
              )}

              {/* REGISTER, LOGIN & FORGOT(Step 1) MODE: Email Field */}
              {(mode === 'login' || mode === 'register' || (mode === 'forgot' && otpStep === 'email')) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
                  />
                </div>
              )}

              {/* LOGIN MODE: Password Field */}
              {mode === 'login' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="password" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot')}
                      style={{
                        marginLeft: 'auto', background: 'none', border: 'none', color: '#fb923c',
                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
                  />
                </div>
              )}

              {/* REGISTER & FORGOT(Step 2) MODE: Password Fields */}
              {(mode === 'register' || (mode === 'forgot' && otpStep === 'code')) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: mode === 'register' ? '1fr 1fr' : '1fr',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label htmlFor="password" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                      {mode === 'forgot' ? 'New Password' : 'Password'}
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="xxxxxxxx"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => handleInputFocus(e)}
                      onBlur={(e) => handleInputBlur(e)}
                    />
                  </div>

                  {mode === 'register' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label htmlFor="confirmPassword" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Repeat Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="xxxxxxxx"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* FORGOT (Step 2) MODE: OTP Code Field */}
              {(mode === 'forgot' && otpStep === 'code') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="otp" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Enter 6-Digit OTP Code</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMsg('New OTP code sent!');
                        setError('');
                      }}
                      style={{
                        marginLeft: 'auto', background: 'none', border: 'none', color: '#fb923c',
                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
                      }}
                    >
                      Resend Code
                    </button>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      ...inputStyle,
                      textAlign: 'center',
                      letterSpacing: '0.3em',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                    }}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.78rem',
                    borderRadius: 24,
                    border: 'none',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // Brand Orange gradient
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.22)',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.32)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.22)';
                  }}
                >
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Sign Up'}
                  {mode === 'forgot' && (otpStep === 'email' ? 'Send Reset OTP' : 'Update Password')}
                </button>
              </div>
            </form>

            {/* Footer Form Toggles */}
            <div style={{
              marginTop: 'auto',
              paddingTop: mode === 'register' ? '1rem' : '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    style={footerLinkStyle}
                  >
                    Don't have an account? <strong style={{ color: '#fb923c' }}>Register</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    style={{ ...footerLinkStyle, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}
                  >
                    Forgot Password?
                  </button>
                </>
              )}

              {mode === 'register' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  style={footerLinkStyle}
                >
                  Already have an account? <strong style={{ color: '#fb923c' }}>Login</strong>
                </button>
              )}

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  style={footerLinkStyle}
                >
                  Remembered your password? <strong style={{ color: '#fb923c' }}>Login</strong>
                </button>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Reusable styling tokens for input boxes
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.68rem 1.1rem',
  borderRadius: 24,
  border: '1.5px solid rgba(249, 115, 22, 0.2)', // Translucent brand orange border
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: 500,
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#f97316'; // Brand Orange
  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
  e.currentTarget.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.25)';
};

const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)';
  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
  e.currentTarget.style.boxShadow = 'none';
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.78rem',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  transition: 'color 200ms ease',
};
