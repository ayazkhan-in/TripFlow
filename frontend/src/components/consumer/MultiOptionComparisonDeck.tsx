import React, { useState } from 'react';
import {
  AIGeneratedProposal,
  AIFlightOption,
  AIHotelOption,
  AITransferOption,
  AIActivityOption,
} from '../../utils/aiTripPlanner';

interface MultiOptionComparisonDeckProps {
  proposal: AIGeneratedProposal;
  targetBudgetUSD: number;
  selectedFlightId: string;
  onSelectFlight: (flightId: string) => void;
  selectedHotelId: string;
  onSelectHotel: (hotelId: string) => void;
  selectedTransferId: string;
  onSelectTransfer: (transferId: string) => void;
  selectedActivityIds: string[];
  onToggleActivity: (activityId: string) => void;
  onOpenInBuilder: () => void;
}

export const MultiOptionComparisonDeck: React.FC<MultiOptionComparisonDeckProps> = ({
  proposal,
  targetBudgetUSD,
  selectedFlightId,
  onSelectFlight,
  selectedHotelId,
  onSelectHotel,
  selectedTransferId,
  onSelectTransfer,
  selectedActivityIds,
  onToggleActivity,
  onOpenInBuilder,
}) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const formatPrice = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Find currently selected items
  const activeFlight = proposal.flights.find(f => f.id === selectedFlightId) || proposal.flights[0];
  const activeHotel = proposal.hotels.find(h => h.id === selectedHotelId) || proposal.hotels[0];
  const activeTransfer = proposal.transfers.find(t => t.id === selectedTransferId) || proposal.transfers[0];

  const nights = Math.max(1, proposal.days - 1);
  const flightTotal = (activeFlight?.priceUSD || 0) * proposal.travelers;
  const hotelTotal = (activeHotel?.pricePerNightUSD || 0) * nights;
  const transferDelta = activeTransfer?.priceDeltaUSD || 0;
  const baseActivities = 3500 * proposal.days;
  const extrasTotal = (proposal.extraActivities || [])
    .filter(act => selectedActivityIds.includes(act.id))
    .reduce((sum, act) => sum + act.price, 0);

  const currentTotalUSD = flightTotal + hotelTotal + transferDelta + baseActivities + extrasTotal;
  const targetBudget = targetBudgetUSD > 0 ? targetBudgetUSD : proposal.basePriceUSD;
  const budgetDeltaUSD = currentTotalUSD - targetBudget;

  const budgetPercentage = Math.min(125, Math.round((currentTotalUSD / targetBudget) * 100));

  return (
    <div className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. MINIMAL HEADER WITHOUT UNNECESSARY PILLS OR FLASHY ICONS */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-slate-200/60">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {proposal.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
            {proposal.summary}
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 shrink-0">
          {proposal.days} Days ({nights} Nights) · {proposal.travelers} Guests
        </div>
      </div>

      {/* 2. MINIMAL LIGHT BLUE BUDGET METER (NO BLACK, NO GRADIENT ON LOADING BAR, NO EMOJI PILLS) */}
      <div className="rounded-2xl p-4 sm:p-5 bg-blue-50/70 border border-blue-200/70 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900/60">
              Live Budget Calibration Meter
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatPrice(currentTotalUSD)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                total ({formatPrice(Math.round(currentTotalUSD / proposal.travelers))} / guest)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <div className="text-xs text-slate-600">
              Target Budget: <span className="font-bold text-slate-900">{formatPrice(targetBudget)}</span>
            </div>
            <div className="mt-1">
              {budgetDeltaUSD <= 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/80 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Within Budget (Saves {formatPrice(Math.abs(budgetDeltaUSD))})</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/80 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>Upgraded Tier (+{formatPrice(budgetDeltaUSD)})</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Solid Loading Bar - No Gradient */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden flex">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetPercentage <= 100 ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>

          {/* Minimal Inline Breakdown - No Bulky Pills or Emojis */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-0.5 font-medium">
            <span>Flight: {formatPrice(flightTotal)}</span>
            <span>Hotels: {formatPrice(hotelTotal)}</span>
            <span>Transfers & Tours: {formatPrice(transferDelta + baseActivities + extrasTotal)}</span>
          </div>
        </div>
      </div>

      {/* 3. FLIGHT OPTIONS DECK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Flight Options ({proposal.travelers} Guests)
          </h4>
          <span className="text-xs text-slate-400 font-medium">Round-trip</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {proposal.flights.map(flt => {
            const isSelected = flt.id === selectedFlightId;
            const flightTotalCost = flt.priceUSD * proposal.travelers;

            return (
              <div
                key={flt.id}
                onClick={() => onSelectFlight(flt.id)}
                className={`rounded-2xl p-4 sm:p-5 text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 ring-2 ring-blue-100 shadow-md'
                    : 'bg-white border border-slate-200/90 ring-1 ring-black/[0.04] shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        flt.type === 'cheaper'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : flt.type === 'recommended'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {flt.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-slate-900">{flt.airline}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {flt.flightNumber} · {flt.cabinClass}
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-slate-800">{flt.departureTime}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{flt.originCode}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 font-medium">{flt.duration}</span>
                      <div className="w-12 h-px bg-slate-300 my-1 relative">
                        <span className="material-symbols-outlined text-[10px] text-slate-400 absolute left-1/2 -top-1.5 -translate-x-1/2">
                          arrow_forward
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-blue-600">{flt.stops}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-800">{flt.arrivalTime}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{flt.destCode}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mt-2.5">
                    Included baggage: {flt.baggage}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatPrice(flightTotalCost)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatPrice(flt.priceUSD)} / traveler
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onSelectFlight(flt.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HOTEL OPTIONS DECK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Accommodation Options ({nights} Nights)
          </h4>
          <span className="text-xs text-slate-400 font-medium">Curated boutique & luxury stays</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {proposal.hotels.map(ht => {
            const isSelected = ht.id === selectedHotelId;
            const hotelTotalCost = ht.pricePerNightUSD * nights;

            return (
              <div
                key={ht.id}
                onClick={() => onSelectHotel(ht.id)}
                className={`group rounded-2xl overflow-hidden text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 ring-2 ring-blue-100 shadow-md'
                    : 'bg-white border border-slate-200/90 ring-1 ring-black/[0.04] shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={ht.image}
                      alt={ht.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                          ht.type === 'cheaper'
                            ? 'bg-slate-900/85 text-emerald-300 border border-emerald-500/30'
                            : ht.type === 'recommended'
                            ? 'bg-blue-900/85 text-blue-200 border border-blue-400/30'
                            : 'bg-purple-900/85 text-purple-200 border border-purple-400/30'
                        }`}
                      >
                        {ht.label}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs border border-slate-200/60">
                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                        <span>{ht.rating}</span>
                        <span className="text-[10px] text-slate-500">({ht.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] text-slate-500 truncate block">
                      {ht.location}
                    </span>

                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                      {ht.name}
                    </h5>
                    <p className="text-xs text-blue-600 font-medium line-clamp-1">
                      {ht.roomType}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {ht.perks.slice(0, 2).map((perk, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 line-clamp-1"
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatPrice(hotelTotalCost)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatPrice(ht.pricePerNightUSD)} / night
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onSelectHotel(ht.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. PRIVATE TRANSFERS */}
      <div className="space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Chauffeur & Transfers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {proposal.transfers.map(tr => {
            const isSelected = tr.id === selectedTransferId;

            return (
              <div
                key={tr.id}
                onClick={() => onSelectTransfer(tr.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 ring-2 ring-blue-100 shadow-md'
                    : 'bg-white border border-slate-200/90 ring-1 ring-black/[0.04] shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{tr.label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 line-clamp-1">{tr.vehicle}</div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tr.description}
                  </div>
                </div>
                <div className="mt-3 text-xs font-extrabold">
                  {tr.priceDeltaUSD === 0 ? (
                    <span className="text-emerald-600">Included in Base</span>
                  ) : tr.priceDeltaUSD > 0 ? (
                    <span className="text-slate-900">+{formatPrice(tr.priceDeltaUSD)}</span>
                  ) : (
                    <span className="text-emerald-600">-{formatPrice(Math.abs(tr.priceDeltaUSD))}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. DAY-BY-DAY SCHEDULE PREVIEW */}
      {proposal.schedulePreview && proposal.schedulePreview.length > 0 && (
        <div className="space-y-3 border-t border-slate-200/60 pt-4">
          <button
            type="button"
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-900 cursor-pointer"
          >
            <span className="text-sm font-bold text-slate-900">
              Curated Day-by-Day Schedule ({proposal.schedulePreview.length} Days)
            </span>
            <span className="material-symbols-outlined text-base text-slate-400">
              {isScheduleOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isScheduleOpen && (
            <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
              {proposal.schedulePreview.map(day => (
                <div key={day.dayNumber} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center justify-center shrink-0 border border-blue-100">
                      D{day.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{day.title}</span>
                  </div>
                  <ul className="pl-8 space-y-1">
                    {day.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-xs text-slate-600 list-disc">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. ACTION FOOTER: OPEN IN BUILDER */}
      <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-medium">
          Instant live reservation & budget-calibrated customization ready.
        </div>

        <button
          type="button"
          onClick={onOpenInBuilder}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Open in Itinerary Builder</span>
        </button>
      </div>
    </div>
  );
};
