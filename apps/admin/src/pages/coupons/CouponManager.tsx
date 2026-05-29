import React, { useState } from 'react';
import { 
  Tag, 
  Trash2, 
  Plus, 
  Check, 
  Sparkles,
  Ticket
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';

interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Flat';
  discount: number;
  minSpend: number;
  active: boolean;
  uses: number;
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOMEPAWS', type: 'Percentage', discount: 15, minSpend: 30, active: true, uses: 142 },
  { id: '2', code: 'BONUS20', type: 'Flat', discount: 20, minSpend: 80, active: true, uses: 89 },
  { id: '3', code: 'CATNIPFREE', type: 'Percentage', discount: 10, minSpend: 20, active: false, uses: 34 },
];

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [discount, setDiscount] = useState('');
  const [minSpend, setMinSpend] = useState('');

  // Custom modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const couponTypeOptions = [
    { value: 'Percentage', label: 'Percentage %', emoji: '🏷️' },
    { value: 'Flat', label: 'Flat $', emoji: '💵' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount || !minSpend) return;

    const newCoupon: Coupon = {
      id: (coupons.length + 1).toString(),
      code: code.toUpperCase().replace(/\s+/g, ''),
      type,
      discount: parseFloat(discount),
      minSpend: parseFloat(minSpend),
      active: true,
      uses: 0
    };

    setCoupons([newCoupon, ...coupons]);
    setCode('');
    setDiscount('');
    setMinSpend('');
  };

  const handleToggle = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleDeleteTrigger = (id: string) => {
    setCouponToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      setCoupons(coupons.filter(c => c.id !== couponToDelete));
    }
    setIsConfirmOpen(false);
    setCouponToDelete(null);
  };

  return (
    <div className="space-y-6">
      


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table list */}
        <div className="lg:col-span-2 clay-table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="clay-th w-16">S.No.</th>
                <th className="clay-th">Coupon Code</th>
                <th className="clay-th">Discount Offer</th>
                <th className="clay-th">Min Spend</th>
                <th className="clay-th text-center">Active Status</th>
                <th className="clay-th text-center">Uses logged</th>
                <th className="clay-th text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, index) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                  <td className="clay-td">
                    <span className="font-extrabold text-[#8e78f5] bg-purple-50 border border-purple-100 px-3 py-1 rounded-xl">
                      🎟️ {c.code}
                    </span>
                  </td>
                  <td className="clay-td">
                    <span className="font-black text-slate-800">
                      {c.type === 'Percentage' ? `${c.discount}% OFF` : `$${c.discount} OFF`}
                    </span>
                  </td>
                  <td className="clay-td">
                    <span className="font-semibold text-slate-400">${c.minSpend} min</span>
                  </td>
                  <td className="clay-td text-center">
                    {/* Cozy Toggle switch */}
                    <button 
                      onClick={() => handleToggle(c.id)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${c.active ? 'bg-emerald-400' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${c.active ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="clay-td text-center">
                    <span className="font-extrabold text-slate-700">{c.uses} times</span>
                  </td>
                  <td className="clay-td text-right">
                    <button 
                      onClick={() => handleDeleteTrigger(c.id)}
                      className="p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form creator */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">New Coupon Code</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Generate campaign codes and settings</p>
          </div>

          <form onSubmit={handleAdd} className="space-y-3.5 flex-1 mt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Coupon Code</label>
              <input 
                type="text" 
                placeholder="e.g. MYSUPERPAWS"
                className="w-full clay-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomSelect
                value={type}
                onChange={setType}
                options={couponTypeOptions}
                label="Type"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Discount</label>
                <input 
                  type="number" 
                  placeholder="15"
                  className="w-full clay-input"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Min Purchase Limit ($)</label>
              <input 
                type="number" 
                placeholder="30"
                className="w-full clay-input"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full clay-btn clay-btn-purple py-3 text-xs gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Generate Coupon
            </button>
          </form>

        </div>

      </div>

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Coupon 🏷️"
        message="Are you sure you want to delete this promotional coupon code? Customers will no longer be able to redeem it at checkout."
        confirmText="Delete"
        cancelText="Cancel"
        emoji="🏷️"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setCouponToDelete(null);
        }}
      />

    </div>
  );
}
