import React, { useState } from 'react';
import { PriceBreakdown, TripItinerary } from '../../types/itinerary';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/pricing';

interface FloatingTripTotalProps {
  pricing: PriceBreakdown;
  itinerary: TripItinerary;
  onOpenBookingModal: () => void;
  onShareItinerary?: () => void;
  priceDelta?: number | null;
}

export const FloatingTripTotal: React.FC<FloatingTripTotalProps> = ({
  pricing,
  itinerary,
  onOpenBookingModal,
  priceDelta,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-3 right-4 sm:right-6 z-40 select-none">
      {/* Expanded Breakdown Popover */}
      {isExpanded && (
        <div className="mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-3.5 text-xs animate-in fade-in zoom-in-95 duration-100">
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

          <div className="py-2 space-y-1.5">
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
        </div>
      )}

      {/* Floating Card in Bottom-Right Corner */}
      <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200/90 px-3.5 py-2 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-neutral-900 group"
          title="Click to view category breakdown"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Budget:
              </span>
              <span className="font-extrabold text-neutral-900 text-sm">
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
            <div className="text-[10px] text-neutral-400">
              {formatCurrency(pricing.perPerson)}/person
            </div>
          </div>

          <span className="material-symbols-outlined text-xs text-neutral-400 group-hover:text-neutral-600 transition-transform">
            {isExpanded ? 'expand_more' : 'expand_less'}
          </span>
        </button>

        <div className="w-px h-6 bg-neutral-200" />

        <button
          type="button"
          onClick={onOpenBookingModal}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1"
        >
          <span>Reserve</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
