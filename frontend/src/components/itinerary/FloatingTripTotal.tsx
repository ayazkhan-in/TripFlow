import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceBreakdown, TripItinerary } from '../../types/itinerary';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/pricing';

interface FloatingTripTotalProps {
  pricing: PriceBreakdown;
  itinerary: TripItinerary;
  onOpenBookingModal: () => void;
  onOpenAddSidebar?: () => void;
  onShareItinerary?: () => void;
  priceDelta?: number | null;
}

export const FloatingTripTotal: React.FC<FloatingTripTotalProps> = ({
  pricing,
  itinerary,
  onOpenBookingModal,
  onOpenAddSidebar,
  priceDelta,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 sm:px-4 sm:py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:shadow-none md:border-0 md:p-0 md:bottom-3 md:right-6 md:left-auto md:w-auto md:bg-transparent select-none">
      {/* Expanded Breakdown Popover */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(6px)' }}
            transition={{ duration: 0.2 }}
            className="absolute md:static bottom-full mb-2 left-3 right-3 md:left-auto md:right-0 md:w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-3.5 text-xs z-50"
          >
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 font-bold text-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-blue-600">
                receipt_long
              </span>
              <span>Trip Budget Breakdown</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>

          <div className="py-2 space-y-1.5 max-h-[40vh] overflow-y-auto custom-scrollbar">
            {(
              ['hotel', 'activity', 'transport', 'meal', 'experience'] as const
            ).map(catKey => {
              const amount = pricing.byCategory[catKey] || 0;
              const percent =
                pricing.total > 0 ? Math.round((amount / pricing.total) * 100) : 0;
              const config = CATEGORY_CONFIG[catKey];
              return (
                <div key={catKey} className="flex items-center justify-between text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ color: config.accentColor }}
                    >
                      {config.icon}
                    </span>
                    <span className="capitalize">{config.label}s</span>
                    <span className="text-[10px] text-neutral-400">({percent}%)</span>
                  </div>
                  <span className="font-semibold text-neutral-900">{formatCurrency(amount)}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 px-2.5 py-1.5 rounded-lg text-neutral-600">
            <span className="font-medium text-[11px]">Per person ({itinerary.travelers}p)</span>
            <span className="font-bold text-blue-600 text-xs">{formatCurrency(pricing.perPerson)}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              onOpenBookingModal();
            }}
            className="mt-2.5 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer text-center"
          >
            Review & Reserve Trip
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Floating Card on Desktop / Bottom Bar Content on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex items-center justify-between md:justify-start bg-transparent md:bg-white/95 md:backdrop-blur-md rounded-2xl md:shadow-xl md:border md:border-neutral-200/90 px-0 md:px-3.5 py-0 md:py-2 gap-2 sm:gap-3 text-xs"
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-neutral-900 group min-w-0"
          title="Click to view category breakdown"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Budget:
              </span>
              <span className="font-extrabold text-neutral-900 text-sm tracking-tight truncate">
                {formatCurrency(pricing.total)}
              </span>
              {priceDelta != null && priceDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold px-1 rounded ${
                    priceDelta > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {priceDelta > 0 ? `+${formatCurrency(priceDelta)}` : formatCurrency(priceDelta)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
              <span>{formatCurrency(pricing.perPerson)}/pax</span>
              <span className="text-neutral-400">• Breakdown</span>
              <span className="material-symbols-outlined text-xs text-neutral-400 group-hover:text-neutral-600 transition-transform">
                {isExpanded ? 'expand_more' : 'expand_less'}
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAddSidebar && (
            <button
              type="button"
              onClick={onOpenAddSidebar}
              className="md:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-200 flex items-center gap-1"
              title="Add activities, hotels, and transport"
            >
              <span className="material-symbols-outlined text-sm text-blue-600">add</span>
              <span>Add</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenBookingModal}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1 shrink-0"
          >
            <span>Reserve</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
