import { useState, useEffect, useRef } from 'react';
import { Star, Gift, Zap, RotateCcw, Clock } from 'lucide-react';

const SEGMENTS = [
  { label: '50 pts',    color: '#f97316', textColor: '#fff' },
  { label: '₹30 OFF',  color: '#22c55e', textColor: '#fff' },
  { label: '100 pts',  color: '#3b82f6', textColor: '#fff' },
  { label: 'Try Again', color: '#94a3b8', textColor: '#fff' },
  { label: '200 pts',  color: '#a855f7', textColor: '#fff' },
  { label: 'Free Ship', color: '#f59e0b', textColor: '#fff' },
  { label: '25 pts',   color: '#ec4899', textColor: '#fff' },
  { label: '₹50 OFF',  color: '#10b981', textColor: '#fff' },
];

const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [history, setHistory] = useState<{ label: string; time: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const currentRotRef = useRef(0);

  // Draw the wheel on canvas
  useEffect(() => {
    drawWheel(currentRotRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer ring shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    SEGMENTS.forEach((seg, i) => {
      const startAngle = ((i * SEG_ANGLE - 90) * Math.PI) / 180 + (rot * Math.PI) / 180;
      const endAngle = startAngle + (SEG_ANGLE * Math.PI) / 180;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + (SEG_ANGLE * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.textColor;
      ctx.font = `bold ${r > 140 ? 13 : 11}px 'Nunito', sans-serif`;
      ctx.fillText(seg.label, r - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(1, '#ea580c');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center paw icon (simplified circles)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(cx, cy - 8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 7, cy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 7, cy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy + 4, 6, 0, Math.PI * 2); ctx.fill();
  };

  const handleSpin = () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 4); // 5–8 full rotations
    const targetSegment = Math.floor(Math.random() * SEG_COUNT);
    const targetAngle = 360 - (targetSegment * SEG_ANGLE + SEG_ANGLE / 2);
    const totalRotation = extraSpins * 360 + targetAngle;

    const startTime = performance.now();
    const duration = 4500; // ms
    const startRot = currentRotRef.current % 360;
    const endRot = startRot + totalRotation;

    // Ease out cubic
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOut(t);
      const currentAngle = startRot + (endRot - startRot) * easedT;
      currentRotRef.current = currentAngle;
      drawWheel(currentAngle);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const prize = SEGMENTS[targetSegment].label;
        setResult(prize);
        if (prize !== 'Try Again') {
          setHistory(prev => [{ label: prize, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...prev.slice(0, 4)]);
        }
        setCanSpin(false);
        // 24h cooldown simulation (24 seconds in demo)
        let secs = 24;
        setCountdown(secs);
        const interval = setInterval(() => {
          secs -= 1;
          setCountdown(secs);
          if (secs <= 0) {
            clearInterval(interval);
            setCanSpin(true);
            setCountdown(0);
          }
        }, 1000);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  const s = {
    title: { fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.82rem', color: '#8a7e72', marginBottom: '1.5rem' } as React.CSSProperties,
    layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' } as React.CSSProperties,
    // Wheel section
    wheelSection: {
      backgroundColor: '#ffffff', borderRadius: '24px',
      border: '1px solid #e5ddd4', padding: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1.5rem',
    } as React.CSSProperties,
    wheelWrap: { position: 'relative' as const, display: 'inline-block' } as React.CSSProperties,
    // Pointer
    pointer: {
      position: 'absolute' as const, top: '-14px', left: '50%', transform: 'translateX(-50%)',
      width: 0, height: 0,
      borderLeft: '12px solid transparent', borderRight: '12px solid transparent',
      borderTop: '26px solid #f97316',
      filter: 'drop-shadow(0 4px 8px rgba(249,115,22,0.5))',
      zIndex: 10,
    } as React.CSSProperties,
    spinBtn: (active: boolean) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.875rem 2.5rem', borderRadius: '99px',
      background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#e5ddd4',
      color: active ? '#ffffff' : '#b0a99f',
      fontWeight: 900, fontSize: '1rem', fontFamily: "'Nunito', sans-serif",
      border: 'none', cursor: active ? 'pointer' : 'not-allowed',
      boxShadow: active ? '0 6px 20px rgba(249,115,22,0.35)' : 'none',
      transition: 'all 0.3s',
    } as React.CSSProperties),
    resultBanner: {
      padding: '1.25rem 2rem', borderRadius: '16px', textAlign: 'center' as const,
      background: 'linear-gradient(135deg, #fff7ed, #fff1e6)',
      border: '1px solid #fed7aa', width: '100%', boxSizing: 'border-box' as const,
    } as React.CSSProperties,
    countdown: {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.75rem 1.25rem', borderRadius: '12px',
      backgroundColor: '#f7f2ec', border: '1px solid #e5ddd4',
      fontSize: '0.82rem', color: '#8a7e72', fontWeight: 600,
    } as React.CSSProperties,
    // Right panel
    rightPanel: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' } as React.CSSProperties,
    infoCard: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    } as React.CSSProperties,
    infoHeader: {
      padding: '0.875rem 1.25rem', borderBottom: '1px solid #f0ebe4',
      fontSize: '0.8rem', fontWeight: 700, color: '#8a7e72',
      textTransform: 'uppercase' as const, letterSpacing: '0.08em', backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    prizeRow: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1.25rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
    prizeDot: (color: string) => ({
      width: '12px', height: '12px', borderRadius: '50%',
      backgroundColor: color, flexShrink: 0,
    } as React.CSSProperties),
    prizeLabel: { fontSize: '0.83rem', color: '#2d2418', fontWeight: 500 } as React.CSSProperties,
    histItem: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1.25rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
  };

  return (
    <div>
      <h1 style={s.title}>Daily Spin Wheel</h1>
      <p style={s.subtitle}>Spin once every 24 hours to win exciting prizes!</p>

      <div style={s.layout}>
        {/* Wheel */}
        <div style={s.wheelSection}>
          <div style={s.wheelWrap}>
            <div style={s.pointer} />
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              style={{ borderRadius: '50%', display: 'block' }}
            />
          </div>

          {/* Result */}
          {result && (
            <div style={s.resultBanner}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>
                {result === 'Try Again' ? '😔' : '🎉'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>
                {result === 'Try Again' ? 'Better luck next time!' : `You won ${result}!`}
              </div>
              {result !== 'Try Again' && (
                <div style={{ fontSize: '0.78rem', color: '#8a7e72', marginTop: '0.25rem' }}>
                  Prize added to your account automatically
                </div>
              )}
            </div>
          )}

          {/* Spin button / countdown */}
          {canSpin ? (
            <button style={s.spinBtn(!spinning)} onClick={handleSpin} disabled={spinning}>
              {spinning ? <><RotateCcw size={18} style={{ animation: 'spin 0.6s linear infinite' }} /> Spinning...</> : <><Zap size={18} /> SPIN NOW</>}
            </button>
          ) : (
            <div style={s.countdown}>
              <Clock size={14} />
              {countdown > 0
                ? `Next spin in ${countdown}s (demo)`
                : 'You can spin again!'
              }
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          {/* Prizes list */}
          <div style={s.infoCard}>
            <div style={s.infoHeader}>Possible Prizes</div>
            {SEGMENTS.map((seg, i) => (
              <div key={i} style={s.prizeRow}>
                <div style={s.prizeDot(seg.color)} />
                <Star size={12} color="#f97316" fill={seg.label !== 'Try Again' ? '#f97316' : 'none'} />
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
              '1 free spin every 24 hours',
              'Prizes are credited automatically',
              'Points expire after 365 days',
              'Discounts valid for 7 days',
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
