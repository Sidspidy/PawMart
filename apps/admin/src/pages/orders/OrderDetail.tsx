import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  CreditCard,
  Tag,
  Star,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import ConfirmModal from '../../components/common/ConfirmModal';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

// ── All statuses available for dropdown ───────────────────────────────────────
const ALL_STATUSES = [
  { value: 'pending', label: 'Placed', dot: 'bg-blue-400', desc: 'Order received, awaiting processing' },
  { value: 'confirmed', label: 'Confirmed', dot: 'bg-amber-400', desc: 'Verified and being prepared' },
  { value: 'packed', label: 'Packed', dot: 'bg-amber-500', desc: 'Items packed, ready to dispatch' },
  { value: 'shipped', label: 'Shipped', dot: 'bg-indigo-400', desc: 'Handed off to courier' },
  { value: 'out_for_delivery', label: 'Out for Delivery', dot: 'bg-indigo-500', desc: 'On the way to customer' },
  { value: 'delivered', label: 'Delivered', dot: 'bg-emerald-500', desc: 'Successfully received by customer' },
  { value: 'cancelled', label: 'Cancelled', dot: 'bg-red-400', desc: 'Order has been cancelled' },
  { value: 'refunded', label: 'Refunded', dot: 'bg-purple-400', desc: 'Payment refunded to customer' },
];

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-blue-50 text-blue-600 border-blue-200',
  confirmed: 'bg-amber-50 text-amber-600 border-amber-200',
  packed: 'bg-amber-50 text-amber-600 border-amber-200',
  shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  out_for_delivery: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  refunded: 'bg-purple-50 text-purple-600 border-purple-200',
};

function statusLabel(s: string) {
  return ALL_STATUSES.find(x => x.value === s)?.label || s;
}
function statusDot(s: string) {
  return ALL_STATUSES.find(x => x.value === s)?.dot || 'bg-slate-300';
}

function paymentMethodLabel(m: string): string {
  return { razorpay: 'Razorpay', stripe: 'Stripe', cashfree: 'Cashfree', cod: 'Cash on Delivery' }[m] || m;
}
function paymentStatusStyle(s: string) {
  switch (s) {
    case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'failed': return 'bg-red-50 text-red-600 border-red-200';
    case 'refunded': return 'bg-purple-50 text-purple-600 border-purple-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

// ── Product image with fallback ───────────────────────────────────────────────
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  const isValid = src && (src.startsWith('http://') || src.startsWith('https://'));
  if (!isValid || errored) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#f0edff] to-[#e4dfff] flex items-center justify-center text-2xl select-none">
        🐾
      </div>
    );
  }
  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErrored(true)} />;
}

// ── Status Dropdown ───────────────────────────────────────────────────────────
function StatusDropdown({
  currentStatus,
  loading,
  onSelect,
}: {
  currentStatus: string;
  loading: boolean;
  onSelect: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = ALL_STATUSES.find(s => s.value === currentStatus);
  const badgeClass = STATUS_BADGE[currentStatus] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger button */}
      <button
        onClick={() => !loading && setOpen(o => !o)}
        disabled={loading}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-[#8e78f5]/40 hover:bg-[#8e78f5]/5 transition-all disabled:opacity-60 group"
      >
        {/* Colored dot */}
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot(currentStatus)}`} />

        {/* Current label */}
        <div className="flex-1 text-left">
          <p className="text-xs font-black text-[#3b2b5c]">{current?.label || 'Unknown'}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{current?.desc || ''}</p>
        </div>

        {/* Chevron / spinner */}
        {loading
          ? <RefreshCw className="w-4 h-4 text-[#8e78f5] animate-spin shrink-0" />
          : <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        }
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border-2 border-slate-100 shadow-xl overflow-hidden animate-slide-in">
          {ALL_STATUSES.map((st, i) => {
            const isCurrent = st.value === currentStatus;
            const isDestructive = st.value === 'cancelled' || st.value === 'refunded';
            return (
              <React.Fragment key={st.value}>
                {/* Divider before cancelled */}
                {i > 0 && isDestructive && !ALL_STATUSES[i - 1].value.match(/cancelled|refunded/) && (
                  <div className="h-px bg-slate-100 mx-3" />
                )}
                <button
                  onClick={() => {
                    if (!isCurrent) onSelect(st.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isCurrent
                      ? 'bg-[#8e78f5]/8 cursor-default'
                      : isDestructive
                        ? 'hover:bg-red-50'
                        : 'hover:bg-slate-50'
                    }`}
                >
                  {/* Dot */}
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black ${isCurrent ? 'text-[#8e78f5]' : isDestructive ? 'text-red-600' : 'text-slate-700'
                      }`}>
                      {st.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold leading-tight">{st.desc}</p>
                  </div>

                  {/* Current check */}
                  {isCurrent && (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeClass}`}>
                      Current
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/orders/${orderId}`);
      if (res?.success && res.data) setOrder(res.data);
    } catch (err) {
      console.error('Failed to load order detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order || statusUpdating || newStatus === order.status) return;
    setStatusUpdating(true);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status changed to ${statusLabel(newStatus)} by admin.`,
      });
      await fetchOrder();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const triggerStatusConfirm = (newStatus: string) => {
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      handleUpdateStatus(pendingStatus);
    }
    setConfirmOpen(false);
    setPendingStatus(null);
  };

  const getConfirmDetails = (status: string | null) => {
    if (!status) return { title: '', message: '', emoji: '🐾', type: 'info' as const };
    const label = statusLabel(status);
    switch (status) {
      case 'cancelled':
        return {
          title: 'Cancel Order?',
          message: 'Are you sure you want to cancel this order? This action cannot be undone.',
          emoji: '🛑',
          type: 'danger' as const,
        };
      case 'refunded':
        return {
          title: 'Refund Order?',
          message: 'Are you sure you want to refund this order? This will mark the payment as refunded.',
          emoji: '💸',
          type: 'danger' as const,
        };
      case 'delivered':
        return {
          title: 'Mark as Delivered?',
          message: 'Are you sure you want to mark this order as Delivered? Points will be rewarded to the customer.',
          emoji: '🎉',
          type: 'info' as const,
        };
      default:
        return {
          title: 'Update Status?',
          message: `Are you sure you want to change the order status to "${label}"?`,
          emoji: '🚚',
          type: 'info' as const,
        };
    }
  };

  const confirmDetails = getConfirmDetails(pendingStatus);

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center py-32">
        <RefreshCw className="w-6 h-6 animate-spin text-[#8e78f5]" />
        <span className="ml-3 text-slate-500 font-semibold">Loading order details…</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-slate-500 font-bold">Order not found</p>
        <button onClick={onBack} className="clay-btn clay-btn-light px-4 py-2 text-sm">Go Back</button>
      </div>
    );
  }

  const customer = order.user || {};
  const addr = order.shippingAddress || {};
  const statusBadge = STATUS_BADGE[order.status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="space-y-5 pb-8">

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 flex-wrap">
        <button onClick={onBack} className="clay-btn clay-btn-light p-2.5 rounded-2xl shadow-sm mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-black text-[#3b2b5c] text-2xl tracking-tight">{order.orderNumber}</h2>
            <span className={`px-3 py-1 text-xs font-black uppercase tracking-wide rounded-full border ${statusBadge}`}>
              {statusLabel(order.status)}
            </span>
            <span className={`px-2.5 py-1 text-[11px] font-black rounded-full border ${paymentStatusStyle(order.paymentStatus)}`}>
              {order.paymentStatus?.toUpperCase()}
            </span>
          </div>
          <p className="text-[12px] text-slate-400 font-semibold mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <button onClick={fetchOrder} className="clay-btn clay-btn-light p-2.5 rounded-2xl shadow-sm" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT: Products + Pricing (2/3) */}
        <div className="xl:col-span-2 space-y-5">

          {/* Ordered Items */}
          <div className="clay-white-card rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-[#8e78f5]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Ordered Items ({order.items?.length || 0})
              </h3>
            </div>
            <div className="space-y-3">
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f0edff] border border-slate-200">
                    <ProductImage src={item.productImage} alt={item.productName} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-800 truncate">{item.productName}</p>
                    {item.variant && (
                      <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 bg-[#8e78f5]/10 text-[#8e78f5] rounded-full">
                        {item.variant}
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-slate-400 font-semibold">
                      ₹{item.price?.toFixed(2)} × {item.quantity}
                    </p>
                    <p className="font-black text-slate-800 text-base mt-0.5">
                      ₹{item.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="clay-white-card rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[#8e78f5]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pricing Breakdown</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-semibold">Subtotal</span>
                <span className="font-black text-slate-800">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-semibold">Shipping</span>
                <span className={`font-black ${order.shippingFee === 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                  {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee?.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Discount</span>
                  <span className="font-black text-red-500">− ₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Tax (GST)</span>
                  <span className="font-black text-slate-800">₹{order.tax?.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="font-black text-[#3b2b5c] text-base">Grand Total</span>
                <span className="font-black text-[#8e78f5] text-xl">₹{order.total?.toFixed(2)}</span>
              </div>
            </div>

            {order.couponCode && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-black text-emerald-700">Coupon Applied</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    {order.couponCode} — saved ₹{order.discount?.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {(order.pointsUsed > 0 || order.pointsEarned > 0) && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {order.pointsUsed > 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-wide">Points Used</p>
                      <p className="text-sm font-black text-orange-700">{order.pointsUsed} pts</p>
                    </div>
                  </div>
                )}
                {order.pointsEarned > 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-wide">Points Earned</p>
                      <p className="text-sm font-black text-amber-700">+{order.pointsEarned} pts</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Payment Method</p>
                <p className="text-sm font-black text-slate-700">{paymentMethodLabel(order.paymentMethod)}</p>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border ${paymentStatusStyle(order.paymentStatus)}`}>
                {order.paymentStatus?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Status + Customer + Address + History (1/3) */}
        <div className="space-y-5">

          {/* ── Update Order Status — dropdown ────────────────────────────── */}
          <div className="clay-white-card rounded-[28px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-[#8e78f5]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Status</h3>
            </div>
            <StatusDropdown
              currentStatus={order.status}
              loading={statusUpdating}
              onSelect={triggerStatusConfirm}
            />
          </div>

          {/* ── Customer ──────────────────────────────────────────────────── */}
          <div className="clay-white-card rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#8e78f5]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8e78f5] to-[#c4b8ff] flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                {(customer.name || 'C')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-black text-slate-800">{customer.name || 'Unknown'}</p>
                <p className="text-[11px] text-slate-400 font-semibold">Registered Customer</p>
              </div>
            </div>
            <div className="space-y-2">
              {customer.email && (
                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold truncate">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Delivery Address ──────────────────────────────────────────── */}
          <div className="clay-white-card rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#8e78f5]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Address</h3>
            </div>
            <div className="space-y-1.5">
              <p className="font-black text-slate-800 text-sm">{addr.fullName}</p>
              <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                <Phone className="w-3 h-3 shrink-0" />
                <span className="font-semibold">{addr.phone}</span>
              </div>
              <p className="text-[12px] text-slate-600 font-semibold leading-relaxed">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
              </p>
              <p className="text-[12px] text-slate-600 font-semibold">
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">{addr.country || 'India'}</p>
            </div>
          </div>

          {/* ── Status History ────────────────────────────────────────────── */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="clay-white-card rounded-[28px] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#8e78f5]" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Status History</h3>
              </div>
              <div className="relative border-l-2 border-slate-100 pl-4 space-y-4">
                {[...order.statusHistory].reverse().map((h: any, i: number) => (
                  <div key={i} className="relative">
                    <div className={`absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${i === 0 ? 'bg-[#8e78f5]' : 'bg-slate-300'
                      }`} />
                    <p className={`text-[11px] font-black ${i === 0 ? 'text-[#3b2b5c]' : 'text-slate-500'}`}>
                      {statusLabel(h.status)}
                    </p>
                    {h.note && (
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-snug">{h.note}</p>
                    )}
                    <p className="text-[10px] text-slate-300 font-semibold mt-0.5">
                      {new Date(h.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.trackingNumber && (
            <div className="clay-white-card rounded-[28px] p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tracking Number</p>
              <p className="font-black text-[#8e78f5] text-sm font-mono">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmDetails.title}
        message={confirmDetails.message}
        emoji={confirmDetails.emoji}
        type={confirmDetails.type}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingStatus(null);
        }}
      />
    </div>
  );
}
