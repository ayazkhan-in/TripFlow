import React, { useState } from 'react';
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'escrow'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dietary, setDietary] = useState('Strict Vegetarian');
  const [transferPref, setTransferPref] = useState('Toyota Vellfire Executive Lounge');
  const [customNotes, setCustomNotes] = useState(
    '10th Wedding Anniversary celebration. Require quiet high-floor suite & English-speaking chauffeur.'
  );

  if (!isOpen) return null;

  const priceDelta = originalPrice !== undefined ? pricing.total - originalPrice : 0;

  // Derive flight, hotel, car highlights from itinerary
  const flightItem = itinerary.days.flatMap(d => d.items).find(it => it.category === 'transport' && it.title.toLowerCase().includes('flight'));
  const hotelItem = itinerary.days.flatMap(d => d.items).find(it => it.category === 'hotel');
  const carItem = itinerary.days.flatMap(d => d.items).find(it => it.category === 'transport' && !it.title.toLowerCase().includes('flight'));

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
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-2xl">
                {isModifying ? 'edit_note' : 'verified'}
              </span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {isModifying ? 'Modify Confirmed Booking' : 'Step 3 · Review & Pay'}
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                {isModifying ? 'Update Your Reserved Itinerary' : 'Confirm & Reserve Trip'}
              </h3>
              <p className="text-xs text-blue-100 truncate max-w-sm">{itinerary.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Destination
              </span>
              <span className="font-bold text-slate-900 truncate block">{itinerary.destination}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Duration
              </span>
              <span className="font-bold text-slate-900">{itinerary.days.length} Days</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Items
              </span>
              <span className="font-bold text-slate-900">{pricing.itemCount} Total</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Travelers
              </span>
              <span className="font-bold text-slate-900">{itinerary.travelers} Pax</span>
            </div>
          </div>

          {/* INCLUSIONS SUMMARY BENTO BOX */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Included in Your Trip & Synced to Vault
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Flight */}
              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-indigo-600 text-lg mt-0.5">flight</span>
                <div className="min-w-0">
                  <span className="font-bold text-indigo-950 block truncate">
                    {flightItem ? flightItem.title : 'Flights (DEL ➔ Destination Return)'}
                  </span>
                  <span className="text-[11px] text-indigo-700 block">
                    Instant PNR · Extra Legroom · 25kg Bags
                  </span>
                </div>
              </div>

              {/* Hotel */}
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-purple-600 text-lg mt-0.5">hotel</span>
                <div className="min-w-0">
                  <span className="font-bold text-purple-950 block truncate">
                    {hotelItem ? hotelItem.title : 'Handpicked Boutique Hotels'}
                  </span>
                  <span className="text-[11px] text-purple-700 block">
                    Breakfast Included · Early Check-in Flagged
                  </span>
                </div>
              </div>

              {/* Car & Chauffeur */}
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-sky-600 text-lg mt-0.5">directions_car</span>
                <div className="min-w-0">
                  <span className="font-bold text-sky-950 block truncate">
                    {carItem ? carItem.title : 'Private Executive Chauffeur (SUV)'}
                  </span>
                  <span className="text-[11px] text-sky-700 block">
                    24/7 Dedicated Driver · GPS Radar Sync
                  </span>
                </div>
              </div>

              {/* Concierge & Vault */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg mt-0.5">lock</span>
                <div className="min-w-0">
                  <span className="font-bold text-emerald-950 block truncate">
                    Encrypted Travel Vault
                  </span>
                  <span className="text-[11px] text-emerald-700 block">
                    Boarding Passes, Vouchers & SOS Offline
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Allocation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Cost Allocation Breakdown
            </h4>
            <div className="space-y-1.5">
              {(
                ['hotel', 'activity', 'transport', 'meal', 'experience'] as const
              ).map(catKey => {
                const amount = pricing.byCategory[catKey] || 0;
                const config = CATEGORY_CONFIG[catKey];
                return (
                  <div
                    key={catKey}
                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ color: config.accentColor }}>
                        {config.icon}
                      </span>
                      <span className="text-slate-700 font-medium">{config.label}s</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modification Price Delta Callout if Modifying */}
          {isModifying && originalPrice !== undefined && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-800">Original Paid Price:</span>
                <span className="font-mono font-bold">{formatCurrency(originalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-800">Updated Itinerary Price:</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="pt-1.5 border-t border-amber-200/80 flex items-center justify-between">
                <span className="font-bold text-amber-900">
                  {priceDelta >= 0 ? 'Price Difference Due:' : 'Refund Credit Due:'}
                </span>
                <span className={`font-mono text-sm font-extrabold ${priceDelta >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {priceDelta >= 0 ? `+${formatCurrency(priceDelta)}` : formatCurrency(priceDelta)}
                </span>
              </div>
            </div>
          )}

          {/* Traveler Concierge Customizations & Preferences */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-base">tune</span>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Traveler Customization & Concierge Preferences
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Dietary Requirements
                </label>
                <select
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Strict Vegetarian">Strict Vegetarian (Indian/Global)</option>
                  <option value="Vegan">Vegan (Plant-Based Gourmet)</option>
                  <option value="Gluten-Free">Gluten-Free Clean Dining</option>
                  <option value="Halal">Halal Certified</option>
                  <option value="No Restrictions">No Dietary Restrictions</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Chauffeur & Fleet Choice
                </label>
                <select
                  value={transferPref}
                  onChange={e => setTransferPref(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Toyota Vellfire Executive Lounge">Toyota Vellfire VIP Lounge</option>
                  <option value="Mercedes-Maybach S 680">Mercedes-Maybach Luxury Sedan</option>
                  <option value="Range Rover Autobiography">Range Rover Executive SUV</option>
                  <option value="Electric Luxury EV Sedan">Electric Luxury EV Sedan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Special Requests & Notes for Operator
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="e.g. Anniversary celebration, prefer quiet high-floor suite, English-fluent driver..."
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                These requests are transmitted directly to the Operator Dispatch Desk for component bookings.
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isModifying && priceDelta <= 0 ? 'Refund Credited To' : 'Select Payment Method'}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">credit_card</span>
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('escrow')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'escrow'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">shield</span>
                <span>Concierge Escrow</span>
              </button>
            </div>
          </div>

          {/* Total & Per Person */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Grand Total</span>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(pricing.total)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Per Person ({itinerary.travelers} Pax)</span>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(pricing.perPerson)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
          >
            Back to Editor
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="px-6 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/25 cursor-pointer flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <span>
                  {isModifying
                    ? priceDelta > 0
                      ? `Pay Difference (${formatCurrency(priceDelta)}) & Confirm`
                      : 'Save & Update Booking'
                    : `Confirm & Pay ${formatCurrency(pricing.total)}`}
                </span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
