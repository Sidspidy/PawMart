import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Smartphone, Building, Check, Lock, ShieldCheck,
  Package, ArrowLeft, ArrowRight, ChevronDown, Wallet, Zap
} from 'lucide-react';
import { useCartStore } from '../../store/cart.store';

const STEP_LABELS = ['Cart', 'Address', 'Payment', 'Confirm'];

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet';

const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay', color: '#4285F4' },
  { id: 'phonepe', label: 'PhonePe', color: '#5F259F' },
  { id: 'paytm', label: 'Paytm', color: '#00BAF2' },
  { id: 'bhim', label: 'BHIM UPI', color: '#00813F' },
];

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
];

const WALLETS = [
  { id: 'paytm_w', label: 'Paytm Wallet', color: '#00BAF2' },
  { id: 'amazon_pay', label: 'Amazon Pay', color: '#FF9900' },
  { id: 'mobikwik', label: 'MobiKwik', color: '#1C3EAA' },
];

export default function Payment() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('paytm_w');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const sub = subtotal();
  const deliveryFee = sub >= 999 ? 0 : 49;
  const total = sub + deliveryFee;

  const formatCardNum = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/checkout/confirmation');
    }, 2000);
  };

  // ── Styles ──────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f2ec',
      paddingTop: '2rem',
      paddingBottom: '4rem',
    } as React.CSSProperties,
    container: {
      width: '100%',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 1.5rem',
    } as React.CSSProperties,
    stepsWrap: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '1.25rem 2rem',
      border: '1px solid #e5ddd4',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    } as React.CSSProperties,
    layout: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '1.75rem',
      alignItems: 'start',
    } as React.CSSProperties,
    paymentCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    } as React.CSSProperties,
    paymentCardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
      background: 'linear-gradient(135deg, #fff7ed, #ffffff)',
    } as React.CSSProperties,
    methodList: {
      display: 'flex',
      flexDirection: 'column' as const,
    } as React.CSSProperties,
    methodTab: (active: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
      cursor: 'pointer',
      backgroundColor: active ? '#fff7ed' : '#ffffff',
      borderLeft: `3px solid ${active ? '#f97316' : 'transparent'}`,
      transition: 'all 0.2s',
    } as React.CSSProperties),
    methodIcon: (active: boolean) => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: active ? '#fff1e6' : '#f7f2ec',
      color: active ? '#f97316' : '#8a7e72',
      flexShrink: 0,
      transition: 'all 0.2s',
    } as React.CSSProperties),
    methodLabel: (active: boolean) => ({
      flex: 1,
      fontSize: '0.9rem',
      fontWeight: active ? 700 : 500,
      color: active ? '#2d2418' : '#8a7e72',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties),
    radioCircle: (active: boolean) => ({
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      border: `2px solid ${active ? '#f97316' : '#e5ddd4'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s',
    } as React.CSSProperties),
    methodContent: {
      padding: '1.5rem',
    } as React.CSSProperties,
    // UPI apps grid
    upiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.75rem',
      marginBottom: '1.25rem',
    } as React.CSSProperties,
    upiApp: (active: boolean, color: string) => ({
      padding: '0.75rem 0.5rem',
      borderRadius: '12px',
      border: `2px solid ${active ? color : '#e5ddd4'}`,
      backgroundColor: active ? `${color}15` : '#ffffff',
      cursor: 'pointer',
      textAlign: 'center' as const,
      transition: 'all 0.2s',
    } as React.CSSProperties),
    upiAppDot: (color: string) => ({
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: color,
      margin: '0 auto 0.375rem',
    }) as React.CSSProperties,
    upiAppLabel: {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: '#2d2418',
    } as React.CSSProperties,
    // Input styles
    label: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      marginBottom: '0.375rem',
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      border: '1.5px solid #e5ddd4',
      fontSize: '0.9rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      backgroundColor: '#f7f2ec',
      outline: 'none',
      boxSizing: 'border-box' as const,
      marginBottom: '1rem',
    } as React.CSSProperties,
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    } as React.CSSProperties,
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      border: '1.5px solid #e5ddd4',
      fontSize: '0.9rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      backgroundColor: '#f7f2ec',
      outline: 'none',
      appearance: 'none' as const,
      cursor: 'pointer',
      marginBottom: '1rem',
    } as React.CSSProperties,
    hint: {
      fontSize: '0.73rem',
      color: '#8a7e72',
      marginTop: '-0.75rem',
      marginBottom: '1rem',
    } as React.CSSProperties,
    // Action row
    actionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 1.5rem',
      borderTop: '1px solid #f0ebe4',
      backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.7rem 1.25rem',
      borderRadius: '9999px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
      color: '#8a7e72',
      fontWeight: 700,
      fontSize: '0.875rem',
      fontFamily: "'Nunito', sans-serif",
      cursor: 'pointer',
    } as React.CSSProperties,
    payBtn: (loading: boolean) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.85rem 2rem',
      borderRadius: '9999px',
      background: loading ? '#d1d5db' : 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '0.95rem',
      fontFamily: "'Nunito', sans-serif",
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      boxShadow: loading ? 'none' : '0 6px 20px rgba(249,115,22,0.35)',
      transition: 'all 0.25s',
    } as React.CSSProperties),
    // Summary
    summaryCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      position: 'sticky' as const,
      top: '100px',
    } as React.CSSProperties,
    summaryHeader: {
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
      fontSize: '0.82rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
    } as React.CSSProperties,
    summaryBody: { padding: '1.25rem 1.5rem' } as React.CSSProperties,
    summaryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem',
    } as React.CSSProperties,
    summaryImg: {
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      objectFit: 'cover' as const,
      backgroundColor: '#f0ebe4',
      flexShrink: 0,
    } as React.CSSProperties,
    summaryItemName: {
      flex: 1,
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#2d2418',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    summaryItemPrice: {
      fontSize: '0.82rem',
      fontWeight: 800,
      color: '#f97316',
      flexShrink: 0,
    } as React.CSSProperties,
    divider: { height: '1px', backgroundColor: '#f0ebe4', margin: '1rem 0' } as React.CSSProperties,
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    } as React.CSSProperties,
    priceLabel: { fontSize: '0.82rem', color: '#8a7e72' } as React.CSSProperties,
    priceValue: { fontSize: '0.82rem', fontWeight: 600, color: '#2d2418' } as React.CSSProperties,
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.5rem',
    } as React.CSSProperties,
    secureNote: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.72rem',
      color: '#8a7e72',
      marginTop: '0.875rem',
    } as React.CSSProperties,
    codBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 0.875rem',
      borderRadius: '9999px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#16a34a',
      fontSize: '0.8rem',
      fontWeight: 700,
      marginBottom: '1rem',
    } as React.CSSProperties,
  };

  const StepItem = ({ idx, label, active, done }: { idx: number; label: string; active: boolean; done: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: done ? '#22c55e' : active ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#e5ddd4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: (done || active) ? '#ffffff' : '#8a7e72',
          fontWeight: 800, fontSize: '0.8rem',
          boxShadow: active ? '0 4px 12px rgba(249,115,22,0.35)' : 'none',
          transition: 'all 0.3s',
        }}>
          {done ? <Check size={16} /> : idx + 1}
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          color: active ? '#f97316' : done ? '#22c55e' : '#8a7e72',
          whiteSpace: 'nowrap' as const,
        }}>{label}</span>
      </div>
      {idx < STEP_LABELS.length - 1 && (
        <div style={{
          flex: 1, height: '2px',
          background: done ? '#22c55e' : '#e5ddd4',
          margin: '0 0.5rem', marginBottom: '1.25rem',
          transition: 'background 0.3s',
        }} />
      )}
    </div>
  );

  const methodTabs: { id: PaymentMethod; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'upi', label: 'UPI / QR Code', icon: <Smartphone size={18} />, badge: 'Recommended' },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
    { id: 'netbanking', label: 'Net Banking', icon: <Building size={18} /> },
    { id: 'wallet', label: 'Wallets', icon: <Wallet size={18} /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <Package size={18} /> },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Step indicator */}
        <div style={s.stepsWrap}>
          {STEP_LABELS.map((label, idx) => (
            <StepItem key={label} idx={idx} label={label} active={idx === 2} done={idx < 2} />
          ))}
        </div>

        <div style={s.layout}>
          {/* Payment panel */}
          <div style={s.paymentCard}>
            {/* Header */}
            <div style={s.paymentCardHeader}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>Secure Payment</div>
                <div style={{ fontSize: '0.75rem', color: '#8a7e72' }}>All transactions are 256-bit SSL encrypted</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.375rem 0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '99px' }}>
                <ShieldCheck size={13} color="#16a34a" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a' }}>SSL Secured</span>
              </div>
            </div>

            {/* Method tabs + content */}
            <div style={{ display: 'flex', minHeight: '420px' }}>
              {/* Left: Method list */}
              <div style={{ width: '220px', borderRight: '1px solid #f0ebe4', flexShrink: 0 }}>
                {methodTabs.map(tab => (
                  <div key={tab.id} style={s.methodTab(method === tab.id)} onClick={() => setMethod(tab.id)}>
                    <div style={s.methodIcon(method === tab.id)}>{tab.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={s.methodLabel(method === tab.id)}>{tab.label}</div>
                      {tab.badge && (
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#22c55e', backgroundColor: '#f0fdf4', padding: '1px 6px', borderRadius: '99px', display: 'inline-block', marginTop: '2px' }}>
                          {tab.badge}
                        </div>
                      )}
                    </div>
                    <div style={s.radioCircle(method === tab.id)}>
                      {method === tab.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Method content */}
              <div style={{ flex: 1, padding: '1.5rem' }}>
                {/* UPI */}
                {method === 'upi' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', marginBottom: '1rem', fontFamily: "'Nunito', sans-serif" }}>
                      Select UPI App
                    </div>
                    <div style={s.upiGrid}>
                      {UPI_APPS.map(app => (
                        <div
                          key={app.id}
                          style={s.upiApp(selectedUpiApp === app.id, app.color)}
                          onClick={() => setSelectedUpiApp(app.id)}
                        >
                          <div style={s.upiAppDot(app.color)} />
                          <div style={s.upiAppLabel}>{app.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px dashed #e5ddd4', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <label style={s.label}>Or enter UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        style={s.input}
                      />
                      <div style={s.hint}>e.g. rahul@okicici, 9876543210@ybl</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                      <Zap size={14} color="#f59e0b" />
                      <span style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>UPI payments are instant — no waiting!</span>
                    </div>
                  </div>
                )}

                {/* Card */}
                {method === 'card' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', marginBottom: '1rem', fontFamily: "'Nunito', sans-serif" }}>
                      Enter Card Details
                    </div>
                    <label style={s.label}>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      onChange={e => setCardNum(formatCardNum(e.target.value))}
                      style={s.input}
                      maxLength={19}
                    />
                    <label style={s.label}>Name on Card</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      style={s.input}
                    />
                    <div style={s.formRow}>
                      <div>
                        <label style={s.label}>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                          style={s.input}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label style={s.label}>CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          style={s.input}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#8a7e72' }}>
                      <Lock size={12} /> Your card details are encrypted and never stored
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {method === 'netbanking' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', marginBottom: '1rem', fontFamily: "'Nunito', sans-serif" }}>
                      Select Your Bank
                    </div>
                    <label style={s.label}>Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      style={s.select}
                    >
                      <option value="">— Choose your bank —</option>
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd', fontSize: '0.8rem', color: '#0369a1' }}>
                      You will be redirected to your bank's secure portal to complete the payment.
                    </div>
                  </div>
                )}

                {/* Wallets */}
                {method === 'wallet' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', marginBottom: '1rem', fontFamily: "'Nunito', sans-serif" }}>
                      Select Wallet
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {WALLETS.map(w => (
                        <div
                          key={w.id}
                          onClick={() => setSelectedWallet(w.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.875rem',
                            padding: '0.875rem 1rem', borderRadius: '12px',
                            border: `1.5px solid ${selectedWallet === w.id ? w.color : '#e5ddd4'}`,
                            backgroundColor: selectedWallet === w.id ? `${w.color}10` : '#ffffff',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: w.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2418' }}>{w.label}</span>
                          {selectedWallet === w.id && (
                            <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={12} color="#fff" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* COD */}
                {method === 'cod' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center', gap: '1rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={32} color="#22c55e" />
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.375rem' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.85rem', color: '#8a7e72', maxWidth: '280px' }}>Pay with cash when your order arrives. Available for orders under ₹5,000.</div>
                    </div>
                    <div style={s.codBadge}>
                      <Check size={13} /> Available for this order
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8a7e72' }}>
                      ₹30 COD handling fee may apply on some orders
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action row */}
            <div style={s.actionRow}>
              <button style={s.backBtn} onClick={() => navigate('/checkout/address')}>
                <ArrowLeft size={15} /> Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f97316', fontFamily: "'Nunito', sans-serif" }}>
                  ₹{total.toLocaleString('en-IN')}
                </div>
                <button style={s.payBtn(processing)} onClick={handlePay} disabled={processing}>
                  {processing ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Pay ₹{total.toLocaleString('en-IN')} <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div style={s.summaryCard}>
            <div style={s.summaryHeader}>Order Summary</div>
            <div style={s.summaryBody}>
              {items.map(item => (
                <div key={item.sku} style={s.summaryItem}>
                  <img
                    src={item.image || '/images/hero/dog.png'}
                    alt={item.name}
                    style={s.summaryImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero/dog.png'; }}
                  />
                  <div style={s.summaryItemName}>{item.name}</div>
                  <div style={s.summaryItemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
              <div style={s.divider} />
              <div style={s.priceRow}>
                <span style={s.priceLabel}>Subtotal</span>
                <span style={s.priceValue}>₹{sub.toLocaleString('en-IN')}</span>
              </div>
              <div style={s.priceRow}>
                <span style={s.priceLabel}>Delivery</span>
                <span style={{ ...s.priceValue, color: deliveryFee === 0 ? '#22c55e' : '#2d2418' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div style={s.divider} />
              <div style={s.totalRow}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>Total</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316', fontFamily: "'Nunito', sans-serif" }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div style={s.secureNote}><Lock size={12} /> Payments are SSL secured</div>
              <div style={s.secureNote}><ShieldCheck size={12} color="#22c55e" /> 100% Authentic Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
