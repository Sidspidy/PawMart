import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Sparkles,
  Award,
  Heart,
  ChevronRight,
  HeartHandshake,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  pointsBalance: number;
  isActive: boolean;
  avatar?: string;
  petName?: string;
  petSpecies?: string;
  ordersCount?: number;
  totalSpent?: number;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error: toastError } = useToast();

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/dashboard/customers');
      if (res && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch customers from server, using empty list fallback', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Toggle user active status
  const handleToggleStatus = async (id: string) => {
    const customer = customers.find(c => c._id === id);
    try {
      const res = await apiClient.patch(`/admin/dashboard/customers/${id}/toggle`, {});
      if (res && res.success) {
        const newState = !customer?.isActive;
        setCustomers(prev =>
          prev.map(c => c._id === id ? { ...c, isActive: newState } : c)
        );
        success(
          newState ? 'Customer Activated ✅' : 'Customer Deactivated 🚫',
          `${customer?.name || 'Customer'}'s account is now ${newState ? 'active' : 'inactive'}.`
        );
      }
    } catch (err) {
      console.error('Failed to toggle customer status:', err);
      toastError('Status update failed', 'Could not toggle user status on the server. Try again.');
    }
  };

  // Snappy real-time client-side filter
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(term);
    const emailMatch = c.email?.toLowerCase().includes(term);
    const petMatch = c.petName?.toLowerCase().includes(term) || false;
    return nameMatch || emailMatch || petMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper action bar with search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 flex items-center bg-white border-[3px] border-white rounded-2xl px-4 py-2.5 gap-2.5 shadow-clay-card">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search name, email or pet..."
            className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Total Customers: {customers.length}
          </span>
        </div>
      </div>

      {/* Customer directory Table */}
      <div className="clay-table-container">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-[#8e78f5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Gathering paw members...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="clay-th w-16">S.No.</th>
                <th className="clay-th">Member profile</th>
                <th className="clay-th">Pet details</th>
                <th className="clay-th text-center">Loyalty Points</th>
                <th className="clay-th text-center">Status</th>
                <th className="clay-th">Total Spend</th>
                <th className="clay-th text-right">Loyalty rank</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust, index) => {
                  const points = cust.pointsBalance || 0;
                  const orders = cust.ordersCount || 0;
                  const spent = cust.totalSpent || 0;
                  const petName = cust.petName || 'Cooper 🦮';
                  const petSpecies = cust.petSpecies || 'Golden Retriever';
                  return (
                    <tr key={cust._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* S.No. */}
                      <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                      
                      {/* Info */}
                      <td className="clay-td">
                        <div className="flex items-center gap-3">
                          {cust.avatar ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-slate-100">
                              <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0 font-black text-xs text-white bg-slate-400 select-none">
                              {cust.name ? cust.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                          )}
                          <div>
                            <h4 className="font-black text-sm text-slate-800">{cust.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block">{cust.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Pet details */}
                      <td className="clay-td">
                        <div>
                          <h5 className="font-black text-xs text-purple-700 flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-purple-500 text-purple-500" /> {petName}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-extrabold">{petSpecies}</span>
                        </div>
                      </td>

                      {/* Loyalty Points */}
                      <td className="clay-td text-center">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-black">
                          ⭐ {points} pts
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="clay-td text-center">
                        <button
                          onClick={() => handleToggleStatus(cust._id)}
                          title="Click to toggle account status"
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border flex items-center gap-1 mx-auto transition-all ${
                            cust.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {cust.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 stroke-[2.5]" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 stroke-[2.5]" /> Suspended
                            </>
                          )}
                        </button>
                      </td>

                      {/* Spend */}
                      <td className="clay-td">
                        <span className="font-black text-[#8e78f5]">₹{spent.toFixed(2)}</span>
                      </td>

                      {/* Rank Badge */}
                      <td className="clay-td text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                          points > 500 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : points > 250 
                            ? 'bg-amber-100 text-amber-700 border-amber-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {points > 500 ? 'Platinum Pet 👑' : points > 250 ? 'Gold Paws 🥇' : 'Bronze Member'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-extrabold text-sm">
                    No customers found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
