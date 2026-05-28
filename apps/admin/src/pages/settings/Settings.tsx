import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Store, Palette, Bell, Shield, 
  Save, Sparkles, Check, ToggleLeft, ToggleRight, Heart 
} from 'lucide-react';

const THEME_PRESETS = [
  { id: 'lavender', name: 'Lavender Fields 💜', bg: 'from-[#fbf9ff] to-[#f5f0ff]', accent: 'text-violet-600 border-violet-200 bg-violet-50' },
  { id: 'peach', name: 'Peach Sparkle 🍑', bg: 'from-[#fff9f6] to-[#fff0e6]', accent: 'text-orange-600 border-orange-200 bg-orange-50' },
  { id: 'mint', name: 'Mint Dream 🌿', bg: 'from-[#f6fff9] to-[#e6ffe6]', accent: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  { id: 'candy', name: 'Candy Sprinkles 🍬', bg: 'from-[#fff6fc] to-[#ffe6f6]', accent: 'text-pink-600 border-pink-200 bg-pink-50' },
];

export default function Settings() {
  const [activeTheme, setActiveTheme] = useState('lavender');
  const [shopOnline, setShopOnline] = useState(true);
  const [successSaved, setSuccessSaved] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'PawMart Storefront',
    email: 'hello@pawmart.com',
    currency: 'USD ($)',
    pointsRatio: '10 points per $1'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <SettingsIcon className="text-violet-500 fill-violet-100" />
            General Settings
          </h2>
          <p className="text-xs text-[#705e8c]">Customize PawMart boutique variables and branding theme</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CORE INPUT CONFIGS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Storefront metadata */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-5">
            <h3 className="font-extrabold text-md text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <Store size={18} className="text-orange-400" />
              Boutique Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#705e8c] ml-1">Store Name</label>
                <input 
                  type="text" 
                  value={formData.storeName}
                  onChange={e => setFormData({...formData, storeName: e.target.value})}
                  className="clay-input w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#705e8c] ml-1">Support Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="clay-input w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#705e8c] ml-1">Preferred Currency</label>
                <select 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="clay-input w-full"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#705e8c] ml-1">Loyalty Points Ratio</label>
                <input 
                  type="text" 
                  value={formData.pointsRatio}
                  onChange={e => setFormData({...formData, pointsRatio: e.target.value})}
                  className="clay-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Storefront Theme Selection */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-md text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <Palette size={18} className="text-violet-500" />
              Curator Design Aesthetic
            </h3>
            <p className="text-xs text-[#705e8c] -mt-2">Select a theme profile to alter the ambient background mood</p>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {THEME_PRESETS.map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`
                    p-4 rounded-[22px] border-2 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden transition-all duration-300
                    ${activeTheme === theme.id ? 'border-violet-500 scale-102 shadow-sm' : 'border-transparent bg-white/50 hover:bg-white/90 hover:scale-101'}
                  `}
                >
                  <span className="text-xs font-extrabold text-[#3d2c54] z-10">{theme.name}</span>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.bg} border border-white shadow-inner self-end mt-2`} />
                  
                  {activeTheme === theme.id && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TOGGLES AND SAVE ACTIONS */}
        <div className="space-y-6">
          
          {/* Online/Offline Status Panel */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
            
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300
              ${shopOnline ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}
            `}>
              <Store size={28} />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#3d2c54]">Shop Status</h3>
              <p className="text-xs text-[#705e8c] mt-0.5">
                {shopOnline ? 'Storefront is active & visible' : 'Under maintenance block'}
              </p>
            </div>

            <button 
              type="button"
              onClick={() => setShopOnline(!shopOnline)}
              className="flex items-center justify-center focus:outline-none transition-transform active:scale-95"
            >
              {shopOnline ? (
                <ToggleRight size={48} className="text-green-400 hover:text-green-500 transition-colors" />
              ) : (
                <ToggleLeft size={48} className="text-[#9f8fb3] hover:text-[#705e8c] transition-colors" />
              )}
            </button>
          </div>

          {/* Section 3: Curator Notifications */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-md text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <Bell size={18} className="text-orange-400" />
              Staff Notifications
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input type="checkbox" defaultChecked className="accent-violet-500 w-4 h-4 rounded" />
                <span className="text-xs font-bold text-[#705e8c]">Sound alerts on new orders</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input type="checkbox" defaultChecked className="accent-violet-500 w-4 h-4 rounded" />
                <span className="text-xs font-bold text-[#705e8c]">Daily digest email report</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input type="checkbox" defaultChecked className="accent-violet-500 w-4 h-4 rounded" />
                <span className="text-xs font-bold text-[#705e8c]">Alert when coupon counts low</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input type="checkbox" defaultChecked className="accent-violet-500 w-4 h-4 rounded" />
                <span className="text-xs font-bold text-[#705e8c]">Spin-wheel payout alert (High prizes)</span>
              </label>
            </div>
          </div>

          {/* Save Configurations Container */}
          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-sm shadow-[0_8px_25px_-5px_rgba(138,92,245,0.35)] hover:shadow-[0_12px_30px_-5px_rgba(138,92,245,0.45)] hover:scale-101 active:scale-99 transition-all cursor-pointer"
            >
              <Save size={18} />
              Save Configuration
            </button>

            {/* Bouncy Saved Feedback alert */}
            <AnimatePresence>
              {successSaved && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-[18px] text-xs font-bold flex items-center justify-center gap-2 text-center"
                >
                  <Sparkles size={14} className="animate-bounce" />
                  Configurations fully updated, Mia!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </form>
    </motion.div>
  );
}
