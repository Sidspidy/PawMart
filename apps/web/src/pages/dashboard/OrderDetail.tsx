import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, MapPin, Clock, CheckCircle, Truck, RotateCcw,
  ChevronLeft, Star, MessageSquare, Phone
} from 'lucide-react';

const ORDER = {
  id: 'PAWXR9821',
  date: '2026-05-24',
  status: 'shipped' as const,
  estimatedDelivery: '30 May 2026',
  items: [
    { name: 'Premium Grain-Free Salmon Kibble', image: '/images/hero/dog.png', qty: 2, price: 1899, size: '5 kg' },
    { name: 'Ultra-Durable Natural Rubber Chew Toy', image: '/images/hero/dog.png', qty: 1, price: 799, size: 'Large' },
  ],
  address: { name: 'Rahul Sharma', line1: 'Flat 4B, Sunrise Apartments', city: 'Mumbai', state: 'Maharashtra', pin: '400001', phone: '9876543210' },
  subtotal: 4597,
  delivery: 0,
  total: 4597,
  payment: 'UPI (Google Pay)',
  trackingId: 'BLR0094782123IN',
};

const TRACKING_STEPS = [
  { label: 'Order Placed', desc: '24 May, 10:30 AM', done: true, icon: CheckCircle },
  { label: 'Confirmed',    desc: '24 May, 11:00 AM', done: true, icon: CheckCircle },
  { label: 'Packed',       desc: '25 May, 2:00 PM',  done: true, icon: Package },
  { label: 'In Transit',   desc: '26 May, 9:00 AM',  done: true, icon: Truck },
  { label: 'Out for Delivery', desc: 'Expected 30 May', done: false, icon: MapPin },
  { label: 'Delivered',    desc: 'Est. 30 May',      done: false, icon: CheckCircle },
];

export default function OrderDetail() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const s = {
    backLink: {
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      fontSize: '0.82rem', fontWeight: 600, color: '#8a7e72',
      textDecoration: 'none', marginBottom: '1.25rem',
    } as React.CSSProperties,
    title: {
      fontSize: '1.5rem', fontWeight: 900, color: '#2d2418',
      fontFamily: "'Nunito', sans-serif", marginBottom: '0.25rem',
    } as React.CSSProperties,
    statusBadge: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.3rem 0.875rem', borderRadius: '99px',
      fontSize: '0.75rem', fontWeight: 700,
      color: '#3b82f6', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    card: {
      backgroundColor: '#ffffff', borderRadius: '20px',
      border: '1px solid #e5ddd4', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)', marginBottom: '1.25rem',
    } as React.CSSProperties,
    cardHeader: {
      padding: '1rem 1.25rem', borderBottom: '1px solid #f0ebe4',
      display: 'flex', alignItems: 'center', gap: '0.625rem',
      backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    cardTitle: {
      fontSize: '0.85rem', fontWeight: 800, color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    cardBody: { padding: '1.25rem' } as React.CSSProperties,
    // Tracking
    trackingWrap: {
      position: 'relative' as const, padding: '0.5rem 0',
    } as React.CSSProperties,
    trackStep: (done: boolean, isLast: boolean) => ({
      display: 'flex', gap: '1rem', position: 'relative' as const,
      paddingBottom: isLast ? '0' : '1.5rem',
    } as React.CSSProperties),
    trackLine: (done: boolean) => ({
      position: 'absolute' as const, left: '17px', top: '34px',
      width: '2px', bottom: '0',
      background: done ? '#f97316' : '#e5ddd4',
      transition: 'background 0.3s',
    } as React.CSSProperties),
    trackDot: (done: boolean) => ({
      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
      background: done ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#e5ddd4',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: done ? '0 2px 8px rgba(249,115,22,0.3)' : 'none',
      transition: 'all 0.3s',
    } as React.CSSProperties),
    trackLabel: (done: boolean) => ({
      fontSize: '0.875rem', fontWeight: done ? 700 : 500,
      color: done ? '#2d2418' : '#b0a99f',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties),
    trackDesc: { fontSize: '0.72rem', color: '#8a7e72', marginTop: '2px' } as React.CSSProperties,
    // Items
    itemRow: {
      display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem',
    } as React.CSSProperties,
    itemImg: {
      width: '56px', height: '56px', borderRadius: '12px',
      objectFit: 'cover' as const, backgroundColor: '#f0ebe4', flexShrink: 0,
    } as React.CSSProperties,
    itemInfo: { flex: 1 } as React.CSSProperties,
    itemName: { fontSize: '0.875rem', fontWeight: 700, color: '#2d2418', marginBottom: '2px' } as React.CSSProperties,
    itemSub: { fontSize: '0.72rem', color: '#8a7e72' } as React.CSSProperties,
    itemPrice: { fontSize: '0.9rem', fontWeight: 800, color: '#f97316' } as React.CSSProperties,
    // Summary rows
    priceRow: {
      display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
    } as React.CSSProperties,
    priceLabel: { fontSize: '0.83rem', color: '#8a7e72' } as React.CSSProperties,
    priceVal: { fontSize: '0.83rem', fontWeight: 600, color: '#2d2418' } as React.CSSProperties,
    divider: { height: '1px', backgroundColor: '#f0ebe4', margin: '0.75rem 0' } as React.CSSProperties,
    // Address
    addrLine: { fontSize: '0.85rem', color: '#2d2418', marginBottom: '0.25rem', lineHeight: 1.6 } as React.CSSProperties,
    // Actions
    actionsRow: {
      display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    primaryBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.7rem 1.25rem', borderRadius: '99px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff', fontWeight: 700, fontSize: '0.82rem',
      fontFamily: "'Nunito', sans-serif", border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
    } as React.CSSProperties,
    secBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.7rem 1.25rem', borderRadius: '99px',
      border: '1.5px solid #e5ddd4', backgroundColor: '#ffffff',
      color: '#8a7e72', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
    } as React.CSSProperties,
  };

  const IconComp = ({ icon: Icon, done }: { icon: React.ElementType; done: boolean }) => (
    <div style={s.trackDot(done)}>
      <Icon size={16} color={done ? '#ffffff' : '#c0b8b0'} />
    </div>
  );

  return (
    <div>
      <Link to="/dashboard/orders" style={s.backLink}>
        <ChevronLeft size={14} /> Back to Orders
      </Link>

      <h1 style={s.title}>Order #{ORDER.id}</h1>
      <p style={{ fontSize: '0.8rem', color: '#8a7e72', marginBottom: '0.75rem' }}>
        Placed on {new Date(ORDER.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        &nbsp;·&nbsp;Tracking ID: <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ORDER.trackingId}</strong>
      </p>
      <div style={s.statusBadge}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
        Shipped — Arriving by {ORDER.estimatedDelivery}
      </div>

      {/* Tracking timeline */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <Truck size={16} color="#f97316" />
          <span style={s.cardTitle}>Order Tracking</span>
        </div>
        <div style={s.cardBody}>
          <div style={s.trackingWrap}>
            {TRACKING_STEPS.map((step, idx) => {
              const isLast = idx === TRACKING_STEPS.length - 1;
              return (
                <div key={step.label} style={s.trackStep(step.done, isLast)}>
                  {!isLast && <div style={s.trackLine(step.done)} />}
                  <IconComp icon={step.icon} done={step.done} />
                  <div>
                    <div style={s.trackLabel(step.done)}>{step.label}</div>
                    <div style={s.trackDesc}>{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <Package size={16} color="#f97316" />
          <span style={s.cardTitle}>Items ({ORDER.items.length})</span>
        </div>
        <div style={s.cardBody}>
          {ORDER.items.map((item, i) => (
            <div key={i} style={s.itemRow}>
              <img src={item.image} alt={item.name} style={s.itemImg}
                onError={e => { (e.target as HTMLImageElement).src = '/images/hero/dog.png'; }} />
              <div style={s.itemInfo}>
                <div style={s.itemName}>{item.name}</div>
                <div style={s.itemSub}>Size: {item.size} · Qty: {item.qty}</div>
              </div>
              <div style={s.itemPrice}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
            </div>
          ))}
          <div style={s.divider} />
          <div style={s.priceRow}><span style={s.priceLabel}>Subtotal</span><span style={s.priceVal}>₹{ORDER.subtotal.toLocaleString('en-IN')}</span></div>
          <div style={s.priceRow}><span style={s.priceLabel}>Delivery</span><span style={{ ...s.priceVal, color: '#22c55e' }}>FREE</span></div>
          <div style={s.divider} />
          <div style={s.priceRow}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>Total</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f97316', fontFamily: "'Nunito', sans-serif" }}>₹{ORDER.total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8a7e72', marginTop: '0.5rem' }}>Paid via {ORDER.payment}</div>
        </div>
      </div>

      {/* Delivery address */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <MapPin size={16} color="#f97316" />
          <span style={s.cardTitle}>Delivery Address</span>
        </div>
        <div style={s.cardBody}>
          <div style={{ ...s.addrLine, fontWeight: 700 }}>{ORDER.address.name}</div>
          <div style={s.addrLine}>{ORDER.address.line1}</div>
          <div style={s.addrLine}>{ORDER.address.city}, {ORDER.address.state} — {ORDER.address.pin}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.82rem', color: '#8a7e72' }}>
            <Phone size={12} /> {ORDER.address.phone}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={s.actionsRow}>
        <button style={s.primaryBtn} onClick={() => setReviewOpen(!reviewOpen)}>
          <Star size={13} /> Rate & Review
        </button>
        <Link to="/products" style={s.secBtn}><RotateCcw size={13} /> Reorder</Link>
        <button style={s.secBtn}><MessageSquare size={13} /> Need Help?</button>
      </div>

      {/* Inline review form */}
      {reviewOpen && (
        <div style={{ ...s.card, marginTop: '1.25rem' }}>
          <div style={s.cardHeader}><Star size={16} color="#f97316" /><span style={s.cardTitle}>Leave a Review</span></div>
          <div style={s.cardBody}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.15s' }}>
                  <Star size={28} color="#f97316" fill={n <= rating ? '#f97316' : 'none'} />
                </button>
              ))}
            </div>
            <textarea placeholder="Share your experience..." rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #e5ddd4', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", color: '#2d2418', resize: 'none', outline: 'none', backgroundColor: '#f7f2ec', boxSizing: 'border-box' }} />
            <button style={{ ...s.primaryBtn, marginTop: '0.875rem' }} onClick={() => setReviewOpen(false)}>
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
