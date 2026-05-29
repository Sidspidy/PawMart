import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Check,
  Sparkles,
  Store,
  DollarSign,
  Shield,
  Mail
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';
interface SettingsProps {
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
}

export default function Settings({ maintenanceMode, setMaintenanceMode }: SettingsProps) {
  const [shopName, setShopName] = useState('PawMart Storefront');
  const [currency, setCurrency] = useState('USD ($)');
  const [autoEmail, setAutoEmail] = useState(true);

  // Custom modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingMaintenanceVal, setPendingMaintenanceVal] = useState<boolean | null>(null);

  const currencyOptions = [
    { value: 'USD ($)', label: 'USD ($) - International Dollar', emoji: '💵' },
    { value: 'INR (₹)', label: 'INR (₹) - Indian Rupee', emoji: '🪙' },
    { value: 'EUR (€)', label: 'EUR (€) - Eurozone', emoji: '💶' },
  ];

  const handleMaintenanceToggleClick = () => {
    setPendingMaintenanceVal(!maintenanceMode);
    setIsConfirmOpen(true);
  };

  const handleConfirmMaintenanceChange = () => {
    if (pendingMaintenanceVal !== null) {
      setMaintenanceMode(pendingMaintenanceVal);
    }
    setIsConfirmOpen(false);
    setPendingMaintenanceVal(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('🎉 Settings updated successfully in the cozy theme!');
  };

  return (
    <div className="space-y-6">



      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Core config cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Details */}
          <div className="clay-white-card rounded-[32px] p-6 space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Store className="w-4 h-4 text-[#8e78f5] stroke-[2.5]" /> Store Preferences
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Shop Name</label>
                <input
                  type="text"
                  className="w-full clay-input"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <CustomSelect
                  value={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  label="Operational Currency"
                />
              </div>
            </div>
          </div>

          {/* Communication details */}
          <div className="clay-white-card rounded-[32px] p-6 space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8e78f5] stroke-[2.5]" /> Email & Notification Rules
            </h3>

            <div className="space-y-4">
              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-black text-xs text-slate-800">Auto-Email Receipt</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Send purchase summaries and timelines automatically</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoEmail(!autoEmail)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-all ${autoEmail ? 'bg-emerald-400' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${autoEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-black text-xs text-slate-800">Maintenance Mode</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Temporarily block customer purchases for system upgrades</p>
                </div>
                <button
                  type="button"
                  onClick={handleMaintenanceToggleClick}
                  className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer ${maintenanceMode ? 'bg-emerald-400' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="clay-white-card rounded-[32px] p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Actions Console</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Publish rules or check active status keys</p>
          </div>

          <div className="bg-[#e2d9ff]/20 border border-[#e2d9ff]/50 rounded-2xl p-4 flex gap-3 text-[11px] text-[#523d85] font-extrabold leading-snug my-4">
            <span>🛡️</span>
            <span>Only Super Admins or Owners have operational credentials to toggle currency targets or store names.</span>
          </div>

          <button
            type="submit"
            className="w-full clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md"
          >
            <Check className="w-4 h-4 stroke-[2.5]" /> Update Preferences
          </button>
        </div>

      </form>

      {/* Custom Confirm Maintenance Mode Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Toggle Maintenance Mode ⚡"
        message={
          pendingMaintenanceVal
            ? "Are you sure you want to turn ON Maintenance Mode? This will block all active customer checkouts and transactions on the storefront."
            : "Are you sure you want to turn OFF Maintenance Mode? Storefront operations, customer baskets, and checkout portals will resume immediately."
        }
        confirmText="Confirm"
        cancelText="Cancel"
        emoji="⚡"
        type="warning"
        onConfirm={handleConfirmMaintenanceChange}
        onCancel={() => {
          setIsConfirmOpen(false);
          setPendingMaintenanceVal(null);
        }}
      />

    </div>
  );
}
