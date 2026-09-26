import React, { useState } from 'react';
import { ViewMode } from '../../types/travel';
import { ThemedToast } from '../common/ThemedToast';

interface TourDetailScreenProps {
  onBackToOverview: () => void;
  onSwitchMode: (mode: ViewMode) => void;
  isDisruptionResolved: boolean;
  onResolveDisruption: () => void;
}

type SubTab = 'overview' | 'travelers' | 'itinerary' | 'bookings' | 'issues' | 'history';

export const TourDetailScreen: React.FC<TourDetailScreenProps> = ({
  onBackToOverview,
  onSwitchMode,
  isDisruptionResolved,
  onResolveDisruption,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const [isCascadeCustomized, setIsCascadeCustomized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = () => {
    onResolveDisruption();
    showToast('Cascade updates dispatched. Driver confirmed, hotel notified, traveler app synced.');
  };

  const tabs: { key: SubTab; label: string; meta?: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'travelers', label: 'Travelers', meta: '2' },
    { key: 'itinerary', label: 'Itinerary', meta: '6 days' },
    { key: 'bookings', label: 'Bookings', meta: '8' },
    { key: 'issues', label: 'Issues', meta: isDisruptionResolved ? '0' : '1' },
    { key: 'history', label: 'Change History' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 text-left">
      {/* ====== HEADER ====== */}
      <section className="bg-white border-b border-slate-200 px-6 lg:px-8 pt-5 pb-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">

          {/* Row 1: Breadcrumb + Status indicators */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <button
                onClick={onBackToOverview}
                onMouseDown={(e) => e.preventDefault()}
                className="hover:text-slate-900 transition-colors outline-none focus:outline-none focus-visible:outline-none"
              >
                Tours
              </button>
              <span className="text-slate-300">/</span>
              <button
                onClick={onBackToOverview}
                onMouseDown={(e) => e.preventDefault()}
                className="hover:text-slate-900 transition-colors outline-none focus:outline-none focus-visible:outline-none"
              >
                Active Tours
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-semibold font-mono">Tour #1024</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              {/* Status indicator */}
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isDisruptionResolved ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                <span className={isDisruptionResolved ? 'text-emerald-700' : 'text-red-600'}>
                  {isDisruptionResolved ? 'All systems resolved' : 'Attention required'}
                </span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>6/6 vendors synced</span>
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => onSwitchMode('consumer')}
                onMouseDown={(e) => e.preventDefault()}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none focus:outline-none focus-visible:outline-none"
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                <span>Traveler view</span>
              </button>
            </div>
          </div>

          {/* Row 2: Title + actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Tour #1024 — Kerala Adventure
                </h1>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  ITIN-COK-992
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  June 14–19, 2026
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">group</span>
                  2 travelers
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-medium text-slate-700">Total ₹42,800</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                  Concierge: <strong className="font-semibold text-slate-800 ml-0.5">Arun V.</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast('Manifest PDF queued for export.')}
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 active:scale-100"
              >
                <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                Export PDF
              </button>
              <button
                onClick={() => showToast('Broadcast notice sent to 2 travelers and all vendors.')}
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 active:scale-100"
              >
                <span className="material-symbols-outlined text-[15px]">campaign</span>
                Broadcast
              </button>
              <button
                onClick={handleApprove}
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 active:scale-100"
              >
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {isDisruptionResolved ? 'Re-Sync' : 'Resolve Issue'}
              </button>
            </div>
          </div>

          {/* Row 3: Tabs */}
          <div className="flex items-center gap-0 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key)}
                onMouseDown={(e) => e.preventDefault()}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 rounded-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 whitespace-nowrap transition-colors cursor-pointer select-none ${activeSubTab === tab.key
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.label}
                {tab.meta && (
                  <span className={`text-[10px] font-mono ${tab.key === 'issues' && !isDisruptionResolved
                      ? 'text-red-600'
                      : 'text-slate-400'
                    }`}>
                    ({tab.meta})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MAIN BODY ====== */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
        {/* Themed Toast */}
        <ThemedToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          title="Tour Dispatch System"
        />

        {/* ======== OVERVIEW TAB ======== */}
        {activeSubTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Disruption + Timeline */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Disruption Card */}
              <div className={`bg-white border rounded-xl overflow-hidden relative ${isDisruptionResolved ? 'border-emerald-200' : 'border-red-200'}`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDisruptionResolved ? 'bg-emerald-500' : 'bg-red-500'}`} />

                <div className="pl-5 pr-5 pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isDisruptionResolved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {isDisruptionResolved ? 'check_circle' : 'warning'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-sm font-bold text-slate-900">
                            {isDisruptionResolved
                              ? 'Resolved — Flight delay ripple absorbed'
                              : 'Open Issue — Flight delayed by 5 hours'}
                          </h2>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${isDisruptionResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {isDisruptionResolved ? 'RESOLVED' : 'CRITICAL #402'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          IndiGo <span className="font-mono font-bold text-slate-800">6E-204</span> (DEL → COK) ETA pushed from{' '}
                          <span className="line-through text-red-500">09:00 AM</span> to{' '}
                          <span className="font-bold text-red-700">02:00 PM</span>. Inbound aircraft turnaround delay at Indira Gandhi Int'l.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 shrink-0">T-minus 2h 18m</span>
                  </div>

                  {/* Ripple chain */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Downstream Ripple (4 impacted segments)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">+5h total impact</span>
                    </div>
                    <div className="flex items-stretch gap-0 overflow-x-auto pb-1">
                      {[
                        { label: 'Flight', name: 'IndiGo 6E-204', detail: 'ETA 02:00 PM', impact: '+5h', color: 'border-red-200 bg-red-50', labelColor: 'text-red-600', detailColor: 'text-red-700' },
                        { label: 'Transfer', name: 'COK Airport Cab', detail: 'Resched 14:30', impact: 'Shifted', color: 'border-amber-200 bg-amber-50', labelColor: 'text-amber-700', detailColor: 'text-amber-700' },
                        { label: 'Check-in', name: 'Old Harbour Hotel', detail: 'Held until 18:00', impact: 'Late hold', color: 'border-slate-200 bg-slate-50', labelColor: 'text-slate-500', detailColor: 'text-slate-600' },
                        { label: 'Dining', name: 'Malabar Cafe', detail: 'Converted to tea', impact: 'Converted', color: 'border-amber-200 bg-amber-50', labelColor: 'text-amber-700', detailColor: 'text-amber-700' },
                      ].map((node, i, arr) => (
                        <React.Fragment key={i}>
                          <div className={`flex flex-col p-2.5 border rounded-lg min-w-[120px] shrink-0 ${node.color}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-semibold uppercase tracking-wide ${node.labelColor}`}>{node.label}</span>
                              <span className={`text-[10px] font-mono ${node.labelColor}`}>{node.impact}</span>
                            </div>
                            <span className="font-bold text-xs text-slate-800 mt-1">{node.name}</span>
                            <span className={`text-[10px] font-mono mt-0.5 ${node.detailColor}`}>{node.detail}</span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className="flex items-center px-1 shrink-0">
                              <div className="w-5 h-[1.5px] border-t-2 border-dashed border-slate-300" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Resolution panel */}
                  <div className="mt-4 p-3.5 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">auto_fix_high</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-blue-800">Automated Resolution Candidate</span>
                          <span className="text-[10px] font-mono bg-white text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">+₹800 difference</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          "Reschedule airport transfer to 02:30 PM & adjust lunch to Malabar high-tea, shifting Fort Kochi walk to 05:30 PM sunset."
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setIsCascadeCustomized(!isCascadeCustomized)}
                            className="h-7 px-3 bg-white border border-blue-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium transition-colors"
                          >
                            {isCascadeCustomized ? 'Hide Options' : 'Customize Cascade'}
                          </button>
                          <button
                            onClick={handleApprove}
                            className="h-7 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            {isDisruptionResolved ? 'Re-broadcast' : 'Approve & Dispatch'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isCascadeCustomized && (
                      <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200 text-xs text-slate-700 cursor-pointer">
                          <input type="checkbox" defaultChecked />
                          Direct hotel transfer before sunset walk
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200 text-xs text-slate-700 cursor-pointer">
                          <input type="checkbox" defaultChecked />
                          Notify restaurant of 2-hour delay
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Day 1 Timeline */}
              <div className="bg-white border border-slate-200 rounded-xl">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-slate-600">timeline</span>
                    <h3 className="text-sm font-bold text-slate-900">Day 1 — Kochi Arrival & Heritage Circuit</h3>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Day
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">All 4 vendors active</span>
                </div>

                <div className="p-5 flex flex-col relative space-y-4">
                  <div className="absolute left-[36px] top-10 bottom-8 w-px bg-slate-200" />

                  {/* Flight */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 border-2 border-white ring-2 ring-red-200 flex items-center justify-center text-red-600 shrink-0 z-10">
                      <span className="material-symbols-outlined text-[15px]">flight_land</span>
                    </div>
                    <div className="flex-1 bg-red-50/50 border border-red-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">02:00 PM</span>
                          <span className="text-[10px] font-mono line-through text-slate-400">09:00 AM</span>
                          <span className="text-[10px] font-semibold text-red-700">+5h delay</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">satellite_alt</span>
                          Radar In-Air
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-xs text-slate-900">IndiGo 6E-204 (Delhi T3 → Cochin Int'l T1)</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-red-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">airline_seat_recline_extra</span>
                          Seats 12A, 12B · PNR: K8X29Q
                        </span>
                        <span className="text-amber-700 font-medium text-[10px]">Terminal Escort Alerted</span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-white ring-2 ring-amber-200 flex items-center justify-center text-amber-700 shrink-0 z-10">
                      <span className="material-symbols-outlined text-[15px]">directions_car</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">02:30 PM</span>
                          <span className="text-[10px] text-amber-700 font-medium">Staged reschedule</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Chauffeur ack'd
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Airport Transfer → Fort Kochi Heritage Quarter</span>
                        <span className="text-xs text-slate-500">Innova Crysta (KL-07-CD-8841)</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">person_pin</span>
                          <strong className="text-slate-700">Suresh K.</strong>
                          <span className="font-mono">+91 98471 20993</span>
                        </span>
                        <button onClick={() => showToast('Calling Suresh K...')} className="text-blue-600 hover:underline text-[10px] font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">call</span> Direct Contact
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Check-In */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-200 flex items-center justify-center text-slate-600 shrink-0 z-10">
                      <span className="material-symbols-outlined text-[15px]">hotel</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">03:45 PM</span>
                          <span className="text-[10px] text-slate-500">Check-in window adjusted</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Voucher validated
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Old Harbour Hotel, Fort Kochi</span>
                        <span className="text-[10px] font-mono text-slate-500">Conf #OHH-4410</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Garden Cottage Room with Welcome Drink</span>
                        <span className="font-medium text-emerald-700 text-[10px]">Late check-in noted</span>
                      </div>
                    </div>
                  </div>

                  {/* Heritage Walk */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-200 flex items-center justify-center text-slate-600 shrink-0 z-10">
                      <span className="material-symbols-outlined text-[15px]">nature_people</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">05:30 PM – 07:15 PM</span>
                          <span className="text-[10px] text-blue-700 font-medium">Optimal golden hour</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Guide assigned
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Colonial Spice Markets & Chinese Fishing Nets</span>
                        <span className="text-xs text-slate-500">Guide: Thomas P.</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Includes tea tasting at Vasco Da Gama Square</span>
                        <span className="text-blue-600 text-[10px] font-medium">Synced to traveler app</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Passengers + Vendors + Audit */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Passenger Manifest */}
              <div className="bg-white border border-slate-200 rounded-xl">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">person</span>
                    <span className="font-bold text-xs text-slate-900">Passenger Manifest</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">VIP Segment</span>
                </div>

                <div className="p-4 flex flex-col gap-4">
                  {/* Sarah Mehta */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">SM</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">Sarah Mehta</span>
                          <span className="text-[10px] text-amber-700 font-medium">Elite</span>
                        </div>
                        <span className="text-xs text-slate-500">Lead Traveler · Vegetarian</span>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">+91 99203 11840 · Verified</div>
                      </div>
                    </div>
                    <button onClick={() => showToast('Messenger launched for Sarah.')} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </button>
                  </div>

                  {/* Rohan Mehta */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">RM</div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Rohan Mehta</span>
                        <span className="text-xs text-slate-500">Guest · No dietary restrictions</span>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">Emergency contact: Attached</div>
                      </div>
                    </div>
                    <button onClick={() => showToast('Messenger launched for Rohan.')} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </button>
                  </div>

                  {/* Concierge note */}
                  <div className="mt-1 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">headset_mic</span>
                      Ops Concierge: <strong className="text-slate-900 ml-0.5">Arun V.</strong>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active On-Call
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Manifest */}
              <div className="bg-white border border-slate-200 rounded-xl">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">handshake</span>
                    <span className="font-bold text-xs text-slate-900">Vendor Manifest</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">4 booked entities</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    { icon: 'local_taxi', name: 'Suresh K. (Chauffeur)', sub: 'KL-07-CD-8841 · Standby Gate 2 COK', status: 'Standby 14:00', statusColor: 'text-amber-700' },
                    { icon: 'apartment', name: 'Old Harbour Hotel', sub: 'Fort Kochi · 1 Night (Confirmed)', status: "Late Note Ack'd", statusColor: 'text-emerald-700' },
                    { icon: 'villa', name: 'The Leaf Resort Munnar', sub: 'Days 2–4 · Cottage 104', status: 'Confirmed', statusColor: 'text-emerald-700' },
                    { icon: 'badge', name: 'Thomas P. (Heritage Guide)', sub: 'English/Hindi · Kerala Tourism Certified', status: 'Slot Moved 17:30', statusColor: 'text-blue-700' },
                  ].map((v, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <span className="material-symbols-outlined text-[16px]">{v.icon}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-slate-900 block">{v.name}</span>
                          <span className="text-[10px] text-slate-500">{v.sub}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium ${v.statusColor}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">history</span>
                    <h3 className="font-bold text-xs text-slate-900">Audit Trail</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Auto-logged</span>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { time: '11:38 AM', color: 'bg-red-500', text: 'System detected IndiGo delay via ADS-B telemetry (+300m push).' },
                    { time: '11:40 AM', color: 'bg-blue-500', text: 'Heuristic engine calculated 3 resolution candidates; Candidate A selected.' },
                    { time: '11:41 AM', color: 'bg-emerald-500', text: 'Driver Suresh K. acknowledged standby hold via SMS gateway.' },
                    { time: '11:42 AM', color: 'bg-amber-500', text: isDisruptionResolved ? 'Plan approved by Alex Vance. Broadcast pushed to 2 travelers.' : 'Staged plan awaiting operator approval. Broadcast payload ready.' },
                  ].map((entry, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono text-slate-400 min-w-[55px]">{entry.time}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${entry.color} mt-1.5 shrink-0`} />
                      <p className="text-xs text-slate-700 flex-1">{entry.text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => showToast('Full audit ledger with 28 telemetry items loaded.')}
                  className="w-full mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  View full audit history (28 events) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======== TRAVELERS TAB ======== */}
        {activeSubTab === 'travelers' && (
          <div className="max-w-3xl space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-bold text-sm text-slate-900">Traveler Profiles</h2>
                <p className="text-xs text-slate-500 mt-0.5">All guests on Tour #1024 — Kerala Adventure</p>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  {
                    initials: 'SM', name: 'Sarah Mehta', role: 'Lead Traveler', tier: 'Elite',
                    phone: '+91 99203 11840', email: 'sarah.mehta@gmail.com',
                    dietary: 'Vegetarian', passport: 'Z1234567 · Verified',
                    emergency: 'Raj Mehta — +91 98765 43210', notes: 'Prefers window seats, no allergens. Requests daily weather updates on app.'
                  },
                  {
                    initials: 'RM', name: 'Rohan Mehta', role: 'Guest', tier: null,
                    phone: 'Via lead traveler', email: 'Via lead traveler',
                    dietary: 'No restrictions', passport: 'Z1234568 · Verified',
                    emergency: 'Sarah Mehta — +91 99203 11840', notes: 'Photography enthusiast — has requested longer stops at heritage sites.'
                  }
                ].map((t, i) => (
                  <div key={i} className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {t.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{t.name}</span>
                            {t.tier && <span className="text-[10px] text-amber-700 font-semibold">{t.tier}</span>}
                          </div>
                          <span className="text-xs text-slate-500">{t.role}</span>
                        </div>
                      </div>
                      <button onClick={() => showToast(`Messenger opened for ${t.name}.`)} className="h-7 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        Message
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'Phone', value: t.phone },
                        { label: 'Email', value: t.email },
                        { label: 'Dietary', value: t.dietary },
                        { label: 'Passport', value: t.passport },
                        { label: 'Emergency Contact', value: t.emergency },
                      ].map((f, j) => (
                        <div key={j} className={f.label === 'Emergency Contact' ? 'col-span-2' : ''}>
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 block">{f.label}</span>
                          <span className="text-slate-800 font-mono text-[11px]">{f.value}</span>
                        </div>
                      ))}
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 block">Concierge Notes</span>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{t.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======== ITINERARY TAB ======== */}
        {activeSubTab === 'itinerary' && (
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-sm text-slate-900">6-Day Itinerary</h2>
                <p className="text-xs text-slate-500">Kerala Adventure · June 14–19, 2026</p>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Day 1 is live
              </span>
            </div>

            {[
              {
                day: 1, date: 'Jun 14', title: 'Kochi Arrival & Heritage Circuit', live: true,
                segments: [
                  { icon: 'flight_land', time: '02:00 PM', label: 'IndiGo 6E-204 arrives COK', status: '+5h delay', statusColor: 'text-red-600' },
                  { icon: 'directions_car', time: '02:30 PM', label: 'Airport → Fort Kochi (Suresh K.)', status: 'On track', statusColor: 'text-emerald-700' },
                  { icon: 'hotel', time: '03:45 PM', label: 'Check-in Old Harbour Hotel', status: 'Confirmed', statusColor: 'text-emerald-700' },
                  { icon: 'nature_people', time: '05:30 PM', label: 'Fort Kochi Heritage Walk', status: 'Guide ready', statusColor: 'text-emerald-700' },
                ]
              },
              {
                day: 2, date: 'Jun 15', title: 'Munnar Tea Estates & Hill Station', live: false,
                segments: [
                  { icon: 'directions_car', time: '07:30 AM', label: 'Kochi → Munnar (4.5h drive)', status: 'Upcoming', statusColor: 'text-slate-500' },
                  { icon: 'nature', time: '12:00 PM', label: 'Eravikulam National Park', status: 'Booked', statusColor: 'text-slate-500' },
                  { icon: 'local_cafe', time: '02:30 PM', label: 'Kolukkumalai Tea Estate Tour', status: 'Confirmed', statusColor: 'text-slate-500' },
                  { icon: 'hotel', time: '06:00 PM', label: 'Check-in The Leaf Resort (Cottage 104)', status: 'Confirmed', statusColor: 'text-slate-500' },
                ]
              },
              {
                day: 3, date: 'Jun 16', title: 'Athirapally Falls & Jungle Trek', live: false,
                segments: [
                  { icon: 'hiking', time: '06:00 AM', label: 'Sunrise trek — Top Station', status: 'Optional', statusColor: 'text-slate-500' },
                  { icon: 'directions_car', time: '10:00 AM', label: 'Munnar → Athirapally (2h)', status: 'Upcoming', statusColor: 'text-slate-500' },
                  { icon: 'water', time: '12:30 PM', label: 'Athirapally Waterfalls excursion', status: 'Booked', statusColor: 'text-slate-500' },
                ]
              },
            ].map((day) => (
              <div key={day.day} className={`bg-white border rounded-xl ${day.live ? 'border-emerald-200' : 'border-slate-200'}`}>
                <div className={`px-5 py-3.5 border-b flex items-center justify-between ${day.live ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">Day {day.day}</span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{day.date}</span>
                    <h3 className="font-bold text-xs text-slate-900">{day.title}</h3>
                    {day.live && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{day.segments.length} segments</span>
                </div>
                <div className="p-4 space-y-2">
                  {day.segments.map((seg, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-slate-400 w-16 shrink-0">{seg.time}</span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">{seg.icon}</span>
                      <span className="text-xs text-slate-700 flex-1">{seg.label}</span>
                      <span className={`text-[10px] font-medium ${seg.statusColor}`}>{seg.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400">Days 4–6 (Jun 17–19) · Alleppey Backwaters, Varkala, Return</p>
              <button onClick={() => showToast('Full 6-day itinerary loaded.')} className="mt-2 text-xs text-blue-600 hover:underline">Load remaining days →</button>
            </div>
          </div>
        )}

        {/* ======== BOOKINGS TAB ======== */}
        {activeSubTab === 'bookings' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Booking Records</h2>
                <p className="text-xs text-slate-500">All confirmed bookings for Tour #1024</p>
              </div>
              <span className="text-xs text-slate-500">8 confirmed · 0 pending</span>
            </div>

            {[
              {
                section: 'Flights', icon: 'flight', items: [
                  { name: 'IndiGo 6E-204', sub: 'Delhi → Kochi · Jun 14', ref: 'PNR: K8X29Q', status: 'Confirmed', note: '+5h delay today' },
                  { name: 'IndiGo 6E-205', sub: 'Kochi → Delhi · Jun 19', ref: 'PNR: K8X32A', status: 'Confirmed', note: 'On schedule' },
                ]
              },
              {
                section: 'Hotels', icon: 'apartment', items: [
                  { name: 'Old Harbour Hotel', sub: 'Fort Kochi · Jun 14–15 · 1 Night', ref: 'Conf #OHH-4410', status: 'Confirmed', note: 'Garden Cottage' },
                  { name: 'The Leaf Resort', sub: 'Munnar · Jun 15–18 · 3 Nights', ref: 'Conf #LRS-2291', status: 'Confirmed', note: 'Cottage 104' },
                  { name: 'Sea Pearl Beach Resort', sub: 'Varkala · Jun 18–19 · 1 Night', ref: 'Conf #SPB-8872', status: 'Confirmed', note: 'Cliff View Room' },
                ]
              },
              {
                section: 'Transfers & Activities', icon: 'directions_car', items: [
                  { name: 'Airport Transfer (COK)', sub: 'Suresh K. · Innova Crysta', ref: 'KL-07-CD-8841', status: 'Standby', note: 'Rescheduled 14:30' },
                  { name: 'Kolukkumalai Tea Estate', sub: 'Guided tour · Jun 15', ref: 'BOOK-TEA-441', status: 'Confirmed', note: '2 pax' },
                  { name: 'Athirapally Falls Entry', sub: 'Permit + Guide · Jun 16', ref: 'PERM-AF-990', status: 'Confirmed', note: 'Permit validated' },
                ]
              },
            ].map((section) => (
              <div key={section.section} className="bg-white border border-slate-200 rounded-xl">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-slate-500">{section.icon}</span>
                  <span className="font-bold text-xs text-slate-900">{section.section}</span>
                  <span className="text-[10px] text-slate-400">({section.items.length})</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {section.items.map((item, j) => (
                    <div key={j} className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.sub}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block">{item.ref}</span>
                        <span className="text-[10px] text-slate-500">{item.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======== ISSUES TAB ======== */}
        {activeSubTab === 'issues' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Issues & Disruptions</h2>
                <p className="text-xs text-slate-500">Active and resolved issues for Tour #1024</p>
              </div>
              {!isDisruptionResolved && (
                <button onClick={handleApprove} className="h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Resolve All
                </button>
              )}
            </div>

            {!isDisruptionResolved ? (
              <div className="bg-white border border-red-200 rounded-xl overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                <div className="pl-5 pr-5 py-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">Flight delayed by 5 hours</span>
                          <span className="text-[10px] font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded font-bold">CRITICAL #402</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">T-minus 2h 18m</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        IndiGo 6E-204 (DEL → COK) pushed from 09:00 AM to 02:00 PM. Affects 4 downstream segments (transfer, check-in, dining, heritage walk).
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          <strong className="text-slate-700">Suggested:</strong> Reschedule airport cab to 14:30, adjust evening itinerary to golden hour.
                        </span>
                        <button
                          onClick={handleApprove}
                          className="h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 ml-3"
                        >
                          <span className="material-symbols-outlined text-[13px]">send</span>
                          Approve & Dispatch
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-emerald-200 rounded-xl p-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900">All issues resolved</span>
                  <p className="text-xs text-slate-500 mt-0.5">Cascade dispatched. Driver, hotel, and traveler app all synchronized.</p>
                </div>
              </div>
            )}

            {/* Previous resolved issues */}
            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3.5 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900">Resolved Issues (2)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { title: 'Hotel room preference change', date: 'Jun 10', resolution: 'Guest room upgraded to garden-view at no charge.' },
                  { title: 'Visa documentation delay', date: 'Jun 08', resolution: 'E-Visa verified and lodged 72h before departure.' },
                ].map((issue, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600 mt-0.5">check_circle</span>
                    <div>
                      <span className="font-medium text-xs text-slate-700">{issue.title}</span>
                      <span className="text-[10px] text-slate-400 ml-2">{issue.date}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{issue.resolution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======== HISTORY TAB ======== */}
        {activeSubTab === 'history' && (
          <div className="max-w-3xl space-y-4">
            <div className="mb-2">
              <h2 className="font-bold text-sm text-slate-900">Change History</h2>
              <p className="text-xs text-slate-500">Complete audit trail for Tour #1024</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-slate-500">history</span>
                  <span className="font-bold text-xs text-slate-900">Audit Log</span>
                </div>
                <span className="text-[10px] text-slate-400">28 events total · Auto-logged</span>
              </div>

              <div className="p-5 space-y-4">
                {[
                  { time: 'Today, 11:42 AM', color: 'bg-amber-500', actor: 'System', label: 'Cascade plan staged and ready for approval.', type: 'Pending' },
                  { time: 'Today, 11:41 AM', color: 'bg-emerald-500', actor: 'System', label: 'Driver Suresh K. acknowledged standby hold via SMS.', type: 'Vendor ACK' },
                  { time: 'Today, 11:40 AM', color: 'bg-blue-500', actor: 'AI Engine', label: 'Heuristic engine selected Candidate A from 3 resolution options.', type: 'AI Action' },
                  { time: 'Today, 11:38 AM', color: 'bg-red-500', actor: 'ADS-B Feed', label: 'IndiGo 6E-204 delay detected — +300 min push.', type: 'Alert' },
                  { time: 'Jun 13, 3:20 PM', color: 'bg-slate-400', actor: 'Arun V.', label: 'Final manifest confirmed. All 8 vendors acknowledged.', type: 'Ops' },
                  { time: 'Jun 12, 10:05 AM', color: 'bg-slate-400', actor: 'Sarah Mehta', label: 'Dietary preference updated to Vegetarian (strict).', type: 'Traveler' },
                  { time: 'Jun 10, 2:40 PM', color: 'bg-emerald-500', actor: 'Arun V.', label: 'Room preference change resolved — garden-view confirmed.', type: 'Resolved' },
                  { time: 'Jun 08, 9:10 AM', color: 'bg-emerald-500', actor: 'System', label: 'E-Visa verified and lodged 72h before departure.', type: 'Resolved' },
                ].map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${entry.color} mt-1.5 shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">{entry.time}</span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] font-medium text-slate-600">{entry.actor}</span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">{entry.type}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">{entry.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                <button onClick={() => showToast('All 28 events loaded.')} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                  Load all 28 events →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
