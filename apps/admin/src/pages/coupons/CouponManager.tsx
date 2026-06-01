import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  Shield,
  Ticket,
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';

// ── Types ──────────────────────────────────────────────────────────────────────
interface CouponDB {
  _id: string;
  code: string;
  description?: string;
  type: string;
  scope: string;
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usagePerUser: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

// ── Select options ─────────────────────────────────────────────────────────────
const couponTypeOptions = [
  { value: 'percentage',    label: 'Percentage %',    emoji: '🏷️' },
  { value: 'flat',          label: 'Flat ₹ Off',       emoji: '💵' },
  { value: 'free_shipping', label: 'Free Shipping',    emoji: '🚚' },
];
const couponScopeOptions = [
  { value: 'global',   label: 'Global (All)',      emoji: '🌐' },
  { value: 'category', label: 'Category-specific', emoji: '📂' },
  { value: 'product',  label: 'Product-specific',  emoji: '📦' },
  { value: 'user',     label: 'User-specific',      emoji: '👤' },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
const toISO = (v: string) => (v ? new Date(v).toISOString() : '');
const toLocalInput = (iso: string) => (iso ? iso.slice(0, 16) : '');
const defaultExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return toLocalInput(d.toISOString());
};

const blankForm = {
  code: '',
  description: '',
  type: 'percentage' as string,
  scope: 'global' as string,
  value: '',
  minOrderValue: '',
  maxDiscount: '',
  usageLimit: '0',
  usagePerUser: '1',
  startsAt: toLocalInput(new Date().toISOString()),
  expiresAt: defaultExpiry(),
};

// ── Badge helpers ──────────────────────────────────────────────────────────────
const discountLabel = (c: CouponDB) => {
  if (c.type === 'percentage') return `${c.value}% OFF`;
  if (c.type === 'flat') return `₹${c.value} OFF`;
  return 'Free Shipping';
};

const typeBadge = (type: string) => {
  if (type === 'percentage') return 'bg-purple-50 text-[#8e78f5] border-purple-100';
  if (type === 'flat') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  return 'bg-blue-50 text-blue-600 border-blue-100';
};

const scopeBadge = (scope: string) => {
  const map: Record<string, string> = {
    global: 'bg-slate-100 text-slate-600',
    category: 'bg-amber-50 text-amber-700',
    product: 'bg-cyan-50 text-cyan-700',
    user: 'bg-pink-50 text-pink-700',
  };
  return map[scope] || 'bg-slate-100 text-slate-600';
};

// ══════════════════════════════════════════════════════════════════════════════
// Create Coupon Modal
// ══════════════════════════════════════════════════════════════════════════════
function CreateCouponModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (coupon: CouponDB) => void;
}) {
  const [form, setForm] = useState({ ...blankForm });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { success, error: toastError } = useToast();

  const setField = (key: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.code.trim() || !form.value) {
      setFormError('Coupon code and discount value are required.');
      return;
    }
    const body: Record<string, unknown> = {
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      description: form.description || undefined,
      type: form.type,
      scope: form.scope,
      value: parseFloat(form.value),
      minOrderValue: parseFloat(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
      usageLimit: parseInt(form.usageLimit) || 0,
      usagePerUser: parseInt(form.usagePerUser) || 1,
      startsAt: toISO(form.startsAt),
      expiresAt: toISO(form.expiresAt),
    };

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/admin/coupons', body);
      if (res?.data) {
        onCreated(res.data);
        success('Coupon Created! 🎟️', `Code "${res.data.code}" is now active.`);
        onClose();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create coupon.';
      setFormError(msg);
      toastError('Failed to create coupon', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trap ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(30,20,60,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-fadeInUp"
        style={{ boxShadow: '0 32px 80px rgba(142,120,245,0.25), 0 0 0 1px #e2d9ff' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e2d9ff] flex items-center justify-center">
              <Ticket className="w-5 h-5 text-[#8e78f5] stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">New Coupon Code</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Generate campaign codes and discount settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-7 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2.5 text-rose-700 text-xs font-black flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" /> {formError}
            </div>
          )}

          {/* Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Coupon Code *
            </label>
            <input
              type="text"
              placeholder="e.g. PAWS20"
              className="w-full clay-input uppercase font-black tracking-widest"
              value={form.code}
              onChange={e => setField('code', e.target.value.toUpperCase())}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Sale 2025"
              className="w-full clay-input text-xs"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
            />
          </div>

          {/* Type + Scope */}
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              value={form.type}
              onChange={val => setField('type', val as string)}
              options={couponTypeOptions}
              label="Type *"
            />
            <CustomSelect
              value={form.scope}
              onChange={val => setField('scope', val as string)}
              options={couponScopeOptions}
              label="Scope"
            />
          </div>

          {/* Value + Min Order */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                {form.type === 'percentage' ? 'Discount %' : form.type === 'flat' ? 'Discount ₹' : 'Value'} *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder={form.type === 'percentage' ? '20' : '100'}
                className="w-full clay-input"
                value={form.value}
                onChange={e => setField('value', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Min Order (₹)
              </label>
              <input
                type="number"
                placeholder="299"
                className="w-full clay-input"
                value={form.minOrderValue}
                onChange={e => setField('minOrderValue', e.target.value)}
              />
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Starts At
              </label>
              <input
                type="datetime-local"
                className="w-full clay-input text-xs"
                value={form.startsAt}
                onChange={e => setField('startsAt', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Expires At *
              </label>
              <input
                type="datetime-local"
                className="w-full clay-input text-xs"
                value={form.expiresAt}
                onChange={e => setField('expiresAt', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] font-black text-[#8e78f5] hover:opacity-75 transition-opacity w-full"
          >
            <Shield className="w-3.5 h-3.5" />
            Usage Limits (Advanced)
            {showAdvanced
              ? <ChevronUp className="w-3.5 h-3.5 ml-auto" />
              : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>

          {showAdvanced && (
            <div className="space-y-3 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full clay-input text-xs"
                    value={form.maxDiscount}
                    onChange={e => setField('maxDiscount', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Total Uses (0 = ∞)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full clay-input text-xs"
                    value={form.usageLimit}
                    onChange={e => setField('usageLimit', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Uses Per User
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full clay-input text-xs"
                  value={form.usagePerUser}
                  onChange={e => setField('usagePerUser', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              {isSubmitting ? 'Creating…' : 'Generate Coupon'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="clay-btn clay-btn-light px-6 py-3.5 text-xs"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function CouponManager() {
  const [coupons, setCoupons] = useState<CouponDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Delete confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const { success, error: toastError, info } = useToast();

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/coupons');
      if (res?.data && Array.isArray(res.data)) setCoupons(res.data);
    } catch {
      toastError('Failed to load coupons', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Toggle active ─────────────────────────────────────────────────────────
  const handleToggle = async (coupon: CouponDB) => {
    const newState = !coupon.isActive;
    try {
      const res = await apiClient.patch(`/admin/coupons/${coupon._id}`, { isActive: newState });
      if (res?.data) setCoupons(prev => prev.map(c => c._id === coupon._id ? res.data : c));
      info(
        newState ? 'Coupon Activated' : 'Coupon Deactivated',
        `"${coupon.code}" is now ${newState ? 'active' : 'inactive'}.`
      );
    } catch {
      // Optimistic local update still
      setCoupons(prev => prev.map(c => c._id === coupon._id ? { ...c, isActive: newState } : c));
      toastError('Status update may not have saved', 'Server sync failed. Changes are shown locally.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteTrigger = (id: string) => { setCouponToDelete(id); setIsConfirmOpen(true); };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    const coupon = coupons.find(c => c._id === couponToDelete);
    try {
      await apiClient.delete(`/admin/coupons/${couponToDelete}`);
      setCoupons(prev => prev.filter(c => c._id !== couponToDelete));
      success('Coupon Deleted 🗑️', `"${coupon?.code}" has been removed.`);
    } catch {
      toastError('Delete failed', 'Could not remove the coupon. Try again.');
    } finally {
      setIsConfirmOpen(false);
      setCouponToDelete(null);
    }
  };

  const isExpired = (expiresAt: string) => expiresAt && new Date(expiresAt) < new Date();
  const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-400 font-semibold">
            {coupons.length} coupon{coupons.length !== 1 ? 's' : ''} · {coupons.filter(c => c.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="clay-btn clay-btn-purple px-5 py-3 text-xs gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> New Coupon
        </button>
      </div>

      {/* Full-width table */}
      <div className="clay-table-container w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="clay-th w-10">S.</th>
              <th className="clay-th">Code</th>
              <th className="clay-th">Description</th>
              <th className="clay-th">Discount</th>
              <th className="clay-th">Min Order</th>
              <th className="clay-th">Scope</th>
              <th className="clay-th text-center">Uses</th>
              <th className="clay-th text-center">Status</th>
              <th className="clay-th">Expires</th>
              <th className="clay-th text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="clay-td text-center text-slate-400 py-12">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#8e78f5] border-t-transparent animate-spin" />
                    Loading coupons…
                  </div>
                </td>
              </tr>
            )}
            {!loading && coupons.length === 0 && (
              <tr>
                <td colSpan={10} className="clay-td text-center text-slate-400 text-sm py-12 font-semibold">
                  No coupons yet. Click <span className="text-[#8e78f5] font-black">+ New Coupon</span> to create one! 🎟️
                </td>
              </tr>
            )}
            {!loading && coupons.map((c, idx) => {
              const expired = isExpired(c.expiresAt);
              return (
                <tr key={c._id} className={`transition-colors ${expired ? 'opacity-60' : 'hover:bg-slate-50/60'}`}>
                  <td className="clay-td font-black text-[#8e78f5]">{idx + 1}</td>

                  {/* Code */}
                  <td className="clay-td">
                    <span className="font-extrabold text-[#8e78f5] bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl text-xs inline-block">
                      🎟️ {c.code}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="clay-td">
                    <span className="text-xs text-slate-500 font-semibold max-w-[160px] truncate block">
                      {c.description || <span className="text-slate-300 italic">—</span>}
                    </span>
                  </td>

                  {/* Discount */}
                  <td className="clay-td">
                    <div className="space-y-1">
                      <span className={`font-black px-2.5 py-1 rounded-xl text-xs border ${typeBadge(c.type)}`}>
                        {discountLabel(c)}
                      </span>
                      {c.maxDiscount && (
                        <p className="text-[10px] text-slate-400 font-semibold">Max cap ₹{c.maxDiscount}</p>
                      )}
                    </div>
                  </td>

                  {/* Min order */}
                  <td className="clay-td">
                    <span className="text-xs font-bold text-slate-600">₹{c.minOrderValue}</span>
                  </td>

                  {/* Scope */}
                  <td className="clay-td">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg capitalize ${scopeBadge(c.scope)}`}>
                      {c.scope}
                    </span>
                  </td>

                  {/* Uses */}
                  <td className="clay-td text-center">
                    <span className="text-xs font-extrabold text-slate-700">
                      {c.usedCount}
                      {c.usageLimit > 0 && <span className="text-slate-400 font-semibold">/{c.usageLimit}</span>}
                    </span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      {c.usagePerUser}/user
                    </p>
                  </td>

                  {/* Active toggle */}
                  <td className="clay-td text-center">
                    <button
                      onClick={() => handleToggle(c)}
                      className={`w-11 h-6 rounded-full p-1 transition-all ${c.isActive && !expired ? 'bg-emerald-400' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${c.isActive && !expired ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    {expired && (
                      <p className="text-[9px] text-rose-500 font-black mt-0.5">EXPIRED</p>
                    )}
                  </td>

                  {/* Expires */}
                  <td className="clay-td">
                    <span className={`text-[11px] font-semibold ${expired ? 'text-rose-500' : 'text-slate-400'}`}>
                      {formatDate(c.expiresAt)}
                    </span>
                  </td>

                  {/* Delete */}
                  <td className="clay-td text-right">
                    <button
                      onClick={() => handleDeleteTrigger(c._id)}
                      className="p-2 bg-rose-50 border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-100 active:scale-90 transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <CreateCouponModal
          onClose={() => setShowModal(false)}
          onCreated={coupon => setCoupons(prev => [coupon, ...prev])}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Coupon 🏷️"
        message="Are you sure? Customers will no longer be able to redeem this code at checkout."
        confirmText="Delete"
        cancelText="Cancel"
        emoji="🏷️"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setCouponToDelete(null); }}
      />
    </div>
  );
}
