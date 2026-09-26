import React, { useState } from 'react';
import { BookingItem, OperatorTab } from '../../types/travel';
import { useOperator } from '../../context/OperatorContext';
import { formatCurrency } from '../../utils/pricing';

interface CustomizedBookingFulfillmentModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  onNavigateToTab?: (tab: OperatorTab) => void;
}

export const CustomizedBookingFulfillmentModal: React.FC<
  CustomizedBookingFulfillmentModalProps
> = ({ booking, isOpen, onClose, showToast, onNavigateToTab }) => {
  const { fulfillBooking, fulfillSingleComponent } = useOperator();
  const [isFulfillingAll, setIsFulfillingAll] = useState(false);
  const [fulfilledResult, setFulfilledResult] = useState<{
    flight: any;
    stay: any;
    transfer: any;
    activities: any[];
  } | null>(null);

  if (!isOpen || !booking) return null;

  const fulfillmentStatus = booking.customization?.fulfillmentStatus || {
    hotelBooked: booking.status === 'Confirmed',
    flightBooked: booking.status === 'Confirmed',
    transferBooked: booking.status === 'Confirmed',
    activityBooked: booking.status === 'Confirmed',
    guideAssigned: booking.status === 'Confirmed',
  };

  const customization = {
    ...(booking.customization || {
      isCustomized: true,
      basePackageTitle: booking.tourTitle,
      basePrice: Math.round(booking.amount * 0.8),
      customPrice: booking.amount,
      deltaPrice: Math.round(booking.amount * 0.2),
      customRequests: 'Strict vegetarian gourmet meals. High floor quiet suite with mountain views. Dedicated English-speaking chauffeur.',
    }),
    fulfillmentStatus,
  };

  const isAlreadyFulfilled =
    booking.status === 'Confirmed' &&
    fulfillmentStatus.hotelBooked &&
    fulfillmentStatus.flightBooked &&
    fulfillmentStatus.transferBooked &&
    fulfillmentStatus.activityBooked;


  const handleFulfillAll = () => {
    setIsFulfillingAll(true);
    setTimeout(() => {
      try {
        const result = fulfillBooking(booking.id);
        setFulfilledResult(result);
        setIsFulfillingAll(false);
        showToast(
          `🎉 All bookings confirmed & dispatched! Stays, flights, transfers, and activity passes created across respective tabs.`
        );
      } catch (err: any) {
        setIsFulfillingAll(false);
        showToast(err.message || 'Error fulfilling booking');
      }
    }, 600);
  };

  const handleSingleFulfill = (
    component: 'stay' | 'flight' | 'transfer' | 'activity' | 'guide',
    label: string,
    targetTab: OperatorTab
  ) => {
    fulfillSingleComponent(booking.id, component);
    showToast(`✅ ${label} confirmed! View in ${label} tab.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-left animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">
                {isAlreadyFulfilled ? 'verified' : 'auto_fix_high'}
              </span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  {isAlreadyFulfilled ? 'Fulfillment Complete' : 'Traveler Customized Package'}
                </span>
                <span className="text-xs text-slate-400">Ref: {booking.ref}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                Traveler Customizations & Operator Fulfillment
              </h3>
              <p className="text-xs text-slate-300">
                {booking.guestName} · {booking.tourTitle} ({booking.guestsCount} Pax)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          {/* Success Banner if just fulfilled */}
          {(fulfilledResult || isAlreadyFulfilled) && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-xs text-emerald-900">
                    All Services Successfully Booked & Dispatched!
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Hotel vouchers, flight tickets, chauffeur transfers, and activity passes have been generated in their respective operator tabs.
                  </p>
                </div>
              </div>

              {/* Direct Jump to Respective Tabs */}
              {onNavigateToTab && (
                <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Jump to Respective Tab:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('stay_bookings');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">hotel</span>
                    <span>Hotels & Stays</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('flight_bookings');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">flight</span>
                    <span>Flights & Rail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('transfer_bookings');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">directions_car</span>
                    <span>Transfers & Cabs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('activity_bookings');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">explore</span>
                    <span>Tours & Activities</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('calendar');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">calendar_month</span>
                    <span>Global Calendar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab('payments');
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">credit_card</span>
                    <span>Payments Ledger</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Customizations Overview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base">
                  tune
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  Traveler Modifications & Bespoke Requirements
                </span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                Detected from Itinerary Builder
              </span>
            </div>

            {/* Special Instructions & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dietary & Meal Preferences
                </span>
                <p className="font-medium text-slate-800">
                  {customization.dietaryRestrictions || 'Strict Vegetarian / Gourmet Wellness'}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Flagged to hotel chef & private flight catering.
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chauffeur & Transfer Choice
                </span>
                <p className="font-medium text-slate-800">
                  {customization.transferPreference || 'Dedicated Executive Chauffeur (SUV / EV)'}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Tarmac luggage meet with live radar telemetry.
                </span>
              </div>
            </div>

            {/* Traveler's Custom Request Notes */}
            {booking.notes && (
              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
                  Traveler Special Note:
                </span>
                <p className="text-slate-800 font-medium italic">"{booking.notes}"</p>
              </div>
            )}

            {/* Financial Delta */}
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Settled Amount in Escrow
                </span>
                <div className="text-base font-extrabold text-slate-900">
                  {formatCurrency(booking.amount)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Customization Delta
                </span>
                <div className="text-xs font-bold text-emerald-600">
                  +{formatCurrency(customization.deltaPrice || 450)} Included
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Component Bookings Checklist (The Respective Tabs) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Bookings To Execute Across Respective Tabs
                </h4>
                <p className="text-[11px] text-slate-500">
                  Confirm each component individually or execute all with 1 click.
                </p>
              </div>

              {!isAlreadyFulfilled && (
                <button
                  type="button"
                  onClick={handleFulfillAll}
                  disabled={isFulfillingAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>{isFulfillingAll ? 'Executing...' : '⚡ Confirm & Book All Services'}</span>
                </button>
              )}
            </div>

            {/* 1. Stays & Hotels Component */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <span className="material-symbols-outlined text-lg">hotel</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Hotels & Stays Booking
                    </span>
                    <span className="text-[10px] text-purple-700 font-mono bg-purple-50 px-1.5 py-0.5 rounded">
                      Tab: stay_bookings
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {booking.roomsAllocated || 'Luxury Suite / Villa Allocation'}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Includes customized dietary briefing & VIP welcome amenities.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {customization.fulfillmentStatus.hotelBooked || isAlreadyFulfilled ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Voucher Confirmed</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSingleFulfill('stay', 'Hotels & Stays', 'stay_bookings')
                    }
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Book Stay
                  </button>
                )}
              </div>
            </div>

            {/* 2. Flights & Rail Component */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <span className="material-symbols-outlined text-lg">flight</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Flights & Rail Ticket
                    </span>
                    <span className="text-[10px] text-indigo-700 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
                      Tab: flight_bookings
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {booking.flightAllocated || 'VIP Scheduled Carrier / Shinkansen'}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Generate confirmed PNR, ticket number, and terminal instructions.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {customization.fulfillmentStatus.flightBooked || isAlreadyFulfilled ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>PNR Issued</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSingleFulfill('flight', 'Flights & Rail', 'flight_bookings')
                    }
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Issue Ticket
                  </button>
                )}
              </div>
            </div>

            {/* 3. Transfers & Cabs Component */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <span className="material-symbols-outlined text-lg">directions_car</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Chauffeur & Transfer Dispatch
                    </span>
                    <span className="text-[10px] text-sky-700 font-mono bg-sky-50 px-1.5 py-0.5 rounded">
                      Tab: transfer_bookings
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Toyota Vellfire / Maybach Sedan Chauffeur Service
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Assign driver with flight tracking and 24/7 standby mesh.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {customization.fulfillmentStatus.transferBooked || isAlreadyFulfilled ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSingleFulfill('transfer', 'Transfers & Cabs', 'transfer_bookings')
                    }
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Dispatch Driver
                  </button>
                )}
              </div>
            </div>

            {/* 4. Tours & Activities Component */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <span className="material-symbols-outlined text-lg">explore</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Customized Activity Passes & Permits
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                      Tab: activity_bookings
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Private Curator & Heritage Entry Clearance
                  </p>
                  <span className="text-[10px] text-slate-400">
                    VIP permits cleared with fast-track entry and master historian.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {customization.fulfillmentStatus.activityBooked || isAlreadyFulfilled ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Passes Issued</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSingleFulfill('activity', 'Tours & Activities', 'activity_bookings')
                    }
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Issue Passes
                  </button>
                )}
              </div>
            </div>

            {/* 5. Calendar & Ledger Summary */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">
                  sync_alt
                </span>
                <span>
                  Synchronizes automatically to{' '}
                  <strong className="text-slate-800">Global Calendar</strong> &{' '}
                  <strong className="text-slate-800">Payments Ledger</strong>
                </span>
              </div>
              <span className="text-emerald-600 font-semibold text-[10px]">
                Real-Time Dispatch Mesh
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>

          {!isAlreadyFulfilled && (
            <button
              type="button"
              onClick={handleFulfillAll}
              disabled={isFulfillingAll}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>{isFulfillingAll ? 'Executing...' : 'Confirm & Book All Services'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
