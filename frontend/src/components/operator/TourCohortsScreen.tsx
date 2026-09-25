import React, { useState } from 'react';
import { OPERATOR_COHORTS } from '../../data/operatorSuiteData';
import { TourCohortItem } from '../../types/travel';

interface TourCohortsScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
}

export const TourCohortsScreen: React.FC<TourCohortsScreenProps> = ({
  onInspectTour,
  showToast,
}) => {
  const [cohorts] = useState<TourCohortItem[]>(OPERATOR_COHORTS);
  const [selectedCohort, setSelectedCohort] = useState<TourCohortItem | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !selectedCohort) return;
    showToast(`Broadcast sent to all ${selectedCohort.paxCount} travelers in ${selectedCohort.name}!`);
    setBroadcastMessage('');
    setIsBroadcastOpen(false);
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">
              groups
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Tour Cohorts
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Active private and small-group travel cohorts, circuit milestones, and concierge broadcasts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Opening New Cohort Configuration...')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Create Cohort</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Active Cohorts</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">travel_explore</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">4 Circuits</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">2 in Japan, 1 India, 1 Europe</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Active Travelers</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">people</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">38 Pax</div>
          <div className="text-[11px] text-neutral-400 mt-1">86% aggregate seat occupancy</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">VIP Guests Ratio</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">star</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">63.1%</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">24 Dedicated VIP Concierge flags</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Schedule Accuracy</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">timer</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">99.1%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Telemetry synchronization active</div>
        </div>
      </div>

      {/* Cohorts List */}
      <div className="space-y-4">
        {cohorts.map(cohort => (
          <div
            key={cohort.id}
            className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      cohort.status === 'In Progress'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{cohort.status}</span>
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">{cohort.dates}</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 mt-1">
                  {cohort.name}
                </h3>
                <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs">route</span>
                  <span>{cohort.circuit}</span>
                </p>
              </div>

              {/* Passenger & Lead Guide pills */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-800">
                    {cohort.paxCount} / {cohort.maxPax} Pax
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold block">
                    ★ {cohort.vipCount} VIP Travelers
                  </span>
                </div>

                <div className="h-8 w-px bg-neutral-200 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort(cohort);
                      setIsBroadcastOpen(true);
                    }}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-emerald-600">
                      chat
                    </span>
                    <span>Broadcast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onInspectTour('#1024')}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Progress and Milestone */}
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  Current: <strong className="text-neutral-800">{cohort.currentStop}</strong>
                </span>
                <span className="font-bold text-blue-600">{cohort.progressPercent}% Completed</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-200/70 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cohort.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
                <span>Lead: {cohort.leadGuide}</span>
                <span>Next Milestone: {cohort.nextMilestone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast WhatsApp Announcement Modal */}
      {isBroadcastOpen && selectedCohort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSendBroadcast}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Broadcast Announcement</h3>
                <span className="text-xs text-neutral-400">{selectedCohort.name} ({selectedCohort.paxCount} travelers)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-600">
                This message will be instantly delivered via WhatsApp & SMS with automatic flight & concierge telemetry synchronization.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">
                  Message Content
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Good morning! Your private transfer for the Tea Ceremony departs the lobby at 10:30 AM."
                  rows={4}
                  required
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Send WhatsApp Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
