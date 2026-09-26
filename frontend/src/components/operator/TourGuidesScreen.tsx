import React, { useState, useMemo, useEffect } from 'react';
import { OPERATOR_GUIDES } from '../../data/operatorSuiteData';
import { TourGuideStaffItem } from '../../types/travel';
import { TripFlowApi } from '../../services/api';

interface TourGuidesScreenProps {
  showToast: (msg: string) => void;
}

export const TourGuidesScreen: React.FC<TourGuidesScreenProps> = ({ showToast }) => {
  const [guides, setGuides] = useState<TourGuideStaffItem[]>(OPERATOR_GUIDES);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<TourGuideStaffItem | null>(null);

  useEffect(() => {
    TripFlowApi.getTourGuides().then(backendGuides => {
      if (backendGuides && backendGuides.length > 0) {
        setGuides(backendGuides.map((g: any) => ({
          ...g,
          rating: Number(g.rating || 4.95),
          totalTours: Number(g.totalTours || 100),
        })));
      }
    });
  }, []);

  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      const matchesRole = roleFilter === 'all' || g.role === roleFilter;
      const matchesSearch =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.languages.some((l: string) => l.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesSearch;
    });
  }, [guides, roleFilter, searchQuery]);

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Guides & Operational Staff
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Licensed historians, private chauffeurs, mountain guides, and concierge curators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Opening Staff Roster Dispatch...')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Assign Guide</span>
        </button>
      </div>

      {/* KPI Cards - Clean & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Staff
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">24 Guides</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified credentials</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Currently on Circuit
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">8 Active</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Connected via telemetry</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Standby Duty
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">12 Ready</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate dispatch capability</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Average Traveler Rating
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.97 ★</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Over 560 verified reviews</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides by name, language, or location..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
          {[
            { id: 'all', label: 'All Staff' },
            { id: 'Master Guide', label: 'Master Guides' },
            { id: 'Private Concierge', label: 'Concierges' },
            { id: 'Licensed Chauffeur', label: 'Chauffeurs' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                roleFilter === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredGuides.map(guide => (
          <div
            key={guide.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 transition-colors flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {guide.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          guide.status === 'On Tour'
                            ? 'bg-emerald-500'
                            : guide.status === 'Available'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="font-medium text-[11px]">{guide.status}</span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-600 block mt-0.5">
                    {guide.role}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>★ {guide.rating}</span>
                    <span>·</span>
                    <span>{guide.totalTours} Tours Completed</span>
                  </div>
                </div>
              </div>

              {/* Languages & Tour */}
              <div className="mt-3.5 space-y-1.5 text-xs">
                <div className="text-slate-500 text-[11px]">
                  Languages: {guide.languages.join(', ')}
                </div>

                {guide.currentTour && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-slate-500">
                      near_me
                    </span>
                    <span>Leading: <strong>{guide.currentTour}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>{guide.location}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast(`Initiating call to ${guide.name} (${guide.phone})`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors"
                >
                  Direct Call
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(guide)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedGuide.avatar}
                  alt={selectedGuide.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedGuide.name}</h3>
                  <span className="text-xs text-slate-500">{selectedGuide.role}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Rating</span>
                  <div className="font-semibold text-slate-900">★ {selectedGuide.rating} / 5.0</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Tours</span>
                  <div className="font-semibold text-slate-900">{selectedGuide.totalTours} Completed</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Phone Contact</span>
                <p className="font-mono text-slate-800 mt-0.5">{selectedGuide.phone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Certifications</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{selectedGuide.certifications.join(', ')}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Languages</span>
                <p className="text-slate-800 mt-0.5">{selectedGuide.languages.join(', ')}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Assigned ${selectedGuide.name} to VIP Tour`);
                  setSelectedGuide(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Assign Circuit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
