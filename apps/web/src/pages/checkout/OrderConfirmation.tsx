import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Clock, ArrowRight, Star, Share2, Download, Home } from 'lucide-react';

// Generate a short order ID
const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'PAW';
  const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}${rand}`;
};

const ESTIMATED_DATE = () => {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
};

const ORDER_STEPS = [
  { label: 'Order Placed', icon: CheckCircle, done: true },
  { label: 'Processing', icon: Package, done: false },
  { label: 'Out for Delivery', icon: MapPin, done: false },
  { label: 'Delivered', icon: CheckCircle, done: false },
];

export default function OrderConfirmation() {
  const [orderId] = useState(generateOrderId);
  const [deliveryDate] = useState(ESTIMATED_DATE);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    setTimeout(() => setAnimIn(true), 100);
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowConfetti(false), 3500);
  }, []);

  // ── Confetti particles ──────────────────────────
  const confettiColors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b'];
  const confettiItems = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 8}px`,
    duration: `${2 + Math.random() * 1.5}s`,
    rotate: `${Math.random() * 360}deg`,
  }));

  // ── Styles ──────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f2ec',
      paddingTop: '3rem',
      paddingBottom: '5rem',
      position: 'relative' as const,
      overflow: 'hidden',
    } as React.CSSProperties,
    container: {
      width: '100%',
      maxWidth: '760px',
      margin: '0 auto',
      padding: '0 1.5rem',
    } as React.CSSProperties,
    // Success card
    successCard: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e5ddd4',
      boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transform: animIn ? 'translateY(0)' : 'translateY(30px)',
      opacity: animIn ? 1 : 0,
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    } as React.CSSProperties,
    successHeader: {
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
      padding: '3rem 2rem 2rem',
      textAlign: 'center' as const,
      position: 'relative' as const,
    } as React.CSSProperties,
    checkCircleWrap: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: '3px solid rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.25rem',
      backdropFilter: 'blur(8px)',
    } as React.CSSProperties,
    successTitle: {
      fontSize: '1.75rem',
      fontWeight: 900,
      color: '#ffffff',
      fontFamily: "'Nunito', sans-serif",
      marginBottom: '0.375rem',
    } as React.CSSProperties,
    successDesc: {
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.85)',
    } as React.CSSProperties,
    // Order ID badge
    orderIdBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 1rem',
      borderRadius: '99px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#ffffff',
      fontSize: '0.82rem',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      marginTop: '1rem',
    } as React.CSSProperties,
    // Content
    cardBody: {
      padding: '2rem',
    } as React.CSSProperties,
    // Order tracking
    trackingSection: {
      marginBottom: '2rem',
    } as React.CSSProperties,
    trackingTitle: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      marginBottom: '1.25rem',
    } as React.CSSProperties,
    trackingSteps: {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
    } as React.CSSProperties,
    // Delivery info cards
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '2rem',
    } as React.CSSProperties,
    infoCard: {
      padding: '1.25rem',
      borderRadius: '16px',
      border: '1px solid #e5ddd4',
      backgroundColor: '#f7f2ec',
    } as React.CSSProperties,
    infoCardIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.75rem',
    } as React.CSSProperties,
    infoCardLabel: {
      fontSize: '0.72rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      marginBottom: '0.25rem',
    } as React.CSSProperties,
    infoCardValue: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    // Promo section
    promoSection: {
      padding: '1.25rem',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #fff7ed, #fff1e6)',
      border: '1px solid #fed7aa',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    } as React.CSSProperties,
    // Actions
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1rem',
    } as React.CSSProperties,
    primaryBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.875rem 1.5rem',
      borderRadius: '9999px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '0.9rem',
      fontFamily: "'Nunito', sans-serif",
      textDecoration: 'none',
      boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
      transition: 'all 0.25s',
      border: 'none',
      cursor: 'pointer',
    } as React.CSSProperties,
    secondaryBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.875rem 1.5rem',
      borderRadius: '9999px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
      color: '#8a7e72',
      fontWeight: 700,
      fontSize: '0.9rem',
      fontFamily: "'Nunito', sans-serif",
      textDecoration: 'none',
      transition: 'all 0.25s',
      cursor: 'pointer',
    } as React.CSSProperties,
    // Rating prompt
    ratingSection: {
      textAlign: 'center' as const,
      paddingTop: '1.25rem',
      borderTop: '1px solid #f0ebe4',
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {confettiItems.map(c => (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                top: '-10px',
                left: c.left,
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
                borderRadius: '2px',
                animation: `confettiFall ${c.duration} ${c.delay} ease-in forwards`,
                transform: `rotate(${c.rotate})`,
              }}
            />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <div style={s.container}>
        <div style={s.successCard}>
          {/* Header */}
          <div style={s.successHeader}>
            <div style={s.checkCircleWrap}>
              <CheckCircle size={40} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h1 style={s.successTitle}>Order Confirmed! 🎉</h1>
            <p style={s.successDesc}>Thank you! Your furry friend's goodies are on their way.</p>
            <div style={s.orderIdBadge}>
              <Package size={13} /> {orderId}
            </div>
          </div>

          {/* Body */}
          <div style={s.cardBody}>
            {/* Tracking steps */}
            <div style={s.trackingSection}>
              <div style={s.trackingTitle}>Order Tracking</div>
              <div style={s.trackingSteps}>
                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isFirst = idx === 0;
                  const isActive = idx === 0;
                  return (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '50%',
                          background: isFirst ? 'linear-gradient(135deg, #f97316, #ea580c)' :
                            step.done ? '#22c55e' : '#e5ddd4',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: (isFirst || step.done) ? '#ffffff' : '#b0a99f',
                          boxShadow: isActive ? '0 4px 16px rgba(249,115,22,0.4)' : 'none',
                          transition: 'all 0.3s',
                          position: 'relative' as const,
                        }}>
                          <Icon size={18} />
                          {isActive && (
                            <div style={{
                              position: 'absolute', inset: '-4px', borderRadius: '50%',
                              border: '2px solid #f97316', opacity: 0.3,
                              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                            }} />
                          )}
                        </div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700,
                          color: isFirst ? '#f97316' : '#8a7e72',
                          textAlign: 'center' as const,
                          whiteSpace: 'nowrap' as const,
                        }}>{step.label}</span>
                      </div>
                      {idx < ORDER_STEPS.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: '2px',
                          background: idx === 0 ? 'linear-gradient(90deg, #f97316, #e5ddd4)' : '#e5ddd4',
                          margin: '0 0.5rem',
                          marginBottom: '1.5rem',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info grid */}
            <div style={s.infoGrid}>
              <div style={s.infoCard}>
                <div style={{ ...s.infoCardIcon, backgroundColor: '#fff7ed' }}>
                  <Clock size={18} color="#f97316" />
                </div>
                <div style={s.infoCardLabel}>Estimated Delivery</div>
                <div style={s.infoCardValue}>{deliveryDate}</div>
                <div style={{ fontSize: '0.73rem', color: '#8a7e72', marginTop: '0.25rem' }}>2–5 business days</div>
              </div>
              <div style={s.infoCard}>
                <div style={{ ...s.infoCardIcon, backgroundColor: '#f0fdf4' }}>
                  <MapPin size={18} color="#22c55e" />
                </div>
                <div style={s.infoCardLabel}>Delivery To</div>
                <div style={s.infoCardValue}>Your saved address</div>
                <div style={{ fontSize: '0.73rem', color: '#8a7e72', marginTop: '0.25rem' }}>SMS tracking link sent</div>
              </div>
              <div style={s.infoCard}>
                <div style={{ ...s.infoCardIcon, backgroundColor: '#eff6ff' }}>
                  <Package size={18} color="#3b82f6" />
                </div>
                <div style={s.infoCardLabel}>Order ID</div>
                <div style={{ ...s.infoCardValue, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{orderId}</div>
                <div style={{ fontSize: '0.73rem', color: '#8a7e72', marginTop: '0.25rem' }}>Keep this for reference</div>
              </div>
              <div style={s.infoCard}>
                <div style={{ ...s.infoCardIcon, backgroundColor: '#fdf4ff' }}>
                  <Share2 size={18} color="#a855f7" />
                </div>
                <div style={s.infoCardLabel}>Tracking</div>
                <div style={s.infoCardValue}>Via SMS & Email</div>
                <div style={{ fontSize: '0.73rem', color: '#8a7e72', marginTop: '0.25rem' }}>Real-time updates</div>
              </div>
            </div>

            {/* Promo / loyalty section */}
            <div style={s.promoSection}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={20} color="#fff" fill="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' }}>
                  You earned 250 PawPoints!
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8a7e72' }}>
                  Redeem on your next purchase for extra savings.
                </div>
              </div>
              <Link to="/dashboard/points" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f97316', textDecoration: 'none', flexShrink: 0 }}>
                View Points →
              </Link>
            </div>

            {/* Action buttons */}
            <div style={s.actionsGrid}>
              <Link to="/products" style={s.primaryBtn}>
                <Package size={16} /> Continue Shopping <ArrowRight size={15} />
              </Link>
              <Link to="/dashboard/orders" style={s.secondaryBtn}>
                <Download size={15} /> View Orders
              </Link>
            </div>
            <Link to="/" style={{ ...s.secondaryBtn, justifyContent: 'center', width: '100%', display: 'flex' }}>
              <Home size={15} /> Back to Home
            </Link>

            {/* Rate experience */}
            <div style={s.ratingSection}>
              <div style={{ fontSize: '0.82rem', color: '#8a7e72', marginBottom: '0.625rem' }}>How was your shopping experience?</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Star size={24} color="#f97316" fill={n <= 4 ? '#f97316' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ping animation keyframe */}
        <style>{`
          @keyframes ping {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
