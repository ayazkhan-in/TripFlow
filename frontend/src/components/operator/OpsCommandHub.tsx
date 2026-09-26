import React, { useState, useEffect } from 'react';
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
import { TripFlowApi } from '../../services/api';

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

  useEffect(() => {
    TripFlowApi.getDisruptionAlerts().then(backendAlerts => {
      if (backendAlerts && backendAlerts.length > 0) {
        setDisruptions(backendAlerts.map((a: any, idx: number) => {
          const fallback = INITIAL_DISRUPTIONS[idx % INITIAL_DISRUPTIONS.length] || INITIAL_DISRUPTIONS[0];
          return {
            ...fallback,
            id: a.id,
            tourId: a.cohortId || fallback.tourId,
            tourName: a.tourTitle || fallback.tourName,
            severity: (a.severity === 'critical' || a.severity === 'high') ? a.severity : 'moderate',
            severityLabel: a.severity === 'critical' ? 'Critical Disruption' : a.severity === 'high' ? 'High Impact' : 'Moderate Advisory',
            rootCauseTitle: a.title || fallback.rootCauseTitle,
            rootCauseDetail: a.description || fallback.rootCauseDetail,
            aiRecommendation: a.actionSuggested || fallback.aiRecommendation,
            actionText: a.isResolved ? 'Resolved' : fallback.actionText,
            status: (a.isResolved ? 'resolved' : 'open') as 'open' | 'resolved',
          };
        }));
      }
    });
  }, []);

  const handleQuickReschedule = (issueId: string) => {
    onResolveDisruption();
    TripFlowApi.resolveDisruptionAlert(issueId).catch(console.warn);
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
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button
            onClick={onOpenNewTour}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
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
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{liveToast}</span>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tour Operations Command Hub
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Good morning, Alex. {openIssuesCount} disruptions requiring dispatch authorization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveToast('Manifest exported to CSV/PDF successfully.')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                file_download
              </span>
              <span>Export Manifest</span>
            </button>
            <button
              onClick={() => setLiveToast('Live telemetry sync completed with ADS-B.')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-400">refresh</span>
              <span>Live Sync</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Row (5 Clean Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Metric 1 */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Active Tours
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                128
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">+12% vs last week</div>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Travelers In-Transit
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                342
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">42 groups · 100% manifest</div>
          </div>

          {/* Metric 3 */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Open Issues
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-red-600">
                {openIssuesCount}
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">Requires authorization</div>
          </div>

          {/* Metric 4 */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Today's Transfers
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                24
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">18 on-time · 4 delayed · 2 active</div>
          </div>

          {/* Metric 5 */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Managed GMV
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                ₹18.4L
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">Active billing cycle</div>
          </div>
        </section>

        {/* Main Focus & Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Attention Required Section (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Attention Required
                </h2>
                <span className="text-xs text-slate-400 font-normal">
                  ({openIssuesCount} Disruptions)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        disruptions[0].status === 'resolved'
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`font-semibold text-[11px] ${
                        disruptions[0].status === 'resolved'
                          ? 'text-emerald-700'
                          : 'text-red-700'
                      }`}
                    >
                      {disruptions[0].status === 'resolved'
                        ? 'Reconciled & Synced'
                        : 'Critical Disruption'}
                    </span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-900">
                    Tour #1024 · Kerala Mist & Spice Route
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-400">
                    PNR: IN-99824
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  T-minus 1h 45m
                </span>
              </div>

              {/* Body Context */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Impacted Group
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    Sarah Mehta Group (4 pax)
                  </p>
                  <p className="text-[11px] text-slate-500">Family Deluxe tier</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Root Cause
                  </p>
                  <p className="text-xs font-bold text-red-600 mt-0.5">
                    IndiGo 6E-204 (DEL → COK)
                  </p>
                  <p className="text-[11px] text-red-600">Delayed +5h 10m · Fog in Delhi</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Downstream Conflict
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    Cochin Airport Chauffeur
                  </p>
                  <p className="text-[11px] text-slate-500">Original pickup: 09:30 AM</p>
                </div>
              </div>

              {/* AI Dispatch Recommendation */}
              <div className="mt-3 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-800 text-xs">
                <span className="material-symbols-outlined text-slate-600 text-base shrink-0">
                  auto_fix_high
                </span>
                <div className="flex-1">
                  <span className="font-semibold">AI Dispatch Recommendation:</span>{' '}
                  Reschedule airport transfer to 02:30 PM & swap lunch stop to Fort
                  Kochi heritage cafe.
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-base">person_pin</span>
                  <span>Driver: Anoop Nair (Innova Crysta)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectTour('issue-1024')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Review Details
                  </button>
                  {disruptions[0].status === 'open' ? (
                    <button
                      onClick={() => handleQuickReschedule(disruptions[0].id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Quick Reschedule</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
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
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        disruptions[1].status === 'resolved'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span
                      className={`font-semibold text-[11px] ${
                        disruptions[1].status === 'resolved'
                          ? 'text-emerald-700'
                          : 'text-amber-800'
                      }`}
                    >
                      {disruptions[1].status === 'resolved'
                        ? 'Approved & Held'
                        : 'High Urgency'}
                    </span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-900">
                    Tour #1081 · Rajasthan Royal Heritage
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-400">
                    PNR: RJ-33411
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Check-in: 03:00 PM
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Travelers Affected
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    Vikram Malhotra Group (4 pax)
                  </p>
                  <p className="text-[11px] text-slate-500">Luxury Suite package</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
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
                  <p className="text-[10px] uppercase font-medium text-slate-400">
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

              <div className="mt-3 flex items-center justify-between p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-base">
                    hotel
                  </span>
                  <span>
                    Hold placed on 2x Luxury Garden Suites at{' '}
                    <strong>Hotel Meridian Heritage</strong>. Confirm within 22 mins.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-800 font-medium whitespace-nowrap">
                  22m remaining
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  No additional cost passed to guest
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setLiveToast(
                        'Alternatives: ITC Rajputana (+₹5,100) or Rambagh Palace (+₹18,000)'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Alternatives
                  </button>
                  {disruptions[1].status === 'open' ? (
                    <button
                      onClick={() => handleApproveBudget(disruptions[1].id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Approve +₹2,400</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
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
                  : 'border-slate-200/80 hover:border-slate-300'
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
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        disruptions[2].status === 'resolved'
                          ? 'bg-emerald-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span
                      className={`font-semibold text-[11px] ${
                        disruptions[2].status === 'resolved'
                          ? 'text-emerald-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {disruptions[2].status === 'resolved'
                        ? 'Driver Swapped'
                        : 'Moderate Delay'}
                    </span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-900">
                    Tour #1042 · Goa Coastal & Spice Trail
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-400">
                    PNR: GA-11029
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Pickup in 25m
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Travelers
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    Dev & Riya Kapoor (2 pax)
                  </p>
                  <p className="text-[11px] text-slate-500">W Goa to Panjim Marina</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
                    Primary Issue
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    EV Charging Queue Stalled
                  </p>
                  <p className="text-[11px] text-amber-600">Assigned driver delayed ~35m</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-medium text-slate-400">
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

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Guest has not been notified yet
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setLiveToast('SMS ping dispatched to original driver.')
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Contact Driver
                  </button>
                  {disruptions[2].status === 'open' ? (
                    <button
                      onClick={() => handleReassignDriver(disruptions[2].id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">
                        swap_horiz
                      </span>
                      <span>Reassign Driver</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
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

                {/* Clean Segmented Tab Filters */}
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 w-fit">
                  {[
                    { id: 'all', label: 'All (48)' },
                    { id: 'flight', label: 'Flight Delays (3)' },
                    { id: 'hotel', label: 'Hotels (12)' },
                    { id: 'driver', label: 'Drivers (33)' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setEventCategoryFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        eventCategoryFilter === tab.id
                          ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
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
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.statusColor === 'red'
                              ? 'bg-red-500'
                              : item.statusColor === 'blue'
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-medium text-[11px]">{item.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onInspectTour(item.tourId)}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 text-slate-700 transition-colors"
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
