import React, { useState } from 'react';
import { TimelineEvent } from '../../types/travel';
import {
  CONCIERGE_AVATAR,
  DAY2_EVENTS,
  INITIAL_DAY1_EVENTS,
  KERALA_HERO_IMAGE,
  KERALA_TIMELINE_HERO,
  RESCHEDULED_DAY1_EVENTS,
  ROUTE_MAP_IMAGE,
} from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';

interface TripsAndBookingsScreenProps {
  initialView?: 'timeline' | 'bookings';
  isDisruptionResolved: boolean;
  onOpenWhatsApp: () => void;
  onOpenCallConcierge: () => void;
  onDownloadPDF: () => void;
  onShareItinerary: () => void;
  onOpenTripAssistant: () => void;
  showToast?: (message: string) => void;
}

export const TripsAndBookingsScreen: React.FC<TripsAndBookingsScreenProps> = ({
  initialView = 'timeline',
  isDisruptionResolved,
  onOpenWhatsApp,
  onOpenCallConcierge,
  onDownloadPDF,
  onShareItinerary,
  onOpenTripAssistant,
  showToast = () => {},
}) => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'bookings'>(initialView);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isFutureExpanded, setIsFutureExpanded] = useState<boolean>(false);
  const [selectedEventModal, setSelectedEventModal] = useState<TimelineEvent | null>(null);
  const [selectedBookingVoucher, setSelectedBookingVoucher] = useState<{
    id?: string;
    title: string;
    ref: string;
    dates: string;
    details: string;
    image: string;
    rating: string;
    price: string;
    amenities: { icon: string; label: string }[];
    flightInfo?: string;
    hotelInfo?: string;
    driverInfo?: string;
    conciergeInfo?: string;
    isCurrentActiveTrip?: boolean;
  } | null>(null);

  const day1Events = isDisruptionResolved
    ? RESCHEDULED_DAY1_EVENTS
    : INITIAL_DAY1_EVENTS;

  return (
    <div className="w-full">
      {/* Sub-Header / Breadcrumb & View Mode Switcher */}
      <section className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-4 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-xs text-[#575E70] flex-wrap">
              <span className="font-semibold text-[#004AC6]">Trips & Bookings</span>
              <span className="text-[#C3C6D7]">/</span>
              <span className="text-[#151c27] font-semibold">
                {activeSection === 'timeline' ? 'Kerala Escape (Active Itinerary)' : 'Confirmed Passes & Vouchers'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Trip on track
              </span>
              <span className="font-mono text-[11px] text-[#737686] px-1.5 py-0.5 rounded bg-[#F0F3FF]">
                Ref #KL-9402
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl text-[#151c27] font-bold tracking-tight">
                {activeSection === 'timeline' ? 'Kerala Escape Itinerary' : 'Your Bookings & Passes'}
              </h1>
              <span className="text-[#C3C6D7] hidden sm:inline">·</span>
              <span className="text-xs text-[#575E70]">June 14–19, 2025</span>
              <span className="text-[#C3C6D7] hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-[#575E70]">
                <span className="material-symbols-outlined text-sm">group</span> 2 Travelers
              </span>
            </div>
          </div>

          {/* Master View Switcher: Timeline vs Bookings */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-[#F0F3FF] p-1 rounded-full border border-[#C3C6D7]/60 flex items-center shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveSection('timeline')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSection === 'timeline'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">timeline</span>
                <span>Active Timeline</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('bookings')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSection === 'bookings'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
                <span>Confirmed Bookings</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current font-bold">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* VIEW 1: INTERACTIVE TIMELINE SCREEN                           */}
      {/* ============================================================= */}
      {activeSection === 'timeline' && (
        <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6 pb-24 md:pb-12 text-left">
          {/* Hero Card with Background & Status Overlays */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#C3C6D7] shadow-xs group">
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                alt="Kerala Escape Itinerary Hero"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                src={KERALA_TIMELINE_HERO}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Hero Floating Information */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
              {/* Top Status Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#151c27] text-xs font-semibold shadow-xs border border-white/40">
                    <span
                      className="material-symbols-outlined text-amber-500 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      wb_sunny
                    </span>
                    Weather: 24°C · Light Mist
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-semibold shadow-xs border border-emerald-200">
                    <span
                      className="material-symbols-outlined text-emerald-600 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    All bookings synced & confirmed
                  </span>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={onDownloadPDF}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#151c27] text-xs font-semibold shadow-xs transition-all active:scale-95 border border-[#C3C6D7]/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                  <button
                    onClick={onShareItinerary}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#151c27] text-xs font-semibold shadow-xs transition-all active:scale-95 border border-[#C3C6D7]/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">ios_share</span>
                    <span className="hidden sm:inline">Share Itinerary</span>
                  </button>
                  <button
                    onClick={onOpenTripAssistant}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold shadow transition-all hover:bg-[#1D4ED8] active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    <span>Trip Assistant</span>
                  </button>
                </div>
              </div>

              {/* Bottom Hero Description */}
              <div className="max-w-2xl text-left">
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#2563EB] text-white font-mono text-[11px] mb-2 tracking-wide font-semibold">
                  CURATED SIGNATURE ROUTE
                </div>
                <h2 className="text-2xl sm:text-4xl text-white tracking-tight font-bold drop-shadow-sm">
                  Monsoon Whispers & Serene Backwaters
                </h2>
                <p className="text-white/90 text-xs sm:text-sm mt-1 drop-shadow-sm leading-relaxed max-w-xl">
                  A bespoke, high-touch luxury circuit transitioning from the spice-laden European lanes of
                  Fort Kochi to cloud-covered tea plantations, culminating aboard private wooden houseboats in Alleppey.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Disruption Alert */}
          {isDisruptionResolved && (
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between text-xs text-[#004AC6]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#004AC6]">auto_fix_high</span>
                <div>
                  <span className="font-bold">Schedule Auto-Reconciled by Dispatch Controller:</span>{' '}
                  <span className="text-[#151c27]">
                    IndiGo flight delay was absorbed seamlessly. Chauffeur pickup moved to 02:30 PM & sunset walking tour aligned for golden hour.
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-semibold bg-white px-2 py-0.5 rounded border border-[#DBEAFE]">
                Zero Friction Guaranteed
              </span>
            </div>
          )}

          {/* Layout Grid: Living Chronological Timeline + Right Intelligence Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Living Chronological Journey Timeline (8 cols) */}
            <section className="lg:col-span-8 flex flex-col gap-6">
              {/* Day Selector Segmented Tabs */}
              <div className="bg-white p-1.5 rounded-full border border-[#C3C6D7] shadow-2xs flex items-center gap-1 overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setSelectedDayFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 'all'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  All Days (6)
                </button>
                <button
                  onClick={() => setSelectedDayFilter(1)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 1
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 1 — Kochi (Arrival)
                </button>
                <button
                  onClick={() => setSelectedDayFilter(2)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 2
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 2 — Munnar (Tea Hills)
                </button>
                <button
                  onClick={() => setSelectedDayFilter(3)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 3
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 3 — Munnar (Lakes & Treks)
                </button>
                <button
                  onClick={() => setSelectedDayFilter(4)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 4
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 4 — Alleppey (Backwaters)
                </button>
                <button
                  onClick={() => setSelectedDayFilter(5)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 5
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 5 — Alleppey
                </button>
                <button
                  onClick={() => setSelectedDayFilter(6)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 6
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#575E70] hover:text-[#151c27] hover:bg-[#F0F3FF]'
                  }`}
                >
                  Day 6 — Kochi (Departure)
                </button>
              </div>

              {/* Master Timeline Flow */}
              <div className="space-y-10">
                {/* DAY 1 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 1) && (
                  <div className="relative">
                    <div className="flex items-center justify-between pb-4 border-b border-[#C3C6D7]">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#004AC6] text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          1
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#151c27] tracking-tight">
                              DAY 1 — KOCHI
                            </h3>
                            <span className="text-[11px] font-mono text-[#575E70]">Saturday, June 14</span>
                          </div>
                          <p className="text-xs text-[#575E70]">Arrival & Spice Coast Heritage Walk</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-[#F0F3FF] text-[#004AC6] px-2.5 py-1 rounded-full border border-[#C3C6D7] font-semibold">
                        {day1Events.length} Events Scheduled
                      </span>
                    </div>

                    <div className="relative pl-6 sm:pl-8 ml-4 mt-6 border-l-2 border-[#C3C6D7]/60 space-y-6">
                      {day1Events.map(event => (
                        <div key={event.id} className="relative group">
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#004AC6] text-[#004AC6] flex items-center justify-center shadow-xs">
                            <span
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {event.icon}
                            </span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[#C3C6D7] hover:border-[#004AC6]/50 shadow-2xs transition-all hover:shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-[#004AC6]">
                                    {event.time}
                                  </span>
                                  {event.originalTime && event.originalTime !== event.time && (
                                    <span className="text-[11px] font-mono line-through text-[#737686]">
                                      {event.originalTime}
                                    </span>
                                  )}
                                  <span className="text-[#C3C6D7]">·</span>
                                  <span className="text-[11px] uppercase tracking-wider text-[#575E70] font-semibold">
                                    {event.category}
                                  </span>

                                  {event.badge && (
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                        event.badgeColor === 'emerald'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : event.badgeColor === 'red'
                                          ? 'bg-red-50 text-red-700 border-red-200'
                                          : event.badgeColor === 'amber'
                                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                                          : 'bg-blue-50 text-blue-700 border-blue-200'
                                      }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                      {event.badge}
                                    </span>
                                  )}

                                  {event.subBadge && (
                                    <span className="text-[11px] font-mono bg-[#F0F3FF] px-1.5 py-0.5 rounded text-[#575E70]">
                                      {event.subBadge}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm font-bold text-[#151c27]">{event.title}</h4>
                                <p className="text-xs text-[#575E70] leading-relaxed">{event.description}</p>
                              </div>

                              <div className="flex items-center gap-2 self-start mt-2 sm:mt-0">
                                <button
                                  onClick={() => setSelectedEventModal(event)}
                                  className="px-3 py-1 rounded-full text-xs border border-[#C3C6D7] hover:bg-[#F0F3FF] text-[#434655] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                                >
                                  <span className="material-symbols-outlined text-xs">edit</span>
                                  <span>Change</span>
                                </button>
                                {event.bookingRef && (
                                  <button
                                    onClick={() => setSelectedEventModal(event)}
                                    className="px-3 py-1 rounded-full text-xs bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#004AC6] font-semibold transition-colors cursor-pointer"
                                  >
                                    View Booking
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DAY 2 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 2) && (
                  <div className="relative pt-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[#C3C6D7]">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#004AC6] text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          2
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#151c27] tracking-tight">
                              DAY 2 — MUNNAR
                            </h3>
                            <span className="text-[11px] font-mono text-[#575E70]">Sunday, June 15</span>
                          </div>
                          <p className="text-xs text-[#575E70]">Misty Tea Plantations & Highland Vistas</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-[#F0F3FF] text-[#004AC6] px-2.5 py-1 rounded-full border border-[#C3C6D7] font-semibold">
                        {DAY2_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    <div className="relative pl-6 sm:pl-8 ml-4 mt-6 border-l-2 border-[#C3C6D7]/60 space-y-6">
                      {DAY2_EVENTS.map(event => (
                        <div key={event.id} className="relative group">
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#004AC6] text-[#004AC6] flex items-center justify-center shadow-xs">
                            <span
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {event.icon}
                            </span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[#C3C6D7] hover:border-[#004AC6]/50 shadow-2xs transition-all hover:shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-[#004AC6]">
                                    {event.time}
                                  </span>
                                  <span className="text-[#C3C6D7]">·</span>
                                  <span className="text-[11px] uppercase tracking-wider text-[#575E70] font-semibold">
                                    {event.category}
                                  </span>
                                  {event.badge && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                                      {event.badge}
                                    </span>
                                  )}
                                  {event.subBadge && (
                                    <span className="text-[11px] font-mono bg-[#F0F3FF] px-1.5 py-0.5 rounded text-[#575E70]">
                                      {event.subBadge}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-[#151c27]">{event.title}</h4>
                                <p className="text-xs text-[#575E70] leading-relaxed">{event.description}</p>
                              </div>

                              <div className="flex items-center gap-2 self-start mt-2 sm:mt-0">
                                <button
                                  onClick={() => setSelectedEventModal(event)}
                                  className="px-3 py-1 rounded-full text-xs border border-[#C3C6D7] hover:bg-[#F0F3FF] text-[#434655] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                                >
                                  <span className="material-symbols-outlined text-xs">edit</span>
                                  <span>Change</span>
                                </button>
                                {event.bookingRef && (
                                  <button
                                    onClick={() => setSelectedEventModal(event)}
                                    className="px-3 py-1 rounded-full text-xs bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#004AC6] font-semibold transition-colors cursor-pointer"
                                  >
                                    View Booking
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Future Days Summary Teaser */}
                <div className="p-4 rounded-xl bg-[#F0F3FF]/70 border border-dashed border-[#C3C6D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#004AC6] text-xl">
                      calendar_view_week
                    </span>
                    <div>
                      <span className="text-xs text-[#151c27] font-bold">
                        Days 3, 4, 5 & 6 (Munnar, Alleppey Houseboat & Departure)
                      </span>
                      <p className="text-xs text-[#575E70] mt-0.5">
                        All transfers, private luxury Kettuvallam cruise, and return flights confirmed.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFutureExpanded(!isFutureExpanded)}
                    className="text-xs text-[#004AC6] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isFutureExpanded ? 'Collapse' : 'Expand All'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {isFutureExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {/* Expanded Days Details */}
                {isFutureExpanded && (
                  <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-3 animate-in fade-in duration-200 text-left">
                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <span className="font-bold text-xs text-[#151c27]">
                        Day 3 — Munnar Highland Peaks & Eravikulam Trek
                      </span>
                      <p className="text-xs text-[#575E70] mt-1">
                        08:00 AM Nilgiri Tahr safari · 01:00 PM Rapsy Restaurant · 05:00 PM Mattupetty Dam boat safari.
                      </p>
                    </div>
                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <span className="font-bold text-xs text-[#151c27]">
                        Day 4 & 5 — Alleppey Backwaters Luxury Kettuvallam Cruise
                      </span>
                      <p className="text-xs text-[#575E70] mt-1">
                        Private 2-bedroom teak houseboat with onboard private chef, sunset toddy shop tastings, and serene canal kayaking.
                      </p>
                    </div>
                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <span className="font-bold text-xs text-[#151c27]">
                        Day 6 — Alleppey → Cochin International Departure
                      </span>
                      <p className="text-xs text-[#575E70] mt-1">
                        Chauffeur transfer to COK Terminal 3 · Return flight to Delhi (IndiGo 6E-205).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Contextual Intelligence & Concierge Inspector (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Card 1: Trip Health & Intelligence Card */}
              <div className="bg-white rounded-2xl border border-[#C3C6D7] p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#C3C6D7]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <h4 className="text-sm font-bold text-[#151c27]">Trip Health & Intel</h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#737686] bg-[#F0F3FF] px-2 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                {/* Flight Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#575E70] flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-sm text-[#004AC6]">flight</span>{' '}
                      IndiGo 6E-204
                    </span>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded border font-semibold ${
                        isDisruptionResolved
                          ? 'text-red-700 bg-red-50 border-red-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      {isDisruptionResolved ? '+5h (Handled)' : 'On Schedule'}
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F8] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full w-full ${
                        isDisruptionResolved ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Weather Stream */}
                <div className="bg-[#F0F3FF]/70 p-3 rounded-xl border border-[#C3C6D7]/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#151c27] font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">cloud_queue</span>
                      Highland Climate Watch
                    </span>
                    <span className="font-mono text-[11px] text-[#575E70]">Munnar & Alleppey</span>
                  </div>
                  <p className="text-xs text-[#575E70] leading-relaxed">
                    Mild intermittent drizzle predicted for evening walks in Munnar. Roads clear and navigable. Chauffeur equipped with travel umbrellas.
                  </p>
                </div>

                {/* Concierge Live Note */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#004AC6] text-base mt-0.5 shrink-0">
                    verified_user
                  </span>
                  <div className="text-xs text-[#575E70] leading-relaxed">
                    <span className="font-bold text-[#151c27]">Local Concierge Note:</span> Fort Kochi Chinese Fishing Net restoration was completed yesterday; full evening demonstrations are operating seamlessly.
                  </div>
                </div>
              </div>

              {/* Card 2: Transparent Budget Breakdown */}
              <div className="bg-white rounded-2xl border border-[#C3C6D7] p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#C3C6D7]/60">
                  <h4 className="text-sm font-bold text-[#151c27]">Budget Breakdown</h4>
                  <span className="font-mono text-xs font-bold text-[#004AC6]">₹42,800 Total</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#575E70] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-[#004AC6]"></span> Luxury Stays (5 nights)
                    </span>
                    <span className="font-mono font-semibold text-[#151c27]">₹24,500</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#575E70] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-blue-400"></span> Private EV & SUV Transfers
                    </span>
                    <span className="font-mono font-semibold text-[#151c27]">₹9,200</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#575E70] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Guided Tours & Passes
                    </span>
                    <span className="font-mono font-semibold text-[#151c27]">₹6,100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#575E70] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Dining Reserve & Tastings
                    </span>
                    <span className="font-mono font-semibold text-[#151c27]">₹3,000</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-[#E2E8F8] overflow-hidden flex gap-0.5 mt-2">
                    <div className="bg-[#004AC6] h-full" style={{ width: '57%' }}></div>
                    <div className="bg-blue-400 h-full" style={{ width: '21%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: '7%' }}></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#737686] border-t border-[#C3C6D7]/40">
                    <span>All Taxes & Tolls Included</span>
                    <button
                      onClick={onDownloadPDF}
                      className="text-[#004AC6] font-semibold cursor-pointer hover:underline"
                    >
                      Download Invoices
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Assigned Concierge Specialist */}
              <div className="bg-white rounded-2xl border border-[#C3C6D7] p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-[#737686] tracking-wider font-semibold">
                    Assigned Operations Concierge
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    On Duty
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    alt="Assigned Concierge Arun V."
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#004AC6]/20 shadow-xs"
                    src={CONCIERGE_AVATAR}
                  />
                  <div>
                    <div className="text-sm font-bold text-[#151c27]">Arun V.</div>
                    <p className="text-xs text-[#575E70]">Senior Dispatch & Guest Experience</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-bold">4.98</span>
                      <span className="text-[#737686]">· 184 Kerala Tours</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onOpenWhatsApp}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={onOpenCallConcierge}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-[#C3C6D7] hover:bg-[#F0F3FF] text-[#151c27] text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Call Concierge</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Quick Navigation Map Preview */}
              <div className="bg-white rounded-2xl border border-[#C3C6D7] overflow-hidden shadow-2xs text-left">
                <div className="p-4 border-b border-[#C3C6D7]/60 flex items-center justify-between">
                  <div className="text-xs font-bold text-[#151c27]">Route Visualizer</div>
                  <span className="font-mono text-[11px] text-[#004AC6] font-semibold">242 km total</span>
                </div>
                <div className="relative h-44 bg-[#E7EEFE] w-full overflow-hidden">
                  <img
                    alt="Kerala Circuit Map Preview"
                    className="w-full h-full object-cover"
                    src={ROUTE_MAP_IMAGE}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-[#C3C6D7]/60 text-xs flex items-center justify-between text-[#151c27] shadow-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[#004AC6] text-sm">near_me</span>
                      Next leg: Fort Kochi → Munnar
                    </span>
                    <span className="font-mono text-[#575E70] text-[11px]">Tomorrow 08:30 AM</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* ============================================================= */}
      {/* VIEW 2: MERGED BOOKINGS & PASSES SCREEN                       */}
      {/* ============================================================= */}
      {activeSection === 'bookings' && (
        <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#00174B] text-[11px] font-semibold uppercase">
                  Verified Vouchers & Passes
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  All confirmed
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#151c27] tracking-tight">
                Your Confirmed Bookings
              </h2>
              <p className="text-xs sm:text-sm text-[#575E70] mt-1">
                Access your real-time e-tickets, hotel reservations, and private transfer vouchers across all circuits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('timeline')}
                className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">timeline</span>
                <span>Back to Kerala Timeline</span>
              </button>
            </div>
          </div>

          {/* Compact Cards Horizontal Scrollable Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
            {/* Booking 1: Kerala Escape (Active) */}
            <LuxuryCard
              id="booking-kerala"
              title="Kerala Escape — Luxury Circuit"
              description="Active 6-day luxury circuit with confirmed IndiGo flights, Old Harbour boutique hotel, and private houseboat."
              image={KERALA_HERO_IMAGE}
              rating="4.95/5"
              amenities={[
                { icon: 'flight', label: 'IndiGo 6E-204' },
                { icon: 'hotel', label: 'Old Harbour' },
                { icon: 'directions_car', label: 'Innova Crysta' },
                { icon: 'sailing', label: 'Houseboat' },
                { icon: 'spa', label: 'Ayurveda' },
                { icon: 'verified_user', label: 'Concierge' },
              ]}
              price="₹42,800"
              pricePeriod="/trip"
              actionLabel="View Pass"
              actionVariant="button"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'kerala-booking',
                  title: 'Kerala Escape — Luxury Circuit',
                  ref: 'REF #KL-92041',
                  dates: 'Oct 14–19, 2025',
                  details:
                    'IndiGo 6E-204 (BOM→COK) · Old Harbour Hotel Fort Kochi · Private Luxury Teak Houseboat Alleppey · Dedicated Innova Crysta Chauffeur · Spice Plantation & Ayurveda Spa.',
                  image: KERALA_HERO_IMAGE,
                  rating: '4.95/5',
                  price: '₹42,800',
                  amenities: [
                    { icon: 'flight', label: 'IndiGo 6E-204' },
                    { icon: 'hotel', label: 'Old Harbour' },
                    { icon: 'directions_car', label: 'Innova Crysta' },
                    { icon: 'sailing', label: 'Houseboat' },
                    { icon: 'spa', label: 'Ayurveda' },
                    { icon: 'verified_user', label: 'Concierge' },
                  ],
                  flightInfo: 'IndiGo 6E-204 · On-Time · Gate 4B · Terminal 2',
                  hotelInfo: 'Old Harbour Heritage Suite · Check-in confirmed 14:00',
                  driverInfo: 'Suresh Menon · Toyota Innova Crysta (KL-07-BW-4910)',
                  conciergeInfo: 'Arun V. (Senior Lead Concierge) · +91 98401 22841',
                  isCurrentActiveTrip: true,
                })
              }
            />

            {/* Booking 2: Rajasthan Royal Heritage */}
            <LuxuryCard
              id="booking-rajasthan"
              title="Rajasthan Royal Heritage"
              description="6 nights & 7 days palace circuit with private guide, heritage Havelis, and sunset desert dining."
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDYoWQHDLBf3TSHPEbB_b3jDxw2Jt-X5Lzb-yOsbLzxWUJxb5g28sXzxlAl4dslwH4fJE-5f86LN6CojW_Pk9g5t3mzchWVM4uPEMJHgSk-FfatTWCqcuZFSxXBMoWOSEyimkrPWwBBWhFrjlDEqznGjSyQQVqZSTp39EgW--0iPYn6EB7V9B5AlL0934o8WSe7lh9zP1qGOGZ9zEwHjVJdDjr7xjUZDJTpYI4gAx9Mn4PbIWYizLyAfw"
              rating="4.9/5"
              amenities={[
                { icon: 'flight', label: 'SpiceJet' },
                { icon: 'castle', label: 'Haveli Stay' },
                { icon: 'directions_car', label: 'Chauffeur' },
                { icon: 'museum', label: 'Palace Guide' },
                { icon: 'sailing', label: 'Lake Cruise' },
                { icon: 'verified_user', label: 'VIP Pass' },
              ]}
              price="₹68,500"
              pricePeriod="/trip"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'rajasthan-booking',
                  title: 'Rajasthan Royal Heritage',
                  ref: 'REF #RJ-33411',
                  dates: 'Oct 12–18, 2025',
                  details:
                    'SpiceJet SG-8194 · Samode Haveli Jaipur & Taj Lake Palace Udaipur · Private Chauffeur, Royal Historian Guide & Sunset Pichola Cruise.',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDYoWQHDLBf3TSHPEbB_b3jDxw2Jt-X5Lzb-yOsbLzxWUJxb5g28sXzxlAl4dslwH4fJE-5f86LN6CojW_Pk9g5t3mzchWVM4uPEMJHgSk-FfatTWCqcuZFSxXBMoWOSEyimkrPWwBBWhFrjlDEqznGjSyQQVqZSTp39EgW--0iPYn6EB7V9B5AlL0934o8WSe7lh9zP1qGOGZ9zEwHjVJdDjr7xjUZDJTpYI4gAx9Mn4PbIWYizLyAfw',
                  rating: '4.9/5',
                  price: '₹68,500',
                  amenities: [
                    { icon: 'flight', label: 'SpiceJet' },
                    { icon: 'castle', label: 'Haveli Stay' },
                    { icon: 'directions_car', label: 'Chauffeur' },
                    { icon: 'museum', label: 'Palace Guide' },
                    { icon: 'sailing', label: 'Lake Cruise' },
                    { icon: 'verified_user', label: 'VIP Pass' },
                  ],
                  flightInfo: 'SpiceJet SG-8194 · Scheduled On-Time · Gate 2A',
                  hotelInfo: 'Samode Haveli Deluxe Royal Suite & Taj Lake Palace',
                  driverInfo: 'Raghav Singh · Toyota Fortuner (RJ-14-EA-7721)',
                  conciergeInfo: 'Pooja K. (Rajasthan Heritage Specialist) · +91 94140 88219',
                  isCurrentActiveTrip: false,
                })
              }
            />

            {/* Booking 3: Bali Cultural Retreat */}
            <LuxuryCard
              id="booking-bali"
              title="Bali Cultural Retreat"
              description="7 nights & 8 days wellness journey with rainforest yoga pavilions, artisanal coffee plantations, and ocean sunsets."
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBByXADs2g9PfqudzYxkj7KyJDF6ZQ9yyFek6w2gqfRr-EML0_oKL0IRb057Qttkd2QyTpq7NoqMACYqbqWrT8Sdx4CH6Qs3MMk2ZESUQwcHAK0RZq1iR1eor7XhZHaO0vGDERLrRIPgd3TwLfh_-PsCEizjAylSSiWgY6BrEFD8lZN0SDu5zx9FsAxi8EpEuNrDrXnRaT9cQSukMkRlYl7pnpkLNeQlZ6PtXLh_Hja1YUULi1FKrjDBA"
              rating="4.85/5"
              amenities={[
                { icon: 'flight', label: 'Air Tickets' },
                { icon: 'villa', label: 'Pool Villa' },
                { icon: 'directions_car', label: 'Chauffeur' },
                { icon: 'spa', label: 'Sound Spa' },
                { icon: 'nature_people', label: 'Artisan Tour' },
                { icon: 'verified_user', label: 'VIP Pass' },
              ]}
              price="₹84,000"
              pricePeriod="/trip"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'bali-booking',
                  title: 'Bali Cultural Retreat',
                  ref: 'REF #BL-5502',
                  dates: 'Nov 4–11, 2025',
                  details:
                    'Singapore Airlines SQ-503 · Kamandalu Ubud Pool Villa & Alila Seminyak Beachfront Suite · Sound Healing, Sacred Water Cleansing & Artisanal Coffee Tour.',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBByXADs2g9PfqudzYxkj7KyJDF6ZQ9yyFek6w2gqfRr-EML0_oKL0IRb057Qttkd2QyTpq7NoqMACYqbqWrT8Sdx4CH6Qs3MMk2ZESUQwcHAK0RZq1iR1eor7XhZHaO0vGDERLrRIPgd3TwLfh_-PsCEizjAylSSiWgY6BrEFD8lZN0SDu5zx9FsAxi8EpEuNrDrXnRaT9cQSukMkRlYl7pnpkLNeQlZ6PtXLh_Hja1YUULi1FKrjDBA',
                  rating: '4.85/5',
                  price: '₹84,000',
                  amenities: [
                    { icon: 'flight', label: 'Air Tickets' },
                    { icon: 'villa', label: 'Pool Villa' },
                    { icon: 'directions_car', label: 'Chauffeur' },
                    { icon: 'spa', label: 'Sound Spa' },
                    { icon: 'nature_people', label: 'Artisan Tour' },
                    { icon: 'verified_user', label: 'VIP Pass' },
                  ],
                  flightInfo: 'Singapore Airlines SQ-503 · Scheduled · Terminal 3',
                  hotelInfo: 'Kamandalu Ubud Pool Villa & Alila Seminyak Ocean Suite',
                  driverInfo: 'Wayan Subawa · Private Luxury Alphard (DK-1945-WS)',
                  conciergeInfo: 'Ketut Astawa (Bali VIP Concierge) · +62 812 3456 7890',
                  isCurrentActiveTrip: false,
                })
              }
            />
          </div>

          {/* Quick Informational Notice */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">qr_code_2</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#151c27]">
                  All Passes Available Offline in Travel Vault
                </h4>
                <p className="text-[11px] text-[#575E70]">
                  Encrypted PKPASS boarding passes, hotel codes, and insurance papers are stored locally on your device.
                </p>
              </div>
            </div>
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 rounded-full border border-[#C3C6D7] hover:bg-[#F0F3FF] text-xs font-semibold text-[#151c27] transition-all cursor-pointer shrink-0"
            >
              Download All Vouchers (PDF)
            </button>
          </div>
        </main>
      )}

      {/* Individual Event Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004AC6]">
                  {selectedEventModal.icon}
                </span>
                <h3 className="font-bold text-sm text-[#151c27]">Itinerary Event Details</h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-[#737686] hover:text-[#151c27] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#737686] block text-[10px] uppercase font-semibold">
                  Event
                </span>
                <span className="font-bold text-sm text-[#151c27]">
                  {selectedEventModal.title}
                </span>
              </div>
              <div>
                <span className="text-[#737686] block text-[10px] uppercase font-semibold">
                  Scheduled Time
                </span>
                <span className="font-mono font-semibold text-[#004AC6]">
                  {selectedEventModal.time}
                </span>
              </div>
              <div>
                <span className="text-[#737686] block text-[10px] uppercase font-semibold">
                  Description
                </span>
                <p className="text-[#575E70] mt-0.5 leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>
              {selectedEventModal.chauffeur && (
                <div>
                  <span className="text-[#737686] block text-[10px] uppercase font-semibold">
                    Assigned Chauffeur
                  </span>
                  <span className="text-[#151c27] font-semibold">
                    {selectedEventModal.chauffeur}
                  </span>
                </div>
              )}
              {selectedEventModal.bookingRef && (
                <div>
                  <span className="text-[#737686] block text-[10px] uppercase font-semibold">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-[#004AC6]">
                    {selectedEventModal.bookingRef}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 rounded-full border border-[#C3C6D7] text-xs font-semibold hover:bg-gray-50 text-[#151c27] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedEventModal(null);
                  onOpenWhatsApp();
                }}
                className="px-4 py-2 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Ask Concierge to Adjust</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Booking Voucher Pass Modal - Follows exact LuxuryCard dark bezel design with zero horizontal line separators */}
      {selectedBookingVoucher && (
        <div
          onClick={() => setSelectedBookingVoucher(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          {/* Outer Bezel (Exact same design language as LuxuryCard, zero drop shadow) */}
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#1e242b] p-1.5 sm:p-2 rounded-[28px] sm:rounded-[32px] max-w-lg w-full border border-black/40 shadow-none animate-in zoom-in-95 duration-200 text-left"
          >
            {/* Inner Framed Container */}
            <div className="relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#222830] flex flex-col max-h-[88vh] overflow-y-auto custom-scrollbar">
              {/* Top Hero Image Header */}
              <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden">
                <img
                  src={selectedBookingVoucher.image}
                  alt={selectedBookingVoucher.title}
                  className="w-full h-full object-cover"
                />

                {/* Progressive Blur & Gradient: Starts at bottom, ends halfway up the header */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none backdrop-blur-md"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
                    maskImage:
                      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, #1e242b 0%, rgba(30,36,43,0.96) 22%, rgba(30,36,43,0.82) 46%, rgba(30,36,43,0.45) 72%, rgba(30,36,43,0.12) 88%, transparent 100%)',
                  }}
                />

                {/* Top Floating Controls */}
                <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between z-10">
                  <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                    <span
                      className="material-symbols-outlined text-white text-[12px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span className="font-mono text-[10.5px]">{selectedBookingVoucher.ref}</span>
                    <span className="text-emerald-400 text-[10px] ml-1 font-semibold">· Confirmed</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBookingVoucher(null)}
                    className="w-7.5 h-7.5 rounded-full bg-black/45 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
                    title="Close"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Floating Title & Route over Progressive Fade */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10 space-y-0.5">
                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300">
                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                    <span>{selectedBookingVoucher.dates}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {selectedBookingVoucher.title}
                  </h2>
                </div>
              </div>

              {/* Details Body - ZERO horizontal line separators */}
              <div className="p-3.5 sm:p-4 space-y-3.5 text-left">
                <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-normal">
                  {selectedBookingVoucher.details}
                </p>

                {/* Amenity Pills matching Card */}
                {selectedBookingVoucher.amenities && selectedBookingVoucher.amenities.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    {selectedBookingVoucher.amenities.slice(0, 6).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-full px-2 py-1 bg-white/10 text-white/90 text-[10px] font-medium flex items-center justify-center gap-1 border border-white/10 whitespace-nowrap overflow-hidden"
                      >
                        <span className="material-symbols-outlined text-[11px] text-white/80 shrink-0">
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detailed Confirmed Specs */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    Confirmed Travel Pass & Telemetry
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5 shrink-0">
                        flight_takeoff
                      </span>
                      <div>
                        <div className="text-[11px] font-bold text-white">Commercial Aviation</div>
                        <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                          {selectedBookingVoucher.flightInfo || 'IndiGo 6E-204 · Confirmed Seat 4F'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">
                        hotel
                      </span>
                      <div>
                        <div className="text-[11px] font-bold text-white">Boutique Stay Reservation</div>
                        <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                          {selectedBookingVoucher.hotelInfo || 'Heritage Boutique Suite · Breakfast Included'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5 shrink-0">
                        directions_car
                      </span>
                      <div>
                        <div className="text-[11px] font-bold text-white">Dedicated Chauffeur & Fleet</div>
                        <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                          {selectedBookingVoucher.driverInfo || 'Private Chauffeur assigned with live GPS'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                      <span className="material-symbols-outlined text-purple-400 text-sm mt-0.5 shrink-0">
                        support_agent
                      </span>
                      <div>
                        <div className="text-[11px] font-bold text-white">24/7 Operations Concierge</div>
                        <p className="text-[10px] text-white/70 mt-0.5 leading-snug">
                          {selectedBookingVoucher.conciergeInfo || 'Arun V. (Senior Lead Concierge)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Price & Actions (NO horizontal line separator) */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {selectedBookingVoucher.price}
                      </span>
                      <span className="text-[10px] text-white/60 ml-1">total pass</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      All inclusive · Zero extra fees
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingVoucher(null)}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedBookingVoucher.isCurrentActiveTrip && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBookingVoucher(null);
                          setActiveSection('timeline');
                        }}
                        className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Timeline</span>
                        <span className="material-symbols-outlined text-[12px]">timeline</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingVoucher(null);
                        showToast(`Voucher ${selectedBookingVoucher.ref} downloaded.`);
                      }}
                      className="px-4 py-1.5 rounded-full bg-white hover:bg-blue-50 text-gray-950 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">download</span>
                      <span>Download Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
