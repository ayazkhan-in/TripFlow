import React, { useState, useMemo } from 'react';
import { OPERATOR_GUIDES } from '../../data/operatorSuiteData';
import { TourGuideStaffItem } from '../../types/travel';

interface TourGuidesScreenProps {
  showToast: (msg: string) => void;
}

export const TourGuidesScreen: React.FC<TourGuidesScreenProps> = ({ showToast }) => {
  const [guides] = useState<TourGuideStaffItem[]>(OPERATOR_GUIDES);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<TourGuideStaffItem | null>(null);

  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      const matchesRole = roleFilter === 'all' || g.role === roleFilter;
      const matchesSearch =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesSearch;
    });
  }, [guides, roleFilter, searchQuery]);

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">
              shield_person
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Tour Guides & Staff
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Certified regional master tour guides, private concierges, and VIP chauffeur roster.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Opening Staff Onboarding & Credentials Verification...')}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Certified Roster</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">badge</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">24 Guides</div>
          <div className="text-[11px] text-neutral-400 mt-1">100% background verified</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Currently on Circuit</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">near_me</span>
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">8 Active</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Connected via Live GPS</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">On Standby Duty</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">event_available</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">12 Ready</div>
          <div className="text-[11px] text-neutral-400 mt-1">Immediate dispatch capability</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Average Traveler Rating</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">star</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">4.97 ★</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Over 560 verified reviews</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides by name, language, or current location..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                roleFilter === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
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
            className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-3xl p-5 shadow-2xs transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 truncate">
                      {guide.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        guide.status === 'On Tour'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : guide.status === 'Available'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{guide.status}</span>
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                    {guide.role}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                    <span>★ {guide.rating} Rating</span>
                    <span>•</span>
                    <span>{guide.totalTours} Tours Completed</span>
                  </div>
                </div>
              </div>

              {/* Badges / Languages */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex flex-wrap gap-1">
                  {guide.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {guide.currentTour && (
                  <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-blue-600">
                      near_me
                    </span>
                    <span>Currently leading: <strong>{guide.currentTour}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>{guide.location}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast(`Initiating direct voice line to ${guide.name} (${guide.phone})...`)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Direct Call
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(guide)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  View File
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Credentials Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedGuide.avatar}
                  alt={selectedGuide.name}
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{selectedGuide.name}</h3>
                  <span className="text-xs text-blue-600 font-semibold">{selectedGuide.role}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-1">
                  Certifications & Clearances
                </span>
                <div className="space-y-1">
                  {selectedGuide.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg text-neutral-800 font-medium">
                      <span className="material-symbols-outlined text-xs text-emerald-600">verified</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-1">
                  Direct Line & Dispatch Phone
                </span>
                <div className="p-2.5 bg-neutral-50 rounded-lg font-mono text-xs text-neutral-800">
                  {selectedGuide.phone}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Assigned ${selectedGuide.name} to dispatch schedule.`);
                  setSelectedGuide(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
              >
                Assign to Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
