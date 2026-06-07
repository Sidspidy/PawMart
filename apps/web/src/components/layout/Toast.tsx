import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useToastStore, Toast as ToastType } from '../../store/toast.store';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 md:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  const { message, type } = toast;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const bgStyle = {
    success: 'border-emerald-500/20 bg-emerald-50/90 text-emerald-950 backdrop-blur-md shadow-emerald-100/10 dark:bg-emerald-950/90 dark:text-emerald-50 dark:border-emerald-500/30',
    error: 'border-rose-500/20 bg-rose-50/90 text-rose-950 backdrop-blur-md shadow-rose-100/10 dark:bg-rose-950/90 dark:text-rose-50 dark:border-rose-500/30',
    warning: 'border-amber-500/20 bg-amber-50/90 text-amber-950 backdrop-blur-md shadow-amber-100/10 dark:bg-amber-950/90 dark:text-amber-50 dark:border-amber-500/30',
    info: 'border-sky-500/20 bg-sky-50/90 text-sky-950 backdrop-blur-md shadow-sky-100/10 dark:bg-sky-950/90 dark:text-sky-50 dark:border-sky-500/30',
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg ${bgStyle}`}
    >
      <div className="flex items-center gap-3">
        {iconMap[type]}
        <p className="text-sm font-medium leading-relaxed font-body">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
