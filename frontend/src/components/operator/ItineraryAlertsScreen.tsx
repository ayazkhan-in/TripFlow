import React, { useState, useMemo } from 'react';
import { OPERATOR_ALERTS } from '../../data/operatorSuiteData';
import { ItineraryAlertItem } from '../../types/travel';

interface ItineraryAlertsScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
  onResolveDisruption?: () => void;
}

export const ItineraryAlertsScreen: React.FC<ItineraryAlertsScreenProps> = ({
  onInspectTour,
  showToast,
  onResolveDisruption,
}) => {
  const [alerts, setAlerts] = useState<ItineraryAlertItem[]>(OPERATOR_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'resolved'>('all');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (severityFilter === 'all') return true;
      if (severityFilter === 'resolved') return a.isResolved;
      return a.severity === severityFilter && !a.isResolved;
    });
  }, [alerts, severityFilter]);

  const handleResolveAlert = (id: string, title: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, isResolved: true, severity: 'resolved' } : a))
    );
    if (onResolveDisruption) onResolveDisruption();
    showToast(`Autonomous resolution applied for: "${title}". Chauffeur & hotel notified.`);
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-rose-600">
              warning
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Itinerary Alerts & Disruption Radar
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time flight delays, weather shifts, and autonomous itinerary reconciliation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('All live telemetry sensors operational across Japan, India & Europe.')}
          className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sensors Live (Sync: 2s)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Critical Alerts</span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">emergency</span>
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {alerts.filter(a => !a.isResolved && a.severity === 'critical').length} Active
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Immediate action needed</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Average Recovery Time</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">bolt</span>
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">3.2 mins</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Autonomous reconciliation</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Travelers Protected</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">shield</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">28 Travelers</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across 4 live circuits</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Auto-Recovery Rate</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">auto_fix_high</span>
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">96.8%</div>
          <div className="text-[11px] text-neutral-400 mt-1">Without customer friction</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'critical', label: 'Critical Only' },
          { id: 'high', label: 'High Priority' },
          { id: 'resolved', label: 'Resolved History' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSeverityFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
              severityFilter === tab.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80">
            <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">
              check_circle
            </span>
            <h3 className="text-base font-bold text-neutral-800">All Clear</h3>
            <p className="text-xs text-neutral-400 mt-1">
              No unresolved alerts in this category. Telemetry systems running smoothly.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 shadow-2xs border transition-all ${
                alert.isResolved
                  ? 'border-neutral-200 opacity-75'
                  : alert.severity === 'critical'
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        alert.isResolved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : alert.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {alert.isResolved ? 'RESOLVED' : alert.severity.toUpperCase()}
                    </span>

                    <span className="font-mono text-xs font-bold text-neutral-800">
                      {alert.tourId} • {alert.tourTitle}
                    </span>

                    <span className="text-[11px] text-neutral-400">• {alert.timeAgo}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900">{alert.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                    {alert.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-neutral-800">
                    {alert.affectedTravelers} Travelers Impacted
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium block">
                    Category: {alert.category}
                  </span>
                </div>
              </div>

              {/* Action Box */}
              <div className="mt-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-blue-600 shrink-0">
                    auto_fix_high
                  </span>
                  <div className="text-xs">
                    <span className="text-neutral-400 font-medium">Autonomous Recommendation: </span>
                    <strong className="text-neutral-800">{alert.actionSuggested}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!alert.isResolved && (
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alert.id, alert.title)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Apply Resolution</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onInspectTour(alert.tourId)}
                    className="px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Inspect Tour
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
