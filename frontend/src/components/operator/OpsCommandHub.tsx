import React, { useState, useEffect } from 'react';
import {
  DisruptionIssue,
  DispatchTransfer,
  RealtimeFeedEvent,
  OperatorTab,
} from '../../types/travel';
import {
  DISPATCH_TRANSFERS,
  INITIAL_DISRUPTIONS,
  REALTIME_EVENTS,
} from '../../data/mockData';
import { TripFlowApi } from '../../services/api';
import { useOperator } from '../../context/OperatorContext';
import { ThemedToast } from '../common/ThemedToast';

const DISPATCH_AVATARS: Record<string, string> = {
  '#1024': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', // Iqra Mulla
  '#1042': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', // Ayaz Khan
  '#1099': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', // Umme Hani
  '#1019': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', // Faiz Khan
  '#1055': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', // Iqra Mulla
};

interface OpsCommandHubProps {
  onInspectTour: (tourId: string) => void;
  onOpenNewTour: () => void;
  onOpenCreatePackage?: () => void;
  onNavigateToTab?: (tab: OperatorTab) => void;
  onOpenCommandPalette: () => void;
  isDisruptionResolved: boolean;
  onResolveDisruption: () => void;
}

export const OpsCommandHub: React.FC<OpsCommandHubProps> = ({
  onInspectTour,
  onOpenNewTour,
  onOpenCreatePackage,
  onNavigateToTab,
  onOpenCommandPalette,
  isDisruptionResolved,
  onResolveDisruption,
}) => {
  const { pendingCustomizedCount } = useOperator();
  const [disruptions, setDisruptions] = useState<DisruptionIssue[]>(INITIAL_DISRUPTIONS);
  const [transfers, setTransfers] = useState<DispatchTransfer[]>(DISPATCH_TRANSFERS);
  const [eventCategoryFilter, setEventCategoryFilter] = useState<
    'all' | 'flight' | 'hotel' | 'driver'
  >('all');
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Collapsible alerts state: All alerts collapsed/off by default
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({
    'issue-1024': false,
    'issue-1081': false,
    'issue-1042': false,
  });

  const toggleAlert = (id: string, defaultOpen = false) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !defaultOpen,
    }));
  };

  const isAlertOpen = (id: string, defaultOpen: boolean) => {
    return expandedAlerts[id] !== undefined ? expandedAlerts[id] : defaultOpen;
  };

  useEffect(() => {
    TripFlowApi.getMe().then(user => {
      const isOperator = user?.role?.toUpperCase() === 'OPERATOR';
      const isAlexDemo = !user || user.id === 'user-alex-007';

      TripFlowApi.getDisruptionAlerts().then(backendAlerts => {
        if (backendAlerts && backendAlerts.length > 0) {
          setDisruptions(
            backendAlerts.map((a: any, idx: number) => {
              const fallback = INITIAL_DISRUPTIONS[idx] || INITIAL_DISRUPTIONS[0];
              return {
                ...fallback,
                id: a.id,
                tourId: a.cohortId || fallback.tourId,
                tourName: a.tourTitle || fallback.tourName,
                severity: (a.severity === 'critical' || a.severity === 'high') ? a.severity : 'moderate',
                severityLabel:
                  a.severity === 'critical'
                    ? 'Critical Disruption'
                    : a.severity === 'high'
                    ? 'High Impact'
                    : 'Moderate Advisory',
                rootCauseTitle: a.title || fallback.rootCauseTitle,
                rootCauseDetail: a.description || fallback.rootCauseDetail,
                aiRecommendation: a.actionSuggested || fallback.aiRecommendation,
                actionText: a.isResolved ? 'Resolved' : fallback.actionText,
                status: (a.isResolved ? 'resolved' : 'open') as 'open' | 'resolved',
              };
            })
          );
        } else if (isOperator && !isAlexDemo) {
          setDisruptions([]);
        }
      });
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

  const item1 = disruptions[0] || INITIAL_DISRUPTIONS[0];
  const item2 = disruptions[1] || INITIAL_DISRUPTIONS[1];
  const item3 = disruptions[2] || INITIAL_DISRUPTIONS[2];
  const displayDisruptions = [item1, item2, item3];
  const openIssuesCount = displayDisruptions.filter(d => d.status === 'open').length;

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
          {onOpenCreatePackage && (
            <button
              onClick={onOpenCreatePackage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_business</span>
              <span>Create Package</span>
            </button>
          )}
          <button
            onClick={onOpenNewTour}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Dispatch</span>
          </button>
        </div>
      </header>

      {/* Main Operational Workspace */}
      <main className="p-6 flex-1 flex flex-col gap-6 max-w-[1600px] w-full mx-auto pb-16">
        {/* Toast Alert */}
        <ThemedToast
          message={liveToast}
          onClose={() => setLiveToast(null)}
          title="Ops Command Hub"
        />

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

        {/* Pending Traveler Customized Package Booking Alert */}
        {pendingCustomizedCount > 0 && (
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">edit_notifications</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    ⚡ {pendingCustomizedCount} Traveler Customized Tour Booking(s) Awaiting Fulfillment!
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  A traveler has customized a tour package from Discover with personalized stays, chauffeur requests, and extra experiences. Review customizations and dispatch bookings to respective tabs.
                </p>
              </div>
            </div>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('bookings')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-amber-400">tune</span>
                <span>Open Package Bookings</span>
              </button>
            )}
          </div>
        )}


        {/* Key Metrics Row (5 Clean Cards with Compact Visual Indicators) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Metric 1: Active Tours (Bigger Sparkline Centered with Metric) */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs min-h-[118px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
              Active Tours
            </span>
            <div className="flex items-center justify-between my-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                128
              </span>
              {/* Bigger Sparkline Line Chart */}
              <svg className="w-20 h-7 overflow-visible" viewBox="0 0 64 24" fill="none">
                <defs>
                  <linearGradient id="sparkline-emerald-lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 18 L10 16 L20 17 L32 11 L42 13 L52 6 L64 3 L64 24 L0 24 Z"
                  fill="url(#sparkline-emerald-lg)"
                />
                <path
                  d="M0 18 L10 16 L20 17 L32 11 L42 13 L52 6 L64 3"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center text-emerald-600 font-semibold text-[10px]">
                <span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>
                +12%
              </span>
              <span>vs last week</span>
            </div>
          </div>

          {/* Metric 2: Travelers In-Transit (Capacity Centered with Metric) */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs min-h-[118px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
              Travelers In-Transit
            </span>
            <div className="flex items-center justify-between my-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                342
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                100% Manifest
              </span>
            </div>
            <div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-full" />
              </div>
              <div className="mt-1 text-[11px] text-slate-400 truncate">42 groups · 100% capacity</div>
            </div>
          </div>

          {/* Metric 3: Open Issues (Bigger Severity Dots Centered with Metric) */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs min-h-[118px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
              Open Issues
            </span>
            <div className="flex items-center justify-between my-1">
              <span className="text-2xl font-bold tracking-tight text-red-600">
                {openIssuesCount}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50/70 rounded-md border border-red-100/90 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical Disruption" />
                <span className="w-2 h-2 rounded-full bg-amber-500" title="High Impact" />
                <span className="w-2 h-2 rounded-full bg-blue-500" title="Medium Advisory" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Requires auth</span>
              <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.2 rounded border border-red-200/60">
                Action Req.
              </span>
            </div>
          </div>

          {/* Metric 4: Today's Transfers (Badge Centered with Metric) */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs min-h-[118px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
              Today's Transfers
            </span>
            <div className="flex items-center justify-between my-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                24
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 font-semibold">
                75% On-Time
              </span>
            </div>
            <div>
              <div className="w-full flex h-1 rounded-full overflow-hidden bg-slate-100 gap-0.5">
                <div style={{ width: '75%' }} className="bg-emerald-500 rounded-l-full" title="18 On-time" />
                <div style={{ width: '17%' }} className="bg-amber-500" title="4 Delayed" />
                <div style={{ width: '8%' }} className="bg-blue-500 rounded-r-full" title="2 Active" />
              </div>
              <div className="mt-1 text-[11px] text-slate-400 truncate">18 on-time · 4 delayed · 2 active</div>
            </div>
          </div>

          {/* Metric 5: Managed GMV (Bigger Bar Chart Centered with Metric) */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs min-h-[118px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
              Managed GMV
            </span>
            <div className="flex items-center justify-between my-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                ₹18.4L
              </span>
              {/* Bigger Ascending Column Spark */}
              <div className="flex items-end gap-1 h-6">
                <span className="w-1.5 h-2 bg-slate-200 rounded-xs" title="Q1" />
                <span className="w-1.5 h-3 bg-blue-200 rounded-xs" title="Q2" />
                <span className="w-1.5 h-4 bg-blue-300 rounded-xs" title="Q3" />
                <span className="w-1.5 h-5 bg-blue-500 rounded-xs" title="Q4" />
                <span className="w-1.5 h-6 bg-blue-600 rounded-xs" title="Current" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Active billing</span>
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600">
                +8.4%
              </span>
            </div>
          </div>
        </section>

        {/* Main Operational Grid: Attention Required + Real-Time Event Stream + Active Dispatch Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Attention Required Section (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-2.5 text-left">
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

            {displayDisruptions.length === 0 ? (
              <div className="bg-white border border-emerald-200/80 rounded-2xl p-8 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">All Operations Clear</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Zero active disruption alerts for your agency fleet. All flights, hotel check-ins, and chauffeur transfers are running on schedule.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Alert 1: 🔴 Critical (Tour #1024) - Expanded by Default */}
                <article
                  className={`bg-white border rounded-xl shadow-2xs relative overflow-hidden transition-all hover:border-slate-300 ${
                    item1.status === 'resolved'
                      ? 'border-slate-200/80 opacity-90'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      item1.status === 'resolved' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />

                  {/* Compact Header */}
                  <div
                    onClick={() => toggleAlert(item1.id, false)}
                    className="py-2 px-3 pl-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-xs min-w-0">
                      {/* Capsule / Pill Severity Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 border ${
                          item1.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                            : 'bg-red-50 text-red-700 border-red-200/70'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item1.status === 'resolved' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                          }`}
                        />
                        <span>
                          {item1.status === 'resolved'
                            ? 'Reconciled & Synced'
                            : 'Critical'}
                        </span>
                      </span>

                      {/* Primary Text: Tour Name */}
                      <span className="font-semibold text-slate-900 truncate">
                        Tour #1024 · Kerala Mist & Spice Route
                      </span>

                      {/* Secondary Metadata: PNR */}
                      <span className="font-mono text-slate-400 text-[11px] shrink-0">
                        PNR: IN-99824
                      </span>

                      {/* Neutral Risk Capsule */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/70 whitespace-nowrap">
                        IndiGo 6E-204 · Delayed +5h 10m
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        T-minus 1h 45m
                      </span>
                      <button
                        type="button"
                        className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={isAlertOpen(item1.id, false) ? "Collapse alert" : "Expand alert"}
                      >
                        <span
                          className={`material-symbols-outlined text-base leading-none transition-transform duration-200 ${
                            isAlertOpen(item1.id, false) ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Clean 3-Column Context Grid */}
                  {isAlertOpen(item1.id, false) && (
                    <div className="px-3 pb-2.5 pt-1 border-t border-slate-100/90 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Impacted Group
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            {item1.impactedGroup || 'Iqra Mulla Group'}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-snug">Family Deluxe tier</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Root Cause
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            IndiGo 6E-204 (DEL → COK)
                          </p>
                          <p className="text-[11px] text-red-600 font-medium leading-snug">
                            Delayed +5h 10m · Fog in Delhi
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Downstream Conflict
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            Cochin Airport Chauffeur
                          </p>
                          <p className="text-[11px] text-slate-500 leading-snug">Original pickup: 09:30 AM</p>
                        </div>
                      </div>

                      {/* Concise AI Recommendation */}
                      <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200/70 rounded-md text-xs text-slate-700">
                        <span className="material-symbols-outlined text-slate-500 text-sm shrink-0">
                          auto_fix_high
                        </span>
                        <div className="flex-1 truncate">
                          <span className="font-semibold text-slate-900">AI Recommendation:</span>{' '}
                          Reschedule airport transfer to 02:30 PM & swap lunch stop to Fort Kochi.
                        </div>
                      </div>

                      {/* Concise Actions */}
                      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="material-symbols-outlined text-sm">person_pin</span>
                          <span>Driver: Anoop Nair (Innova Crysta)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onInspectTour('issue-1024')}
                            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Review Details
                          </button>
                          {item1.status === 'open' ? (
                            <button
                              onClick={() => handleQuickReschedule(item1.id)}
                              className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">bolt</span>
                              <span>Quick Reschedule</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              <span className="material-symbols-outlined text-xs">check</span>
                              Dispatched
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>

                {/* Alert 2: 🟠 High (Tour #1081) - Collapsed by Default */}
                <article
                  className={`bg-white border rounded-xl shadow-2xs relative overflow-hidden transition-all hover:border-slate-300 ${
                    item2.status === 'resolved'
                      ? 'border-slate-200/80 opacity-90'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      item2.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />

                  {/* Compact Header */}
                  <div
                    onClick={() => toggleAlert(item2.id, false)}
                    className="py-2 px-3 pl-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-xs min-w-0">
                      {/* Capsule / Pill Severity Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 border ${
                          item2.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                            : 'bg-amber-50 text-amber-800 border-amber-200/70'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item2.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>
                          {item2.status === 'resolved'
                            ? 'Approved & Held'
                            : 'High'}
                        </span>
                      </span>

                      {/* Primary Text: Tour Name */}
                      <span className="font-semibold text-slate-900 truncate">
                        Tour #1081 · Rajasthan Royal Heritage
                      </span>

                      {/* Secondary Metadata: PNR */}
                      <span className="font-mono text-slate-400 text-[11px] shrink-0">
                        PNR: RJ-33411
                      </span>

                      {/* Neutral Risk Capsule */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/70 whitespace-nowrap">
                        HVAC Outage
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        Check-in: 03:00 PM
                      </span>
                      <button
                        type="button"
                        className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={isAlertOpen(item2.id, false) ? "Collapse alert" : "Expand alert"}
                      >
                        <span
                          className={`material-symbols-outlined text-base leading-none transition-transform duration-200 ${
                            isAlertOpen(item2.id, false) ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Clean 3-Column Context Grid */}
                  {isAlertOpen(item2.id, false) && (
                    <div className="px-3 pb-2.5 pt-1 border-t border-slate-100/90 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Impacted Group
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            {item2.impactedGroup || 'Ayaz Khan Group'}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-snug">Luxury Suite package</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Root Cause
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            Samode Palace Jaipur
                          </p>
                          <p className="text-[11px] text-amber-700 font-medium leading-snug">
                            HVAC emergency electrical outage
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Downstream Conflict
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            Meridian Heritage Suite
                          </p>
                          <p className="text-[11px] text-emerald-700 font-mono leading-snug">
                            +₹2,400 delta approved budget
                          </p>
                        </div>
                      </div>

                      {/* Concise AI Recommendation */}
                      <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 bg-amber-50/50 border border-amber-200/60 rounded-md text-xs text-slate-700">
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-amber-600 text-sm shrink-0">
                            hotel
                          </span>
                          <span className="truncate">
                            <strong className="text-slate-900 font-semibold">AI Recommendation:</strong>{' '}
                            Hold placed on 2x Luxury Garden Suites at Hotel Meridian Heritage.
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-700 font-medium whitespace-nowrap ml-2">
                          22m remaining
                        </span>
                      </div>

                      {/* Concise Actions */}
                      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-500">
                          No additional cost passed to guest
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setLiveToast(
                                'Alternatives: ITC Rajputana (+₹5,100) or Rambagh Palace (+₹18,000)'
                              )
                            }
                            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            View Alternatives
                          </button>
                          {item2.status === 'open' ? (
                            <button
                              onClick={() => handleApproveBudget(item2.id)}
                              className="px-3 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">check</span>
                              <span>Approve +₹2,400</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              <span className="material-symbols-outlined text-xs">check</span>
                              Approved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>

                {/* Alert 3: 🔵 Medium (Tour #1042) - Collapsed by Default */}
                <article
                  className={`bg-white border rounded-xl shadow-2xs relative overflow-hidden transition-all hover:border-slate-300 ${
                    item3.status === 'resolved'
                      ? 'border-slate-200/80 opacity-90'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      item3.status === 'resolved' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />

                  {/* Compact Header */}
                  <div
                    onClick={() => toggleAlert(item3.id, false)}
                    className="py-2 px-3 pl-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-xs min-w-0">
                      {/* Capsule / Pill Severity Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 border ${
                          item3.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                            : 'bg-blue-50 text-blue-700 border-blue-200/70'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item3.status === 'resolved' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                        />
                        <span>
                          {item3.status === 'resolved'
                            ? 'Driver Swapped'
                            : 'Medium'}
                        </span>
                      </span>

                      {/* Primary Text: Tour Name */}
                      <span className="font-semibold text-slate-900 truncate">
                        Tour #1042 · Goa Coastal & Spice Trail
                      </span>

                      {/* Secondary Metadata: PNR */}
                      <span className="font-mono text-slate-400 text-[11px] shrink-0">
                        PNR: GA-11029
                      </span>

                      {/* Neutral Risk Capsule */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/70 whitespace-nowrap">
                        EV Charging Stalled +35m
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        Pickup in 25m
                      </span>
                      <button
                        type="button"
                        className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={isAlertOpen(item3.id, false) ? "Collapse alert" : "Expand alert"}
                      >
                        <span
                          className={`material-symbols-outlined text-base leading-none transition-transform duration-200 ${
                            isAlertOpen(item3.id, false) ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Clean 3-Column Context Grid */}
                  {isAlertOpen(item3.id, false) && (
                    <div className="px-3 pb-2.5 pt-1 border-t border-slate-100/90 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Impacted Group
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            {item3.impactedGroup || 'Umme Hani & Faiz Khan'}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-snug">W Goa to Panjim Marina</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Root Cause
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            EV Charging Queue Stalled
                          </p>
                          <p className="text-[11px] text-amber-600 font-medium leading-snug">
                            Assigned driver delayed ~35m
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                            Downstream Conflict
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                            Standby: Rohit S. (Tata Nexon EV)
                          </p>
                          <p className="text-[11px] text-emerald-700 font-mono leading-snug">
                            10 mins away · Standby proximity
                          </p>
                        </div>
                      </div>

                      {/* Concise AI Recommendation */}
                      <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200/70 rounded-md text-xs text-slate-700">
                        <span className="material-symbols-outlined text-slate-500 text-sm shrink-0">
                          swap_horiz
                        </span>
                        <div className="flex-1 truncate">
                          <span className="font-semibold text-slate-900">AI Recommendation:</span>{' '}
                          Auto-reassign standby chauffeur Rohit S. to arrive within 10 minutes.
                        </div>
                      </div>

                      {/* Concise Actions */}
                      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-500">
                          Guest has not been notified yet
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setLiveToast('SMS ping dispatched to original driver.')
                            }
                            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Contact Driver
                          </button>
                          {item3.status === 'open' ? (
                            <button
                              onClick={() => handleReassignDriver(item3.id)}
                              className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">
                                swap_horiz
                              </span>
                              <span>Reassign Driver</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              <span className="material-symbols-outlined text-xs">check</span>
                              Rohit S. Enroute
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </div>
            )}
          </section>

          {/* Right: Real-Time Event Stream Log (5 Cols) - Takes the space of the removed radar map */}
          <section className="lg:col-span-5 flex flex-col text-left">
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs flex flex-col">
              <div className="p-3.5 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">
                      manage_history
                    </span>
                    <h3 className="text-xs font-bold text-[#111827]">
                      Real-Time Event Stream
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200/70">
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
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
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
              <div className="divide-y divide-[#E5E7EB] max-h-[310px] overflow-y-auto custom-scrollbar">
                {filteredEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3 hover:bg-[#F9FAFB] transition-colors flex items-start gap-3"
                  >
                    <div
                      className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-xs text-blue-600">
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

          {/* Full Width Row: Active Dispatch Queue (12 Cols) */}
          <section className="lg:col-span-12 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs text-left">
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
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              DISPATCH_AVATARS[item.tourId] ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={item.leadTraveler}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200/90 shrink-0 shadow-2xs"
                          />
                          <span className="font-semibold text-[#111827]">
                            {item.leadTraveler}
                          </span>
                        </div>
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
                          className="px-2.5 py-1 text-xs font-medium bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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
        </div>
      </main>
    </div>
  );
};
