import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Star, Gift, Zap, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { api } from '../../api';

interface PrizeSegment {
  type: string;
  label: string;
  value?: number;
  probability: number;
}

interface MappedSegment {
  label: string;
  type: string;
  value?: number;
  color: string;
  lightColor: string;
  icon: string;
  textColor: string;
}

const SEGMENT_COLORS = [
  '#f97316', // Orange
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Yellow
  '#10b981', // Teal
  '#8a7e72', // Slate/Charcoal
];

const getPrizeStyle = (type: string, index: number) => {
  const styles: Record<string, { color: string; lightColor: string; icon: string }> = {
    points: { color: '#f59e0b', lightColor: '#fef3c7', icon: '🌟' },
    coupon: { color: '#22c55e', lightColor: '#dcfce7', icon: '🏷️' },
    free_shipping: { color: '#0ea5e9', lightColor: '#e0f2fe', icon: '🚚' },
    gift: { color: '#ec4899', lightColor: '#fce7f3', icon: '🎁' },
    no_prize: { color: '#8a7e72', lightColor: '#f3f4f6', icon: '🐾' }
  };
  return styles[type] || {
    color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
    lightColor: '#f3e8ff',
    icon: '✨'
  };
};

/* ── Floating Particle Component ────────────────────────────── */
const FloatingParticle = ({ delay, x, size, emoji }: { delay: number; x: number; size: number; emoji: string }) => (
  <motion.div
    style={{ position: 'absolute', left: `${x}%`, bottom: '-20px', fontSize: `${size}rem`, pointerEvents: 'none', zIndex: 0 }}
    animate={{
      y: [0, -400 - Math.random() * 200],
      x: [0, (Math.random() - 0.5) * 60],
      opacity: [0, 1, 1, 0],
      rotate: [0, (Math.random() - 0.5) * 60],
    }}
    transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeOut' }}
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

export default function SpinWheel() {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [segments, setSegments] = useState<MappedSegment[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonSegment, setWonSegment] = useState<MappedSegment | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [history, setHistory] = useState<{ label: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRotation, setCurrentRotation] = useState(0);

  const wheelControls = useAnimation();
  const totalSpins = user?.totalSpins || 0;

  // Load configuration and history
  useEffect(() => {
    const loadConfigAndHistory = async () => {
      try {
        setLoading(true);
        // 1. Fetch Wheel Config
        const configRes = await api.get('/points/config');
        if (configRes.data?.success) {
          const rawSegments = configRes.data.data || [];
          const mapped = rawSegments.map((seg: PrizeSegment, idx: number) => {
            const style = getPrizeStyle(seg.type, idx);
            return {
              label: seg.label,
              type: seg.type,
              value: seg.value,
              color: style.color,
              lightColor: style.lightColor,
              icon: style.icon,
              textColor: '#ffffff'
            };
          });
          setSegments(mapped);
        }

        // 2. Fetch Spin History
        const historyRes = await api.get('/points/spin/history');
        if (historyRes.data?.success) {
          const rawHistory = historyRes.data.data || [];
          const mappedHistory = rawHistory.map((h: any) => ({
            label: h.description,
            time: new Date(h.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }));
          setHistory(mappedHistory);
        }
      } catch (err) {
        console.error('Failed to load spin wheel details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfigAndHistory();

    // Sync latest balance/spin count from server on mount
    api.get('/points/balance').then(res => {
      if (res.data?.success && res.data.data) {
        updateUser({
          pointsBalance: res.data.data.pointsBalance || 0,
          totalSpins: res.data.data.totalSpins || 0,
        });
      }
    }).catch(() => { });
  }, []);

  /* ── Idle rotation ────────────────────────────────────────── */
  useEffect(() => {
    if (segments.length > 0 && !isSpinning && !showReward) {
      wheelControls.start({
        rotate: [currentRotation, currentRotation + 360],
        transition: { duration: 45, repeat: Infinity, ease: 'linear' },
      });
    }
  }, [segments, isSpinning, showReward, currentRotation]);

  const handleSpin = async () => {
    if (totalSpins <= 0 || isSpinning || segments.length === 0) return;
    setIsSpinning(true);
    setShowReward(false);
    setWonSegment(null);
    setCelebrating(false);

    try {
      const response = await api.post('/points/spin');
      if (response.data?.success) {
        const { prizeType, pointsAwarded, description } = response.data.data;

        // Find winning segment index
        const targetIndex = segments.findIndex(seg => seg.label === description);
        const winIndex = targetIndex >= 0 ? targetIndex : 0;

        const SEGMENT_ANGLE = 360 / segments.length;
        const extraRotations = 6 + Math.floor(Math.random() * 3); // 6-8 rotations
        const targetAngle = extraRotations * 360 + (360 - winIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
        const finalRotation = currentRotation + targetAngle;

        wheelControls.start({
          rotate: finalRotation,
          transition: {
            duration: 5,
            ease: [0.15, 0.85, 0.25, 1],
          },
        }).then(() => {
          setCurrentRotation(finalRotation % 360);
          setIsSpinning(false);
          const won = segments[winIndex];
          setWonSegment(won);

          if (prizeType !== 'no_prize') {
            addToast(`Congratulations! You won ${description}! 🐾`, 'success');
            setHistory(prev => [
              {
                label: description,
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              },
              ...prev.slice(0, 4)
            ]);
          } else {
            addToast('Better luck next time! 🐾', 'info');
          }

          // Show reward card after a beat
          setTimeout(() => {
            setShowReward(true);
            setCelebrating(true);
            setTimeout(() => setCelebrating(false), 3000);
          }, 400);

          // Sync user's global points and spin limits in auth store
          if (user) {
            updateUser({
              pointsBalance: user.pointsBalance + pointsAwarded,
              totalSpins: Math.max(0, user.totalSpins - 1)
            });
          }
        });
      } else {
        addToast(response.data?.message || 'Failed to complete spin', 'error');
        setIsSpinning(false);
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error occurred while spinning', 'error');
      setIsSpinning(false);
    }
  };

  const s = {
    title: { fontSize: '1.75rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.85rem', color: '#8a7e72', marginBottom: '2rem' } as React.CSSProperties,
    layout: { display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' as const, justifyContent: 'center' } as React.CSSProperties,
    wheelSection: {
      backgroundColor: '#ffffff', borderRadius: '32px',
      border: '1px solid #e5ddd4', padding: '2.5rem 2rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '2rem',
      position: 'relative' as const, overflow: 'hidden' as const,
      width: '380px', flexShrink: 0
    } as React.CSSProperties,
    wheelWrap: { position: 'relative' as const, width: '280px', height: '280px', flexShrink: 0 } as React.CSSProperties,
    rightPanel: { display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', flex: '1 1 300px', maxWidth: '420px' } as React.CSSProperties,
    infoCard: {
      backgroundColor: '#ffffff', borderRadius: '24px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    } as React.CSSProperties,
    infoHeader: {
      padding: '1rem 1.5rem', borderBottom: '1px solid #f0ebe4',
      fontSize: '0.78rem', fontWeight: 800, color: '#8a7e72',
      textTransform: 'uppercase' as const, letterSpacing: '0.08em', backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    prizeRow: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.875rem 1.5rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
    prizeDot: (color: string) => ({
      width: '10px', height: '10px', borderRadius: '50%',
      backgroundColor: color, flexShrink: 0,
    } as React.CSSProperties),
    prizeLabel: { fontSize: '0.85rem', color: '#2d2418', fontWeight: 600 } as React.CSSProperties,
    histItem: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.875rem 1.5rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <h1 style={s.title}>Daily Spin Wheel</h1>
      <p style={s.subtitle}>Spin once every 24 hours to win exciting prizes!</p>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={s.layout}>
          {/* Wheel Card */}
          <div style={s.wheelSection}>
            {/* Floating particles inside card */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
              {['✨', '🐾', '🪙', '✨', '🐾'].map((emoji, i) => (
                <FloatingParticle key={i} delay={i * 1.5} x={5 + i * 22} size={0.6 + Math.random() * 0.4} emoji={emoji} />
              ))}
            </div>

            <div style={{ ...s.wheelWrap, zIndex: 1 }}>
              {/* Conic Glow */}
              <motion.div
                animate={celebrating ? { scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] } : { scale: 1, opacity: 0.25 }}
                transition={celebrating ? { duration: 0.6, repeat: Infinity } : {}}
                style={{
                  position: 'absolute', inset: -15,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, rgba(249,115,22,0.15), rgba(14,165,233,0.15), rgba(168,85,247,0.15), rgba(249,115,22,0.15))',
                  filter: 'blur(15px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Glassmorphism ring */}
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255,255,255,0.4)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.2)',
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
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.08))' }}>
                  <defs>
                    {segments.map((seg, i) => (
                      <linearGradient key={`grad-${i}`} id={`segGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={seg.lightColor} />
                        <stop offset="100%" stopColor={seg.color} stopOpacity="0.25" />
                      </linearGradient>
                    ))}
                    <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.08)" />
                    </filter>
                  </defs>

                  {/* Wheel segments */}
                  {segments.map((seg, i) => {
                    const SEGMENT_ANGLE = 360 / segments.length;
                    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                    const x1 = 200 + 190 * Math.cos(startAngle);
                    const y1 = 200 + 190 * Math.sin(startAngle);
                    const x2 = 200 + 190 * Math.cos(endAngle);
                    const y2 = 200 + 190 * Math.sin(endAngle);
                    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                    const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                    const labelR = 115;
                    const lx = 200 + labelR * Math.cos(midAngle);
                    const ly = 200 + labelR * Math.sin(midAngle);
                    const textRotation = i * SEGMENT_ANGLE;

                    return (
                      <g key={i}>
                        <path
                          d={`M200,200 L${x1},${y1} A190,190 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={`url(#segGrad-${i})`}
                          stroke="rgba(255,255,255,0.7)"
                          strokeWidth="2"
                        />
                        {/* Label */}
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="900" fill={seg.color} transform={`rotate(${textRotation}, ${lx}, ${ly})`} style={{ letterSpacing: '0.02em' }}>
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center circle */}
                  <circle cx="200" cy="200" r="38" fill="#fff" stroke="rgba(249,115,22,0.15)" strokeWidth="3" filter="url(#centerShadow)" />

                  {/* Center paw */}
                  <g transform="translate(188, 186) scale(1)">
                    <PawPrint style={{ color: '#f97316' }} />
                  </g>
                </svg>
              </motion.div>

              {/* Pointer (top indicator) */}
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                zIndex: 10, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
              }}>
                <svg width="24" height="30" viewBox="0 0 28 36">
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
            </div>

            {/* Spin button / attempt status */}
            <div style={{ zIndex: 1, width: '100%', textAlign: 'center' }}>
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning || totalSpins <= 0}
                whileHover={!isSpinning && totalSpins > 0 ? { scale: 1.03, y: -2 } : {}}
                whileTap={!isSpinning && totalSpins > 0 ? { scale: 0.97 } : {}}
                style={{
                  width: '100%',
                  padding: '0.875rem 2rem',
                  borderRadius: '99px',
                  border: 'none',
                  background: isSpinning
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : totalSpins <= 0
                      ? 'linear-gradient(135deg, #d1d5db, #9ca3af)'
                      : 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: isSpinning || totalSpins <= 0 ? 'not-allowed' : 'pointer',
                  boxShadow: isSpinning || totalSpins <= 0
                    ? '0 4px 16px rgba(0,0,0,0.06)'
                    : '0 6px 20px rgba(249,115,22,0.3)',
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
                ) : totalSpins <= 0 ? (
                  '🔒 No Spins Available'
                ) : (
                  <><Zap size={16} /> SPIN ({totalSpins} Left)</>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right Panel */}
          <div style={s.rightPanel}>
            {/* Prizes list */}
            <div style={s.infoCard}>
              <div style={s.infoHeader}>Possible Prizes</div>
              {segments.map((seg, i) => (
                <div key={i} style={s.prizeRow}>
                  <div style={s.prizeDot(seg.color)} />
                  <Star size={12} color="#f97316" fill={!seg.label.toLowerCase().includes('better luck') ? '#f97316' : 'none'} />
                  <span style={s.prizeLabel}>{seg.label}</span>
                </div>
              ))}
            </div>

            {/* Spin history */}
            {history.length > 0 && (
              <div style={s.infoCard}>
                <div style={s.infoHeader}>Recent Wins</div>
                {history.map((h, i) => (
                  <div key={i} style={s.histItem}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Gift size={14} color="#f97316" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#2d2418' }}>{h.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#8a7e72' }}>Won at {h.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rules */}
            <div style={{ ...s.infoCard, padding: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2d2418', marginBottom: '0.75rem', fontFamily: "'Nunito', sans-serif" }}>
                How it works
              </div>
              {[
                'Earn spins by placing orders',
                'Prizes are credited automatically',
                'Points expire after 365 days',
                'Vouchers are added directly to your Coupons page',
              ].map(rule => (
                <div key={rule} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#8a7e72', marginBottom: '0.5rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <Star size={9} fill="#f97316" color="#f97316" />
                  </div>
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
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
                borderRadius: 28,
                padding: '2.5rem 2rem',
                textAlign: 'center',
                maxWidth: 360,
                width: '90%',
                boxShadow: `0 20px 60px rgba(0,0,0,0.12), 0 0 40px ${wonSegment.color}25`,
                border: `2px solid ${wonSegment.color}15`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 30%, ${wonSegment.lightColor} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}
                >
                  {wonSegment.icon}
                </motion.div>

                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: wonSegment.color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  🎉 Congratulations!
                </span>

                <h3 style={{
                  fontSize: '1.8rem', fontWeight: 900, color: '#2d2418',
                  margin: '0.5rem 0 0.25rem',
                  letterSpacing: '-0.01em',
                }}>
                  {wonSegment.label}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#8a7e72', marginBottom: '1.5rem' }}>
                  {wonSegment.type === 'no_prize' ? 'Hope you enjoyed the spin! Play again soon.' : `${wonSegment.label} has been added to your account!`}
                </p>

                <button
                  onClick={() => setShowReward(false)}
                  style={{
                    padding: '0.65rem 1.75rem', borderRadius: '99px',
                    border: 'none', background: wonSegment.color, color: '#fff',
                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    boxShadow: `0 6px 20px ${wonSegment.color}30`,
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
