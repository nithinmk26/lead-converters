import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl ${
        type === 'success' 
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/20'
          : 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-500/20'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        )}
        <span className="text-sm font-semibold font-heading">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
