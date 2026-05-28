import { useState } from 'react';
import { Star, Gift, ShoppingBag, TrendingUp, ChevronRight, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
  { name: 'Paw Starter',   min: 0,     max: 999,   color: '#94a3b8', bg: '#f1f5f9', icon: '🐾' },
  { name: 'Paw Explorer',  min: 1000,  max: 2499,  color: '#f97316', bg: '#fff7ed', icon: '🐕' },
  { name: 'Paw Champion',  min: 2500,  max: 4999,  color: '#a855f7', bg: '#faf5ff', icon: '🏆' },
  { name: 'Paw Royale',    min: 5000,  max: Infinity, color: '#f59e0b', bg: '#fffbeb', icon: '👑' },
];

const HISTORY = [
  { id: 1, type: 'earn',   desc: 'Order #PAWXR9821',          pts: +250, date: '24 May 2026' },
  { id: 2, type: 'earn',   desc: 'Order #PAWMK4431',          pts: +175, date: '18 May 2026' },
  { id: 3, type: 'redeem', desc: 'Redeemed on Order',         pts: -200, date: '12 May 2026' },
  { id: 4, type: 'earn',   desc: 'Daily check-in bonus',      pts: +50,  date: '10 May 2026' },
  { id: 5, type: 'earn',   desc: 'Referral bonus (Priya D.)', pts: +500, date: '5 May 2026' },
  { id: 6, type: 'redeem', desc: 'Coupon generated',          pts: -300, date: '1 May 2026' },
];

const WAYS_TO_EARN = [
  { label: 'Make a purchase',    pts: '1 pt per ₹10',  icon: ShoppingBag, done: true },
  { label: 'Write a review',     pts: '50 pts',         icon: Star,        done: false },
  { label: 'Refer a friend',     pts: '500 pts',        icon: Gift,        done: false },
  { label: 'Daily check-in',     pts: '10–50 pts',      icon: Zap,         done: false },
];

const CURRENT_PTS = 1250;

export default function Points() {
  const [tab, setTab] = useState<'history' | 'redeem'>('history');

  const tier = TIERS.find(t => CURRENT_PTS >= t.min && CURRENT_PTS <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const pct = nextTier
    ? Math.round(((CURRENT_PTS - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  const s = {
    title: { fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.82rem', color: '#8a7e72', marginBottom: '1.5rem' } as React.CSSProperties,
    // Balance card
    balanceCard: {
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
      borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem',
      color: '#ffffff', position: 'relative' as const, overflow: 'hidden',
    } as React.CSSProperties,
    balancePts: {
      fontSize: '3rem', fontWeight: 900, fontFamily: "'Nunito', sans-serif", lineHeight: 1,
    } as React.CSSProperties,
    balanceLabel: { fontSize: '0.85rem', opacity: 0.85, marginBottom: '1.5rem' } as React.CSSProperties,
    tierRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } as React.CSSProperties,
    progressBar: {
      height: '8px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden',
    } as React.CSSProperties,
    progressFill: {
      height: '100%', borderRadius: '99px', backgroundColor: '#ffffff',
      width: `${pct}%`, transition: 'width 0.8s ease',
    } as React.CSSProperties,
    // Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' } as React.CSSProperties,
    statCard: {
      backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem',
      border: '1px solid #e5ddd4', textAlign: 'center' as const,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    } as React.CSSProperties,
    statNum: { fontSize: '1.5rem', fontWeight: 900, fontFamily: "'Nunito', sans-serif", color: '#f97316' } as React.CSSProperties,
    statLabel: { fontSize: '0.72rem', color: '#8a7e72', marginTop: '0.2rem' } as React.CSSProperties,
    // Tabs
    tabsRow: {
      display: 'flex', gap: '0.375rem', backgroundColor: '#ffffff',
      borderRadius: '12px', border: '1px solid #e5ddd4', padding: '0.3rem', marginBottom: '1rem',
    } as React.CSSProperties,
    tab: (active: boolean) => ({
      flex: 1, padding: '0.5rem', borderRadius: '9px', border: 'none',
      fontWeight: active ? 700 : 500, fontSize: '0.82rem',
      color: active ? '#ffffff' : '#8a7e72',
      background: active ? '#f97316' : 'transparent', cursor: 'pointer', transition: 'all 0.2s',
    } as React.CSSProperties),
    // History
    historyCard: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    } as React.CSSProperties,
    historyItem: {
      display: 'flex', alignItems: 'center', gap: '0.875rem',
      padding: '0.875rem 1.25rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
    histIcon: (earn: boolean) => ({
      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
      backgroundColor: earn ? '#f0fdf4' : '#fef2f2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } as React.CSSProperties),
    histDesc: { flex: 1, fontSize: '0.83rem', fontWeight: 600, color: '#2d2418' } as React.CSSProperties,
    histDate: { fontSize: '0.7rem', color: '#8a7e72', marginTop: '2px' } as React.CSSProperties,
    histPts: (earn: boolean) => ({
      fontSize: '0.9rem', fontWeight: 800,
      color: earn ? '#22c55e' : '#ef4444',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties),
    // Redeem
    redeemGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } as React.CSSProperties,
    redeemCard: {
      backgroundColor: '#ffffff', borderRadius: '16px',
      border: '1px solid #e5ddd4', padding: '1.25rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'all 0.2s',
    } as React.CSSProperties,
    redeemPts: { fontSize: '1.1rem', fontWeight: 900, color: '#f97316', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    redeemVal: { fontSize: '0.78rem', color: '#22c55e', fontWeight: 600, marginBottom: '0.5rem' } as React.CSSProperties,
    redeemTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    redeemDesc: { fontSize: '0.73rem', color: '#8a7e72', marginBottom: '0.875rem' } as React.CSSProperties,
    redeemBtn: (enough: boolean) => ({
      width: '100%', padding: '0.55rem',
      borderRadius: '10px', border: 'none',
      background: enough ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#e5ddd4',
      color: enough ? '#ffffff' : '#b0a99f',
      fontWeight: 700, fontSize: '0.78rem', cursor: enough ? 'pointer' : 'not-allowed',
    } as React.CSSProperties),
    // Ways to earn
    earnCard: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)', marginTop: '1.25rem',
    } as React.CSSProperties,
    earnHeader: {
      padding: '1rem 1.25rem', borderBottom: '1px solid #f0ebe4',
      fontSize: '0.82rem', fontWeight: 700, color: '#8a7e72',
      textTransform: 'uppercase' as const, letterSpacing: '0.08em', backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    earnItem: {
      display: 'flex', alignItems: 'center', gap: '0.875rem',
      padding: '0.875rem 1.25rem', borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
  };

  const REDEEM_OPTIONS = [
    { pts: 200, value: '₹20 OFF', title: '₹20 Discount', desc: 'Apply to any order', enough: CURRENT_PTS >= 200 },
    { pts: 500, value: '₹60 OFF', title: '₹60 Discount', desc: 'Min. order ₹499', enough: CURRENT_PTS >= 500 },
    { pts: 1000, value: '₹130 OFF', title: '₹130 Discount', desc: 'Min. order ₹999', enough: CURRENT_PTS >= 1000 },
    { pts: 2500, value: 'Free Ship', title: 'Free Delivery', desc: 'On any 3 orders', enough: CURRENT_PTS >= 2500 },
  ];

  return (
    <div>
      <h1 style={s.title}>Points & Rewards</h1>
      <p style={s.subtitle}>Earn PawPoints on every purchase and redeem for discounts</p>

      {/* Balance Card */}
      <div style={s.balanceCard}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '60%', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={s.balancePts}>{CURRENT_PTS.toLocaleString('en-IN')}</div>
        <div style={s.balanceLabel}>PawPoints Balance</div>
        <div style={s.tierRow}>
          <span style={{ fontSize: '1.1rem' }}>{tier.icon}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tier.name}</span>
          {nextTier && (
            <span style={{ fontSize: '0.72rem', opacity: 0.75, marginLeft: 'auto' }}>
              {nextTier.min - CURRENT_PTS} pts to {nextTier.name}
            </span>
          )}
        </div>
        <div style={s.progressBar}><div style={s.progressFill} /></div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.statNum}>2,475</div>
          <div style={s.statLabel}>Total Earned</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>500</div>
          <div style={s.statLabel}>Total Redeemed</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>7</div>
          <div style={s.statLabel}>Days Streak</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabsRow}>
        <button style={s.tab(tab === 'history')} onClick={() => setTab('history')}>Points History</button>
        <button style={s.tab(tab === 'redeem')} onClick={() => setTab('redeem')}>Redeem Points</button>
      </div>

      {tab === 'history' ? (
        <div style={s.historyCard}>
          {HISTORY.map(h => {
            const isEarn = h.pts > 0;
            return (
              <div key={h.id} style={s.historyItem}>
                <div style={s.histIcon(isEarn)}>
                  {isEarn ? <TrendingUp size={16} color="#22c55e" /> : <Gift size={16} color="#ef4444" />}
                </div>
                <div>
                  <div style={s.histDesc}>{h.desc}</div>
                  <div style={s.histDate}><Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />{h.date}</div>
                </div>
                <div style={s.histPts(isEarn)}>{isEarn ? '+' : ''}{h.pts} pts</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={s.redeemGrid}>
          {REDEEM_OPTIONS.map((opt, i) => (
            <div key={i} style={s.redeemCard}>
              <div style={s.redeemPts}>{opt.pts.toLocaleString('en-IN')} pts</div>
              <div style={s.redeemVal}>= {opt.value}</div>
              <div style={s.redeemTitle}>{opt.title}</div>
              <div style={s.redeemDesc}>{opt.desc}</div>
              <button style={s.redeemBtn(opt.enough)} disabled={!opt.enough}>
                {opt.enough ? 'Redeem Now' : 'Need More Points'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ways to earn */}
      <div style={s.earnCard}>
        <div style={s.earnHeader}>Ways to Earn More Points</div>
        {WAYS_TO_EARN.map(way => {
          const Icon = way.icon;
          return (
            <div key={way.label} style={s.earnItem}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="#f97316" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d2418' }}>{way.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#8a7e72' }}>{way.pts}</div>
              </div>
              {way.done
                ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: '#f0fdf4', padding: '0.2rem 0.625rem', borderRadius: '99px' }}>Done ✓</span>
                : <ChevronRight size={14} color="#c0b8b0" />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
