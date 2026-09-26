import React, { useState, useMemo } from 'react';
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
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [activeTab, setActiveTab] = useState<'all' | 'flights' | 'hotels' | 'itinerary'>('all');
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const exchangeRate = currency === 'USD' ? 1 : 83;
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const formatPrice = (usd: number) => {
    const val = currency === 'USD' ? usd : Math.round(usd * exchangeRate);
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // Find currently selected items
  const activeFlight = proposal.flights.find(f => f.id === selectedFlightId) || proposal.flights[0];
  const activeHotel = proposal.hotels.find(h => h.id === selectedHotelId) || proposal.hotels[0];
  const activeTransfer = proposal.transfers.find(t => t.id === selectedTransferId) || proposal.transfers[0];

  const nights = Math.max(1, proposal.days - 1);
  const flightTotal = (activeFlight?.priceUSD || 0) * proposal.travelers;
  const hotelTotal = (activeHotel?.pricePerNightUSD || 0) * nights;
  const transferDelta = activeTransfer?.priceDeltaUSD || 0;
  const baseActivities = 180 * proposal.days;
  const extrasTotal = (proposal.extraActivities || [])
    .filter(act => selectedActivityIds.includes(act.id))
    .reduce((sum, act) => sum + act.price, 0);

  const currentTotalUSD = flightTotal + hotelTotal + transferDelta + baseActivities + extrasTotal;
  const targetBudget = targetBudgetUSD > 0 ? targetBudgetUSD : proposal.basePriceUSD;
  const budgetDeltaUSD = currentTotalUSD - targetBudget;

  const budgetPercentage = Math.min(125, Math.round((currentTotalUSD / targetBudget) * 100));

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-left animate-in fade-in duration-200">
      {/* 1. TOP HEADER & CURRENCY SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✨ AI Tailored Proposal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {proposal.days} Days ({nights} Nights) · {proposal.travelers} Guests
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {proposal.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            {proposal.summary}
          </p>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              currency === 'INR'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      {/* 2. LIVE BUDGET ADHERENCE METER */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Budget Adherence Tracker
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {formatPrice(currentTotalUSD)}
              </span>
              <span className="text-xs text-slate-300">
                total ({formatPrice(Math.round(currentTotalUSD / proposal.travelers))} / guest)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <div className="text-[11px] text-slate-300">
              Target Budget: <span className="font-bold text-white">{formatPrice(targetBudget)}</span>
            </div>
            <div className="mt-1">
              {budgetDeltaUSD <= 0 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Within Budget (Saves {formatPrice(Math.abs(budgetDeltaUSD))})</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>Upgraded Tier (+{formatPrice(budgetDeltaUSD)})</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                budgetPercentage <= 100
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : 'bg-gradient-to-r from-amber-400 to-rose-400'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>✈️ Flight: {formatPrice(flightTotal)}</span>
            <span>🏨 Hotels: {formatPrice(hotelTotal)}</span>
            <span>🚗 Transfers & Experiences: {formatPrice(transferDelta + baseActivities + extrasTotal)}</span>
          </div>
        </div>
      </div>

      {/* 3. FLIGHT OPTIONS DECK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">flight</span>
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Round-Trip Flight Options ({proposal.travelers} Guests)
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click to select option</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {proposal.flights.map(flt => {
            const isSelected = flt.id === selectedFlightId;
            const flightTotalCost = flt.priceUSD * proposal.travelers;

            return (
              <div
                key={flt.id}
                onClick={() => onSelectFlight(flt.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      flt.type === 'cheaper'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : flt.type === 'recommended'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {flt.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-slate-900">{flt.airline}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {flt.flightNumber} · {flt.cabinClass}
                  </div>

                  <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-800">{flt.departureTime}</div>
                      <div className="text-[10px] text-slate-400">{flt.originCode}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400">{flt.duration}</span>
                      <div className="w-12 h-px bg-slate-300 my-0.5 relative">
                        <span className="material-symbols-outlined text-[10px] text-slate-400 absolute left-1/2 -top-1.5 -translate-x-1/2">
                          arrow_forward
                        </span>
                      </div>
                      <span className="text-[9px] font-semibold text-blue-600">{flt.stops}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-800">{flt.arrivalTime}</div>
                      <div className="text-[10px] text-slate-400">{flt.destCode}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-slate-400">luggage</span>
                    <span>{flt.baggage}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white'
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
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">hotel</span>
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Accommodation Options ({nights} Nights)
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click to select stay</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {proposal.hotels.map(ht => {
            const isSelected = ht.id === selectedHotelId;
            const hotelTotalCost = ht.pricePerNightUSD * nights;

            return (
              <div
                key={ht.id}
                onClick={() => onSelectHotel(ht.id)}
                className={`rounded-xl border overflow-hidden text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={ht.image}
                      alt={ht.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                        ht.type === 'cheaper'
                          ? 'bg-emerald-900/80 text-emerald-200'
                          : ht.type === 'recommended'
                          ? 'bg-blue-900/80 text-blue-200'
                          : 'bg-purple-900/80 text-purple-200'
                      }`}>
                        {ht.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                        <span>{ht.rating}</span>
                        <span className="text-[10px] text-slate-400">({ht.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                        {ht.location}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {ht.name}
                    </h5>
                    <p className="text-[11px] text-blue-700 font-medium line-clamp-1">
                      {ht.roomType}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {ht.perks.slice(0, 2).map((perk, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 line-clamp-1"
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-xs font-black text-slate-900">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white'
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
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-base">directions_car</span>
          </span>
          <h4 className="text-sm font-bold text-slate-900">
            Dedicated Chauffeur & Transfers
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {proposal.transfers.map(tr => {
            const isSelected = tr.id === selectedTransferId;

            return (
              <div
                key={tr.id}
                onClick={() => onSelectTransfer(tr.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{tr.label}</span>
                    {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{tr.vehicle}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{tr.description}</div>
                </div>
                <div className="mt-2 text-xs font-black text-slate-900">
                  {tr.priceDeltaUSD === 0 ? 'Included in Base' : tr.priceDeltaUSD > 0 ? `+${formatPrice(tr.priceDeltaUSD)}` : `-${formatPrice(Math.abs(tr.priceDeltaUSD))}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. DAY-BY-DAY SCHEDULE PREVIEW */}
      {proposal.schedulePreview && proposal.schedulePreview.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-blue-600">calendar_month</span>
              <span>Day-by-Day Curated Schedule ({proposal.schedulePreview.length} Days)</span>
            </div>
            <span className="material-symbols-outlined text-sm">
              {isScheduleOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isScheduleOpen && (
            <div className="space-y-2 pt-2 animate-in fade-in duration-150">
              {proposal.schedulePreview.map(day => (
                <div key={day.dayNumber} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      D{day.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{day.title}</span>
                  </div>
                  <ul className="pl-7 space-y-0.5">
                    {day.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-[11px] text-slate-500 list-disc">
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
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
          <span>Ready to customize timings, routes, and checkout.</span>
        </div>

        <button
          type="button"
          onClick={onOpenInBuilder}
          className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Open in Interactive Itinerary Builder</span>
        </button>
      </div>
    </div>
  );
};
