import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Smartphone, Building, Check, Lock, ShieldCheck,
  Package, ArrowLeft, ArrowRight, ChevronDown, Wallet, Zap, MapPin
} from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useToastStore } from '../../store/toast.store';
import { api } from '../../api';

const STEP_LABELS = ['Cart', 'Address', 'Payment', 'Confirm'];

type PaymentMethod = 'stripe' | 'razorpay' | 'cashfree' | 'cod';

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

const getGatewayBrand = (id: PaymentMethod) => {
  switch (id) {
    case 'razorpay':
      return { primary: '#3399cc', light: '#eff6ff' };
    case 'cashfree':
      return { primary: '#00cc99', light: '#f0fdf4' };
    case 'stripe':
      return { primary: '#635bff', light: '#f5f4ff' };
    case 'cod':
    default:
      return { primary: '#10b981', light: '#f0fdf4' };
  }
};

export default function Payment() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  // Load address from sessionStorage
  const addressString = sessionStorage.getItem('checkout_address');
  const address = addressString ? (() => {
    try {
      return JSON.parse(addressString);
    } catch {
      return null;
    }
  })() : null;

  useEffect(() => {
    if (!addressString) {
      addToast('Please select a shipping address first! 🐾', 'warning');
      navigate('/checkout/address');
    }
  }, [addressString, navigate, addToast]);
  const [method, setMethod] = useState<PaymentMethod>('razorpay');
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
  
  // Parse coupon from sessionStorage
  const couponString = sessionStorage.getItem('checkout_coupon');
  const coupon = couponString ? (() => {
    try {
      return JSON.parse(couponString);
    } catch {
      return null;
    }
  })() : null;

  let couponDiscount = 0;
  let deliveryFee = sub >= 999 ? 0 : 49;
  if (coupon) {
    if (coupon.type === 'percentage') {
      couponDiscount = Math.round((sub * coupon.value) / 100);
    } else if (coupon.type === 'flat') {
      couponDiscount = Math.min(coupon.value, sub);
    } else if (coupon.type === 'free_shipping') {
      deliveryFee = 0;
    }
  }

  const total = Math.max(0, sub - couponDiscount + deliveryFee);

  const formatCardNum = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    if (method === 'stripe') {
      if (!cardNum.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        addToast('Please enter all card details to proceed! 🐾', 'warning');
        return;
      }
    }

    setProcessing(true);
    try {
      // 1. Load checkout address from sessionStorage
      const addressString = sessionStorage.getItem('checkout_address');
      if (!addressString) {
        addToast('Delivery address is missing. Please choose address again! 🐾', 'error');
        navigate('/checkout/address');
        return;
      }
      const rawAddress = JSON.parse(addressString);

      // Map rawAddress to what schema expects
      const shippingAddress = {
        fullName: rawAddress.fullName,
        phone: rawAddress.phone,
        line1: rawAddress.addressLine1,
        line2: rawAddress.addressLine2 || '',
        city: rawAddress.city,
        state: rawAddress.state,
        pincode: rawAddress.pincode,
        country: 'India',
      };

      // 2. Load coupon code from sessionStorage if any
      const couponString = sessionStorage.getItem('checkout_coupon');
      let couponCode = undefined;
      if (couponString) {
        try {
          const parsed = JSON.parse(couponString);
          couponCode = parsed?.code || undefined;
        } catch {
          couponCode = couponString || undefined;
        }
      }

      // 3. Build items array for API
      const apiItems = items.map(item => ({
        product: item.product,
        variant: item.variant || item.size || undefined,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      }));

      // 4. Send POST /api/orders
      const response = await api.post('/orders', {
        items: apiItems,
        shippingAddress,
        paymentMethod: method,
        couponCode,
        pointsToRedeem: 0,
      });

      if (!response.data?.success) {
        addToast(response.data?.message || 'Failed to create order', 'error');
        setProcessing(false);
        return;
      }

      const createdOrder = response.data.data;

      // 5. Cash on Delivery (COD) flow
      if (method === 'cod') {
        addToast('Order placed successfully! 🐾', 'success');
        clearCart();
        navigate('/checkout/confirmation', {
          state: { order: createdOrder, shippingAddress }
        });
        return;
      }

      // 6. Online Payment Gateways initiation
      const initRes = await api.post('/payment/initiate', {
        orderId: createdOrder._id,
        gateway: method,
      });

      if (!initRes.data?.success) {
        addToast('Failed to initiate payment gateway session', 'error');
        setProcessing(false);
        return;
      }

      const paymentData = initRes.data.data;

      // 7. Gateway-specific SDK flows
      if (method === 'razorpay') {
        const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!loaded) {
          addToast('Failed to load Razorpay Checkout SDK', 'error');
          setProcessing(false);
          return;
        }

        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount * 100,
          currency: paymentData.currency,
          name: 'PawMart',
          description: `Order #${createdOrder.orderNumber}`,
          order_id: paymentData.orderId,
          handler: async function (rzpResponse: any) {
            try {
              setProcessing(true);
              const verifyRes = await api.post('/payment/verify', {
                orderId: createdOrder._id,
                gateway: 'razorpay',
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpayPaymentId: rzpResponse.razorpay_payment_id,
                razorpaySignature: rzpResponse.razorpay_signature,
              });

              if (verifyRes.data?.success) {
                addToast('Payment verified successfully! 🐾', 'success');
                clearCart();
                navigate('/checkout/confirmation', {
                  state: { order: createdOrder, shippingAddress }
                });
              } else {
                addToast('Payment verification failed on server', 'error');
              }
            } catch (err: any) {
              console.error(err);
              addToast(err.response?.data?.message || 'Verification failed', 'error');
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
          },
          theme: {
            color: '#f97316',
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } else if (method === 'stripe') {
        const loaded = await loadScript('https://js.stripe.com/v3/');
        if (!loaded) {
          addToast('Failed to load Stripe Checkout SDK', 'error');
          setProcessing(false);
          return;
        }

        const stripe = (window as any).Stripe(paymentData.keyId);
        const confirmResult = await stripe.confirmCardPayment(paymentData.clientSecret, {
          payment_method: {
            card: {
              number: cardNum.replace(/\s/g, ''),
              exp_month: cardExpiry.split('/')[0],
              exp_year: '20' + cardExpiry.split('/')[1],
              cvc: cardCvv,
              billing_details: {
                name: cardName || shippingAddress.fullName,
                phone: shippingAddress.phone,
              }
            }
          }
        });

        if (confirmResult.error) {
          addToast(confirmResult.error.message || 'Stripe card payment failed', 'error');
          setProcessing(false);
          return;
        }

        if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'succeeded') {
          const verifyRes = await api.post('/payment/verify', {
            orderId: createdOrder._id,
            gateway: 'stripe',
            stripePaymentIntentId: confirmResult.paymentIntent.id,
          });

          if (verifyRes.data?.success) {
            addToast('Payment captured successfully! 🐾', 'success');
            clearCart();
            navigate('/checkout/confirmation', {
              state: { order: createdOrder, shippingAddress }
            });
          } else {
            addToast('Server verification failed for Stripe payment', 'error');
          }
        }

      } else if (method === 'cashfree') {
        const loaded = await loadScript('https://sdk.cashfree.com/js/v3/cashfree.js');
        if (!loaded) {
          addToast('Failed to load Cashfree Checkout SDK', 'error');
          setProcessing(false);
          return;
        }

        const cashfree = (window as any).Cashfree({
          mode: 'sandbox',
        });

        cashfree.checkout({
          paymentSessionId: paymentData.clientSecret,
          returnUrl: `${window.location.origin}/checkout/confirmation?order_id=${createdOrder._id}`,
        });
      }

    } catch (err: any) {
      console.error('Order/Payment error:', err);
      addToast(err.response?.data?.message || 'Error processing your checkout', 'error');
    } finally {
      if (method !== 'cashfree') {
        setProcessing(false);
      }
    }
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
    methodTab: (active: boolean, id: PaymentMethod) => {
      const brand = getGatewayBrand(id);
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #f0ebe4',
        cursor: 'pointer',
        backgroundColor: active ? brand.light : '#ffffff',
        borderLeft: `3px solid ${active ? brand.primary : 'transparent'}`,
        transition: 'all 0.2s',
      };
    },
    methodIcon: (active: boolean, id: PaymentMethod) => {
      const brand = getGatewayBrand(id);
      return {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? `${brand.primary}18` : '#f7f2ec',
        color: active ? brand.primary : '#8a7e72',
        flexShrink: 0,
        transition: 'all 0.2s',
      };
    },
    methodLabel: (active: boolean, id: PaymentMethod) => {
      const brand = getGatewayBrand(id);
      return {
        flex: 1,
        fontSize: '0.9rem',
        fontWeight: active ? 700 : 500,
        color: active ? brand.primary : '#8a7e72',
        fontFamily: "'Nunito', sans-serif",
      };
    },
    radioCircle: (active: boolean, id: PaymentMethod) => {
      const brand = getGatewayBrand(id);
      return {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: `2px solid ${active ? brand.primary : '#e5ddd4'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s',
      };
    },
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
    payBtn: (loading: boolean, id: PaymentMethod) => {
      const brand = getGatewayBrand(id);
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.85rem 2rem',
        borderRadius: '9999px',
        background: loading ? '#d1d5db' : brand.primary,
        color: '#ffffff',
        fontWeight: 800,
        fontSize: '0.95rem',
        fontFamily: "'Nunito', sans-serif",
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : `0 6px 20px ${brand.primary}40`,
        transition: 'all 0.25s',
      };
    },
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
    { id: 'razorpay', label: 'Razorpay', icon: <Smartphone size={18} />, badge: 'Popular' },
    { id: 'cashfree', label: 'Cashfree', icon: <Building size={18} /> },
    { id: 'stripe', label: 'Stripe Card', icon: <CreditCard size={18} /> },
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
                    <div key={tab.id} style={s.methodTab(method === tab.id, tab.id)} onClick={() => setMethod(tab.id)}>
                      <div style={s.methodIcon(method === tab.id, tab.id)}>{tab.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={s.methodLabel(method === tab.id, tab.id)}>{tab.label}</div>
                        {tab.badge && (
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#22c55e', backgroundColor: '#f0fdf4', padding: '1px 6px', borderRadius: '99px', display: 'inline-block', marginTop: '2px' }}>
                            {tab.badge}
                          </div>
                        )}
                      </div>
                      <div style={s.radioCircle(method === tab.id, tab.id)}>
                        {method === tab.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getGatewayBrand(tab.id).primary }} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Method content */}
                <div style={{ flex: 1, padding: '1.5rem' }}>
                  {/* Razorpay */}
                  {method === 'razorpay' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', textAlign: 'center', gap: '1rem' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={32} color="#3b82f6" />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.375rem' }}>Razorpay Secure Checkout</div>
                        <div style={{ fontSize: '0.85rem', color: '#8a7e72', maxWidth: '320px' }}>Pay instantly using Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, or Wallets.</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Check size={13} /> Secured by Razorpay
                      </div>
                    </div>
                  )}

                  {/* Cashfree */}
                  {method === 'cashfree' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', textAlign: 'center', gap: '1rem' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building size={32} color="#a855f7" />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif", marginBottom: '0.375rem' }}>Cashfree Payments</div>
                        <div style={{ fontSize: '0.85rem', color: '#8a7e72', maxWidth: '320px' }}>Redirect to Cashfree secure portal to pay using UPI, Cards, Net Banking, and more.</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '9999px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Check size={13} /> Secured by Cashfree
                      </div>
                    </div>
                  )}

                  {/* Stripe Card */}
                  {method === 'stripe' && (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d2418', marginBottom: '1rem', fontFamily: "'Nunito', sans-serif" }}>
                        Enter Card Details (Stripe)
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#8a7e72', marginTop: '0.5rem' }}>
                        <Lock size={12} /> Your card details are processed securely via Stripe
                      </div>
                    </div>
                  )}

                  {/* COD */}
                  {method === 'cod' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', textAlign: 'center', gap: '1rem' }}>
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
                  <button style={s.payBtn(processing, method)} onClick={handlePay} disabled={processing}>
                    {processing ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={15} />{' '}
                        {method === 'cod'
                          ? 'Confirm Order (COD)'
                          : method === 'razorpay'
                          ? `Pay via Razorpay`
                          : method === 'cashfree'
                          ? `Pay via Cashfree`
                          : `Pay with Stripe`}{' '}
                        <ArrowRight size={15} />
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
                    src={item.image || '/images/placeholder.png'}
                    alt={item.name}
                    style={s.summaryImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
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
              {couponDiscount > 0 && (
                <div style={s.priceRow}>
                  <span style={s.priceLabel}>Coupon Discount ({coupon?.code})</span>
                  <span style={{ ...s.priceValue, color: '#22c55e' }}>−₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
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
