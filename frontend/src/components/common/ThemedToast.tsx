import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, X, Sparkles } from 'lucide-react';

export interface ThemedToastProps {
  message: string | null;
  onClose: () => void;
  title?: string;
  duration?: number;
  type?: 'success' | 'info' | 'alert';
}

export const ThemedToast: React.FC<ThemedToastProps> = ({
  message,
  onClose,
  title = 'Bookit System Notice',
  duration = 4000,
  type = 'info',
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;
    setProgress(100);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message, duration]);

  if (!message) return null;

  const isSuccess = type === 'success' || message.includes('success') || message.includes('resolved') || message.includes('published') || message.includes('Welcome');
  const isAlert = type === 'alert' || message.includes('critical') || message.includes('failed') || message.includes('Disruption');

  return (
    <aside
      aria-label="Notification"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 animate-element max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0A1224]/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-blue-950/50 p-4 text-white ring-1 ring-white/10 flex items-start gap-3.5 group">
        {/* Glowing Ambient Backdrop Dot */}
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40 ${
            isSuccess ? 'bg-emerald-500' : isAlert ? 'bg-amber-500' : 'bg-blue-600'
          }`}
        />

        {/* Accent Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
            isSuccess
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : isAlert
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-[#004AC6]/25 border-blue-500/30 text-blue-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isAlert ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400">
              {title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
            <span className="text-[10px] text-slate-400 font-medium">Live Telemetry</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-100 leading-snug break-words">
            {message}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Countdown Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className={`h-full transition-all duration-75 ${
              isSuccess ? 'bg-emerald-400' : isAlert ? 'bg-amber-400' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
