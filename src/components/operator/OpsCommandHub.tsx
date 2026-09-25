import React, { useState } from 'react';
import {
  DisruptionIssue,
  DispatchTransfer,
  RealtimeFeedEvent,
} from '../../types/travel';
import {
  DISPATCH_TRANSFERS,
  INITIAL_DISRUPTIONS,
  RADAR_MAP_IMAGE,
  REALTIME_EVENTS,
} from '../../data/mockData';

interface OpsCommandHubProps {
  onInspectTour: (tourId: string) => void;
  onOpenNewTour: () => void;
  onOpenCommandPalette: () => void;
  isDisruptionResolved: boolean;
  onResolveDisruption: () => void;
}

export const OpsCommandHub: React.FC<OpsCommandHubProps> = ({
  onInspectTour,
  onOpenNewTour,
  onOpenCommandPalette,
  isDisruptionResolved,
  onResolveDisruption,
}) => {
  const [disruptions, setDisruptions] = useState<DisruptionIssue[]>(INITIAL_DISRUPTIONS);
  const [transfers, setTransfers] = useState<DispatchTransfer[]>(DISPATCH_TRANSFERS);
  const [eventCategoryFilter, setEventCategoryFilter] = useState<
    'all' | 'flight' | 'hotel' | 'driver'
  >('all');
  const [liveToast, setLiveToast] = useState<string | null>(null);

  const handleQuickReschedule = (issueId: string) => {
    onResolveDisruption();
    setDisruptions(prev =>
      prev.map(d => (d.id === issueId ? { ...d, status: 'resolved' } : d))
    );
    setTransfers(prev =>
      prev.map(t =>
        t.tourId === '#1024'
          ? {
              ...t,
              status: 'On Track',
              statusColor: 'emerald',
              scheduledTime: '02:30 PM (Synced)',
            }
          : t
      )
    );
    setLiveToast('Tour #1024 airport transfer successfully rescheduled to 02:30 PM!');
    setTimeout(() => setLiveToast(null), 4000);
  };

  const handleApproveBudget = (issueId: string) => {
    setDisruptions(prev =>
      prev.map(d => (d.id === issueId ? { ...d, status: 'resolved' } : d))
    );
    setLiveToast('Budget delta +₹2,400 approved for Hotel Meridian Heritage!');
    setTimeout(() => setLiveToast(null), 4000);
  };

  const handleReassignDriver = (issueId: string) => {
    setDisruptions(prev =>
      prev.map(d => (d.id === issueId ? { ...d, status: 'resolved' } : d))
    );
    setTransfers(prev =>
      prev.map(t =>
        t.tourId === '#1042'
          ? {
              ...t,
              chauffeur: 'Rohit S.',
              vehicle: 'Tata Nexon EV',
              status: 'On Track',
              statusColor: 'emerald',
            }
          : t
      )
    );
    setLiveToast('Chauffeur Rohit S. dispatched to W Goa (ETA 10m)!');
    setTimeout(() => setLiveToast(null), 4000);
  };

  const filteredEvents = REALTIME_EVENTS.filter(e => {
    if (eventCategoryFilter === 'all') return true;
    return e.category === eventCategoryFilter;
  });

  const openIssuesCount = disruptions.filter(d => d.status === 'open').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7F8FA]">
      {/* Top Operational Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 w-full bg-white border-b border-[#E5E7EB] shadow-xs">
        {/* Search & Context Navigation */}
        <div className="flex items-center gap-6 w-1/2">
          <div
            onClick={onOpenCommandPalette}
            className="relative w-full max-w-md cursor-pointer"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#9CA3AF]">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </span>
            <input
              readOnly
              className="w-full pl-9 pr-12 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-[#111827] placeholder-[#9CA3AF] cursor-pointer"
              placeholder="Search tours, travelers, PNR, drivers (Cmd+K)"
              type="text"
            />
            <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] bg-white border border-[#E5E7EB] rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-[#575e70] border-l border-[#E5E7EB] pl-6 whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>11:42 AM IST</span>
            <span className="text-[#D1D5DB]">·</span>
            <span className="text-[#111827] font-semibold">
              Kochi & Munnar Hubs Synchronized
            </span>
          </div>
        </div>

        {/* Trailing Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onInspectTour('issue-1024')}
            className="flex items-center justify-center p-2 rounded-full text-[#575E70] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition-colors cursor-pointer"
            title="Active Tour #1024"
          >
            <span className="material-symbols-outlined text-lg">schedule</span>
          </button>
          <button
            onClick={() =>
              setLiveToast('3 critical disruptions logged in the queue.')
            }
            className="flex items-center justify-center p-2 rounded-full text-[#575E70] hover:bg-[#F3F4F6] border border-[#E5E7EB] relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            {openIssuesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#BA1A1A] rounded-full ring-2 ring-white"></span>
            )}
          </button>
          <div className="h-6 w-px bg-[#E5E7EB] mx-1"></div>
          <button
            onClick={onOpenNewTour}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004AC6] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create Tour</span>
          </button>
        </div>
      </header>

      {/* Main Operational Workspace */}
      <main className="p-6 flex-1 flex flex-col gap-6 max-w-[1600px] w-full mx-auto pb-16">
        {/* Toast Alert */}
        {liveToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{liveToast}</span>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Tour Operations Command Hub
            </h1>
            <p className="text-xs text-[#575E70] mt-0.5">
              Good morning, Alex. There are{' '}
              <strong className="text-red-600 font-bold">{openIssuesCount} disruptions</strong>{' '}
              requiring immediate dispatch authorization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveToast('Manifest exported to CSV/PDF successfully.')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                file_download
              </span>
              <span>Export Manifest</span>
            </button>
            <button
              onClick={() => setLiveToast('Live telemetry sync completed with ADS-B.')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Live Sync</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Row (5 High-Density Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Metric 1 */}
          <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Active Tours
              </span>
              <span className="material-symbols-outlined text-[#9CA3AF]">
                flight_takeoff
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                128
              </span>
              <span className="inline-flex items-center text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                ↑ 12%
              </span>
            </div>
            <div className="mt-1 text-[11px] text-[#9CA3AF]">vs last week (114)</div>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Travelers In-Transit
              </span>
              <span className="material-symbols-outlined text-[#9CA3AF]">groups</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                342
              </span>
              <span className="inline-flex items-center text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md font-semibold">
                42 groups
              </span>
            </div>
            <div className="mt-1 text-[11px] text-[#9CA3AF]">100% manifest covered</div>
          </div>

          {/* Metric 3 (Alert Critical) */}
          <div className="p-3.5 bg-white border border-red-200 rounded-xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-red-50 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between text-red-600">
              <span className="text-[11px] uppercase tracking-wide font-bold">
                Open Issues
              </span>
              <span className="material-symbols-outlined text-red-500">warning</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-red-600">
                {openIssuesCount}
              </span>
              <span className="inline-flex items-center text-[11px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded-md font-bold">
                {openIssuesCount} Critical
              </span>
            </div>
            <div className="mt-1 text-[11px] text-red-700/80 font-medium">
              4 pending coordinator review
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Today's Transfers
              </span>
              <span className="material-symbols-outlined text-[#9CA3AF]">
                directions_car
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                24
              </span>
              <div className="flex gap-1 text-[10px] font-mono">
                <span className="text-emerald-600 font-bold" title="On-time">
                  18✓
                </span>
                <span className="text-amber-600 font-bold" title="Delayed">
                  4⏳
                </span>
                <span className="text-blue-600 font-bold" title="In-progress">
                  2⚡
                </span>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-[#9CA3AF]">75% completion rate</div>
          </div>

          {/* Metric 5 */}
          <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Managed GMV
              </span>
              <span className="material-symbols-outlined text-[#9CA3AF]">
                payments
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                ₹18.4L
              </span>
              <span className="inline-flex items-center text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                Active month
              </span>
            </div>
            <div className="mt-1 text-[11px] text-[#9CA3AF]">
              0 bad-debt reconciliations
            </div>
          </div>
        </section>

        {/* Main Focus & Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Attention Required Section (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">
                  emergency_home
                </span>
                <h2 className="text-base font-bold text-[#111827]">
                  Attention Required
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-red-100 text-red-700 font-bold">
                  {openIssuesCount} Live Disruptions
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                <span>Sorted by Severity</span>
              </div>
            </div>

            {/* Card 1: Critical Flight Delay (Tour #1024) */}
            <article
              className={`bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden transition-all ${
                disruptions[0].status === 'resolved'
                  ? 'border-emerald-300 opacity-80'
                  : 'border-red-300 hover:border-red-400'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  disruptions[0].status === 'resolved'
                    ? 'bg-emerald-500'
                    : 'bg-red-600'
                }`}
              ></div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      disruptions[0].status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {disruptions[0].status === 'resolved'
                      ? 'Reconciled & Synced'
                      : 'Critical Disruption'}
                  </span>
                  <span className="text-xs font-semibold text-[#111827]">
                    Tour #1024 · Kerala Mist & Spice Route
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    PNR: IN-99824
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6B7280] whitespace-nowrap">
                  T-minus 1h 45m
                </span>
              </div>

              {/* Body Context */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Impacted Group
                  </p>
                  <p className="text-xs font-semibold text-[#111827] mt-0.5">
                    Sarah Mehta Group (4 pax)
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Family Deluxe tier</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Root Cause
                  </p>
                  <p className="text-xs font-bold text-red-600 mt-0.5">
                    IndiGo 6E-204 (DEL → COK)
                  </p>
                  <p className="text-[11px] text-red-700">Delayed +5h 10m · Fog in Delhi</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Downstream Conflict
                  </p>
                  <p className="text-xs font-semibold text-[#111827] mt-0.5">
                    Cochin Airport Chauffeur
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Original pickup: 09:30 AM</p>
                </div>
              </div>

              {/* AI Dispatch Recommendation */}
              <div className="mt-3 flex items-center gap-2 p-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[#004AC6] text-xs">
                <span className="material-symbols-outlined text-[#004AC6] text-base shrink-0">
                  auto_fix_high
                </span>
                <div className="flex-1">
                  <span className="font-bold">AI Dispatch Recommendation:</span>{' '}
                  Reschedule airport transfer to 02:30 PM & swap lunch stop to Fort
                  Kochi heritage cafe.
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span className="material-symbols-outlined text-base">person_pin</span>
                  <span>Driver: Anoop Nair (Innova Crysta)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectTour('issue-1024')}
                    className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    Review Details
                  </button>
                  {disruptions[0].status === 'open' ? (
                    <button
                      onClick={() => handleQuickReschedule(disruptions[0].id)}
                      className="px-4 py-1.5 rounded-full bg-[#004AC6] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Quick Reschedule</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Dispatched
                    </span>
                  )}
                </div>
              </div>
            </article>

            {/* Card 2: High Urgency Hotel Outage (Tour #1081) */}
            <article
              className={`bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden transition-all ${
                disruptions[1].status === 'resolved'
                  ? 'border-emerald-300 opacity-80'
                  : 'border-amber-300 hover:border-amber-400'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  disruptions[1].status === 'resolved'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              ></div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      disruptions[1].status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {disruptions[1].status === 'resolved'
                      ? 'Approved & Held'
                      : 'High Urgency'}
                  </span>
                  <span className="text-xs font-semibold text-[#111827]">
                    Tour #1081 · Rajasthan Royal Heritage
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    PNR: RJ-33411
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6B7280]">
                  Check-in: 03:00 PM
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Travelers Affected
                  </p>
                  <p className="text-xs font-semibold text-[#111827] mt-0.5">
                    Vikram Malhotra Group (4 pax)
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Luxury Suite package</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Root Cause
                  </p>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">
                    Samode Palace Jaipur
                  </p>
                  <p className="text-[11px] text-amber-800">
                    HVAC emergency electrical outage
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Auto-Reconciliation
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Meridian Heritage Suite
                  </p>
                  <p className="text-[11px] text-emerald-700 font-mono">
                    +₹2,400 delta approved budget
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-[#111827]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-base">
                    hotel
                  </span>
                  <span>
                    Hold placed on 2x Luxury Garden Suites at{' '}
                    <strong>Hotel Meridian Heritage</strong>. Confirm within 22 mins.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-800 font-bold whitespace-nowrap">
                  22m remaining
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280]">
                  No additional cost passed to guest
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setLiveToast(
                        'Alternatives: ITC Rajputana (+₹5,100) or Rambagh Palace (+₹18,000)'
                      )
                    }
                    className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    View Alternatives
                  </button>
                  {disruptions[1].status === 'open' ? (
                    <button
                      onClick={() => handleApproveBudget(disruptions[1].id)}
                      className="px-4 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Approve +₹2,400</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </article>

            {/* Card 3: Moderate Chauffeur Delay (Tour #1042) */}
            <article
              className={`bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden transition-all ${
                disruptions[2].status === 'resolved'
                  ? 'border-emerald-300 opacity-80'
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  disruptions[2].status === 'resolved'
                    ? 'bg-emerald-500'
                    : 'bg-blue-500'
                }`}
              ></div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      disruptions[2].status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {disruptions[2].status === 'resolved'
                      ? 'Driver Swapped'
                      : 'Moderate Delay'}
                  </span>
                  <span className="text-xs font-semibold text-[#111827]">
                    Tour #1042 · Goa Coastal & Spice Trail
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    PNR: GA-11029
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6B7280]">
                  Pickup in 25m
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Travelers
                  </p>
                  <p className="text-xs font-semibold text-[#111827] mt-0.5">
                    Dev & Riya Kapoor (2 pax)
                  </p>
                  <p className="text-[11px] text-[#6B7280]">W Goa to Panjim Marina</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Primary Issue
                  </p>
                  <p className="text-xs font-bold text-[#111827] mt-0.5">
                    EV Charging Queue Stalled
                  </p>
                  <p className="text-[11px] text-amber-600">Assigned driver delayed ~35m</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Standby Proximity
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Rohit S. (Tata Nexon EV)
                  </p>
                  <p className="text-[11px] text-emerald-700 font-mono">
                    10 mins away from resort
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280]">
                  Guest has not been notified yet
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setLiveToast('SMS ping dispatched to original driver.')
                    }
                    className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    Contact Driver
                  </button>
                  {disruptions[2].status === 'open' ? (
                    <button
                      onClick={() => handleReassignDriver(disruptions[2].id)}
                      className="px-4 py-1.5 rounded-full bg-[#004AC6] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        swap_horiz
                      </span>
                      <span>Reassign Driver</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Rohit S. Enroute
                    </span>
                  )}
                </div>
              </div>
            </article>
          </section>

          {/* Right: Auxiliary Radar & Real-Time Event Stream (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-4 text-left">
            {/* South India Active Fleet Radar */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs flex flex-col">
              <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004AC6]">
                    radar
                  </span>
                  <h3 className="text-xs font-bold text-[#111827]">
                    South India Active Fleet Radar
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    14 Chauffeurs Live
                  </span>
                  <button
                    onClick={() =>
                      setLiveToast('Full radar map telemetry synchronized.')
                    }
                    className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      fullscreen
                    </span>
                  </button>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative h-64 w-full bg-[#E5E7EB] overflow-hidden group">
                <img
                  alt="South India Route Radar"
                  className="w-full h-full object-cover object-center grayscale contrast-125 brightness-95 opacity-80"
                  src={RADAR_MAP_IMAGE}
                />
                <div className="absolute inset-0 bg-blue-950/10 pointer-events-none"></div>

                {/* Live Chauffeur Markers Overlay */}
                <div
                  onClick={() =>
                    setLiveToast('Chauffeur KL-07-BW-4412 on time at Fort Kochi.')
                  }
                  className="absolute top-1/4 left-1/3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <div className="bg-[#004AC6] text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-md border border-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      directions_car
                    </span>
                    <span>KL-07-BW-4412</span>
                  </div>
                  <div className="w-2 h-2 bg-[#004AC6] rounded-full ring-4 ring-[#004AC6]/30 mt-0.5"></div>
                </div>

                <div
                  onClick={() => onInspectTour('issue-1024')}
                  className="absolute bottom-1/3 right-1/4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <div className="bg-amber-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-md border border-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      flight_land
                    </span>
                    <span>6E-204 (+5h)</span>
                  </div>
                  <div className="w-2 h-2 bg-amber-600 rounded-full ring-4 ring-amber-600/30 mt-0.5"></div>
                </div>

                <div
                  onClick={() =>
                    setLiveToast('Munnar Tea Estate Chauffeur standby active.')
                  }
                  className="absolute top-1/2 right-1/3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <div className="bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-md border border-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">hotel</span>
                    <span>Munnar Tea Estate</span>
                  </div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full ring-4 ring-emerald-600/30 mt-0.5"></div>
                </div>

                {/* Floating Map Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#004AC6]"></span>
                  <span className="font-semibold text-[#151c27]">
                    Corridor: Kochi (COK) → Munnar → Alleppey
                  </span>
                </div>
              </div>

              {/* Hub Quick Stats */}
              <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] bg-[#F9FAFB] text-center py-2 border-t border-[#E5E7EB]">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Kochi Hub
                  </p>
                  <p className="text-xs font-bold text-[#111827]">9 Dispatched</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Munnar Hub
                  </p>
                  <p className="text-xs font-bold text-[#111827]">4 In-transit</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    Alleppey Hub
                  </p>
                  <p className="text-xs font-bold text-[#111827]">3 Docked</p>
                </div>
              </div>
            </div>

            {/* Real-Time Event Stream Log */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs flex flex-col flex-1">
              <div className="p-3.5 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6B7280]">
                      manage_history
                    </span>
                    <h3 className="text-xs font-bold text-[#111827]">
                      Real-Time Event Stream
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                    WebSocket: LIVE
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    onClick={() => setEventCategoryFilter('all')}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      eventCategoryFilter === 'all'
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]'
                    }`}
                  >
                    All (48)
                  </button>
                  <button
                    onClick={() => setEventCategoryFilter('flight')}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      eventCategoryFilter === 'flight'
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]'
                    }`}
                  >
                    Flight Delays (3)
                  </button>
                  <button
                    onClick={() => setEventCategoryFilter('hotel')}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      eventCategoryFilter === 'hotel'
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]'
                    }`}
                  >
                    Hotel Syncs (12)
                  </button>
                  <button
                    onClick={() => setEventCategoryFilter('driver')}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      eventCategoryFilter === 'driver'
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]'
                    }`}
                  >
                    Driver Pings (33)
                  </button>
                </div>
              </div>

              {/* Feed Items */}
              <div className="divide-y divide-[#E5E7EB] max-h-80 overflow-y-auto custom-scrollbar">
                {filteredEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3 hover:bg-[#F9FAFB] transition-colors flex items-start gap-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${evt.iconBg} ${evt.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {evt.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#111827] truncate">
                          {evt.title}
                        </p>
                        <span className="text-[11px] font-mono text-[#9CA3AF]">
                          {evt.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Stream Footer */}
              <div className="p-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center">
                <button
                  onClick={() => onInspectTour('issue-1024')}
                  className="text-xs font-semibold text-[#004AC6] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Audit Log</span>
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Quick Transfer Matrix Bar */}
        <section className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6B7280]">
                sync_alt
              </span>
              <h3 className="text-sm font-bold text-[#111827]">
                Active Dispatch Queue (Today's Next 5 Transfers)
              </h3>
            </div>
            <span className="text-xs text-[#6B7280]">Auto-refreshing every 30s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-2 px-3">Tour ID</th>
                  <th className="py-2 px-3">Lead Traveler</th>
                  <th className="py-2 px-3">Leg / Segment</th>
                  <th className="py-2 px-3">Vehicle / Chauffeur</th>
                  <th className="py-2 px-3">Scheduled</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {transfers.map(item => (
                  <tr
                    key={item.tourId}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#004AC6]">
                      {item.tourId}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#111827]">
                      {item.leadTraveler}
                    </td>
                    <td className="py-2.5 px-3 text-[#6B7280]">{item.leg}</td>
                    <td className="py-2.5 px-3 text-[#111827]">{item.vehicle}</td>
                    <td
                      className={`py-2.5 px-3 font-mono ${
                        item.isDelayed ? 'text-red-600 font-bold' : 'text-[#111827]'
                      }`}
                    >
                      {item.scheduledTime}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          item.statusColor === 'red'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.statusColor === 'blue'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onInspectTour(item.tourId)}
                        className="px-3 py-1 text-xs font-semibold bg-white border border-[#E5E7EB] rounded-full hover:bg-[#F3F4F6] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
