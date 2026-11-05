import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ notification, onDismiss }) {
  if (!notification || !notification.message) return null;

  const styles = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
  };

  const currentStyle = styles[notification.type] || styles.info;

  return (
    <div
      role="alert"
      className={`border rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${currentStyle.container}`}
    >
      <div className="flex items-center gap-3">
        {currentStyle.icon}
        <span className="text-sm font-medium">{notification.message}</span>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
