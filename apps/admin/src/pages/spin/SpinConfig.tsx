import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  RefreshCw,
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';
import { apiClient } from '../../api/apiClient';

type PrizeType = 'coupon' | 'free_shipping' | 'points' | 'gift' | 'no_prize';

interface PrizeSlice {
  _id?: string;
  type: PrizeType;
  label: string;
  value?: number;
  probability: number; // 0–1
  isActive: boolean;
  // UI-only helpers
  _uiId: number;
  color: string;
}

const SLICE_COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#8a7e72'];

const PRIZE_TYPE_OPTIONS: { label: string; value: PrizeType }[] = [
  { label: 'Points Bonus',    value: 'points' },
  { label: 'Coupon',          value: 'coupon' },
  { label: 'Free Shipping',   value: 'free_shipping' },
  { label: 'Gift',            value: 'gift' },
  { label: 'No Prize',        value: 'no_prize' },
];

const getPrizeStyle = (type: string, index: number) => {
  const styles: Record<string, { color: string; lightColor: string; icon: string }> = {
    points: { color: '#f59e0b', lightColor: '#fef3c7', icon: '🌟' },
    coupon: { color: '#22c55e', lightColor: '#dcfce7', icon: '🏷️' },
    free_shipping: { color: '#0ea5e9', lightColor: '#e0f2fe', icon: '🚚' },
    gift: { color: '#ec4899', lightColor: '#fce7f3', icon: '🎁' },
    no_prize: { color: '#8a7e72', lightColor: '#f3f4f6', icon: '🐾' }
  };
  return styles[type] || {
    color: SLICE_COLORS[index % SLICE_COLORS.length],
    lightColor: '#f3e8ff',
    icon: '✨'
  };
};

/* ── Paw Print SVG ──────────────────────────────────────────── */
const PawPrint = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={style}>
    <ellipse cx="12" cy="17" rx="5" ry="4" />
    <circle cx="6" cy="10" r="2.5" />
    <circle cx="18" cy="10" r="2.5" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="6" r="2" />
  </svg>
);

export default function SpinConfig() {
  const [prizes, setPrizes] = useState<PrizeSlice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // New prize form
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<PrizeType>('points');
  const [newValue, setNewValue] = useState('');
  const [newProb, setNewProb] = useState('10');

  // Delete confirm modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<number | null>(null);

  const { success, error, info } = useToast();

  // ── Load prizes from backend ────────────────────────────────────────────────
  const fetchPrizes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/admin/spin/prizes');
      if (data?.success && data.data) {
        const loaded: PrizeSlice[] = data.data.map((seg: any, i: number) => ({
          _id: seg._id,
          type: seg.type,
          label: seg.label,
          value: seg.value,
          probability: seg.probability,
          isActive: seg.isActive !== false,
          _uiId: i + 1,
          color: getPrizeStyle(seg.type, i).color,
        }));
        setPrizes(loaded);
      }
    } catch (err: any) {
      error('Failed to load spin config', err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalProb = prizes.reduce((s, p) => s + p.probability, 0);
  const totalProbPct = Math.round(totalProb * 100);

  const handleProbChange = (uiId: number, val: number) => {
    setPrizes(prev => prev.map(p => p._uiId === uiId ? { ...p, probability: Math.min(1, Math.max(0, val / 100)) } : p));
  };

  const handleToggleActive = (uiId: number) => {
    setPrizes(prev => prev.map(p => p._uiId === uiId ? { ...p, isActive: !p.isActive } : p));
  };

  // ── Save to backend ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (Math.abs(totalProb - 1) > 0.005) {
      error('Probabilities must sum to 100%', `Current total: ${totalProbPct}%`);
      return;
    }

    try {
      setSaving(true);
      const payload = prizes.map(p => ({
        type: p.type,
        label: p.label,
        value: p.value,
        probability: p.probability,
        isActive: p.isActive,
      }));
      await apiClient.post('/admin/spin/prizes', payload);
      success('Spin wheel saved!', 'Changes are now live for all customers.');
      fetchPrizes(); // refresh with server-assigned _ids
    } catch (err: any) {
      error('Save failed', err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  };

  // ── Test spin ───────────────────────────────────────────────────────────────
  const handleSpinTest = () => {
    if (isSpinning || prizes.length === 0) return;
    setIsSpinning(true);
    setSpinResult(null);

    const activePrizes = prizes.filter(p => p.isActive);
    const rand = Math.random();
    let cumulative = 0;
    let landed = activePrizes[activePrizes.length - 1];
    for (const p of activePrizes) {
      cumulative += p.probability;
      if (rand <= cumulative) { landed = p; break; }
    }

    const sliceAngle = 360 / prizes.length;
    const landedIdx = prizes.findIndex(p => p._uiId === landed._uiId);
    const extraRotations = 5 * 360;
    const targetAngle = extraRotations + (360 - (landedIdx * sliceAngle + sliceAngle / 2));
    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(landed.label);
      success(`🎉 Landed on "${landed.label}"!`, 'Probability weights look good!');
      setRotation(targetAngle % 360);
    }, 4000);
  };

  // ── Add prize ───────────────────────────────────────────────────────────────
  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const prob = Math.min(1, Math.max(0, parseFloat(newProb) / 100 || 0.1));
    const newPrize: PrizeSlice = {
      type: newType,
      label: newLabel.trim(),
      value: newValue ? parseFloat(newValue) : undefined,
      probability: prob,
      isActive: true,
      _uiId: Date.now(),
      color: getPrizeStyle(newType, prizes.length).color,
    };
    setPrizes(prev => [...prev, newPrize]);
    setNewLabel('');
    setNewValue('');
    setNewProb('10');
    info('Prize Slice Added 🎡', `"${newPrize.label}" added. Remember to save.`);
  };

  // ── Delete prize ────────────────────────────────────────────────────────────
  const handleDeleteTrigger = (uiId: number) => {
    setPrizeToDelete(uiId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (prizeToDelete !== null) {
      const prize = prizes.find(p => p._uiId === prizeToDelete);
      setPrizes(prizes.filter(p => p._uiId !== prizeToDelete));
      info('Removed', `"${prize?.label}" removed. Remember to save.`);
    }
    setIsConfirmOpen(false);
    setPrizeToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
        <span className="ml-3 text-slate-500 font-semibold">Loading spin config…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header with Save button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-slate-800 text-lg">Spin Wheel Configuration</h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Configure prizes and probabilities for the customer spin wheel</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || Math.abs(totalProb - 1) > 0.005}
          className="clay-btn clay-btn-purple px-5 py-2.5 text-sm gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save to Database'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Spin Wheel Preview ── */}
        <div className="clay-white-card rounded-[32px] p-6 flex flex-col items-center justify-between min-h-[460px]">
          <div className="w-full mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">Live Preview</h3>
            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${
              Math.abs(totalProb - 1) <= 0.005
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              Total: {totalProbPct}% {Math.abs(totalProb - 1) <= 0.005 ? '(Calibrated ✓)' : '(Fix to 100%)'}
            </span>
          </div>

          {/* Premium SVG Wheel Preview */}
          <div className="relative w-64 h-64 my-6 flex items-center justify-center shrink-0">
            {/* Conic Glow */}
            <div
              style={{
                position: 'absolute', inset: -12,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(249,115,22,0.12), rgba(14,165,233,0.12), rgba(168,85,247,0.12), rgba(249,115,22,0.12))',
                filter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            />

            {/* Glassmorphism ring */}
            <div style={{
              position: 'absolute', inset: -4,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(6px)',
              border: '2px solid rgba(255,255,255,0.4)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.05), inset 0 0 15px rgba(255,255,255,0.2)',
            }} />

            {prizes.length > 0 ? (
              <svg
                className="w-full h-full filter drop-shadow-md relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.95, 0.3, 1)' : 'none',
                }}
                viewBox="0 0 400 400"
              >
                <defs>
                  {prizes.map((p, idx) => {
                    const style = getPrizeStyle(p.type, idx);
                    return (
                      <linearGradient key={`grad-${idx}`} id={`segGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={p.isActive ? style.lightColor : '#f3f4f6'} />
                        <stop offset="100%" stopColor={p.isActive ? p.color : '#d1d5db'} stopOpacity="0.35" />
                      </linearGradient>
                    );
                  })}
                  <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.08)" />
                  </filter>
                </defs>

                {/* Wheel segments */}
                {prizes.map((p, idx) => {
                  const sliceAngle = 360 / prizes.length;
                  const startAngle = (idx * sliceAngle - 90) * (Math.PI / 180);
                  const endAngle = ((idx + 1) * sliceAngle - 90) * (Math.PI / 180);
                  const x1 = 200 + 190 * Math.cos(startAngle);
                  const y1 = 200 + 190 * Math.sin(startAngle);
                  const x2 = 200 + 190 * Math.cos(endAngle);
                  const y2 = 200 + 190 * Math.sin(endAngle);
                  const largeArc = sliceAngle > 180 ? 1 : 0;

                  const midAngle = ((idx + 0.5) * sliceAngle - 90) * (Math.PI / 180);
                  const labelR = 115;
                  const lx = 200 + labelR * Math.cos(midAngle);
                  const ly = 200 + labelR * Math.sin(midAngle);
                  const textRotation = idx * sliceAngle;

                  return (
                    <g key={p._uiId} opacity={p.isActive ? 1 : 0.5}>
                      <path
                        d={`M200,200 L${x1},${y1} A190,190 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={`url(#segGrad-${idx})`}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Label */}
                      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="900" fill={p.isActive ? p.color : '#8a7e72'} transform={`rotate(${textRotation}, ${lx}, ${ly})`} style={{ letterSpacing: '0.02em' }}>
                        {p.label}
                      </text>
                    </g>
                  );
                })}

                {/* Center circle */}
                <circle cx="200" cy="200" r="38" fill="#fff" stroke="rgba(249,115,22,0.15)" strokeWidth="3" filter="url(#centerShadow)" />

                {/* Center paw */}
                <g transform="translate(188, 186) scale(1)">
                  <PawPrint style={{ color: '#f97316' }} />
                </g>
              </svg>
            ) : (
              <div className="text-slate-400 text-sm font-medium text-center">
                No prizes configured
              </div>
            )}

            {/* Pointer (top indicator) */}
            <div style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              zIndex: 10, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
            }}>
              <svg width="24" height="30" viewBox="0 0 28 36">
                <path d="M14 36 L2 8 Q0 2 6 0 L22 0 Q28 2 26 8 Z" fill="#f97316" />
                <path d="M14 36 L2 8 Q0 2 6 0 L22 0 Q28 2 26 8 Z" fill="url(#pointerGrad)" />
                <defs>
                  <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Spin result */}
          {spinResult && !isSpinning && (
            <div className="w-full bg-[#e2d9ff]/60 border border-[#c4b8ff] rounded-2xl px-4 py-2.5 mb-2 text-center">
              <p className="text-xs font-black text-[#3b2b5c]">🎉 Last result: <span className="text-[#8e78f5]">{spinResult}</span></p>
            </div>
          )}

          {/* Controls */}
          <div className="w-full flex gap-3.5 border-t border-slate-50 pt-4 mt-2">
            <button
              onClick={handleSpinTest}
              disabled={isSpinning || prizes.length === 0 || Math.abs(totalProb - 1) > 0.005}
              className="flex-1 clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              {isSpinning ? 'Spinning…' : 'Test Spin'}
            </button>
            <button
              onClick={() => { setRotation(0); setSpinResult(null); }}
              disabled={isSpinning}
              className="clay-btn clay-btn-light px-4 py-3.5 text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" /> Reset
            </button>
          </div>
        </div>

        {/* ── Prize Config ── */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-6 flex flex-col justify-between min-h-[460px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Prize Probability Sliders</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Adjust each segment's weight (must total 100%). Sliders adjust size dynamically based on value.
            </p>
          </div>

          {/* Sliders with Dynamic Size based on probability percentage */}
          <div className="space-y-4 overflow-y-auto max-h-[260px] pr-1 mt-4 flex-1">
            {prizes.map(p => {
              const style = getPrizeStyle(p.type, p._uiId - 1);
              const percentage = Math.round(p.probability * 100);
              return (
                <div key={p._uiId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white"
                        style={{ backgroundColor: p.isActive ? p.color : '#d1d5db' }}
                      >
                        {p._uiId}
                      </span>
                      <span className="max-w-[120px] truncate">{p.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        p.type === 'points' ? 'bg-orange-50 text-orange-600' :
                        p.type === 'coupon' ? 'bg-blue-50 text-blue-600' :
                        p.type === 'free_shipping' ? 'bg-green-50 text-green-600' :
                        p.type === 'gift' ? 'bg-purple-50 text-purple-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>{p.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <span>{percentage}%</span>
                      <button
                        onClick={() => handleToggleActive(p._uiId)}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${p.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}
                      >
                        {p.isActive ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => handleDeleteTrigger(p._uiId)}
                        className="p-1 text-slate-400 hover:text-rose-500 active:scale-90 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Slider Wrapper: Width dynamically sized based on percentage with +/- buttons */}
                  <div 
                    className="flex items-center gap-2 transition-all duration-300"
                    style={{ width: `${Math.max(50, percentage)}%` }}
                  >
                    <button
                      type="button"
                      onClick={() => handleProbChange(p._uiId, Math.max(0, percentage - 1))}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-xs font-black text-slate-600 transition-all shrink-0 select-none"
                    >
                      -
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="flex-1 cursor-pointer h-2 bg-slate-100 rounded-full"
                      style={{ accentColor: p.isActive ? p.color : '#d1d5db' }}
                      value={percentage}
                      onChange={e => handleProbChange(p._uiId, parseInt(e.target.value))}
                    />

                    <button
                      type="button"
                      onClick={() => handleProbChange(p._uiId, Math.min(100, percentage + 1))}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-xs font-black text-slate-600 transition-all shrink-0 select-none"
                    >
                      +
                    </button>

                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.isActive ? p.color : '#d1d5db' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add prize form */}
          <form onSubmit={handleAddPrize} className="space-y-2 pt-4 border-t border-slate-50 mt-2">
            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="Prize label (e.g. 50 Bonus Points)"
                className="flex-1 clay-input py-2.5 text-sm"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                required
              />
              <div className="w-20 relative flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="%"
                  className="w-full clay-input py-2.5 pr-6 text-center text-sm"
                  value={newProb}
                  onChange={e => setNewProb(e.target.value)}
                  required
                />
                <span className="absolute right-2.5 text-xs font-black text-slate-400 pointer-events-none">%</span>
              </div>
              <button type="submit" className="clay-btn clay-btn-purple px-4 py-2.5 text-xs shadow-sm">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
            <div className="flex gap-2.5">
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as PrizeType)}
                className="flex-1 clay-input py-2 text-sm"
              >
                {PRIZE_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Value (e.g. 50 for 50 pts)"
                className="flex-1 clay-input py-2 text-sm"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
            </div>
          </form>
        </div>

      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Remove Prize Slice 🎡"
        message={`Are you sure you want to remove "${prizes.find(p => p._uiId === prizeToDelete)?.label}" from the spin wheel? Click Save after to persist changes.`}
        confirmText="Remove"
        cancelText="Keep It"
        emoji="🎡"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setPrizeToDelete(null); }}
      />

    </div>
  );
}
