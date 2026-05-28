import { useState } from 'react';
import { Tag, Gift, Copy, Check, Clock, Zap, Star, ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type CouponStatus = 'all' | 'active' | 'used' | 'expired';

interface Coupon {
  code: string;
  title: string;
  desc: string;
  type: 'pct' | 'flat' | 'shipping';
  value: number;
  minOrder?: number;
  expiry: string;
  status: 'active' | 'used' | 'expired';
  category?: string;
  isGift?: boolean;
}

const COUPONS: Coupon[] = [
  { code: 'PAWFIRST20', title: '20% Off on First Order', desc: 'Exclusive welcome offer for new members', type: 'pct', value: 20, expiry: '2026-06-30', status: 'active', isGift: true },
  { code: 'PETLOVER15', title: '₹150 Flat Discount', desc: 'Valid on orders above ₹999', type: 'flat', value: 150, minOrder: 999, expiry: '2026-06-15', status: 'active' },
  { code: 'DOGSALE10', title: '10% Off on Dog Products', desc: 'Exclusive for dog parents', type: 'pct', value: 10, expiry: '2026-05-31', status: 'active', category: 'Dogs' },
  { code: 'FREESHIP99', title: 'Free Delivery', desc: 'Free shipping on any order above ₹499', type: 'shipping', value: 0, minOrder: 499, expiry: '2026-06-30', status: 'active' },
  { code: 'SPINWIN50', title: '₹50 Off (Spin Reward)', desc: 'Won from Daily Spin Wheel', type: 'flat', value: 50, expiry: '2026-06-07', status: 'active', isGift: true },
  { code: 'SUMMER25', title: '25% Off Summer Sale', desc: 'Summer pet essentials discount', type: 'pct', value: 25, minOrder: 799, expiry: '2026-04-30', status: 'expired' },
  { code: 'WELCOME10', title: '10% New Member Discount', desc: 'Used on first purchase', type: 'pct', value: 10, expiry: '2026-03-31', status: 'used' },
];

const STATUS_CONFIG = {
  active:  { label: 'Active',  color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  used:    { label: 'Used',    color: '#8a7e72', bg: '#f7f2ec', border: '#e5ddd4' },
  expired: { label: 'Expired', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const FILTER_TABS: { key: CouponStatus; label: string }[] = [
  { key: 'all',     label: 'All' },
  { key: 'active',  label: 'Active' },
  { key: 'used',    label: 'Used' },
  { key: 'expired', label: 'Expired' },
];

export default function Coupons() {
  const [filter, setFilter] = useState<CouponStatus>('active');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = COUPONS.filter(c => filter === 'all' || c.status === filter);

  const active = COUPONS.filter(c => c.status === 'active');
  const gifts = COUPONS.filter(c => c.isGift && c.status === 'active');

  const s = {
    title: { fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.82rem', color: '#8a7e72', marginBottom: '1.5rem' } as React.CSSProperties,
    // Summary cards
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' } as React.CSSProperties,
    summaryCard: (color: string, bg: string) => ({
      backgroundColor: '#ffffff', borderRadius: '16px',
      padding: '1.25rem', border: `1px solid ${bg}`,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      borderLeft: `4px solid ${color}`,
    } as React.CSSProperties),
    summaryNum: (color: string) => ({ fontSize: '1.75rem', fontWeight: 900, color, fontFamily: "'Nunito', sans-serif" } as React.CSSProperties),
    summaryLabel: { fontSize: '0.75rem', color: '#8a7e72', marginTop: '0.2rem' } as React.CSSProperties,
    // Tabs
    tabsWrap: {
      display: 'flex', gap: '0.375rem', backgroundColor: '#ffffff',
      borderRadius: '12px', border: '1px solid #e5ddd4', padding: '0.3rem', marginBottom: '1.25rem',
    } as React.CSSProperties,
    tab: (a: boolean) => ({
      flex: 1, padding: '0.5rem', borderRadius: '9px', border: 'none',
      fontWeight: a ? 700 : 500, fontSize: '0.82rem',
      color: a ? '#ffffff' : '#8a7e72',
      background: a ? '#f97316' : 'transparent', cursor: 'pointer', transition: 'all 0.2s',
    } as React.CSSProperties),
    // Coupon cards
    couponCard: (status: string) => ({
      backgroundColor: '#ffffff', borderRadius: '18px',
      border: `1px solid ${status === 'active' ? '#e5ddd4' : '#f0ebe4'}`,
      overflow: 'hidden', marginBottom: '0.875rem',
      boxShadow: status === 'active' ? '0 4px 16px rgba(0,0,0,0.05)' : 'none',
      opacity: status === 'expired' ? 0.65 : 1,
      transition: 'all 0.25s',
    } as React.CSSProperties),
    couponInner: {
      display: 'grid', gridTemplateColumns: '1fr auto',
      alignItems: 'center', gap: '1rem', padding: '1.25rem',
    } as React.CSSProperties,
    couponLeft: { display: 'flex', alignItems: 'flex-start', gap: '0.875rem' } as React.CSSProperties,
    couponIconWrap: (status: string) => ({
      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
      background: status === 'active'
        ? 'linear-gradient(135deg, #f97316, #ea580c)'
        : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } as React.CSSProperties),
    couponTitle: { fontSize: '0.9rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.2rem' } as React.CSSProperties,
    couponDesc: { fontSize: '0.73rem', color: '#8a7e72', marginBottom: '0.4rem' } as React.CSSProperties,
    couponMeta: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const } as React.CSSProperties,
    metaTag: (color: string, bg: string, border: string) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      padding: '0.18rem 0.5rem', borderRadius: '6px',
      fontSize: '0.65rem', fontWeight: 700, color, backgroundColor: bg, border: `1px solid ${border}`,
    } as React.CSSProperties),
    couponRight: { display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '0.5rem' } as React.CSSProperties,
    valueTag: {
      fontSize: '1.2rem', fontWeight: 900, color: '#f97316', fontFamily: "'Nunito', sans-serif",
      textAlign: 'right' as const,
    } as React.CSSProperties,
    valueSubtag: { fontSize: '0.7rem', color: '#8a7e72' } as React.CSSProperties,
    codePill: (status: string) => ({
      display: 'flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.4rem 0.875rem', borderRadius: '9px',
      backgroundColor: status === 'active' ? '#f7f2ec' : '#f0ebe4',
      border: `1px dashed ${status === 'active' ? '#f97316' : '#d1d5db'}`,
      cursor: status === 'active' ? 'pointer' : 'default',
    } as React.CSSProperties),
    codeText: (status: string) => ({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.78rem', fontWeight: 700,
      color: status === 'active' ? '#f97316' : '#9ca3af',
      letterSpacing: '0.08em',
    } as React.CSSProperties),
    // Divider line (dashed)
    couponDivider: {
      borderTop: '2px dashed #f0ebe4', margin: '0 1.25rem',
      position: 'relative' as const,
    } as React.CSSProperties,
    expireRow: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.625rem 1.25rem',
    } as React.CSSProperties,
    // Empty
    emptyState: {
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      padding: '3rem', gap: '1rem', backgroundColor: '#ffffff',
      borderRadius: '20px', border: '1px solid #e5ddd4',
    } as React.CSSProperties,
  };

  const formatValue = (c: Coupon) => {
    if (c.type === 'pct') return `${c.value}% OFF`;
    if (c.type === 'flat') return `₹${c.value} OFF`;
    return 'FREE SHIP';
  };

  return (
    <div>
      <h1 style={s.title}>Coupons & Gifts</h1>
      <p style={s.subtitle}>Your exclusive discounts, rewards and gift vouchers</p>

      {/* Summary */}
      <div style={s.summaryGrid}>
        <div style={s.summaryCard('#22c55e', '#bbf7d0')}>
          <div style={s.summaryNum('#22c55e')}>{active.length}</div>
          <div style={s.summaryLabel}>Active Coupons</div>
        </div>
        <div style={s.summaryCard('#a855f7', '#e9d5ff')}>
          <div style={s.summaryNum('#a855f7')}>{gifts.length}</div>
          <div style={s.summaryLabel}>Gift Vouchers</div>
        </div>
        <div style={s.summaryCard('#f59e0b', '#fde68a')}>
          <div style={s.summaryNum('#f59e0b')}>₹{active.filter(c => c.type === 'flat').reduce((s, c) => s + c.value, 0)}</div>
          <div style={s.summaryLabel}>Flat Savings Available</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabsWrap}>
        {FILTER_TABS.map(t => (
          <button key={t.key} style={s.tab(filter === t.key)} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Coupons */}
      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #fff1e6, #fde8d0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={28} color="#f97316" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>No coupons here</div>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', borderRadius: '99px', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
            <ShoppingBag size={14} /> Shop to Earn Coupons <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        filtered.map(c => (
          <div key={c.code} style={s.couponCard(c.status)}>
            <div style={s.couponInner}>
              {/* Left */}
              <div style={s.couponLeft}>
                <div style={s.couponIconWrap(c.status)}>
                  {c.isGift ? <Gift size={20} color="#fff" /> : <Tag size={20} color="#fff" />}
                </div>
                <div>
                  <div style={s.couponTitle}>{c.title}</div>
                  <div style={s.couponDesc}>{c.desc}</div>
                  <div style={s.couponMeta}>
                    <div style={s.metaTag(STATUS_CONFIG[c.status].color, STATUS_CONFIG[c.status].bg, STATUS_CONFIG[c.status].border)}>
                      <Zap size={9} /> {STATUS_CONFIG[c.status].label}
                    </div>
                    {c.minOrder && (
                      <div style={s.metaTag('#3b82f6', '#eff6ff', '#bfdbfe')}>
                        Min. ₹{c.minOrder}
                      </div>
                    )}
                    {c.category && (
                      <div style={s.metaTag('#8a7e72', '#f7f2ec', '#e5ddd4')}>
                        {c.category} only
                      </div>
                    )}
                    {c.isGift && (
                      <div style={s.metaTag('#a855f7', '#faf5ff', '#e9d5ff')}>
                        <Star size={9} fill="#a855f7" color="#a855f7" /> Gift
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div style={s.couponRight}>
                <div style={s.valueTag}>{formatValue(c)}</div>
                <div style={s.valueSubtag}>discount value</div>
                {c.status === 'active' ? (
                  <div style={s.codePill(c.status)} onClick={() => handleCopy(c.code)}>
                    <span style={s.codeText(c.status)}>{c.code}</span>
                    {copiedCode === c.code
                      ? <Check size={12} color="#22c55e" />
                      : <Copy size={12} color="#f97316" />
                    }
                  </div>
                ) : (
                  <div style={s.codePill(c.status)}>
                    <span style={s.codeText(c.status)}>{c.code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiry footer */}
            <div style={s.couponDivider} />
            <div style={s.expireRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', color: c.status === 'expired' ? '#ef4444' : '#8a7e72' }}>
                <Clock size={11} />
                {c.status === 'used' ? 'Used' : c.status === 'expired' ? 'Expired' : 'Valid'} till{' '}
                {new Date(c.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {c.status === 'active' && (
                <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, color: '#f97316', textDecoration: 'none' }}>
                  Apply Now <ChevronRight size={11} />
                </Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
