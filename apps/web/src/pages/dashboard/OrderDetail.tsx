import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Package, MapPin, CheckCircle, Truck, RotateCcw,
  ChevronLeft, Star, MessageSquare, Phone
} from 'lucide-react';
import { api } from '../../api';
import { useToastStore } from '../../store/toast.store';

interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface StatusHistory {
  status: string;
  note?: string;
  timestamp: string;
}

interface OrderDetailData {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  statusHistory: StatusHistory[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const ALL_STEPS = [
  { status: 'pending', label: 'Order Placed', icon: CheckCircle },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'packed', label: 'Packed', icon: Package },
  { status: 'shipped', label: 'In Transit', icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const { addToast } = useToastStore();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        if (response.data?.success) {
          setOrder(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch order detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  const handleSubmitReview = () => {
    addToast('Thank you for your rating & feedback! 🐾', 'success');
    setReviewOpen(false);
    setRating(0);
    setReviewComment('');
  };

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
    priceRow: {
      display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
    } as React.CSSProperties,
    priceLabel: { fontSize: '0.83rem', color: '#8a7e72' } as React.CSSProperties,
    priceVal: { fontSize: '0.83rem', fontWeight: 600, color: '#2d2418' } as React.CSSProperties,
    divider: { height: '1px', backgroundColor: '#f0ebe4', margin: '0.75rem 0' } as React.CSSProperties,
    addrLine: { fontSize: '0.85rem', color: '#2d2418', marginBottom: '0.25rem', lineHeight: 1.6 } as React.CSSProperties,
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Link to="/dashboard/orders" style={s.backLink}>
          <ChevronLeft size={14} /> Back to Orders
        </Link>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#8a7e72' }}>
          <h3>Order not found</h3>
        </div>
      </div>
    );
  }

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

      <h1 style={s.title}>Order #{order.orderNumber}</h1>
      <p style={{ fontSize: '0.8rem', color: '#8a7e72', marginBottom: '0.75rem' }}>
        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        {order.trackingNumber && (
          <span>&nbsp;·&nbsp;Tracking ID: <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{order.trackingNumber}</strong></span>
        )}
      </p>
      <div style={s.statusBadge}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
        Status: {order.status.toUpperCase()}
      </div>

      {/* Tracking timeline */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <Truck size={16} color="#f97316" />
          <span style={s.cardTitle}>Order Tracking</span>
        </div>
        <div style={s.cardBody}>
          <div style={s.trackingWrap}>
            {ALL_STEPS.map((step, idx) => {
              const isLast = idx === ALL_STEPS.length - 1;
              const historyItem = order.statusHistory?.find(
                (h) => h.status.toLowerCase() === step.status
              );
              const done = !!historyItem;
              const desc = historyItem 
                ? new Date(historyItem.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : 'Pending';

              return (
                <div key={step.label} style={s.trackStep(done, isLast)}>
                  {!isLast && <div style={s.trackLine(done)} />}
                  <IconComp icon={step.icon} done={done} />
                  <div>
                    <div style={s.trackLabel(done)}>{step.label}</div>
                    <div style={s.trackDesc}>{desc}</div>
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
          <span style={s.cardTitle}>Items ({order.items.length})</span>
        </div>
        <div style={s.cardBody}>
          {order.items.map((item, i) => (
            <div key={i} style={s.itemRow}>
              <img src={item.productImage || '/images/hero/dog.png'} alt={item.productName} style={s.itemImg}
                onError={e => { (e.target as HTMLImageElement).src = '/images/hero/dog.png'; }} />
              <div style={s.itemInfo}>
                <div style={s.itemName}>{item.productName}</div>
                <div style={s.itemSub}>{item.variant ? `Option: ${item.variant} · ` : ''}Qty: {item.quantity}</div>
              </div>
              <div style={s.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          ))}
          <div style={s.divider} />
          <div style={s.priceRow}><span style={s.priceLabel}>Subtotal</span><span style={s.priceVal}>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
          {order.discount > 0 && (
            <div style={s.priceRow}><span style={s.priceLabel}>Discount</span><span style={{ ...s.priceVal, color: '#ef4444' }}>−₹{order.discount.toLocaleString('en-IN')}</span></div>
          )}
          <div style={s.priceRow}><span style={s.priceLabel}>Delivery</span><span style={{ ...s.priceVal, color: '#22c55e' }}>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span></div>
          <div style={s.divider} />
          <div style={s.priceRow}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>Total</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f97316', fontFamily: "'Nunito', sans-serif" }}>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8a7e72', marginTop: '0.5rem' }}>Paid via {order.paymentMethod.toUpperCase()}</div>
        </div>
      </div>

      {/* Delivery address */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <MapPin size={16} color="#f97316" />
          <span style={s.cardTitle}>Delivery Address</span>
        </div>
        <div style={s.cardBody}>
          <div style={{ ...s.addrLine, fontWeight: 700 }}>{order.shippingAddress.fullName}</div>
          <div style={s.addrLine}>{order.shippingAddress.line1}</div>
          {order.shippingAddress.line2 && <div style={s.addrLine}>{order.shippingAddress.line2}</div>}
          <div style={s.addrLine}>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.82rem', color: '#8a7e72' }}>
            <Phone size={12} /> {order.shippingAddress.phone}
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
            <textarea placeholder="Share your experience..." rows={3} value={reviewComment} onChange={e => setReviewComment(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #e5ddd4', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", color: '#2d2418', resize: 'none', outline: 'none', backgroundColor: '#f7f2ec', boxSizing: 'border-box' }} />
            <button style={{ ...s.primaryBtn, marginTop: '0.875rem' }} onClick={handleSubmitReview}>
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
