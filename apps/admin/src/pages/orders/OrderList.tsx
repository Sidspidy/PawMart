import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  itemCount: number;
  date: string;
}

function mapBackendStatusToFrontend(s: string): string {
  switch (s) {
    case 'pending': return 'Placed';
    case 'confirmed':
    case 'packed': return 'Confirmed';
    case 'shipped':
    case 'out_for_delivery': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    case 'refunded': return 'Refunded';
    default: return 'Placed';
  }
}

interface OrderListProps {
  initialFilter?: 'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered';
  onFilterChange?: (filter: 'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered') => void;
  onViewDetail?: (orderId: string) => void;
}

const TABS = ['All', 'Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderList({ initialFilter = 'All', onFilterChange, onViewDetail }: OrderListProps) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialFilter);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await apiClient.get('/admin/orders?limit=100');
        if (res && res.data && Array.isArray(res.data)) {
          const mapped: OrderRow[] = res.data.map((o: any) => ({
            id: o._id,
            orderNumber: o.orderNumber || `#${o._id.slice(-6)}`,
            customerName: o.user?.name || o.shippingAddress?.fullName || 'Customer',
            customerEmail: o.user?.email || '',
            total: o.total,
            status: mapBackendStatusToFrontend(o.status),
            paymentMethod: o.paymentMethod || 'cod',
            paymentStatus: o.paymentStatus || 'pending',
            itemCount: o.items?.length || 0,
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '-',
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn('Could not load orders', err);
      }
    }
    loadOrders();
  }, []);

  useEffect(() => {
    setActiveTab(initialFilter);
  }, [initialFilter]);

  const handleTabChange = (t: string) => {
    setActiveTab(t);
    onFilterChange?.(t as any);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Confirmed': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Refunded': return 'bg-purple-50 text-purple-600 border border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const paymentMethodLabel = (m: string) =>
    ({ razorpay: 'Razorpay', stripe: 'Stripe', cashfree: 'Cashfree', cod: 'COD' }[m] || m);

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Search + Filter bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 flex items-center bg-white border-[3px] border-white rounded-2xl px-4 py-2.5 gap-2.5 shadow-clay-card">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search order ID or customer…"
            className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
            value={orderSearchTerm}
            onChange={(e) => setOrderSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center bg-white/50 border-2 border-white rounded-2xl p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === t ? 'bg-[#8e78f5] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="clay-table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="clay-th w-12">#</th>
              <th className="clay-th">Order ID</th>
              <th className="clay-th">Customer</th>
              <th className="clay-th text-center">Status</th>
              <th className="clay-th">Payment</th>
              <th className="clay-th">Items</th>
              <th className="clay-th">Total</th>
              <th className="clay-th">Date</th>
              <th className="clay-th text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord, index) => (
                <tr
                  key={ord.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="clay-td font-black text-[#8e78f5] text-sm">{index + 1}</td>
                  <td className="clay-td">
                    <span className="font-black text-[#8e78f5] text-sm font-mono">{ord.orderNumber}</span>
                  </td>
                  <td className="clay-td">
                    <div>
                      <h4 className="font-black text-sm text-slate-800">{ord.customerName}</h4>
                      {ord.customerEmail && (
                        <span className="text-[10px] text-slate-400 font-semibold">{ord.customerEmail}</span>
                      )}
                    </div>
                  </td>
                  <td className="clay-td text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${getStatusStyle(ord.status)}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="clay-td">
                    <div>
                      <p className="text-xs font-black text-slate-700">{paymentMethodLabel(ord.paymentMethod)}</p>
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        ord.paymentStatus === 'paid' ? 'text-emerald-600 bg-emerald-50' :
                        ord.paymentStatus === 'pending' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                      }`}>{ord.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="clay-td">
                    <span className="text-xs font-bold text-slate-500">
                      {ord.itemCount} {ord.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="clay-td">
                    <span className="font-black text-slate-800">₹{ord.total.toFixed(2)}</span>
                  </td>
                  <td className="clay-td">
                    <span className="text-xs font-semibold text-slate-400">{ord.date}</span>
                  </td>
                  <td className="clay-td text-right">
                    <button
                      onClick={() => onViewDetail?.(ord.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black bg-[#8e78f5]/10 text-[#8e78f5] border border-[#8e78f5]/20 hover:bg-[#8e78f5]/20 transition-all ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400 font-extrabold text-sm">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
