import React, { useState, useEffect } from 'react';
import { RouteStop, TripItinerary } from '../../types/itinerary';

interface TripHeroHeaderProps {
  itinerary: TripItinerary;
  viewMode?: 'single' | 'board';
  activeDayNumber?: number;
  onViewModeChange?: (mode: 'single' | 'board') => void;
  onUpdateItinerary: (updated: TripItinerary) => void;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onViewRouteMap?: () => void;
}

export const TripHeroHeader: React.FC<TripHeroHeaderProps> = ({
  itinerary,
  viewMode = 'board',
  activeDayNumber = 1,
  onViewModeChange,
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

  useEffect(() => {
    setTitleInput(itinerary.title);
  }, [itinerary.title]);

  // Active day helper for single-day mode
  const currentDay = itinerary.days.find(d => d.dayNumber === activeDayNumber) || itinerary.days[0] || {
    id: 'day-1',
    dayNumber: 1,
    date: 'Day 1',
    title: itinerary.destination || 'Arrival',
    subtitle: 'Personalized Day',
    items: [],
  };

  // Single shared Hero background image for both views (Zero flicker / exact same card data)
  const heroBg =
    itinerary.heroImage ||
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80';

  const routeStops: RouteStop[] = itinerary.routeStops || [
    {
      id: 'stop-1',
      city: '1. Cochin',
      weather: '24°C Pleasant',
      hotel: 'Brunton Boatyard',
      transitMode: 'flight',
    },
    {
      id: 'stop-2',
      city: '2. Alleppey',
      weather: '26°C Sunny',
      hotel: 'Spice Coast Houseboat',
      transitMode: 'car',
    },
    {
      id: 'stop-3',
      city: '3. Kumarakom',
      weather: '25°C Tropical',
      hotel: 'Kumarakom Lake Resort',
      transitMode: 'car',
    },
  ];

  const currentStop = routeStops[activeDayNumber - 1];
  const weatherTemp = currentStop?.weather ? currentStop.weather.split(' ')[0] : '24°C';
  const weatherCity = currentStop?.city?.replace(/^\d+\.\s*/, '') || currentDay.title.split(' ')[0] || 'Cochin';

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
      weather: '24°C Sunny',
      hotel: 'Hotel',
      transitMode: 'car',
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

  const isSingle = viewMode === 'single';

  return (
    <div
      className={`relative w-full text-white bg-neutral-950 border shadow-sm select-none overflow-hidden transition-all duration-300 ease-in-out ${
        isSingle
          ? 'rounded-2xl sm:rounded-3xl border-slate-100/30 p-3.5 sm:p-4.5 flex flex-col justify-between gap-3'
          : 'rounded-2xl border-white/10 p-3 sm:p-3.5 flex flex-col justify-between gap-2.5'
      }`}
    >
      {/* Background Image with Dark Cinematic Overlay (Same image for both views) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={heroBg}
          alt={itinerary.title}
          className="w-full h-full object-cover object-center scale-102 transition-all duration-300"
        />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isSingle
              ? 'bg-gradient-to-r from-black/50 via-black/30 to-black/45'
              : 'bg-gradient-to-r from-black/55 via-black/35 to-black/50'
          }`}
        />
      </div>

      {/* Top Header Row: Trip Title & Metadata + Controls (Slider, Export, Map) */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 flex-wrap">
        {/* Left Side: Trip Icon + Editable Title + Metadata (+ Day Badge in single mode) */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xl sm:text-2xl select-none shrink-0" role="img" aria-label="Trip Icon">
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
                className="text-base sm:text-lg font-bold text-white bg-black/80 border border-white/40 rounded-lg px-2.5 py-0.5 focus:outline-none"
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
              className="text-base sm:text-lg font-bold text-white hover:text-blue-200 cursor-pointer transition-colors truncate max-w-xs sm:max-w-md inline-flex items-center gap-1.5 group drop-shadow-sm tracking-tight"
              title="Click to rename trip"
            >
              <span>{itinerary.title}</span>
              <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400">
                edit
              </span>
            </h1>
          )}

          {/* If Single mode, show frosted Day Badge and weather */}
          {isSingle && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-bold shadow-2xs border border-blue-400/40">
                Day {activeDayNumber} of {itinerary.days.length}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                <span className="material-symbols-outlined text-amber-400 text-xs">wb_sunny</span>
                <span>{weatherTemp} {weatherCity}</span>
              </span>
            </div>
          )}

          {/* Metadata */}
          <span className="text-xs text-white/90 font-medium drop-shadow-md hidden md:inline">
            • {itinerary.days.length} Days • {itinerary.travelStyle || `Bespoke AI Journey (${itinerary.days.length} Days)`} • {itinerary.travelers || 2} Travelers
          </span>
        </div>

        {/* Right Side: ONEDAY / ALL DAY SLIDER + EXPORT + MAP BUTTONS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Slider inside Banner (Requirement 3) */}
          {onViewModeChange && (
            <div className="bg-black/55 backdrop-blur-md p-0.5 sm:p-1 rounded-xl flex items-center border border-white/20 shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('single')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSingle
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Show one day at a time"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm">calendar_today</span>
                <span>One Day</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('board')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isSingle
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Show all days side by side as columns"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm">view_column</span>
                <span>All Days</span>
              </button>
            </div>
          )}

          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2.5 sm:px-3 py-1.5 bg-black/55 hover:bg-black/70 active:bg-black/85 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export Itinerary"
            >
              <span className="material-symbols-outlined text-sm text-neutral-200">ios_share</span>
              <span className="hidden sm:inline">Export</span>
              <span className="material-symbols-outlined text-xs text-neutral-300">
                {isExportMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-52 bg-white text-neutral-900 rounded-xl shadow-2xl border border-slate-200 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportPDF && onExportPDF();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700"
                >
                  <span className="material-symbols-outlined text-base text-rose-500">picture_as_pdf</span>
                  <div>
                    <span className="font-semibold block">Download PDF Guide</span>
                    <span className="text-[10px] text-slate-400">Printable luxury itinerary</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportCSV && onExportCSV();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600">table_view</span>
                  <div>
                    <span className="font-semibold block">Export CSV Spreadsheet</span>
                    <span className="text-[10px] text-slate-400">Timelines, items & prices</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    navigator.clipboard.writeText(window.location.href);
                    alert('Itinerary share link copied to clipboard!');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700 border-t border-slate-100 mt-1"
                >
                  <span className="material-symbols-outlined text-base text-blue-600">share</span>
                  <div>
                    <span className="font-semibold block">Copy Share Link</span>
                    <span className="text-[10px] text-slate-400">Shareable guest portal link</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Map Button */}
          <button
            type="button"
            onClick={onViewRouteMap}
            className="px-2.5 sm:px-3 py-1.5 bg-black/55 hover:bg-black/70 active:bg-black/85 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="View Route Map"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">map</span>
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Bottom Area: ROUTE & LOGISTICS CHIPS (Present in BOTH views) */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 flex-wrap text-xs pt-0.5">
        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider shrink-0 drop-shadow-md">
          ROUTE & LOGISTICS:
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap overflow-x-auto no-scrollbar py-0.5">
          {routeStops.map((stop, idx) => {
            const isStopForCurrentDay = isSingle && idx === activeDayNumber - 1;
            return (
              <div
                key={stop.id}
                className={`inline-flex items-center gap-1.5 sm:gap-2 backdrop-blur-md rounded-full px-2.5 sm:px-3 py-1 text-xs text-white shadow-2xs transition-all ${
                  isStopForCurrentDay
                    ? 'bg-blue-600/85 border border-blue-300 ring-2 ring-blue-400/50 scale-[1.02]'
                    : 'bg-black/60 hover:bg-black/75 border border-white/20'
                }`}
              >
                <span className="font-semibold text-white">{stop.city.replace(/^\d+\.\s*/, '')}</span>
                {stop.weather && (
                  <span className={`text-[11px] font-medium ${isStopForCurrentDay ? 'text-white' : 'text-sky-300'}`}>
                    {stop.weather}
                  </span>
                )}
                {stop.hotel && (
                  <span className="text-[11px] text-slate-300 truncate max-w-[120px] hidden sm:inline">
                    🏨 {stop.hotel}
                  </span>
                )}
                {stop.transitMode && (
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider bg-indigo-600/90 px-1.5 py-0.5 rounded-md">
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
            );
          })}

          {/* + Add City Button */}
          {isAddCityOpen ? (
            <form
              onSubmit={handleAddCityStop}
              className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-3 py-0.5 border border-white/30"
            >
              <input
                type="text"
                value={newCityName}
                onChange={e => setNewCityName(e.target.value)}
                placeholder="City name..."
                autoFocus
                className="px-1 text-xs text-white placeholder:text-neutral-400 bg-transparent focus:outline-none w-28"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[11px] font-bold cursor-pointer"
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
              className="inline-flex items-center gap-1 border border-dashed border-slate-500 hover:border-white bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              <span>Add City</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
