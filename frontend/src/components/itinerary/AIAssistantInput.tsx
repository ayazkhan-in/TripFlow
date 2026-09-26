import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAssistantInputProps {
  onSubmitPrompt: (prompt: string) => Promise<void>;
  isLoading: boolean;
  lastFeedback?: string | null;
  activeDayNumber?: number;
  destination?: string;
}

export const AIAssistantInput: React.FC<AIAssistantInputProps> = ({
  onSubmitPrompt,
  isLoading,
  lastFeedback,
  activeDayNumber = 1,
  destination = '',
}) => {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleFeedback, setVisibleFeedback] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss AI feedback message after 5 seconds
  useEffect(() => {
    if (lastFeedback) {
      setVisibleFeedback(lastFeedback);
      setIsDismissing(false);

      const fadeTimer = setTimeout(() => {
        setIsDismissing(true);
      }, 4500);

      const removeTimer = setTimeout(() => {
        setVisibleFeedback(null);
        setIsDismissing(false);
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    } else {
      setVisibleFeedback(null);
      setIsDismissing(false);
    }
  }, [lastFeedback]);

  const isTurkey = destination.toLowerCase().includes('turkey');
  const isJapan = destination.toLowerCase().includes('japan') || destination.toLowerCase().includes('tokyo');

  const samplePrompts = useMemo(() => {
    if (isTurkey) {
      return [
        `Add dinner at Zuma Istanbul on Day ${Math.min(2, activeDayNumber || 2)} at 8:30 PM (₹6,500)`,
        `Add Cappadocia sunrise hot air balloon on Day ${Math.max(3, activeDayNumber || 3)} (₹24,000)`,
        `Add private Bosphorus yacht charter on Day 1 (₹18,500)`,
        `Add historical Turkish hamam bath on Day ${activeDayNumber} morning (₹4,500)`,
        `Add pottery workshop in Avanos on Day ${activeDayNumber} (₹3,000)`,
        'Add another day for Pamukkale thermal pools',
      ];
    }
    if (isJapan) {
      return [
        `Add Michelin sushi omakase to Day ${activeDayNumber} at 7:30 PM (₹16,500)`,
        'Add Shibuya Sky sunset observation deck Day 2 (₹2,200)',
        'Add Shinkansen Gran Class bullet train Day 3 (₹12,000)',
        'Make Day 1 more budget friendly',
        'Add another day for Kyoto street food',
      ];
    }
    return [
      `Add curated fine dining on Day ${activeDayNumber} at 8:00 PM (₹6,500)`,
      `Add private sunset yacht cruise on Day ${activeDayNumber} (₹12,500)`,
      `Add luxury chauffeur transfer on Day 1 (₹4,500)`,
      'Add another day for cultural exploration',
      'Optimize itinerary to save budget',
    ];
  }, [isTurkey, isJapan, activeDayNumber]);

  // Click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    const current = prompt;
    setPrompt('');
    setShowSuggestions(false);
    await onSubmitPrompt(current);
  };

  const handleSelectPrompt = async (sample: string) => {
    setPrompt('');
    setShowSuggestions(false);
    await onSubmitPrompt(sample);
  };

  return (
    <div className="fixed bottom-[60px] md:bottom-3.5 left-0 right-0 z-30 px-2 sm:px-4 pointer-events-none flex justify-center" ref={containerRef}>
      <div className="w-full max-w-lg pointer-events-auto">
        {/* Last AI Feedback Toast (auto-dismisses after 5 seconds) */}
        {visibleFeedback && (
          <div
            className={`mb-2 px-3.5 py-2 bg-slate-900/90 text-white backdrop-blur-md rounded-xl shadow-lg text-xs flex items-center justify-between gap-2 border border-slate-700/60 transition-all duration-500 ${
              isDismissing
                ? 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-2'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-sm text-amber-400 shrink-0 animate-pulse">
                auto_awesome
              </span>
              <span className="truncate">{visibleFeedback}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                ✓ Applied
              </span>
              <button
                type="button"
                onClick={() => setVisibleFeedback(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer flex items-center"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              transition={{ duration: 0.2 }}
              className="mb-2 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-2xl shadow-xl flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-indigo-600">magic_button</span>
                  Instant AI Modifications ({destination || 'Trip'})
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Click to add directly</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    onClick={() => handleSelectPrompt(p)}
                    className="text-xs font-medium text-slate-700 bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/60 px-2.5 py-1 rounded-lg cursor-pointer transition-all active:scale-98 text-left"
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Concierge AI Pill */}
        <motion.form
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          onSubmit={handleSubmit}
          className="flex items-center bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl px-3 py-1.5 gap-2 focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/15 transition-all"
        >
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Show AI Suggestions"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
          </button>

          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider shrink-0 border border-slate-200/60">
            Day {activeDayNumber}
          </span>

          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Ask AI to modify trip (e.g. 'Add dinner at 8 PM')..."
            disabled={isLoading}
            className="flex-1 min-w-0 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="h-7 px-3 rounded-xl bg-slate-900 text-white disabled:opacity-30 hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer shrink-0 transition-all font-semibold text-xs shadow-xs"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                <span className="text-[11px] hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <span className="text-[11px] hidden sm:inline">Add</span>
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

