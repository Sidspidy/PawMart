import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Sliders, Play, Plus, RefreshCw, 
  Trash2, HelpCircle, AlertCircle, Check, Award 
} from 'lucide-react';

const INITIAL_REWARDS = [
  { id: '1', name: 'Free Chew Toy 🦴', prob: 15, color: '#c8b6ff', count: 12 },
  { id: '2', name: '10% Discount 🎫', prob: 35, color: '#ffd8be', count: 180 },
  { id: '3', name: '50 Loyalty Points 💎', prob: 25, color: '#e2f0cb', count: 420 },
  { id: '4', name: 'Free Shipping 🚚', prob: 15, color: '#ffd6ff', count: 90 },
  { id: '5', name: 'Try Again 🐾', prob: 10, color: '#e7c6ff', count: 0 },
];

export default function SpinConfig() {
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalProbability = rewards.reduce((sum, item) => sum + item.prob, 0);

  const handleProbChange = (id: string, newVal: number) => {
    setRewards(rewards.map(item => {
      if (item.id === id) {
        return { ...item, prob: newVal };
      }
      return item;
    }));
  };

  const handleSpinPreview = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    setShowCelebration(false);

    // Pick a random reward based on probabilities
    const rand = Math.random() * totalProbability;
    let accumulated = 0;
    let selectedReward = rewards[rewards.length - 1];

    for (const reward of rewards) {
      accumulated += reward.prob;
      if (rand <= accumulated) {
        selectedReward = reward;
        break;
      }
    }

    // Find the slice index to stop the pointer at
    const rewardIndex = rewards.findIndex(r => r.id === selectedReward.id);
    const sliceAngle = 360 / rewards.length;
    // Calculate rotation to align the slice at the top (with added full spins)
    const baseRotation = 360 * 5; // 5 full spins
    const targetAngle = 360 - (rewardIndex * sliceAngle + sliceAngle / 2);
    const finalRotation = baseRotation + targetAngle;

    setWheelRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(selectedReward.name);
      setShowCelebration(true);
    }, 4000);
  };

  const handleResetProbabilities = () => {
    const slice = Math.floor(100 / rewards.length);
    setRewards(rewards.map(item => ({ ...item, prob: slice })));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 relative"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <Sparkles className="text-violet-500 fill-violet-100" />
            Spin Wheel Configurator
          </h2>
          <p className="text-xs text-[#705e8c]">Set up gamified loyalty rewards, probability margins, and live visual preview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE SPIN WHEEL PREVIEW */}
        <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          
          {/* Subtle neon glowing light rings behind the wheel */}
          <div className="absolute w-[300px] h-[300px] bg-violet-200/40 rounded-full blur-[80px] pointer-events-none animate-glow" />
          
          <h3 className="font-extrabold text-sm text-[#3d2c54] self-start mb-6 flex items-center gap-2">
            <Award size={16} className="text-orange-400" />
            Live Gamification Sandbox
          </h3>

          {/* WHEEL CONSTRUCT */}
          <div className="relative w-[280px] h-[280px] mb-6 flex items-center justify-center select-none">
            
            {/* The Pointer */}
            <div className="absolute top-[-10px] w-6 h-8 bg-orange-400 rounded-b-full shadow-md z-30 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full -mt-1.5" />
            </div>

            {/* Rotatable wheel canvas (simulated using CSS gradient slices) */}
            <motion.div 
              className="w-full h-full rounded-full border-8 border-white bg-white shadow-[0_12px_45px_rgba(138,92,245,0.22)] relative overflow-hidden flex items-center justify-center z-10"
              style={{ rotate: wheelRotation }}
              animate={isSpinning ? { rotate: wheelRotation } : {}}
              transition={{ ease: [0.12, 0.8, 0.15, 1], duration: 4 }}
            >
              {/* Outer decorative beads */}
              <div className="absolute inset-0 border-4 border-dashed border-violet-200/50 rounded-full pointer-events-none z-20" />

              {/* Draw segments */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {rewards.map((reward, i) => {
                  const slice = 100 / rewards.length;
                  const startAngle = i * (360 / rewards.length);
                  const endAngle = (i + 1) * (360 / rewards.length);
                  
                  // Convert angles to polar coords
                  const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={reward.id}>
                      <path d={pathData} fill={reward.color} />
                    </g>
                  );
                })}
              </svg>

              {/* Inner Segment Emojis (Visual representation) */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {rewards.map((reward, i) => {
                  const angle = (360 / rewards.length) * i + (360 / rewards.length) / 2;
                  const distance = 80; // distance from center in px
                  const x = 140 + distance * Math.cos(((angle - 90) * Math.PI) / 180);
                  const y = 140 + distance * Math.sin(((angle - 90) * Math.PI) / 180);
                  const emoji = reward.name.split(' ').pop();

                  return (
                    <div 
                      key={reward.id}
                      className="absolute text-lg font-bold"
                      style={{ 
                        left: `${x - 12}px`, 
                        top: `${y - 12}px`,
                        transform: `rotate(${angle}deg)`
                      }}
                    >
                      {emoji}
                    </div>
                  );
                })}
              </div>

              {/* Center Hub Glass Bubble */}
              <div className="absolute w-12 h-12 bg-white rounded-full shadow-md z-20 flex items-center justify-center border border-violet-100">
                <Sparkles size={16} className="text-[#8a5cf5]" />
              </div>

            </motion.div>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleSpinPreview}
            disabled={isSpinning}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-sm shadow-[0_6px_20px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform cursor-pointer disabled:opacity-50"
          >
            <Play size={16} fill="white" />
            Spin Preview
          </button>

        </div>

        {/* RIGHT COLUMN: PROBABILITY TUNER AND SLIDERS */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            
            <div className="flex items-center justify-between border-b border-violet-100/60 pb-3">
              <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2">
                <Sliders size={16} className="text-orange-400" />
                Win Probability Ratios
              </h3>
              <button 
                onClick={handleResetProbabilities}
                className="text-[10px] font-bold text-violet-500 hover:text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all"
              >
                <RefreshCw size={10} />
                Distribute Evenly
              </button>
            </div>

            {/* ERROR INDICATOR */}
            {totalProbability !== 100 && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-[18px] text-[10px] font-bold flex items-center gap-2">
                <AlertCircle size={14} />
                <span>Validation Failure: Total odds must equal 100%. Currently: <strong>{totalProbability}%</strong>.</span>
              </div>
            )}

            {/* SLIDERS LIST */}
            <div className="space-y-4 mt-2">
              {rewards.map(reward => (
                <div key={reward.id} className="p-4 bg-white/50 border border-violet-50 rounded-[22px] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#3d2c54]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reward.color }} />
                      {reward.name}
                    </span>
                    <span className="text-[#8a5cf5] font-extrabold">{reward.prob}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      value={reward.prob}
                      onChange={e => handleProbChange(reward.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-[10px] text-[#9f8fb3] font-bold shrink-0 w-8 text-right">
                      {reward.count} spins
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SAVE CONFIG SUCCESS COMPONENT */}
            <div className="pt-2">
              <button 
                disabled={totalProbability !== 100}
                className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-amber-400 disabled:opacity-50 text-white rounded-full font-extrabold text-xs shadow-[0_6px_20px_rgba(249,115,22,0.25)] hover:scale-101 cursor-pointer duration-200"
              >
                Save Payout Configurations
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* POPUP CELEBRATION MODAL ON SPIN RESULT */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-violet-950/20 backdrop-blur-sm z-[999] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm glass-panel p-8 rounded-[36px] border border-white/80 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              {/* Confetti decoration particles */}
              <div className="absolute top-2 left-6 text-pink-300 animate-float"><Sparkles size={24} /></div>
              <div className="absolute bottom-4 right-10 text-orange-300 animate-float-delayed"><Sparkles size={16} /></div>

              <div className="w-16 h-16 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl font-bold shadow-inner mb-4">
                🎉
              </div>

              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#9f8fb3]">
                Spin Wheel Preview Payout
              </span>
              <h4 className="text-xl font-extrabold text-[#3d2c54] mt-2">
                {spinResult}
              </h4>
              <p className="text-xs text-[#705e8c] mt-2 leading-relaxed max-w-[220px]">
                Loyalty system selected this segment successfully! Ready to dispatch coupons to customer wallets.
              </p>

              <button 
                onClick={() => setShowCelebration(false)}
                className="mt-6 px-6 py-2.5 bg-violet-600 text-white rounded-full font-bold text-xs shadow-md hover:scale-102 transition-transform cursor-pointer"
              >
                Close Sandbox
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
