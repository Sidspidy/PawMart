import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: any) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select option...',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}

      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left clay-input bg-white cursor-pointer select-none py-3.5"
      >
        <div className="flex items-center gap-2 text-slate-700 font-extrabold text-xs">
          {selectedOption?.emoji && (
            <span className="text-sm shrink-0">{selectedOption.emoji}</span>
          )}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 stroke-[2.5] transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[#8e78f5]' : ''
          }`}
        />
      </button>

      {/* Select options popover */}
      {isOpen && (
        <div className="absolute top-[102%] left-0 w-full bg-[#faf6f0] border-[3px] border-white rounded-2xl shadow-[0_12px_24px_rgba(59,43,92,0.1),inset_0_2px_4px_rgba(255,255,255,0.6)] z-50 py-1.5 max-h-48 overflow-y-auto pr-1 mt-1 scrollbar-hide animate-pop-in">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left font-black text-xs transition-all ${
                  isSelected
                    ? 'bg-purple-100/60 text-[#8e78f5] border-r-4 border-[#8e78f5]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {opt.emoji && <span className="text-base select-none">{opt.emoji}</span>}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
