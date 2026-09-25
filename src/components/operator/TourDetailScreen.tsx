import React, { useState } from 'react';
import { ViewMode } from '../../types/travel';

interface TourDetailScreenProps {
  onBackToOverview: () => void;
  onSwitchMode: (mode: ViewMode) => void;
  isDisruptionResolved: boolean;
  onResolveDisruption: () => void;
}

export const TourDetailScreen: React.FC<TourDetailScreenProps> = ({
  onBackToOverview,
  onSwitchMode,
  isDisruptionResolved,
  onResolveDisruption,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'travelers' | 'itinerary' | 'bookings' | 'issues' | 'history'
  >('overview');
  const [isCascadeCustomized, setIsCascadeCustomized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = () => {
    onResolveDisruption();
    setToastMessage(
      'Cascade updates dispatched! Driver standby confirmed, hotel late arrival recorded, and traveler app synchronized.'
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7F8FA] text-left">
      {/* Top Breadcrumb & Status Sub-Header */}
      <section className="bg-white border-b border-[#E5E7EB] px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Breadcrumbs & Status Indicators */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-[#575E70]">
              <button
                onClick={onBackToOverview}
                className="hover:text-[#004AC6] transition-colors cursor-pointer"
              >
                Tours
              </button>
              <span className="text-[#C3C6D7]">/</span>
              <button
                onClick={onBackToOverview}
                className="hover:text-[#004AC6] transition-colors cursor-pointer"
              >
                Active Tours
              </button>
              <span className="text-[#C3C6D7]">/</span>
              <span className="text-[#111827] font-mono font-bold">Tour #1024</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Warning Badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  isDisruptionResolved
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDisruptionResolved ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'
                  }`}
                ></span>
                <span>
                  {isDisruptionResolved
                    ? 'Resolution Dispatched'
                    : 'Attention Required'}
                </span>
              </div>

              {/* Sync Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">
                  sync
                </span>
                <span>Live Sync: 6/6 Vendors Connected</span>
              </div>

              {/* Guest Travel Vault Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004AC6] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Guest Vault: 12/12 Verified</span>
              </div>

              {/* Switch to Traveler View pill */}
              <button
                onClick={() => onSwitchMode('consumer')}
                className="px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#004AC6] text-[11px] font-semibold hover:bg-[#DBE1FF] transition-colors cursor-pointer flex items-center gap-1"
                title="View Sarah Mehta's Live App Experience"
              >
                <span className="material-symbols-outlined text-xs">visibility</span>
                <span>View Traveler App</span>
              </button>
            </div>
          </div>

          {/* Title, Meta, and Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight flex items-center gap-3">
                <span>Tour #1024 — Kerala Adventure</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E7EEFE] text-[#004AC6] font-semibold">
                  ITIN-COK-992
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#575E70]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#737686]">
                    calendar_today
                  </span>
                  June 14–19
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#737686]">
                    group
                  </span>
                  2 travelers
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono text-[#111827] font-semibold">
                  Total ₹42,800
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#004AC6]">
                    support_agent
                  </span>
                  Assigned Concierge:{' '}
                  <strong className="font-semibold text-[#111827]">Arun V.</strong>
                </span>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setToastMessage(
                    'Manifest PDF generated and queued for export.'
                  )
                }
                className="h-9 px-3.5 rounded-full border border-[#E5E7EB] bg-white text-[#111827] text-xs font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  picture_as_pdf
                </span>
                <span>Export Manifest PDF</span>
              </button>
              <button
                onClick={() =>
                  setToastMessage(
                    'Broadcast notice sent to Sarah Mehta and driver Suresh K.'
                  )
                }
                className="h-9 px-3.5 rounded-full border border-[#E5E7EB] bg-white text-[#111827] text-xs font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  campaign
                </span>
                <span>Broadcast Notice</span>
              </button>
              <button
                onClick={handleApprove}
                className="h-9 px-4 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>
                <span>{isDisruptionResolved ? 'Re-Sync Issue' : 'Resolve Issue'}</span>
              </button>
            </div>
          </div>

          {/* Operational Workspace Tabs */}
          <div className="flex items-center gap-6 mt-2 -mb-5 border-b border-transparent overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`pb-3 font-semibold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#575E70] hover:text-[#111827]'
              }`}
            >
              <span>Overview</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            </button>

            <button
              onClick={() => setActiveSubTab('travelers')}
              className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'travelers'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#575E70] hover:text-[#111827]'
              }`}
            >
              <span>Travelers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#E2E8F8] text-[10px] font-mono">
                2
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('itinerary')}
              className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'itinerary'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#575E70] hover:text-[#111827]'
              }`}
            >
              <span>Itinerary</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#E2E8F8] text-[10px] font-mono">
                6 Days
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'bookings'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#575E70] hover:text-[#111827]'
              }`}
            >
              <span>Bookings</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                8 Confirmed
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('issues')}
              className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'issues'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-red-600 hover:text-red-700'
              }`}
            >
              <span>Issues</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-mono">
                {isDisruptionResolved ? '0 Open' : '1 Open'}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
              className={`pb-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer ${
                activeSubTab === 'history'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#575E70] hover:text-[#111827]'
              }`}
            >
              <span>Change History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
        {/* Real-Time Action Feedback Toast */}
        {toastMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ==================== LEFT COLUMN: DISRUPTION & CASCADE PIPELINE ==================== */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* HERO WARNING CARD: FLIGHT DELAY IMPACT */}
            <div
              className={`bg-white border rounded-xl p-5 shadow-xs relative overflow-hidden ${
                isDisruptionResolved ? 'border-emerald-200' : 'border-red-200'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isDisruptionResolved ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              ></div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                      isDisruptionResolved
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isDisruptionResolved ? 'check_circle' : 'warning'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-[#111827]">
                        {isDisruptionResolved
                          ? 'Resolved — Flight delay ripple absorbed successfully'
                          : 'Open Issue — Flight delayed by 5 hours'}
                      </h2>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                          isDisruptionResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isDisruptionResolved ? 'RESOLVED' : 'CRITICAL #402'}
                      </span>
                    </div>
                    <p className="text-xs text-[#575E70] mt-1 leading-relaxed">
                      IndiGo <span className="font-mono font-bold text-[#111827]">6E-204</span>{' '}
                      (DEL → COK) ETA pushed from{' '}
                      <span className="line-through text-red-600">09:00 AM</span> to{' '}
                      <span className="font-bold text-red-700">02:00 PM</span>. Inbound
                      aircraft turnaround delay at Indira Gandhi Int'l.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#575E70] shrink-0">
                  T-minus 2h 18m
                </span>
              </div>

              {/* VISUAL DEPENDENCY CHAIN (Ripple Effect Pipeline) */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#575E70]">
                    Downstream Ripple Cascade (4 impacted segments)
                  </span>
                  <span className="text-[11px] font-mono text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE] font-medium">
                    ↳ +5h Ripple Impact
                  </span>
                </div>

                {/* Pipeline visual nodes */}
                <div className="flex items-center gap-2 overflow-x-auto py-2 custom-scrollbar">
                  {/* Node 1: Flight (Source) */}
                  <div className="flex flex-col p-2.5 rounded-lg bg-red-50 border border-red-200 min-w-[130px] shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-mono text-red-700">
                      <span>Flight</span>
                      <span className="font-bold">+5h</span>
                    </div>
                    <span className="font-bold text-xs text-red-950 mt-1">
                      IndiGo 6E-204
                    </span>
                    <span className="text-[11px] text-red-600 font-mono">
                      ETA 02:00 PM
                    </span>
                  </div>

                  <div className="w-4 h-[1.5px] border-t-2 border-dashed border-amber-400 shrink-0"></div>

                  {/* Node 2: Transfer */}
                  <div className="flex flex-col p-2.5 rounded-lg bg-amber-50 border border-amber-200 min-w-[130px] shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-800">
                      <span>Transfer</span>
                      <span className="font-semibold">Shifted</span>
                    </div>
                    <span className="font-bold text-xs text-amber-950 mt-1">
                      COK Airport Cab
                    </span>
                    <span className="text-[11px] text-amber-700 font-mono">
                      Resched to 2:30 PM
                    </span>
                  </div>

                  <div className="w-4 h-[1.5px] border-t-2 border-dashed border-amber-400 shrink-0"></div>

                  {/* Node 3: Hotel */}
                  <div className="flex flex-col p-2.5 rounded-lg bg-slate-50 border border-[#E5E7EB] min-w-[130px] shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#575E70]">
                      <span>Check-in</span>
                      <span>Late Hold</span>
                    </div>
                    <span className="font-bold text-xs text-[#111827] mt-1">
                      Old Harbour
                    </span>
                    <span className="text-[11px] text-[#575E70] font-mono">
                      Held until 18:00
                    </span>
                  </div>

                  <div className="w-4 h-[1.5px] border-t-2 border-dashed border-amber-400 shrink-0"></div>

                  {/* Node 4: Dining */}
                  <div className="flex flex-col p-2.5 rounded-lg bg-amber-50 border border-amber-200 min-w-[130px] shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-800">
                      <span>Dining</span>
                      <span>Converted</span>
                    </div>
                    <span className="font-bold text-xs text-amber-950 mt-1">
                      Malabar Cafe
                    </span>
                    <span className="text-[11px] text-amber-700 font-mono">
                      Switched to High Tea
                    </span>
                  </div>

                  <div className="w-4 h-[1.5px] border-t-2 border-dashed border-amber-400 shrink-0"></div>

                  {/* Node 5: Kochi Walk */}
                  <div className="flex flex-col p-2.5 rounded-lg bg-slate-50 border border-[#E5E7EB] min-w-[130px] shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#575E70]">
                      <span>Heritage</span>
                      <span>Moved</span>
                    </div>
                    <span className="font-bold text-xs text-[#111827] mt-1">
                      Fort Kochi Walk
                    </span>
                    <span className="text-[11px] text-[#575E70] font-mono">
                      Golden Hour 17:30
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Resolution Box */}
              <div className="mt-4 p-3.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#004AC6] shrink-0 mt-0.5">
                    auto_fix_high
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#004AC6]">
                        Automated Heuristic Solution
                      </span>
                      <span className="text-[10px] font-mono bg-white text-[#004AC6] border border-[#DBEAFE] px-1.5 py-0.2 rounded font-semibold">
                        +₹800 difference
                      </span>
                    </div>
                    <p className="text-xs text-[#434655] mt-0.5 leading-relaxed">
                      "Reschedule airport transfer to 02:30 PM & adjust lunch slot to
                      Malabar high-tea, shifting Fort Kochi walk to 05:30 PM sunset."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => setIsCascadeCustomized(!isCascadeCustomized)}
                    className="h-8 px-3.5 rounded-full border border-[#DBEAFE] bg-white text-[#575E70] hover:text-[#111827] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isCascadeCustomized ? 'Hide Options' : 'Customize Cascade'}
                  </button>
                  <button
                    onClick={handleApprove}
                    className="h-8 px-4 rounded-full bg-[#2563EB] text-white font-semibold text-xs hover:bg-[#1D4ED8] transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      send
                    </span>
                    <span>
                      {isDisruptionResolved
                        ? 'Re-broadcast Plan'
                        : 'Approve & Dispatch Updates'}
                    </span>
                  </button>
                </div>
              </div>

              {isCascadeCustomized && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-[#DBEAFE] text-xs space-y-2">
                  <span className="font-bold text-[#111827]">
                    Cascade Overrides:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-1.5 bg-[#F9FAFB] rounded border border-[#E5E7EB]">
                      <input type="checkbox" defaultChecked />
                      <span>Direct transfer to hotel before sunset walk</span>
                    </label>
                    <label className="flex items-center gap-2 p-1.5 bg-[#F9FAFB] rounded border border-[#E5E7EB]">
                      <input type="checkbox" defaultChecked />
                      <span>Notify restaurant of 2-hour delay</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* CONNECTED CHRONOLOGICAL OPERATIONS ITINERARY */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#004AC6]">
                    timeline
                  </span>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Day 1 — Kochi Arrival & Heritage Circuit
                  </h3>
                  <span className="text-[11px] font-mono bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-2 py-0.5 rounded font-semibold">
                    Live Day
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#575E70]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>All 4 Segment Vendors Active</span>
                </div>
              </div>

              {/* Segment Item List with timeline spine */}
              <div className="p-5 flex flex-col relative space-y-4">
                <div className="absolute left-9 top-8 bottom-8 w-[1.5px] bg-[#E5E7EB]"></div>

                {/* Item 1: Flight 6E-204 */}
                <div className="relative flex items-start gap-4 pb-2 group">
                  <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-white ring-2 ring-red-300 flex items-center justify-center text-red-600 shrink-0 z-10">
                    <span className="material-symbols-outlined text-[16px]">
                      flight_land
                    </span>
                  </div>
                  <div className="flex-1 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg p-3.5 hover:border-[#004AC6] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#111827]">
                          02:00 PM
                        </span>
                        <span className="text-[11px] font-mono line-through text-[#737686]">
                          09:00 AM
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold font-mono">
                          +5h Delay
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#575E70] flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">
                          satellite_alt
                        </span>
                        Radar In-Air
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]">
                        IndiGo 6E-204 (Delhi T3 → Cochin Int'l T1)
                      </span>
                      <span className="text-[11px] font-mono text-[#575E70]">
                        PNR: K8X29Q
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#575E70]">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#737686]">
                          airline_seat_recline_extra
                        </span>
                        Seats 12A, 12B (Sarah Mehta + Guest)
                      </span>
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                        Terminal Escort Alerted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 2: Private Chauffeur Pickup */}
                <div className="relative flex items-start gap-4 pb-2 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white ring-2 ring-amber-300 flex items-center justify-center text-amber-700 shrink-0 z-10">
                    <span className="material-symbols-outlined text-[16px]">
                      directions_car
                    </span>
                  </div>
                  <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg p-3.5 hover:border-[#004AC6] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#111827]">
                          02:30 PM
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Staged Reschedule
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>Chauffeur Ack'd Standby</span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]">
                        Airport Transfer → Fort Kochi Heritage Quarter
                      </span>
                      <span className="text-xs text-[#575E70]">
                        Innova Crysta (KL-07-CD-8841)
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#575E70]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-[#004AC6]">
                          person_pin
                        </span>
                        <span className="text-[#111827] font-semibold">
                          Suresh K.
                        </span>
                        <span className="font-mono text-[11px]">+91 98471 20993</span>
                      </div>
                      <button
                        onClick={() =>
                          setToastMessage('Calling chauffeur Suresh K...')
                        }
                        className="text-[11px] text-[#004AC6] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>
                        <span>Direct Contact</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Item 3: Hotel Check-In */}
                <div className="relative flex items-start gap-4 pb-2 group">
                  <div className="w-8 h-8 rounded-full bg-[#E2E8F8] border-2 border-white ring-2 ring-slate-300 flex items-center justify-center text-[#434655] shrink-0 z-10">
                    <span className="material-symbols-outlined text-[16px]">
                      hotel
                    </span>
                  </div>
                  <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg p-3.5 hover:border-[#004AC6] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#111827]">
                          03:45 PM
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          Check-in Window Adjusted
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>
                        Voucher Validated
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]">
                        Old Harbour Hotel, Fort Kochi
                      </span>
                      <span className="text-[11px] font-mono text-[#575E70]">
                        Conf #OHH-4410
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#575E70]">
                      <span>Garden Cottage Room with Welcome Drink</span>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        Late Check-in noted by desk (Lijo)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 4: Fort Kochi Walk */}
                <div className="relative flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-[#E2E8F8] border-2 border-white ring-2 ring-slate-300 flex items-center justify-center text-[#434655] shrink-0 z-10">
                    <span className="material-symbols-outlined text-[16px]">
                      nature_people
                    </span>
                  </div>
                  <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg p-3.5 hover:border-[#004AC6] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#111827]">
                          05:30 PM – 07:15 PM
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          Optimal Golden Hour
                        </span>
                      </div>
                      <span className="text-[11px] text-[#575E70] flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">
                          verified
                        </span>
                        Guide Assigned
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]">
                        Colonial Spice Markets & Chinese Fishing Nets
                      </span>
                      <span className="text-xs text-[#575E70]">
                        Private Guide: Thomas P.
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#575E70]">
                      <span>Includes tea tasting stop at Vasco Da Gama Square</span>
                      <span className="text-[#004AC6] font-semibold">
                        Auto-synced to Traveler App
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: TRAVELERS, VENDORS & AUDIT ==================== */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* TRAVELERS CONTEXT CARD */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#004AC6]">
                    person
                  </span>
                  <span className="font-bold text-xs text-[#111827]">
                    Passenger Manifest (2)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#575E70] font-semibold">
                  VIP Segment
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Lead Traveler */}
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#004AC6]/10 text-[#004AC6] font-bold flex items-center justify-center text-xs border border-[#004AC6]/20">
                      SM
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">
                          Sarah Mehta
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          Elite
                        </span>
                      </div>
                      <span className="text-xs text-[#575E70]">
                        Lead Traveler · Vegetarian
                      </span>
                      <span className="font-mono text-[11px] text-[#575E70] mt-0.5">
                        +91 99203 11840 · Verified
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setToastMessage('Direct SMS messenger launched for Sarah.')
                    }
                    className="text-[#575E70] hover:text-[#004AC6] p-2 rounded-full hover:bg-[#F0F3FF] transition-colors cursor-pointer"
                    title="Message traveler"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </button>
                </div>

                {/* Guest Traveler */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-[#E5E7EB]">
                      RM
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#111827]">
                        Rohan Mehta
                      </span>
                      <span className="text-xs text-[#575E70]">
                        Guest · No dietary restrictions
                      </span>
                      <span className="font-mono text-[11px] text-[#575E70] mt-0.5">
                        Emergency Contact: Attached
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setToastMessage('Direct SMS messenger launched for Rohan.')
                    }
                    className="text-[#575E70] hover:text-[#004AC6] p-2 rounded-full hover:bg-[#F0F3FF] transition-colors cursor-pointer"
                    title="Message traveler"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </button>
                </div>

                {/* Concierge Assignment Note */}
                <div className="mt-1 p-3 rounded-lg bg-[#F0F3FF] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#575E70]">
                    <span className="material-symbols-outlined text-[18px] text-[#004AC6]">
                      headset_mic
                    </span>
                    <span>
                      Direct Ops Concierge:{' '}
                      <strong className="text-[#111827]">Arun V.</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    Active On-Call
                  </span>
                </div>
              </div>
            </div>

            {/* VENDOR MANIFEST & QUICK STATUS */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#004AC6]">
                    handshake
                  </span>
                  <span className="font-bold text-xs text-[#111827]">
                    Vendor Manifest
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  4 Booked Entities
                </span>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {/* Driver Suresh */}
                <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#004AC6]">
                      <span className="material-symbols-outlined text-base">
                        local_taxi
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">
                          Suresh K. (Chauffeur)
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                          Innova
                        </span>
                      </div>
                      <span className="text-xs text-[#575E70]">
                        KL-07-CD-8841 · Standby Gate 2 COK
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-semibold">
                    Standby 14:00
                  </span>
                </div>

                {/* Old Harbour Hotel */}
                <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <span className="material-symbols-outlined text-base">
                        apartment
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#111827]">
                        Old Harbour Hotel
                      </span>
                      <span className="text-xs text-[#575E70]">
                        Fort Kochi · 1 Night (Confirmed)
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    Late Note Ack'd
                  </span>
                </div>

                {/* The Leaf Resort Munnar */}
                <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <span className="material-symbols-outlined text-base">
                        villa
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#111827]">
                        The Leaf Resort Munnar
                      </span>
                      <span className="text-xs text-[#575E70]">
                        Days 2–4 · Cottage 104
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    Confirmed
                  </span>
                </div>

                {/* Heritage Guide */}
                <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                      <span className="material-symbols-outlined text-base">
                        badge
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#111827]">
                        Thomas P. (Heritage Guide)
                      </span>
                      <span className="text-xs text-[#575E70]">
                        English/Hindi · Kerala Tourism Certified
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 font-semibold">
                    Slot Moved 17:30
                  </span>
                </div>
              </div>
            </div>

            {/* AUDIT TRAIL & CHANGE HISTORY */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#004AC6]">
                    history
                  </span>
                  <h3 className="font-bold text-xs text-[#111827]">
                    Audit Trail & Change History
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#575E70]">
                  Auto-logged
                </span>
              </div>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] text-[#575E70] min-w-[55px]">
                    11:38 AM
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                  <p className="text-xs text-[#111827] flex-1">
                    System auto-detected IndiGo delay via ADS-B telemetry (
                    <span className="text-red-700 font-bold">+300m push</span>).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] text-[#575E70] min-w-[55px]">
                    11:40 AM
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <p className="text-xs text-[#111827] flex-1">
                    Heuristic engine calculated 3 resolution candidates; Candidate A
                    picked by system.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] text-[#575E70] min-w-[55px]">
                    11:41 AM
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <p className="text-xs text-[#111827] flex-1">
                    Driver Suresh K. acknowledged standby hold notification via SMS
                    gateway.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] text-[#575E70] min-w-[55px]">
                    11:42 AM
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <p className="text-xs text-[#111827] flex-1">
                    {isDisruptionResolved
                      ? 'Plan approved by Alex Vance. Real-time broadcast pushed to travelers.'
                      : 'Staged plan awaiting operator approval. Broadcast payload generated for 2 travelers.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setToastMessage(
                    'Full audit ledger containing 28 telemetry items loaded.'
                  )
                }
                className="w-full mt-4 py-2 border-t border-[#E5E7EB] text-center text-xs font-semibold text-[#004AC6] hover:underline cursor-pointer"
              >
                Expand Full Audit History (28 events) →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
