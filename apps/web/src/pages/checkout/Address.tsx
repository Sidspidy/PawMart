import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ChevronRight, Check, User, Phone, Home, Building2,
  Navigation, FileText, ShieldCheck, Package, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useCartStore } from '../../store/cart.store';

const STEP_LABELS = ['Cart', 'Address', 'Payment', 'Confirm'];

interface AddressForm {
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressType: 'Home' | 'Work' | 'Other';
}

const INITIAL_FORM: AddressForm = {
  fullName: '',
  phone: '',
  pincode: '',
  city: '',
  state: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  addressType: 'Home',
};

// Indian state list (abbreviated)
const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export default function Address() {
  const navigate = useNavigate();
  const { items, subtotal } = useCartStore();
  const [form, setForm] = useState<AddressForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<AddressForm>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const sub = subtotal();
  const deliveryFee = sub >= 999 ? 0 : 49;
  const total = sub + deliveryFee;

  const handleChange = (field: keyof AddressForm, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Simulated pin-code auto-fill
  const handlePincodeBlur = () => {
    if (form.pincode.length === 6) {
      setPincodeLoading(true);
      setTimeout(() => {
        const pincodeMap: Record<string, { city: string; state: string }> = {
          '400001': { city: 'Mumbai', state: 'Maharashtra' },
          '110001': { city: 'New Delhi', state: 'Delhi' },
          '560001': { city: 'Bangalore', state: 'Karnataka' },
          '600001': { city: 'Chennai', state: 'Tamil Nadu' },
          '700001': { city: 'Kolkata', state: 'West Bengal' },
          '500001': { city: 'Hyderabad', state: 'Telangana' },
        };
        const match = pincodeMap[form.pincode];
        if (match) {
          setForm(prev => ({ ...prev, city: match.city, state: match.state }));
        }
        setPincodeLoading(false);
      }, 800);
    }
  };

  const validate = () => {
    const e: Partial<AddressForm> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Please select a state';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Street address is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Store in session for Payment page
    sessionStorage.setItem('checkout_address', JSON.stringify(form));
    navigate('/checkout/payment');
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
    // Steps
    stepsWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
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
    // Form card
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    } as React.CSSProperties,
    formCardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
      background: 'linear-gradient(135deg, #fff7ed, #ffffff)',
    } as React.CSSProperties,
    formCardTitle: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    formBody: {
      padding: '1.5rem',
    } as React.CSSProperties,
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1rem',
    } as React.CSSProperties,
    formGroup: {
      marginBottom: '1rem',
    } as React.CSSProperties,
    label: {
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      marginBottom: '0.375rem',
    } as React.CSSProperties,
    inputWrap: {
      position: 'relative' as const,
    } as React.CSSProperties,
    inputIcon: {
      position: 'absolute' as const,
      left: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8a7e72',
      pointerEvents: 'none' as const,
    } as React.CSSProperties,
    input: (hasError: boolean, hasIcon: boolean) => ({
      width: '100%',
      padding: hasIcon ? '0.7rem 0.875rem 0.7rem 2.75rem' : '0.7rem 0.875rem',
      borderRadius: '12px',
      border: `1.5px solid ${hasError ? '#ef4444' : '#e5ddd4'}`,
      fontSize: '0.9rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      backgroundColor: '#f7f2ec',
      outline: 'none',
      transition: 'border 0.2s',
      boxSizing: 'border-box' as const,
    } as React.CSSProperties),
    select: (hasError: boolean) => ({
      width: '100%',
      padding: '0.7rem 0.875rem',
      borderRadius: '12px',
      border: `1.5px solid ${hasError ? '#ef4444' : '#e5ddd4'}`,
      fontSize: '0.9rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      backgroundColor: '#f7f2ec',
      outline: 'none',
      appearance: 'none' as const,
      cursor: 'pointer',
    } as React.CSSProperties),
    errorText: {
      fontSize: '0.73rem',
      color: '#ef4444',
      marginTop: '0.25rem',
    } as React.CSSProperties,
    // Address type
    addressTypeWrap: {
      display: 'flex',
      gap: '0.625rem',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    addrTypeBtn: (active: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      border: `1.5px solid ${active ? '#f97316' : '#e5ddd4'}`,
      backgroundColor: active ? '#fff7ed' : '#ffffff',
      color: active ? '#f97316' : '#8a7e72',
      fontSize: '0.82rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s',
    } as React.CSSProperties),
    // Action buttons
    actionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #f0ebe4',
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
      transition: 'all 0.2s',
    } as React.CSSProperties,
    nextBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.8rem 1.75rem',
      borderRadius: '9999px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '0.9rem',
      fontFamily: "'Nunito', sans-serif",
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
      transition: 'all 0.25s',
    } as React.CSSProperties,
    // Summary sidebar
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
    summaryItemImg: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      objectFit: 'cover' as const,
      backgroundColor: '#f0ebe4',
      flexShrink: 0,
    } as React.CSSProperties,
    summaryItemInfo: { flex: 1, minWidth: 0 } as React.CSSProperties,
    summaryItemName: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#2d2418',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    summaryItemSub: { fontSize: '0.72rem', color: '#8a7e72', marginTop: '2px' } as React.CSSProperties,
    summaryItemPrice: { fontSize: '0.85rem', fontWeight: 800, color: '#f97316', flexShrink: 0 } as React.CSSProperties,
    divider: { height: '1px', backgroundColor: '#f0ebe4', margin: '1rem 0' } as React.CSSProperties,
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.625rem',
    } as React.CSSProperties,
    priceLabel: { fontSize: '0.83rem', color: '#8a7e72' } as React.CSSProperties,
    priceValue: { fontSize: '0.83rem', fontWeight: 600, color: '#2d2418' } as React.CSSProperties,
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.5rem',
    } as React.CSSProperties,
    totalLabel: { fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    totalValue: { fontSize: '1.2rem', fontWeight: 800, color: '#f97316', fontFamily: "'Nunito', sans-serif" } as React.CSSProperties,
    trustBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.73rem',
      color: '#8a7e72',
      marginTop: '0.875rem',
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
          fontFamily: "'Nunito', sans-serif",
          transition: 'all 0.3s',
          boxShadow: active ? '0 4px 12px rgba(249,115,22,0.35)' : 'none',
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

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Step indicator */}
        <div style={s.stepsWrap}>
          {STEP_LABELS.map((label, idx) => (
            <StepItem key={label} idx={idx} label={label} active={idx === 1} done={idx === 0} />
          ))}
        </div>

        <div style={s.layout}>
          {/* Address Form */}
          <div>
            <div style={s.formCard}>
              <div style={s.formCardHeader}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="#fff" />
                </div>
                <div>
                  <div style={s.formCardTitle}>Delivery Address</div>
                  <div style={{ fontSize: '0.75rem', color: '#8a7e72' }}>Where should we send your order?</div>
                </div>
              </div>

              <form style={s.formBody} onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name + Phone */}
                <div style={s.formRow}>
                  <div>
                    <label style={s.label}>Full Name *</label>
                    <div style={s.inputWrap}>
                      <User size={15} style={s.inputIcon} />
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={form.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                        style={s.input(!!errors.fullName, true)}
                      />
                    </div>
                    {errors.fullName && <div style={s.errorText}>{errors.fullName}</div>}
                  </div>
                  <div>
                    <label style={s.label}>Mobile Number *</label>
                    <div style={s.inputWrap}>
                      <Phone size={15} style={s.inputIcon} />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                        style={s.input(!!errors.phone, true)}
                      />
                    </div>
                    {errors.phone && <div style={s.errorText}>{errors.phone}</div>}
                  </div>
                </div>

                {/* Row 2: Pincode + City */}
                <div style={s.formRow}>
                  <div>
                    <label style={s.label}>PIN Code *</label>
                    <div style={s.inputWrap}>
                      <Navigation size={15} style={s.inputIcon} />
                      <input
                        type="text"
                        placeholder="400001"
                        maxLength={6}
                        value={form.pincode}
                        onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                        onBlur={handlePincodeBlur}
                        style={s.input(!!errors.pincode, true)}
                      />
                      {pincodeLoading && (
                        <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', border: '2px solid #e5ddd4', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      )}
                    </div>
                    {errors.pincode && <div style={s.errorText}>{errors.pincode}</div>}
                    <div style={{ fontSize: '0.7rem', color: '#8a7e72', marginTop: '0.2rem' }}>Try: 400001, 110001, 560001</div>
                  </div>
                  <div>
                    <label style={s.label}>City *</label>
                    <div style={s.inputWrap}>
                      <Building2 size={15} style={s.inputIcon} />
                      <input
                        type="text"
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={e => handleChange('city', e.target.value)}
                        style={s.input(!!errors.city, true)}
                      />
                    </div>
                    {errors.city && <div style={s.errorText}>{errors.city}</div>}
                  </div>
                </div>

                {/* State */}
                <div style={s.formGroup}>
                  <label style={s.label}>State *</label>
                  <div style={s.inputWrap}>
                    <select
                      value={form.state}
                      onChange={e => handleChange('state', e.target.value)}
                      style={s.select(!!errors.state)}
                    >
                      <option value="">Select State</option>
                      {STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <div style={s.errorText}>{errors.state}</div>}
                </div>

                {/* Address Line 1 */}
                <div style={s.formGroup}>
                  <label style={s.label}>Street Address *</label>
                  <div style={s.inputWrap}>
                    <Home size={15} style={s.inputIcon} />
                    <input
                      type="text"
                      placeholder="Flat no., Building name, Street"
                      value={form.addressLine1}
                      onChange={e => handleChange('addressLine1', e.target.value)}
                      style={s.input(!!errors.addressLine1, true)}
                    />
                  </div>
                  {errors.addressLine1 && <div style={s.errorText}>{errors.addressLine1}</div>}
                </div>

                {/* Address Line 2 */}
                <div style={s.formGroup}>
                  <label style={s.label}>Area / Colony (Optional)</label>
                  <input
                    type="text"
                    placeholder="Colony, Area, Locality"
                    value={form.addressLine2}
                    onChange={e => handleChange('addressLine2', e.target.value)}
                    style={s.input(false, false)}
                  />
                </div>

                {/* Landmark */}
                <div style={s.formGroup}>
                  <label style={s.label}>Landmark (Optional)</label>
                  <div style={s.inputWrap}>
                    <FileText size={15} style={s.inputIcon} />
                    <input
                      type="text"
                      placeholder="Near Metro Station, Park etc."
                      value={form.landmark}
                      onChange={e => handleChange('landmark', e.target.value)}
                      style={s.input(false, true)}
                    />
                  </div>
                </div>

                {/* Address type selector */}
                <div>
                  <label style={{ ...s.label, marginBottom: '0.625rem' }}>Save As</label>
                  <div style={s.addressTypeWrap}>
                    {(['Home', 'Work', 'Other'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        style={s.addrTypeBtn(form.addressType === type)}
                        onClick={() => handleChange('addressType', type)}
                      >
                        {type === 'Home' ? <Home size={13} /> : type === 'Work' ? <Building2 size={13} /> : <MapPin size={13} />}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action row */}
                <div style={s.actionRow}>
                  <button type="button" style={s.backBtn} onClick={() => navigate('/cart')}>
                    <ArrowLeft size={15} /> Back to Cart
                  </button>
                  <button type="submit" style={s.nextBtn}>
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div style={s.summaryCard}>
            <div style={s.summaryHeader}>Order Summary ({items.length} items)</div>
            <div style={s.summaryBody}>
              {items.map(item => (
                <div key={item.sku} style={s.summaryItem}>
                  <img
                    src={item.image || '/images/hero/dog.png'}
                    alt={item.name}
                    style={s.summaryItemImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero/dog.png'; }}
                  />
                  <div style={s.summaryItemInfo}>
                    <div style={s.summaryItemName}>{item.name}</div>
                    <div style={s.summaryItemSub}>Qty: {item.quantity}{item.variant ? ` · ${item.variant}` : ''}</div>
                  </div>
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
                <span style={s.totalLabel}>Total</span>
                <span style={s.totalValue}>₹{total.toLocaleString('en-IN')}</span>
              </div>

              {/* Trust badges */}
              <div style={s.trustBadge}><ShieldCheck size={13} color="#22c55e" /> Secure & Encrypted Checkout</div>
              <div style={s.trustBadge}><Package size={13} color="#3b82f6" /> Delivery in 2–5 business days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
