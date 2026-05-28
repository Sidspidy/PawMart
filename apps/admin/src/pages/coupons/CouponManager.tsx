import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Tag, HelpCircle, Save, Sparkles, AlertCircle, Check } from 'lucide-react';

const INITIAL_COUPONS = [
  { id: '1', code: 'PUPPYLOVE20', type: 'Percentage', val: 20, desc: '20% off all dog accessories & toys', limit: '150 left', status: 'Active', color: 'from-[#ffd8be] to-[#fde2e4]' },
  { id: '2', code: 'CATPURR15', type: 'Percentage', val: 15, desc: '15% off premium cat scratchers', limit: '320 left', status: 'Active', color: 'from-[#e7c6ff] to-[#ffd6ff]' },
  { id: '3', code: 'FREEBIRD', type: 'Free Shipping', val: 0, desc: 'Free shipping on orders over $30', limit: 'Expired', status: 'Expired', color: 'from-[#e2f0cb] to-[#f6fff9]' },
  { id: '4', code: 'WELCOME5', type: 'Fixed Cost', val: 5, desc: '$5 off your initial boutique purchase', limit: 'Unlimited', status: 'Active', color: 'from-blue-100 to-violet-100' },
];

export default function CouponManager() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [val, setVal] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('Percentage');
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colorPresets = [
      'from-[#ffd8be] to-[#fde2e4]',
      'from-[#e7c6ff] to-[#ffd6ff]',
      'from-[#e2f0cb] to-[#f6fff9]',
      'from-blue-100 to-violet-100'
    ];
    const newCoupon = {
      id: String(coupons.length + 1),
      code: code.toUpperCase(),
      type,
      val: type === 'Free Shipping' ? 0 : parseFloat(val),
      desc,
      limit: '100 left',
      status: 'Active',
      color: colorPresets[Math.floor(Math.random() * colorPresets.length)]
    };
    setCoupons([newCoupon, ...coupons]);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      setShowAddForm(false);
      setCode('');
      setVal('');
      setDesc('');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 relative"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <Ticket className="text-violet-500 fill-violet-100" />
            Coupon Book
          </h2>
          <p className="text-xs text-[#705e8c]">Manage discount voucher codes, limits, and boutique campaigns</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-bold text-xs shadow-[0_8px_20px_-4px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE COUPONS BOOK GRID (Ticket visual) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 self-start">
          {coupons.map(coupon => (
            <div 
              key={coupon.id}
              className={`
                relative h-36 rounded-[24px] bg-gradient-to-br ${coupon.color} border border-white/60 p-4 flex flex-col justify-between shadow-soft overflow-hidden
                ${coupon.status === 'Expired' && 'opacity-60'}
              `}
            >
              
              {/* Crescent ticket bites on left and right */}
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#fbf9ff] rounded-full border-r border-violet-100 z-20" />
              <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#fbf9ff] rounded-full border-l border-violet-100 z-20" />

              {/* Dashed Tear Line */}
              <div className="absolute left-[36px] right-[36px] top-1/2 -translate-y-1/2 border-t border-dashed border-violet-300/40 z-10" />

              {/* Top half: discount code */}
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold text-[#3d2c54] bg-white/70 px-2.5 py-1 rounded-lg border border-white">
                    {coupon.code}
                  </span>
                  <p className="text-[10px] text-[#705e8c] mt-2 font-bold max-w-[170px] truncate">
                    {coupon.desc}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${coupon.status === 'Active' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                  {coupon.status}
                </span>
              </div>

              {/* Bottom half: value */}
              <div className="relative z-10 flex justify-between items-end">
                <span className="text-lg font-extrabold text-[#3d2c54]">
                  {coupon.type === 'Percentage' && `${coupon.val}% OFF`}
                  {coupon.type === 'Fixed Cost' && `$${coupon.val} OFF`}
                  {coupon.type === 'Free Shipping' && `FREE SHP`}
                </span>

                <span className="text-[9px] font-extrabold text-[#9f8fb3] uppercase bg-white/40 px-2 py-0.5 rounded-full">
                  {coupon.limit}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: SLIDE-IN ADD FORM */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4"
              >
                <h3 className="font-extrabold text-sm text-[#3d2c54] border-b border-violet-100/60 pb-3 flex items-center gap-2">
                  <Tag size={16} className="text-orange-400" />
                  Voucher Generator
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Voucher Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SUMMER40" 
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      className="clay-input w-full text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#705e8c] ml-1">Type</label>
                      <select 
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="clay-input w-full text-xs py-2.5 font-bold"
                      >
                        <option>Percentage</option>
                        <option>Fixed Cost</option>
                        <option>Free Shipping</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#705e8c] ml-1">Discount Value</label>
                      <input 
                        type="number" 
                        placeholder="15" 
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        disabled={type === 'Free Shipping'}
                        className="clay-input w-full text-xs"
                        required={type !== 'Free Shipping'}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Marketing Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 15% off dog food packages" 
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      className="clay-input w-full text-xs"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-xs shadow-md hover:scale-101 cursor-pointer duration-200"
                  >
                    Save Coupon Ticket
                  </button>
                </form>

              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft text-center py-10 space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl font-bold animate-float">
                  🎫
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#3d2c54]">Add campaign discounts!</h4>
                  <p className="text-[10px] text-[#705e8c] max-w-[180px] mx-auto mt-1 leading-relaxed">
                    Generate gamified coupons linked directly to spin wheel rewards or boutique catalogs.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer"
                >
                  Generate First Coupon
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Success Overlay Alerts */}
          <AnimatePresence>
            {successSaved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-[18px] text-[10px] font-bold flex items-center justify-center gap-1.5"
              >
                <Sparkles size={12} className="animate-bounce" />
                Voucher added to campaign catalog!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
