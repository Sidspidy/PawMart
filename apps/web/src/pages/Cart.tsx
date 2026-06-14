import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, Package, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { useToastStore } from '../store/toast.store';
import { api } from '../api';

const PROMO_CODES: Record<string, number> = {
  PAWMART10: 10,
  PETLOVER20: 20,
  FIRSTPAW15: 15,
};

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: string; value: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [removingSkus, setRemovingSkus] = useState<Set<string>>(new Set());

  const sub = subtotal();
  let discount = 0;
  let deliveryFee = sub >= 999 ? 0 : 49;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = Math.round((sub * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      discount = Math.min(appliedPromo.value, sub);
    } else if (appliedPromo.type === 'free_shipping') {
      deliveryFee = 0;
    }
  }
  const total = sub - discount + deliveryFee;

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (!isAuthenticated) {
      setPromoError('Please login to apply coupon codes! 🐾');
      return;
    }

    try {
      setPromoError('');
      const response = await api.post('/coupons/validate', { code, orderTotal: sub });
      if (response.data?.success) {
        const { coupon } = response.data.data;
        setAppliedPromo({ code: coupon.code, type: coupon.type, value: coupon.value });
        addToast(`Coupon "${coupon.code}" applied successfully! 🐾`, 'success');
      } else {
        setPromoError(response.data?.message || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } catch (err: any) {
      console.error(err);
      setPromoError(err.response?.data?.message || 'Invalid promo code. Try PAWMART10');
      setAppliedPromo(null);
    }
  };

  const handleRemove = (sku: string) => {
    setRemovingSkus(prev => new Set(prev).add(sku));
    setTimeout(() => {
      removeItem(sku);
      setRemovingSkus(prev => {
        const next = new Set(prev);
        next.delete(sku);
        return next;
      });
    }, 300);
  };

  // ── Styles ──────────────────────────────────────────────
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f2ec',
      paddingTop: '2rem',
      paddingBottom: '4rem',
    } as React.CSSProperties,
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '2rem',
    } as React.CSSProperties,
    headerIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    headerCount: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#8a7e72',
      marginTop: '2px',
    } as React.CSSProperties,
    layout: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '2rem',
      alignItems: 'start',
    } as React.CSSProperties,
    // ── Cart Items Column ──
    itemsCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e5ddd4',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    } as React.CSSProperties,
    itemsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
    } as React.CSSProperties,
    itemsHeaderLabel: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
    } as React.CSSProperties,
    clearBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#ef4444',
      cursor: 'pointer',
      padding: '0.25rem 0.625rem',
      borderRadius: '8px',
      transition: 'background 0.2s',
      background: 'transparent',
      border: 'none',
    } as React.CSSProperties,
    cartItem: (removing: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid #f0ebe4',
      transition: 'all 0.3s ease',
      opacity: removing ? 0 : 1,
      transform: removing ? 'translateX(30px)' : 'translateX(0)',
    } as React.CSSProperties),
    itemImage: {
      width: '80px',
      height: '80px',
      borderRadius: '12px',
      objectFit: 'cover' as const,
      flexShrink: 0,
      backgroundColor: '#f0ebe4',
    } as React.CSSProperties,
    itemInfo: {
      flex: 1,
      minWidth: 0,
    } as React.CSSProperties,
    itemName: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
      marginBottom: '0.25rem',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } as React.CSSProperties,
    itemCategory: {
      fontSize: '0.75rem',
      color: '#8a7e72',
      textTransform: 'capitalize' as const,
      marginBottom: '0.5rem',
    } as React.CSSProperties,
    itemPrice: {
      fontSize: '1.05rem',
      fontWeight: 800,
      color: '#f97316',
    } as React.CSSProperties,
    qtyControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexShrink: 0,
    } as React.CSSProperties,
    qtyBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#2d2418',
    } as React.CSSProperties,
    qtyNum: {
      width: '36px',
      textAlign: 'center' as const,
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#2d2418',
    } as React.CSSProperties,
    removeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#ef4444',
      flexShrink: 0,
    } as React.CSSProperties,
    itemTotal: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#2d2418',
      minWidth: '70px',
      textAlign: 'right' as const,
      flexShrink: 0,
    } as React.CSSProperties,
    // ── Empty State ──
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 2rem',
      gap: '1.25rem',
    } as React.CSSProperties,
    emptyIconWrap: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fff1e6, #fde8d0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    emptyTitle: {
      fontSize: '1.35rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    emptyDesc: {
      fontSize: '0.9rem',
      color: '#8a7e72',
      textAlign: 'center' as const,
      maxWidth: '280px',
    } as React.CSSProperties,
    shopBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.75rem',
      borderRadius: '9999px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.9rem',
      fontFamily: "'Nunito', sans-serif",
      textDecoration: 'none',
      boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
      transition: 'all 0.25s',
    } as React.CSSProperties,
    // ── Summary Column ──
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
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#8a7e72',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
    } as React.CSSProperties,
    summaryBody: {
      padding: '1.5rem',
    } as React.CSSProperties,
    promoWrap: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    promoInput: {
      flex: 1,
      padding: '0.625rem 1rem',
      borderRadius: '10px',
      border: '1.5px solid #e5ddd4',
      fontSize: '0.85rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      outline: 'none',
      backgroundColor: '#f7f2ec',
    } as React.CSSProperties,
    promoApplyBtn: {
      padding: '0.625rem 1rem',
      borderRadius: '10px',
      background: '#f97316',
      color: '#ffffff',
      border: 'none',
      fontWeight: 700,
      fontSize: '0.8rem',
      cursor: 'pointer',
      fontFamily: "'Nunito', sans-serif",
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    promoSuccess: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 0.875rem',
      borderRadius: '10px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#16a34a',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    promoErrorText: {
      fontSize: '0.75rem',
      color: '#ef4444',
      marginTop: '-1rem',
      marginBottom: '1rem',
    } as React.CSSProperties,
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
    } as React.CSSProperties,
    summaryLabel: {
      fontSize: '0.875rem',
      color: '#8a7e72',
    } as React.CSSProperties,
    summaryValue: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#2d2418',
    } as React.CSSProperties,
    summaryDiscount: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#22c55e',
    } as React.CSSProperties,
    divider: {
      height: '1px',
      backgroundColor: '#f0ebe4',
      margin: '1rem 0',
    } as React.CSSProperties,
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    totalLabel: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    totalValue: {
      fontSize: '1.35rem',
      fontWeight: 800,
      color: '#f97316',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    checkoutBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '0.875rem 1.5rem',
      borderRadius: '9999px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '1rem',
      fontFamily: "'Nunito', sans-serif",
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
      transition: 'all 0.25s',
    } as React.CSSProperties,
    trustBadges: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.625rem',
      marginTop: '1.25rem',
      padding: '1rem',
      backgroundColor: '#f7f2ec',
      borderRadius: '12px',
    } as React.CSSProperties,
    trustBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: '#8a7e72',
    } as React.CSSProperties,
    freeShippingBar: {
      padding: '0.75rem 1rem',
      backgroundColor: '#fff7ed',
      borderRadius: '10px',
      marginBottom: '1.25rem',
      border: '1px solid #fed7aa',
    } as React.CSSProperties,
    freeShippingText: {
      fontSize: '0.78rem',
      color: '#c2410c',
      fontWeight: 600,
      textAlign: 'center' as const,
    } as React.CSSProperties,
    freeShippingBar2: {
      height: '4px',
      borderRadius: '99px',
      backgroundColor: '#e5ddd4',
      marginTop: '0.5rem',
      overflow: 'hidden',
    } as React.CSSProperties,
    freeShippingFill: (pct: number) => ({
      height: '100%',
      width: `${Math.min(pct, 100)}%`,
      borderRadius: '99px',
      background: 'linear-gradient(90deg, #f97316, #ea580c)',
      transition: 'width 0.4s ease',
    } as React.CSSProperties),
  };

  const freeShippingPct = Math.min((sub / 999) * 100, 100);
  const amountLeft = Math.max(999 - sub, 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        {/* <div style={styles.header}>
          <div style={styles.headerIcon}>
            <ShoppingCart size={22} color="#fff" />
          </div>
          <div>
            <h1 style={styles.headerTitle}>My Cart</h1>
            <p style={styles.headerCount}>
              {items.length === 0 ? 'Empty' : `${items.length} item${items.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div> */}

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#8a7e72' }}>
          <Link to="/" style={{ color: '#8a7e72', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#f97316', fontWeight: 600 }}>Cart</span>
        </div>

        {items.length === 0 ? (
          // ── Empty State ──────────────────────────────
          <div style={styles.itemsCard}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIconWrap}>
                <ShoppingCart size={44} color="#f97316" strokeWidth={1.5} />
              </div>
              <h2 style={styles.emptyTitle}>Your cart is empty</h2>
              <p style={styles.emptyDesc}>Looks like you haven't added anything yet. Let's fix that!</p>
              <Link to="/products" style={styles.shopBtn}>
                <Package size={16} /> Start Shopping <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          // ── Cart Layout ──────────────────────────────
          <div style={styles.layout}>
            {/* Items Column */}
            <div>
              <div style={styles.itemsCard}>
                <div style={styles.itemsHeader}>
                  <span style={styles.itemsHeaderLabel}>Cart Items ({items.length})</span>
                  <button style={styles.clearBtn} onClick={clearCart}>
                    <Trash2 size={13} /> Clear all
                  </button>
                </div>

                {items.map((item) => {
                  const isRemoving = removingSkus.has(item.sku);
                  return (
                    <div key={item.sku} style={styles.cartItem(isRemoving)}>
                      {/* Image */}
                      <img
                        src={item.image || '/images/placeholder.png'}
                        alt={item.name}
                        style={styles.itemImage}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                      />

                      {/* Info */}
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.name}</div>
                        {item.size && (
                          <div style={styles.itemCategory}>Size: {item.size}</div>
                        )}
                        <div style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</div>
                      </div>

                      {/* Qty */}
                      <div style={styles.qtyControls}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={styles.qtyNum}>{item.quantity}</span>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div style={styles.itemTotal}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      {/* Remove */}
                      <button style={styles.removeBtn} onClick={() => handleRemove(item.sku)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
                <Link
                  to="/products"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: '#f97316', textDecoration: 'none' }}
                >
                  <Package size={15} /> Continue Shopping
                </Link>
              </div>


            </div>

            {/* Summary Column */}
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>Order Summary</div>
              <div style={styles.summaryBody}>

                {/* Free shipping progress */}
                <div style={styles.freeShippingBar}>
                  {deliveryFee === 0 ? (
                    <div style={styles.freeShippingText}>🎉 You've unlocked free delivery!</div>
                  ) : (
                    <div style={styles.freeShippingText}>
                      Add ₹{amountLeft.toLocaleString('en-IN')} more for FREE delivery
                    </div>
                  )}
                  <div style={styles.freeShippingBar2}>
                    <div style={styles.freeShippingFill(freeShippingPct)} />
                  </div>
                </div>

                {/* Promo code */}
                {!appliedPromo ? (
                  <>
                    <div style={styles.promoWrap}>
                      <Tag size={16} style={{ color: '#8a7e72', flexShrink: 0, marginTop: '0.7rem' }} />
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        style={styles.promoInput}
                      />
                      <button style={styles.promoApplyBtn} onClick={handleApplyPromo}>Apply</button>
                    </div>
                    {promoError && <div style={styles.promoErrorText}>{promoError}</div>}
                  </>
                ) : (
                  <div style={styles.promoSuccess}>
                    <Tag size={14} />
                    <span>
                      {appliedPromo.code} — {appliedPromo.type === 'percentage' ? `${appliedPromo.value}% OFF` : appliedPromo.type === 'flat' ? `₹${appliedPromo.value} OFF` : 'Free Shipping'} applied!
                    </span>
                    <button
                      onClick={() => { setAppliedPromo(null); setPromoInput(''); }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Price rows */}
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span style={styles.summaryValue}>₹{sub.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>
                      Discount {appliedPromo?.type === 'percentage' ? `(${appliedPromo.value}%)` : appliedPromo?.type === 'flat' ? '(Flat)' : ''}
                    </span>
                    <span style={styles.summaryDiscount}>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Delivery Fee</span>
                  <span style={deliveryFee === 0 ? { ...styles.summaryValue, color: '#22c55e' } : styles.summaryValue}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div style={styles.divider} />

                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  style={styles.checkoutBtn}
                  onClick={() => {
                    if (!isAuthenticated) {
                      addToast('Please login first to proceed to checkout! 🐾', 'warning');
                      navigate('/login');
                      return;
                    }

                    if (appliedPromo) {
                      sessionStorage.setItem('checkout_coupon', JSON.stringify(appliedPromo));
                    } else {
                      sessionStorage.removeItem('checkout_coupon');
                    }
                    navigate('/checkout/address');
                  }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                {/* Trust badges */}
                <div style={styles.trustBadges}>
                  <div style={styles.trustBadge}>
                    <ShieldCheck size={14} color="#22c55e" />
                    <span>100% Secure Payments</span>
                  </div>
                  <div style={styles.trustBadge}>
                    <Package size={14} color="#3b82f6" />
                    <span>Easy 7-day Returns</span>
                  </div>
                  <div style={styles.trustBadge}>
                    <ShieldCheck size={14} color="#f97316" />
                    <span>Authentic Products Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
