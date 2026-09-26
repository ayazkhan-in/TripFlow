import React, { useState, useEffect } from 'react';
import { OPERATOR_COHORTS } from '../../data/operatorSuiteData';
import { TourCohortItem } from '../../types/travel';
import { TripFlowApi } from '../../services/api';

interface TourCohortsScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
}

export const TourCohortsScreen: React.FC<TourCohortsScreenProps> = ({
  onInspectTour,
  showToast,
}) => {
  const [cohorts, setCohorts] = useState<TourCohortItem[]>(OPERATOR_COHORTS);
  const [selectedCohort, setSelectedCohort] = useState<TourCohortItem | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  useEffect(() => {
    TripFlowApi.getTourCohorts().then(backendCohorts => {
      if (backendCohorts && backendCohorts.length > 0) {
        setCohorts(backendCohorts.map((c: any) => ({
          ...c,
          leadGuide: c.leadGuide?.name || 'Rohan Deshmukh',
        })));
      }
    });
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !selectedCohort) return;
    showToast(`Broadcast sent to ${selectedCohort.paxCount} travelers in ${selectedCohort.name}.`);
    setBroadcastMessage('');
    setIsBroadcastOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tour Cohorts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active private and small-group travel cohorts, circuit milestones, and concierge broadcasts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Opening New Cohort Configuration...')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Create Cohort</span>
        </button>
      </div>

      {/* KPI Cards - Clean & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Active Cohorts
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4 Circuits</div>
          <div className="text-[11px] text-slate-400 mt-0.5">2 Japan, 1 India, 1 Europe</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Active Travelers
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">38 Pax</div>
          <div className="text-[11px] text-slate-400 mt-0.5">86% aggregate seat load</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            VIP Guests
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">24 VIPs</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dedicated concierge flags</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Schedule Accuracy
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">99.1%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Telemetry sync active</div>
        </div>
      </div>

      {/* Cohorts List */}
      <div className="space-y-3">
        {cohorts.map(cohort => (
          <div
            key={cohort.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 transition-colors space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cohort.status === 'In Progress' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                    />
                    <span className="font-medium">{cohort.status}</span>
                  </div>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{cohort.dates}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {cohort.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs text-slate-400">route</span>
                  <span>{cohort.circuit}</span>
                </p>
              </div>

              {/* Passenger & Actions */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900">
                    {cohort.paxCount} / {cohort.maxPax} Pax
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {cohort.vipCount} VIP Travelers
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort(cohort);
                      setIsBroadcastOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    Broadcast
                  </button>

                  <button
                    type="button"
                    onClick={() => onInspectTour('#1024')}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Progress and Milestone */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Current: <strong className="text-slate-800 font-medium">{cohort.currentStop}</strong>
                </span>
                <span className="font-semibold text-slate-900">{cohort.progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cohort.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Lead: {cohort.leadGuide}</span>
                <span>Next: {cohort.nextMilestone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastOpen && selectedCohort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleSendBroadcast}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Broadcast Announcement</h3>
                <span className="text-xs text-slate-400">{selectedCohort.name} ({selectedCohort.paxCount} travelers)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Type an announcement to broadcast to traveler devices..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Send Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
