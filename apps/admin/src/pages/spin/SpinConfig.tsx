import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface PrizeSlice {
  id: number;
  prize: string;
  weight: number;
  color: string;
}

const initialPrizes: PrizeSlice[] = [
  { id: 1, prize: '10% OFF Coupon',    weight: 40, color: '#9d7df9' },
  { id: 2, prize: 'Free Dog Toy',      weight: 15, color: '#ff8da1' },
  { id: 3, prize: '50 Loyalty Points', weight: 25, color: '#ffd27d' },
  { id: 4, prize: '15% OFF Coupon',    weight: 10, color: '#aae297' },
  { id: 5, prize: 'Free Cat Nip',      weight: 8,  color: '#8bc4f9' },
  { id: 6, prize: 'Mega Paw Box 🎁',   weight: 2,  color: '#ff9a9e' },
];

export default function SpinConfig() {
  const [prizes, setPrizes] = useState<PrizeSlice[]>(initialPrizes);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeWeight, setNewPrizeWeight] = useState('10');
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Delete confirm modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<number | null>(null);

  const { success, info } = useToast();

  const handleWeightChange = (id: number, val: number) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, weight: val } : p));
  };

  const handleSpinTest = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const totalWeights = prizes.reduce((acc, p) => acc + p.weight, 0);
    const rand = Math.random() * totalWeights;

    let sum = 0;
    let landedIdx = 0;
    for (let i = 0; i < prizes.length; i++) {
      sum += prizes[i].weight;
      if (rand <= sum) { landedIdx = i; break; }
    }

    const sliceAngle = 360 / prizes.length;
    const extraRotations = 5 * 360;
    const targetAngle = extraRotations + (360 - (landedIdx * sliceAngle + sliceAngle / 2));

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = prizes[landedIdx].prize;
      setSpinResult(prize);
      success(`🎉 Landed on "${prize}"!`, 'Test spin complete. Probability weights look good!');
      setRotation(targetAngle % 360);
    }, 4000);
  };

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeName.trim()) return;

    const colors = ['#9d7df9', '#ff8da1', '#ffd27d', '#aae297', '#8bc4f9', '#ff9a9e'];
    const newPrize: PrizeSlice = {
      id: prizes.length + 1,
      prize: newPrizeName.trim(),
      weight: parseInt(newPrizeWeight) || 10,
      color: colors[prizes.length % colors.length],
    };

    setPrizes([...prizes, newPrize]);
    setNewPrizeName('');
    setNewPrizeWeight('10');
    info('Prize Slice Added 🎡', `"${newPrize.prize}" has been added to the wheel.`);
  };

  const handleDeleteTrigger = (id: number) => {
    setPrizeToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (prizeToDelete !== null) {
      const prize = prizes.find(p => p.id === prizeToDelete);
      setPrizes(prizes.filter(p => p.id !== prizeToDelete));
      info('Prize Slice Removed', `"${prize?.prize}" has been removed from the wheel.`);
    }
    setIsConfirmOpen(false);
    setPrizeToDelete(null);
  };

  const totalWeight = prizes.reduce((acc, p) => acc + p.weight, 0);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Spin Wheel Card ── */}
        <div className="clay-white-card rounded-[32px] p-6 flex flex-col items-center justify-between min-h-[460px]">
          <div className="w-full mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">3D Interactive Preview</h3>
            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${
              totalWeight === 100
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              Sum: {totalWeight}% {totalWeight === 100 ? '(Calibrated ✓)' : '(Fix to 100%)'}
            </span>
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 my-6 flex items-center justify-center shrink-0">
            <div className="absolute top-[-10px] z-20 text-4xl filter drop-shadow-md select-none transform translate-y-[2px]">
              👇
            </div>
            <svg
              className="w-full h-full filter drop-shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.95, 0.3, 1)' : 'none',
              }}
              viewBox="0 0 200 200"
            >
              {prizes.map((p, idx) => {
                const sliceAngle = 360 / prizes.length;
                const startAngle = idx * sliceAngle;
                const endAngle = startAngle + sliceAngle;
                const rad = Math.PI / 180;
                const x1 = 100 + 85 * Math.cos(startAngle * rad);
                const y1 = 100 + 85 * Math.sin(startAngle * rad);
                const x2 = 100 + 85 * Math.cos(endAngle * rad);
                const y2 = 100 + 85 * Math.sin(endAngle * rad);
                const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                const labelAngle = startAngle + sliceAngle / 2;
                const lx = 100 + 55 * Math.cos(labelAngle * rad);
                const ly = 100 + 55 * Math.sin(labelAngle * rad);

                return (
                  <g key={p.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={p.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={lx} y={ly}
                      fill="#3b2b5c" fontSize="9" fontWeight="900"
                      textAnchor="middle" dominantBaseline="middle"
                      transform={`rotate(${labelAngle + 90}, ${lx}, ${ly})`}
                    >
                      {p.id}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#eae6f8" strokeWidth="3" />
              <circle cx="100" cy="100" r="6" fill="#8e78f5" />
            </svg>
          </div>

          {/* Spin result banner */}
          {spinResult && !isSpinning && (
            <div className="w-full bg-[#e2d9ff]/60 border border-[#c4b8ff] rounded-2xl px-4 py-2.5 mb-2 text-center">
              <p className="text-xs font-black text-[#3b2b5c]">🎉 Last result: <span className="text-[#8e78f5]">{spinResult}</span></p>
            </div>
          )}

          {/* Controls */}
          <div className="w-full flex gap-3.5 border-t border-slate-50 pt-4 mt-2">
            <button
              onClick={handleSpinTest}
              disabled={isSpinning || totalWeight !== 100}
              className="flex-1 clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              {isSpinning ? 'Spinning…' : 'Spin Wheel Test'}
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

        {/* ── Weights + Config ── */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-6 flex flex-col justify-between min-h-[460px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Prize Probability Sliders</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Control individual weights (must sum to exactly 100%)
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1 mt-4 flex-1">
            {prizes.map(p => (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-slate-700">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.id}
                    </span>
                    <span className="max-w-[140px] truncate">{p.prize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <span>Weight: {p.weight}%</span>
                    <button
                      onClick={() => handleDeleteTrigger(p.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 active:scale-90 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-[#8e78f5] cursor-pointer h-2 bg-slate-100 rounded-full"
                  value={p.weight}
                  onChange={e => handleWeightChange(p.id, parseInt(e.target.value))}
                />
              </div>
            ))}
          </div>

          {/* Add prize form */}
          <form onSubmit={handleAddPrize} className="flex gap-2.5 pt-4 border-t border-slate-50 mt-2">
            <input
              type="text"
              placeholder="e.g. Free Grooming 🧴"
              className="flex-1 clay-input py-2.5"
              value={newPrizeName}
              onChange={e => setNewPrizeName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="10"
              className="w-16 clay-input py-2.5 text-center"
              value={newPrizeWeight}
              onChange={e => setNewPrizeWeight(e.target.value)}
              required
            />
            <button type="submit" className="clay-btn clay-btn-purple px-4 py-2.5 text-xs shadow-sm">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Remove Prize Slice 🎡"
        message={`Are you sure you want to remove "${prizes.find(p => p.id === prizeToDelete)?.prize}" from the spin wheel? This cannot be undone.`}
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
