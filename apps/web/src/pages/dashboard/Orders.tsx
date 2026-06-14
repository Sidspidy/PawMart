import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, ShoppingBag, RotateCcw, Star } from 'lucide-react';
import { api } from '../../api';

type OrderStatus = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
}

interface DbOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  discount: number;
  subtotal: number;
  estimatedDelivery?: string;
}

const STATUS_CONFIG = {
  processing: { label: 'Processing', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  shipped:    { label: 'Shipped',    color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  delivered:  { label: 'Delivered',  color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const FILTER_TABS: { key: OrderStatus; label: string }[] = [
  { key: 'all',        label: 'All Orders' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped',    label: 'Shipped' },
  { key: 'delivered',  label: 'Delivered' },
  { key: 'cancelled',  label: 'Cancelled' },
];

const mapStatus = (status: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
  const s = status.toLowerCase();
  if (['pending', 'confirmed', 'packed', 'processing'].includes(s)) return 'processing';
  if (['shipped', 'out_for_delivery'].includes(s)) return 'shipped';
  if (s === 'delivered') return 'delivered';
  return 'cancelled';
};

export default function Orders() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        if (response.data?.success) {
          setOrders(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    const active = mapStatus(o.status);
    const matchStatus = activeFilter === 'all' || active === activeFilter;
    const matchSearch = !search || 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.productName.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const s = {
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    } as React.CSSProperties,
    title: {
      fontSize: '1.5rem',
      fontWeight: 900,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    subtitle: {
      fontSize: '0.82rem',
      color: '#8a7e72',
      marginTop: '0.2rem',
    } as React.CSSProperties,
    filterBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.25rem',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    searchWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flex: 1,
      minWidth: '220px',
      padding: '0.6rem 1rem',
      borderRadius: '12px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
    } as React.CSSProperties,
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '0.875rem',
      fontFamily: "'Inter', sans-serif",
      color: '#2d2418',
      backgroundColor: 'transparent',
    } as React.CSSProperties,
    tabsWrap: {
      display: 'flex',
      gap: '0.375rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5ddd4',
      padding: '0.3rem',
    } as React.CSSProperties,
    tab: (active: boolean) => ({
      padding: '0.4rem 0.875rem',
      borderRadius: '9px',
      fontSize: '0.8rem',
      fontWeight: active ? 700 : 500,
      color: active ? '#ffffff' : '#8a7e72',
      backgroundColor: active ? '#f97316' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties),
    orderCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5ddd4',
      overflow: 'hidden',
      marginBottom: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s',
    } as React.CSSProperties,
    orderHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid #f0ebe4',
      backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    orderId: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#2d2418',
      fontFamily: "'JetBrains Mono', monospace",
    } as React.CSSProperties,
    orderDate: {
      fontSize: '0.72rem',
      color: '#8a7e72',
      marginTop: '2px',
    } as React.CSSProperties,
    statusBadge: (status: keyof typeof STATUS_CONFIG) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.3rem 0.75rem',
      borderRadius: '99px',
      fontSize: '0.72rem',
      fontWeight: 700,
      color: STATUS_CONFIG[status].color,
      backgroundColor: STATUS_CONFIG[status].bg,
      border: `1px solid ${STATUS_CONFIG[status].border}`,
    } as React.CSSProperties),
    orderBody: {
      padding: '1rem 1.25rem',
    } as React.CSSProperties,
    itemRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.625rem',
    } as React.CSSProperties,
    itemImg: {
      width: '44px', height: '44px', borderRadius: '10px',
      objectFit: 'cover' as const, backgroundColor: '#f0ebe4', flexShrink: 0,
    } as React.CSSProperties,
    itemName: {
      fontSize: '0.82rem', fontWeight: 600, color: '#2d2418',
      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
    } as React.CSSProperties,
    itemPrice: {
      fontSize: '0.82rem', fontWeight: 700, color: '#f97316', flexShrink: 0,
    } as React.CSSProperties,
    orderFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.25rem',
      borderTop: '1px solid #f0ebe4',
      backgroundColor: '#fafaf9',
    } as React.CSSProperties,
    totalWrap: {
      fontSize: '0.82rem',
      color: '#8a7e72',
    } as React.CSSProperties,
    totalAmt: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#2d2418',
      fontFamily: "'Nunito', sans-serif",
    } as React.CSSProperties,
    footerBtns: {
      display: 'flex',
      gap: '0.5rem',
    } as React.CSSProperties,
    detailBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 1rem',
      borderRadius: '99px',
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.78rem',
      fontFamily: "'Nunito', sans-serif",
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
    } as React.CSSProperties,
    actionBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 1rem',
      borderRadius: '99px',
      border: '1.5px solid #e5ddd4',
      backgroundColor: '#ffffff',
      color: '#8a7e72',
      fontWeight: 600,
      fontSize: '0.78rem',
      textDecoration: 'none',
      cursor: 'pointer',
    } as React.CSSProperties,
    emptyState: {
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      justifyContent: 'center', padding: '4rem 2rem', gap: '1rem',
      backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e5ddd4',
    } as React.CSSProperties,
    emptyIcon: {
      width: '72px', height: '72px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #fff1e6, #fde8d0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } as React.CSSProperties,
  };

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.title}>My Orders</h1>
          <p style={s.subtitle}>
            {loading ? 'Loading...' : `${orders.length} total orders`}
          </p>
        </div>
      </div>

      {/* Filter + Search bar */}
      <div style={s.filterBar}>
        <div style={s.searchWrap}>
          <Search size={15} color="#8a7e72" />
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <div style={s.tabsWrap}>
          {FILTER_TABS.map(tab => (
            <button key={tab.key} style={s.tab(activeFilter === tab.key)} onClick={() => setActiveFilter(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}><Package size={32} color="#f97316" strokeWidth={1.5} /></div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d2418', fontFamily: "'Nunito', sans-serif" }}>No orders found</div>
          <div style={{ fontSize: '0.85rem', color: '#8a7e72' }}>Try a different filter or start shopping!</div>
          <Link to="/products" style={s.detailBtn}><ShoppingBag size={14} /> Shop Now</Link>
        </div>
      ) : (
        filtered.map(order => {
          const mappedStatusKey = mapStatus(order.status);
          return (
            <div key={order._id} style={s.orderCard}>
              {/* Header */}
              <div style={s.orderHeader}>
                <div>
                  <div style={s.orderId}>#{order.orderNumber}</div>
                  <div style={s.orderDate}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {order.estimatedDelivery && ` · Est. ${order.estimatedDelivery}`}
                  </div>
                </div>
                <div style={s.statusBadge(mappedStatusKey)}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: STATUS_CONFIG[mappedStatusKey].color }} />
                  {STATUS_CONFIG[mappedStatusKey].label}
                </div>
              </div>

              {/* Items */}
              <div style={s.orderBody}>
                {order.items.slice(0, 2).map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <img src={item.productImage || '/images/placeholder.png'} alt={item.productName} style={s.itemImg}
                      onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
                    <div style={s.itemName}>{item.productName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#8a7e72', flexShrink: 0, marginRight: '0.5rem' }}>×{item.quantity}</div>
                    <div style={s.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div style={{ fontSize: '0.75rem', color: '#8a7e72', paddingTop: '0.25rem' }}>
                    +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={s.orderFooter}>
                <div style={s.totalWrap}>
                  Total &nbsp;
                  <span style={s.totalAmt}>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <div style={s.footerBtns}>
                  {mappedStatusKey === 'delivered' && (
                    <button style={s.actionBtn}>
                      <Star size={12} /> Rate & Review
                    </button>
                  )}
                  {mappedStatusKey === 'delivered' && (
                    <Link to="/products" style={s.actionBtn}>
                      <RotateCcw size={12} /> Reorder
                    </Link>
                  )}
                  <Link to={`/dashboard/orders/${order._id}`} style={s.detailBtn}>
                    View Details <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
