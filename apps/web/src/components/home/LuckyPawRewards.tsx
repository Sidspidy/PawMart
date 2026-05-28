import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/* ── Wheel Segments ─────────────────────────────────────────── */
const segments = [
  { label: 'Bonus Points', icon: '🌟', color: '#f59e0b', lightColor: '#fef3c7', value: '+100 Points' },
  { label: 'Free Shipping', icon: '🚚', color: '#0ea5e9', lightColor: '#e0f2fe', value: 'Free Shipping' },
  { label: 'Gift Product', icon: '🎁', color: '#ec4899', lightColor: '#fce7f3', value: 'Free Dog Toy' },
  { label: '10% Coupon', icon: '🏷️', color: '#22c55e', lightColor: '#dcfce7', value: '10% OFF' },
  { label: '20% Coupon', icon: '💎', color: '#a855f7', lightColor: '#f3e8ff', value: '20% OFF' },
  { label: 'Mystery Reward', icon: '✨', color: '#f97316', lightColor: '#fff7ed', value: 'Mystery Gift' },
  { label: 'Extra Spin', icon: '🔄', color: '#14b8a6', lightColor: '#ccfbf1', value: 'Extra Spin!' },
  { label: 'Surprise Box', icon: '📦', color: '#e11d48', lightColor: '#ffe4e6', value: 'Surprise Box' },
];

const SEGMENT_ANGLE = 360 / segments.length; // 45 degrees each

/* ── Floating Particle Component ────────────────────────────── */
const FloatingParticle = ({ delay, x, size, emoji }: { delay: number; x: number; size: number; emoji: string }) => (
  <motion.div
    style={{ position: 'absolute', left: `${x}%`, bottom: '-20px', fontSize: `${size}rem`, pointerEvents: 'none', zIndex: 0 }}
    animate={{
      y: [0, -600 - Math.random() * 300],
      x: [0, (Math.random() - 0.5) * 100],
      opacity: [0, 1, 1, 0],
      rotate: [0, (Math.random() - 0.5) * 60],
    }}
    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay, ease: 'easeOut' }}
  >
    {emoji}
  </motion.div>
);

/* ── Paw Print SVG ──────────────────────────────────────────── */
const PawPrint = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={style}>
    <ellipse cx="12" cy="17" rx="5" ry="4" />
    <circle cx="6" cy="10" r="2.5" />
    <circle cx="18" cy="10" r="2.5" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="6" r="2" />
  </svg>
);

export default function LuckyPawRewards() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [wonSegment, setWonSegment] = useState<typeof segments[0] | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [totalPoints, setTotalPoints] = useState(2450);
  const [celebrating, setCelebrating] = useState(false);
  const wheelControls = useAnimation();

  /* ── Idle rotation ────────────────────────────────────────── */
  useEffect(() => {
    if (!isSpinning && !showReward) {
      wheelControls.start({
        rotate: [currentRotation, currentRotation + 360],
        transition: { duration: 40, repeat: Infinity, ease: 'linear' },
      });
    }
  }, [isSpinning, showReward, currentRotation]);

  /* ── Spin Logic ───────────────────────────────────────────── */
  const handleSpin = useCallback(() => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setShowReward(false);
    setWonSegment(null);
    setCelebrating(false);

    const winIndex = Math.floor(Math.random() * segments.length);
    const extraRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const targetAngle = extraRotations * 360 + (360 - winIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
    const finalRotation = currentRotation + targetAngle;

    wheelControls.start({
      rotate: finalRotation,
      transition: {
        duration: 4.5,
        ease: [0.2, 0.8, 0.3, 1],
      },
    }).then(() => {
      setCurrentRotation(finalRotation % 360);
      setIsSpinning(false);
      setWonSegment(segments[winIndex]);
      setSpinsLeft((prev) => prev - 1);
      if (segments[winIndex].label === 'Bonus Points') {
        setTotalPoints((prev) => prev + 100);
      }

      // Show reward card after a beat
      setTimeout(() => {
        setShowReward(true);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
      }, 400);
    });
  }, [isSpinning, spinsLeft, currentRotation, wheelControls]);

  const progressToNextSpin = 72; // percentage

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ── Background Decorations ──────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Floating particles */}
        {['🪙', '🐾', '⭐', '🎁', '💰', '✨', '🐾', '🪙'].map((emoji, i) => (
          <FloatingParticle key={i} delay={i * 1.2} x={10 + i * 12} size={0.8 + Math.random() * 0.6} emoji={emoji} />
        ))}

        {/* Soft background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Floating paw prints */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`paw-${i}`}
            style={{ position: 'absolute', left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%`, color: 'rgba(249,115,22,0.06)', pointerEvents: 'none' }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            <PawPrint style={{ width: 30 + i * 6, height: 30 + i * 6 }} />
          </motion.div>
        ))}
      </div>

      {/* ── Main Content: Wheel Left / Info Right ───────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '4rem', flexWrap: 'wrap',
        padding: '3rem 0',
      }}>

        {/* ── LEFT SIDE: Spin Wheel ──────────────────────────── */}
        <div style={{ position: 'relative', width: 380, height: 380, flexShrink: 0 }}>
          {/* Outer glow ring */}
          <motion.div
            animate={celebrating ? { scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.2 }}
            transition={celebrating ? { duration: 0.6, repeat: Infinity } : {}}
            style={{
              position: 'absolute', inset: -20,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(249,115,22,0.15), rgba(14,165,233,0.15), rgba(168,85,247,0.15), rgba(249,115,22,0.15))',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />

          {/* Glassmorphism ring */}
          <div style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08), inset 0 0 30px rgba(255,255,255,0.3)',
          }} />

          {/* The Wheel SVG */}
          <motion.div
            animate={wheelControls}
            style={{
              width: '100%', height: '100%',
              position: 'relative',
              transformOrigin: 'center center',
            }}
          >
            <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))' }}>
              <defs>
                {segments.map((seg, i) => (
                  <linearGradient key={`grad-${i}`} id={`segGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={seg.lightColor} />
                    <stop offset="100%" stopColor={seg.color} stopOpacity="0.3" />
                  </linearGradient>
                ))}
              </defs>

              {/* Wheel segments */}
              {segments.map((seg, i) => {
                const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const x1 = 200 + 190 * Math.cos(startAngle);
                const y1 = 200 + 190 * Math.sin(startAngle);
                const x2 = 200 + 190 * Math.cos(endAngle);
                const y2 = 200 + 190 * Math.sin(endAngle);
                const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const labelR = 130;
                const iconR = 100;
                const lx = 200 + labelR * Math.cos(midAngle);
                const ly = 200 + labelR * Math.sin(midAngle);
                const ix = 200 + iconR * Math.cos(midAngle);
                const iy = 200 + iconR * Math.sin(midAngle);
                const textRotation = i * SEGMENT_ANGLE;

                return (
                  <g key={i}>
                    <path
                      d={`M200,200 L${x1},${y1} A190,190 0 ${largeArc},1 ${x2},${y2} Z`}
                      fill={`url(#segGrad-${i})`}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2"
                    />
                    {/* Icon */}
                    <text x={ix} y={iy} textAnchor="middle" dominantBaseline="central" fontSize="22" transform={`rotate(${textRotation}, ${ix}, ${iy})`}>
                      {seg.icon}
                    </text>
                    {/* Label */}
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="800" fill={seg.color} transform={`rotate(${textRotation}, ${lx}, ${ly})`} style={{ letterSpacing: '0.03em' }}>
                      {seg.label}
                    </text>
                  </g>
                );
              })}

              {/* Center circle */}
              <circle cx="200" cy="200" r="40" fill="#fff" stroke="rgba(249,115,22,0.2)" strokeWidth="3" filter="url(#centerShadow)" />
              <defs>
                <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="rgba(0,0,0,0.08)" />
                </filter>
              </defs>

              {/* Center paw */}
              <g transform="translate(188, 186) scale(1)">
                <PawPrint style={{ color: '#f97316' }} />
              </g>
            </svg>
          </motion.div>

          {/* Pointer (top indicator) */}
          <div style={{
            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          }}>
            <svg width="28" height="36" viewBox="0 0 28 36">
              <path d="M14 36 L2 8 Q0 2 6 0 L22 0 Q28 2 26 8 Z" fill="#f97316" />
              <path d="M14 36 L2 8 Q0 2 6 0 L22 0 Q28 2 26 8 Z" fill="url(#pointerGrad)" />
              <defs>
                <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating paw prints around wheel */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const r = 220;
            const rad = (angle - 90) * (Math.PI / 180);
            const px = 190 + r * Math.cos(rad);
            const py = 190 + r * Math.sin(rad);
            return (
              <motion.div
                key={`fp-${i}`}
                style={{ position: 'absolute', left: px, top: py, color: 'rgba(249,115,22,0.12)', pointerEvents: 'none' }}
                animate={{ y: [0, -8, 0], scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              >
                <PawPrint />
              </motion.div>
            );
          })}
        </div>

        {/* ── RIGHT SIDE: Info Panel ──────────────────────────── */}
        <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>
              🎰 Spin & Win
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
              Lucky Paw Rewards
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#8a7e72', lineHeight: 1.6, marginTop: '0.5rem' }}>
              Earn points through every purchase and unlock exciting rewards, exclusive discounts, free gifts, and bonus surprises.
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Points */}
            <div style={{
              background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
              borderRadius: 20, padding: '1.25rem',
              border: '1px solid rgba(249,115,22,0.1)',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Points
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', marginTop: '0.25rem' }}>
                {totalPoints.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8a7e72' }}>🪙 PawCoins</span>
            </div>

            {/* Spins */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: 20, padding: '1.25rem',
              border: '1px solid rgba(14,165,233,0.1)',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Spins Left
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', marginTop: '0.25rem' }}>
                {spinsLeft}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8a7e72' }}>🎯 Available</span>
            </div>
          </div>

          {/* Progress to next spin */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '1.25rem',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2d2418' }}>Progress to Next Spin</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f97316' }}>{progressToNextSpin}%</span>
            </div>
            <div style={{ width: '100%', height: 8, borderRadius: 99, background: '#f0ebe4', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextSpin}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #f97316, #f59e0b)' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#8a7e72' }}>🐾 280 more points needed</span>
              <span style={{ fontSize: '0.68rem', color: '#8a7e72' }}>1,000 pts</span>
            </div>
          </div>

          {/* Reward Examples */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {segments.slice(0, 4).map((seg, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.8rem', borderRadius: 12,
                background: seg.lightColor, border: `1px solid ${seg.color}22`,
                fontSize: '0.72rem', fontWeight: 700, color: seg.color,
              }}>
                <span>{seg.icon}</span>
                {seg.label}
              </div>
            ))}
          </div>

          {/* Spin Button */}
          <motion.button
            onClick={handleSpin}
            disabled={isSpinning || spinsLeft <= 0}
            whileHover={!isSpinning && spinsLeft > 0 ? { scale: 1.03, y: -2 } : {}}
            whileTap={!isSpinning && spinsLeft > 0 ? { scale: 0.97 } : {}}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              borderRadius: 9999,
              border: 'none',
              background: isSpinning
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : spinsLeft <= 0
                  ? 'linear-gradient(135deg, #d1d5db, #9ca3af)'
                  : 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: isSpinning || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
              boxShadow: isSpinning || spinsLeft <= 0
                ? '0 4px 16px rgba(0,0,0,0.08)'
                : '0 8px 30px rgba(249,115,22,0.35)',
              letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {isSpinning ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  🎡
                </motion.span>
                Spinning...
              </>
            ) : spinsLeft <= 0 ? (
              '🔒 No Spins Available'
            ) : (
              <>🐾 Spin the Wheel!</>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Reward Reveal Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showReward && wonSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowReward(false)}
          >
            {/* Celebration Particles */}
            {celebrating && [...Array(12)].map((_, i) => (
              <motion.div
                key={`cel-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                style={{ position: 'absolute', fontSize: '1.5rem', pointerEvents: 'none' }}
              >
                {['🎉', '⭐', '🪙', '🐾', '✨', '🎁'][i % 6]}
              </motion.div>
            ))}

            {/* Reward Card */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 32,
                padding: '3rem 2.5rem',
                textAlign: 'center',
                maxWidth: 380,
                width: '90%',
                boxShadow: `0 30px 80px rgba(0,0,0,0.15), 0 0 60px ${wonSegment.color}33`,
                border: `2px solid ${wonSegment.color}22`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background glow */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 30%, ${wonSegment.lightColor} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '4rem', marginBottom: '1rem' }}
                >
                  {wonSegment.icon}
                </motion.div>

                {/* Congrats */}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: wonSegment.color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  🎉 Congratulations!
                </span>

                {/* Value */}
                <h3 style={{
                  fontSize: '2.2rem', fontWeight: 900, color: '#2d2418',
                  fontFamily: 'var(--font-display)', margin: '0.5rem 0 0.25rem',
                  letterSpacing: '-0.02em',
                }}>
                  {wonSegment.value}
                </h3>

                {/* Label */}
                <p style={{ fontSize: '0.9rem', color: '#8a7e72', marginBottom: '1.5rem' }}>
                  {wonSegment.label} has been added to your account!
                </p>

                {/* Action */}
                <button
                  onClick={() => setShowReward(false)}
                  style={{
                    padding: '0.75rem 2rem', borderRadius: 9999,
                    border: 'none', background: wonSegment.color, color: '#fff',
                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    boxShadow: `0 8px 25px ${wonSegment.color}40`,
                  }}
                >
                  Claim Reward 🐾
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
