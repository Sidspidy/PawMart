import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 3500
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────
export const ToastContext = createContext<ToastContextValue | null>(null);

// ── Config per type ────────────────────────────────────────────────────────────
const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; bg: string; border: string; iconColor: string; titleColor: string }
> = {
  success: {
    icon: <CheckCircle className="w-5 h-5 stroke-[2.5]" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-800',
  },
  error: {
    icon: <XCircle className="w-5 h-5 stroke-[2.5]" />,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconColor: 'text-rose-500',
    titleColor: 'text-rose-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 stroke-[2.5]" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800',
  },
  info: {
    icon: <Info className="w-5 h-5 stroke-[2.5]" />,
    bg: 'bg-[#e2d9ff]',
    border: 'border-[#c4b8ff]',
    iconColor: 'text-[#8e78f5]',
    titleColor: 'text-[#3b2b5c]',
  },
};

// ── Single Toast card ──────────────────────────────────────────────────────────
function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const cfg = toastConfig[item.type];
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(onRemove, 280);
  }, [onRemove]);

  React.useEffect(() => {
    const t = setTimeout(dismiss, item.duration ?? 3500);
    return () => clearTimeout(t);
  }, [dismiss, item.duration]);

  return (
    <div
      className={`
        flex items-start gap-3 w-80 max-w-[90vw] rounded-[22px] border-2 px-4 py-3.5 shadow-clay-card
        ${cfg.bg} ${cfg.border}
        transition-all duration-300
        ${leaving ? 'opacity-0 translate-x-6 scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>{cfg.icon}</div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`font-black text-xs leading-snug ${cfg.titleColor}`}>{item.title}</p>
        {item.message && (
          <p className={`text-[11px] font-semibold mt-0.5 opacity-80 ${cfg.titleColor}`}>{item.message}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        className={`shrink-0 mt-0.5 p-0.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity ${cfg.iconColor}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Toast Stack (portal) ───────────────────────────────────────────────────────
function ToastStack({ toasts, remove }: { toasts: ToastItem[]; remove: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastCard item={t} onRemove={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, 'id'>) => {
    const id = `toast-${++counter.current}-${Date.now()}`;
    setToasts(prev => [...prev.slice(-4), { ...opts, id }]); // max 5 visible
  }, []);

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: 'error',   title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: 'info',    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <ToastStack toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
