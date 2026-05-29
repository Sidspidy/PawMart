import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  emoji?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  emoji = '🐾',
  type = 'info',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-500 hover:bg-rose-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_rgba(244,63,94,0.3)] border-b-[4px] border-rose-700 active:border-b-0 hover:translate-y-[2px] active:translate-y-[4px]';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_rgba(245,158,11,0.3)] border-b-[4px] border-amber-700 active:border-b-0 hover:translate-y-[2px] active:translate-y-[4px]';
      default:
        return 'bg-[#8e78f5] hover:bg-[#7c63eb] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_rgba(142,120,245,0.3)] border-b-[4px] border-[#6b52db] active:border-b-0 hover:translate-y-[2px] active:translate-y-[4px]';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#faf6f0] border-[4px] border-white rounded-[40px] p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(59,43,92,0.15),inset_0_4px_8px_rgba(255,255,255,0.8)] relative transform scale-100 transition-all duration-300 flex flex-col items-center text-center animate-pop-in">
        
        {/* Floating Bubble Emoji */}
        <div className="w-20 h-20 rounded-[28px] border-[3px] border-white bg-white shadow-clay-card flex items-center justify-center text-4xl mb-5 shrink-0 transform -rotate-6 select-none">
          {emoji}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-[#3b2b5c] tracking-tight leading-tight mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-xs text-slate-500 font-extrabold leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex w-full gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-xs font-black text-slate-500 bg-white border-[3px] border-white rounded-2xl hover:bg-slate-50 active:scale-95 transition-all shadow-[0_4px_8px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-xs font-black rounded-2xl transition-all duration-200 uppercase tracking-wider ${getButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
