import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  ShoppingBag, Search, Eye, ChevronRight, 
  TrendingUp, Clock, Truck, CheckCircle2, XCircle 
} from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'PW-9801', name: 'Ava Mitchell 🐶', itemsCount: 3, total: 142.50, date: 'May 28, 2026', status: 'Completed', tier: 'Gold Paw' },
  { id: 'PW-9802', name: 'Liam Davies 🐱', itemsCount: 1, total: 24.99, date: 'May 28, 2026', status: 'Shipped', tier: 'Silver Whiskers' },
  { id: 'PW-9803', name: 'Sophia Smith 🦜', itemsCount: 2, total: 12.50, date: 'May 27, 2026', status: 'Pending', tier: 'Bronze Feather' },
  { id: 'PW-9804', name: 'Oliver Johnson 🐰', itemsCount: 5, total: 85.20, date: 'May 26, 2026', status: 'Completed', tier: 'Gold Paw' },
  { id: 'PW-9805', name: 'Emma Wilson 🐱', itemsCount: 1, total: 9.99, date: 'May 25, 2026', status: 'Cancelled', tier: 'Guest' },
];

export default function OrderList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery);
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
          <ShoppingBag className="text-violet-500 fill-violet-100" />
          Order Shipments
        </h2>
        <p className="text-xs text-[#705e8c]">Monitor purchase checkouts, dispatch logistics, and status pipelines</p>
      </div>

      {/* FILTER & STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-[22px] border border-white/60 shadow-soft flex items-center gap-3">
          <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl"><Clock size={16} /></div>
          <div>
            <span className="text-[10px] font-bold text-[#9f8fb3] block">Pending dispatch</span>
            <span className="text-sm font-extrabold text-[#3d2c54]">1 Order</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-[22px] border border-white/60 shadow-soft flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl"><Truck size={16} /></div>
          <div>
            <span className="text-[10px] font-bold text-[#9f8fb3] block">In Transit</span>
            <span className="text-sm font-extrabold text-[#3d2c54]">1 Order</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-[22px] border border-white/60 shadow-soft flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle2 size={16} /></div>
          <div>
            <span className="text-[10px] font-bold text-[#9f8fb3] block">Completed today</span>
            <span className="text-sm font-extrabold text-[#3d2c54]">2 Orders</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-[22px] border border-white/60 shadow-soft flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-500 rounded-xl"><XCircle size={16} /></div>
          <div>
            <span className="text-[10px] font-bold text-[#9f8fb3] block">Failed checkouts</span>
            <span className="text-sm font-extrabold text-[#3d2c54]">1 Order</span>
          </div>
        </div>

      </div>

      {/* FILTER BUTTONS AND SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-4 rounded-[28px] border border-white/60">
        
        <div className="relative w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="Search Order ID or customer..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full clay-input pr-10 pl-5 text-xs py-2.5"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400" size={14} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending', 'Shipped', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`
                px-4 py-2 rounded-full text-xs font-bold transition-all
                ${selectedStatus === status 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'bg-white/80 hover:bg-white text-[#705e8c] border border-violet-100/50'}
              `}
            >
              {status === 'All' && '📋 All'}
              {status === 'Pending' && '🕒 Pending'}
              {status === 'Shipped' && '🚚 Shipped'}
              {status === 'Completed' && '✅ Completed'}
              {status === 'Cancelled' && '❌ Cancelled'}
            </button>
          ))}
        </div>

      </div>

      {/* TABLE DATA LIST CONTAINER */}
      <div className="glass-panel rounded-[32px] border border-white/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-violet-100">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Order ID</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Customer Name</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Items Count</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Checkout Cost</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Order Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20 text-right">View details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-4 px-6 font-extrabold text-sm text-[#3d2c54]">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-sm text-[#3d2c54]">{order.name}</span>
                      <span className="text-[10px] text-violet-500 font-bold bg-violet-100 px-2 py-0.2 rounded-full w-fit">
                        {order.tier}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-[#705e8c]">{order.itemsCount} articles</td>
                  <td className="py-4 px-6 font-extrabold text-sm text-[#3d2c54]">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-xs font-bold text-[#705e8c]">{order.date}</td>
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold
                      ${order.status === 'Completed' && 'bg-green-50 text-green-500'}
                      ${order.status === 'Shipped' && 'bg-blue-50 text-blue-500'}
                      ${order.status === 'Pending' && 'bg-orange-50 text-orange-500'}
                      ${order.status === 'Cancelled' && 'bg-red-50 text-red-500'}
                    `}>
                      <span className={`
                        w-1.5 h-1.5 rounded-full
                        ${order.status === 'Completed' && 'bg-green-400'}
                        ${order.status === 'Shipped' && 'bg-blue-400'}
                        ${order.status === 'Pending' && 'bg-orange-400'}
                        ${order.status === 'Cancelled' && 'bg-red-400'}
                      `} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <NavLink
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-[#8a5cf5] hover:text-[#705e8c] bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-all"
                    >
                      Inspect
                      <ChevronRight size={14} />
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
