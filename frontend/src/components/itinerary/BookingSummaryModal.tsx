import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PriceBreakdown, TripItinerary } from '../../types/itinerary';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/pricing';

interface BookingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: TripItinerary;
  pricing: PriceBreakdown;
  isModifying?: boolean;
  originalPrice?: number;
  onConfirmBooking: (customizations?: {
    dietaryRestrictions: string;
    transferPreference: string;
    customRequests: string;
  }) => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  pricing,
  isModifying = false,
  originalPrice,
  onConfirmBooking,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'escrow'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dietary, setDietary] = useState('Strict Vegetarian');
  const [transferPref, setTransferPref] = useState('Toyota Vellfire Executive Lounge');
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const priceDelta = originalPrice !== undefined ? pricing.total - originalPrice : 0;

  // Filter categories with actual amounts
  const activeCostCategories = (
    ['hotel', 'activity', 'transport', 'meal', 'experience'] as const
  ).filter(catKey => (pricing.byCategory[catKey] || 0) > 0);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmBooking({
        dietaryRestrictions: dietary,
        transferPreference: transferPref,
        customRequests: customNotes,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90dvh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Clean, Minimal & Refined */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {isModifying ? 'Update Reserved Itinerary' : 'Review & Confirm Trip'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {itinerary.title} · {itinerary.destination} ({itinerary.days.length} Days)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          {/* Minimal Key Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 py-2.5 px-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destination</span>
              <span className="font-bold text-slate-800">{itinerary.destination}</span>
            </div>
            <div className="sm:text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
              <span className="font-bold text-slate-800">{itinerary.days.length} Days</span>
            </div>
            <div className="sm:text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Activities</span>
              <span className="font-bold text-slate-800">{pricing.itemCount} Total</span>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travelers</span>
              <span className="font-bold text-slate-800">{itinerary.travelers} Guests</span>
            </div>
          </div>

          {/* Minimal Inclusions List */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Included with Your Booking
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-slate-600 text-base">flight</span>
                <span className="font-semibold text-slate-800 truncate">Flights & Baggage</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-slate-600 text-base">hotel</span>
                <span className="font-semibold text-slate-800 truncate">Boutique Luxury Stays</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-slate-600 text-base">directions_car</span>
                <span className="font-semibold text-slate-800 truncate">Private Chauffeur</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-slate-600 text-base">lock</span>
                <span className="font-semibold text-slate-800 truncate">Encrypted Vault Storage</span>
              </div>
            </div>
          </div>

          {/* Cost Allocation (Only showing categories > 0, typo fixed) */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Cost Allocation
            </h4>
            <div className="space-y-1.5">
              {activeCostCategories.map(catKey => {
                const amount = pricing.byCategory[catKey] || 0;
                const config = CATEGORY_CONFIG[catKey];
                const label = catKey === 'activity' ? 'Activities' : `${config.label}s`;

                return (
                  <div
                    key={catKey}
                    className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50/60 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-slate-500">
                        {config.icon}
                      </span>
                      <span className="text-slate-700 font-medium">{label}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modification Price Delta if Modifying */}
          {isModifying && originalPrice !== undefined && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-amber-800">Original Booking:</span>
                <span className="font-mono font-medium">{formatCurrency(originalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-800">Updated Itinerary:</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between font-bold">
                <span>{priceDelta >= 0 ? 'Difference Due:' : 'Refund Due:'}</span>
                <span className="font-mono text-sm">
                  {priceDelta >= 0 ? `+${formatCurrency(priceDelta)}` : formatCurrency(priceDelta)}
                </span>
              </div>
            </div>
          )}

          {/* Concierge Customizations */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Traveler Preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Dietary</label>
                <select
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value="Strict Vegetarian">Strict Vegetarian</option>
                  <option value="Vegan">Vegan Gourmet</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal Certified</option>
                  <option value="No Restrictions">No Restrictions</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Chauffeur Fleet</label>
                <select
                  value={transferPref}
                  onChange={e => setTransferPref(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value="Toyota Vellfire Executive Lounge">Toyota Vellfire Lounge</option>
                  <option value="Mercedes-Maybach S 680">Mercedes-Maybach</option>
                  <option value="Range Rover Autobiography">Range Rover Luxury SUV</option>
                  <option value="Electric Luxury EV Sedan">Electric Luxury EV</option>
                </select>
              </div>
            </div>
          </div>

          {/* Minimal Payment Selector */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Payment Instrument
            </h4>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs">
              {[
                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                { id: 'upi', label: 'UPI / QR', icon: 'qr_code_2' },
                { id: 'escrow', label: 'Escrow', icon: 'shield' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id as any)}
                  className={`py-2 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1 sm:gap-1.5 font-medium text-[11px] sm:text-xs transition-all cursor-pointer ${
                    paymentMethod === opt.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/80 border-t border-slate-100 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
            <div className="text-xl font-bold font-mono text-slate-900 tracking-tight">
              {formatCurrency(pricing.total)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-97 flex-1 sm:flex-initial"
            >
              {isProcessing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <span>
                    {isModifying
                      ? priceDelta > 0
                        ? `Pay Difference (${formatCurrency(priceDelta)})`
                        : 'Save Changes'
                      : `Confirm & Pay ${formatCurrency(pricing.total)}`}
                  </span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

