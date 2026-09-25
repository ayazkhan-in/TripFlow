import React, { useState } from 'react';
import { RouteStop, TripItinerary } from '../../types/itinerary';

interface TripHeroHeaderProps {
  itinerary: TripItinerary;
  onUpdateItinerary: (updated: TripItinerary) => void;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onViewRouteMap?: () => void;
}

export const TripHeroHeader: React.FC<TripHeroHeaderProps> = ({
  itinerary,
  onUpdateItinerary,
  onExportPDF,
  onExportCSV,
  onViewRouteMap,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(itinerary.title);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  // Destination hero background image
  const defaultHeroBg =
    itinerary.heroImage ||
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80';

  const routeStops: RouteStop[] = itinerary.routeStops || [
    {
      id: 'stop-1',
      city: '1. Tokyo',
      weather: '22° / 14°',
      hotel: 'Aman Tokyo',
      transitMode: 'flight',
    },
    {
      id: 'stop-2',
      city: '2. Kyoto',
      weather: '20° / 13°',
      hotel: 'Hoshinoya',
      transitMode: 'train',
    },
    {
      id: 'stop-3',
      city: '3. Osaka',
      weather: '23° / 15°',
      hotel: 'W Osaka',
    },
  ];

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== itinerary.title) {
      onUpdateItinerary({
        ...itinerary,
        title: titleInput.trim(),
      });
    }
  };

  const handleAddCityStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const stopNumber = routeStops.length + 1;
    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      city: `${stopNumber}. ${newCityName.trim()}`,
      weather: '21° / 12°',
      hotel: 'Hotel',
      transitMode: 'train',
    };

    onUpdateItinerary({
      ...itinerary,
      routeStops: [...routeStops, newStop],
    });

    setNewCityName('');
    setIsAddCityOpen(false);
  };

  const handleRemoveCityStop = (stopId: string) => {
    const updated = routeStops.filter(s => s.id !== stopId);
    onUpdateItinerary({
      ...itinerary,
      routeStops: updated,
    });
  };

  return (
    <div className="relative mx-3 sm:mx-4 mt-3 rounded-2xl bg-neutral-900 text-white shrink-0 border border-white/10 shadow-md select-none">
      {/* Background Image with Dark Cinematic Overlay */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
        <img
          src={defaultHeroBg}
          alt="Destination Background"
          className="w-full h-full object-cover object-center opacity-65 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80 backdrop-blur-[0.5px]" />
      </div>

      {/* Content Layer (Comfortable height with breathing room) */}
      <div className="relative z-10 px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Left Side: ⛩️ Icon + Title + Metadata & Route Logistics */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Row 1: ⛩️ Icon + Bold Title + Dates / Travelers */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="text-xl sm:text-2xl select-none shrink-0"
              role="img"
              aria-label="Trip Icon"
            >
              ⛩️
            </span>

            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="text-base sm:text-lg font-bold text-white bg-black/70 border border-white/40 rounded-lg px-2.5 py-0.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="px-2.5 py-0.5 bg-white text-neutral-900 rounded-md text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-base sm:text-lg font-bold text-white hover:text-blue-200 cursor-pointer transition-colors truncate max-w-sm sm:max-w-xl inline-flex items-center gap-1.5 group drop-shadow-sm"
                title="Click to rename trip"
              >
                <span>{itinerary.title}</span>
                <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300">
                  edit
                </span>
              </h1>
            )}

            <span className="text-xs text-neutral-300 font-medium drop-shadow-xs">
              • {itinerary.dates} ({itinerary.days.length} Days) • {itinerary.travelers} Travelers
            </span>
          </div>

          {/* Row 2: Route & Logistics Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider shrink-0 drop-shadow-xs">
              Route & Logistics:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {routeStops.map(stop => (
                <div
                  key={stop.id}
                  className="inline-flex items-center gap-1.5 bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white shadow-2xs transition-colors"
                >
                  <span className="font-bold text-white">{stop.city}</span>

                  {stop.weather && (
                    <span className="text-[11px] text-blue-200 font-medium">
                      {stop.weather}
                    </span>
                  )}

                  {stop.hotel && (
                    <span className="text-[11px] text-neutral-200 truncate max-w-[110px]">
                      🏨 {stop.hotel}
                    </span>
                  )}

                  {stop.transitMode && (
                    <span className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider bg-indigo-500/25 px-1.5 py-0.2 rounded">
                      {stop.transitMode}
                    </span>
                  )}

                  {routeStops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCityStop(stop.id)}
                      className="text-neutral-400 hover:text-white text-xs ml-0.5 cursor-pointer leading-none"
                      title="Remove stop"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {/* + Add City Button */}
              {isAddCityOpen ? (
                <form
                  onSubmit={handleAddCityStop}
                  className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg px-2 py-0.5 border border-white/25"
                >
                  <input
                    type="text"
                    value={newCityName}
                    onChange={e => setNewCityName(e.target.value)}
                    placeholder="City name"
                    autoFocus
                    className="px-1 text-xs text-white placeholder:text-neutral-400 bg-transparent focus:outline-none w-24"
                  />
                  <button
                    type="submit"
                    className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCityOpen(false)}
                    className="text-neutral-300 hover:text-white text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddCityOpen(true)}
                  className="inline-flex items-center gap-1 border border-dashed border-white/35 hover:border-white hover:bg-black/30 text-neutral-200 hover:text-white rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Add City</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: ONLY Export and Map Buttons (Budget moved to bottom-right floating card) */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          {/* Export Button with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3 py-2 bg-black/45 hover:bg-black/60 active:bg-black/75 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export Itinerary"
            >
              <span className="material-symbols-outlined text-sm text-neutral-300">
                ios_share
              </span>
              <span>Export</span>
              <span className="material-symbols-outlined text-xs text-neutral-400">
                {isExportMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Export Dropdown Menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 bg-white text-neutral-900 rounded-xl shadow-2xl border border-neutral-200 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportPDF && onExportPDF();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer text-neutral-700"
                >
                  <span className="material-symbols-outlined text-base text-rose-500">
                    picture_as_pdf
                  </span>
                  <span>Export PDF Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportCSV && onExportCSV();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer text-neutral-700"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600">
                    table_view
                  </span>
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Map Button */}
          <button
            type="button"
            onClick={onViewRouteMap}
            className="px-3 py-2 bg-black/45 hover:bg-black/60 active:bg-black/75 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="View Route Map"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">map</span>
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
