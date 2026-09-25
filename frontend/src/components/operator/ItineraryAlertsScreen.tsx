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
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Itinerary Alerts & Disruption Radar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time flight delays, weather shifts, and autonomous itinerary reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sensors Live</span>
        </div>
      </div>

      {/* KPI Cards - Clean & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Critical Alerts
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {alerts.filter(a => !a.isResolved && a.severity === 'critical').length} Active
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Requires resolution</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Avg Recovery Time
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">3.2 mins</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Autonomous reconciliation</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Travelers Protected
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">28 Travelers</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 4 circuits</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Auto-Recovery Rate
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">96.8%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero traveler friction</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 w-fit">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'critical', label: 'Critical' },
          { id: 'high', label: 'High Priority' },
          { id: 'resolved', label: 'Resolved' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSeverityFilter(tab.id as any)}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              severityFilter === tab.id
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80">
            <h3 className="text-sm font-medium text-slate-700">All Clear</h3>
            <p className="text-xs text-slate-400 mt-1">
              No unresolved alerts in this category. Telemetry systems running smoothly.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-5 border transition-colors ${
                alert.isResolved
                  ? 'border-slate-200/80 opacity-70'
                  : alert.severity === 'critical'
                  ? 'border-rose-300'
                  : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          alert.isResolved
                            ? 'bg-slate-400'
                            : alert.severity === 'critical'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span
                        className={`font-semibold uppercase text-[10px] tracking-wider ${
                          alert.isResolved
                            ? 'text-slate-500'
                            : alert.severity === 'critical'
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {alert.isResolved ? 'Resolved' : alert.severity}
                      </span>
                    </div>

                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-700">
                      {alert.tourId} · {alert.tourTitle}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">{alert.timeAgo}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">{alert.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {alert.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-800">
                    {alert.affectedTravelers} Travelers Impacted
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {alert.category}
                  </span>
                </div>
              </div>

              {/* Action Box */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Suggested Action: </span>
                  <span>{alert.actionSuggested}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!alert.isResolved && (
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alert.id, alert.title)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Apply Resolution
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onInspectTour(alert.tourId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    View Tour
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
