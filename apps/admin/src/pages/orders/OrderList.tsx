import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Sparkles
} from 'lucide-react';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  petTag: string;
  total: number;
  status: 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered';
  date: string;
  items: OrderItem[];
}

const initialOrders: Order[] = [
  { id: '2844', customerName: 'Oliver Vance', petTag: 'Cooper (Golden Retriever)', total: 74.50, status: 'Placed', date: '2026-05-28', items: [{ name: 'Sunset Premium Kibble', qty: 2, price: 29.99 }, { name: 'Rubber Chew Toy Bone', qty: 1, price: 14.52 }] },
  { id: '2843', customerName: 'Sophia Miller', petTag: 'Luna (Persian Cat)', total: 148.00, status: 'Confirmed', date: '2026-05-28', items: [{ name: 'Luxury Scratching Post', qty: 1, price: 89.99 }, { name: 'Organic Salmon Treats', qty: 2, price: 29.00 }] },
  { id: '2842', customerName: 'William Davies', petTag: 'Bubbles (Clown Fish)', total: 65.00, status: 'Shipped', date: '2026-05-27', items: [{ name: 'Silent Bio-Filter Tank', qty: 1, price: 65.00 }] },
  { id: '2841', customerName: 'Charlotte Smith', petTag: 'Pip (Parrot)', total: 110.00, status: 'Delivered', date: '2026-05-26', items: [{ name: 'Sky-view Bird Cage Small', qty: 1, price: 110.00 }] },
];

interface OrderListProps {
  initialFilter?: 'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered';
  onFilterChange?: (filter: 'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered') => void;
}

export default function OrderList({ initialFilter = 'All', onFilterChange }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered'>(initialFilter);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Synchronize state when props change
  React.useEffect(() => {
    setActiveTab(initialFilter);
  }, [initialFilter]);

  const handleTabChange = (t: 'All' | 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered') => {
    setActiveTab(t);
    onFilterChange?.(t);
  };

  const updateStatus = (orderId: string, newStatus: 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered') => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Confirmed': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) || 
      o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 relative">
      
      {/* Upper stats bar with search bar on left, tab filters on right */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80 flex items-center bg-white border-[3px] border-white rounded-2xl px-4 py-2.5 gap-2.5 shadow-clay-card">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search order ID or customer..."
            className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
            value={orderSearchTerm}
            onChange={(e) => setOrderSearchTerm(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center bg-white/50 border-2 border-white rounded-2xl p-1 shadow-sm">
          {['All', 'Placed', 'Confirmed', 'Shipped', 'Delivered'].map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === t ? 'bg-[#8e78f5] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main split: Order logs + Drawer preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Table list */}
        <div className={`clay-table-container transition-all duration-300 ${selectedOrder ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="clay-th w-16">S.No.</th>
                <th className="clay-th">Order ID</th>
                <th className="clay-th">Customer details</th>
                <th className="clay-th text-center">Status</th>
                <th className="clay-th">Total Amount</th>
                <th className="clay-th">Purchase Date</th>
                <th className="clay-th text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord, index) => (
                  <tr 
                    key={ord.id} 
                    onClick={() => setSelectedOrder(ord)}
                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedOrder?.id === ord.id ? 'bg-[#8e78f5]/5' : ''}`}
                  >
                    <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                    <td className="clay-td">
                      <span className="font-extrabold text-[#8e78f5]">#PW-{ord.id}</span>
                    </td>
                    <td className="clay-td">
                      <div>
                        <h4 className="font-black text-sm text-slate-800">{ord.customerName}</h4>
                        <span className="text-[10px] text-slate-400 font-extrabold">{ord.petTag}</span>
                      </div>
                    </td>
                    <td className="clay-td text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${getStatusStyle(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="clay-td">
                      <span className="font-black text-slate-800">${ord.total.toFixed(2)}</span>
                    </td>
                    <td className="clay-td">
                      <span className="font-semibold text-slate-400">{ord.date}</span>
                    </td>
                    <td className="clay-td text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 inline" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-extrabold text-sm">
                    No orders matching this category type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Order Timeline Drawer Details (Exactly matching neomorphism style) */}
        {selectedOrder && (
          <div className="clay-white-card rounded-[32px] p-6 space-y-6 flex flex-col justify-between border-[3px] border-white shadow-clay-card relative animate-slide-in">
            {/* Close button */}
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-500 hover:text-slate-800 active:scale-95 transition-all shadow-sm"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Detailed Logs</span>
              <h3 className="font-black text-[#3b2b5c] text-lg mt-1">Order #PW-{selectedOrder.id}</h3>
              <p className="text-[11px] text-slate-400 font-semibold">{selectedOrder.customerName} &middot; {selectedOrder.petTag}</p>
            </div>

            {/* Items list */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Purchased Items</span>
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{item.qty}x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200/50 pt-2 flex items-center justify-between text-xs font-black text-[#8e78f5]">
                <span>Total Amount</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Tracking Status timeline */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tracking timeline</span>
              
              <div className="space-y-3 pl-3.5 relative border-l-2 border-slate-100">
                {/* Placed */}
                <div className="relative">
                  <div className={`absolute left-[-21px] top-[2px] w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${
                    ['Placed', 'Confirmed', 'Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                  <span className="text-xs font-black text-slate-800 block">Placed</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Payment processed and registered</span>
                </div>

                {/* Confirmed */}
                <div className="relative">
                  <div className={`absolute left-[-21px] top-[2px] w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${
                    ['Confirmed', 'Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                  <span className="text-xs font-black text-slate-800 block">Confirmed</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Order validated inside staff dashboard</span>
                </div>

                {/* Shipped */}
                <div className="relative">
                  <div className={`absolute left-[-21px] top-[2px] w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${
                    ['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                  <span className="text-xs font-black text-slate-800 block">Shipped</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Courier package generated & sent</span>
                </div>

                {/* Delivered */}
                <div className="relative">
                  <div className={`absolute left-[-21px] top-[2px] w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${
                    selectedOrder.status === 'Delivered' ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                  <span className="text-xs font-black text-slate-800 block">Delivered</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Package received by pet parent</span>
                </div>
              </div>
            </div>

            {/* Quick status controls */}
            <div className="border-t border-slate-50 pt-4 flex flex-wrap gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block w-full">Update Order Status</span>
              {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => updateStatus(selectedOrder.id, st as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    selectedOrder.status === st 
                      ? 'bg-slate-700 text-white shadow-sm border border-slate-800' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
