import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(itinerary.title);
  }, [itinerary.title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <motion.div
      initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`relative w-full text-white bg-neutral-950 border shadow-xs select-none overflow-hidden transition-all duration-300 ease-in-out ${
        isSingle
          ? 'rounded-2xl sm:rounded-3xl border-white/10 p-3.5 sm:p-4.5 flex flex-col justify-between gap-3'
          : 'rounded-2xl border-white/10 p-3 sm:p-3.5 flex flex-col justify-between gap-2.5'
      }`}
    >
      {/* Background Image with Dark Cinematic Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={heroBg}
          alt={itinerary.title}
          className="w-full h-full object-cover object-center scale-102 transition-all duration-300"
        />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isSingle
              ? 'bg-gradient-to-r from-black/60 via-black/40 to-black/55'
              : 'bg-gradient-to-r from-black/65 via-black/45 to-black/60'
          }`}
        />
      </div>

      {/* 1. Top Section: Trip Title & Subtitle (Left) + Minimal Controls (Right) */}
      <div className="relative z-10 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left: Title + Subtitle Metadata & Badges */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl select-none shrink-0" role="img" aria-label="Trip Icon">
              ⛩️
            </span>

            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="text-base sm:text-lg font-bold text-white bg-black/80 border border-white/40 rounded-lg px-2.5 py-0.5 focus:outline-none w-full max-w-md"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="px-2.5 py-0.5 bg-white text-neutral-900 rounded-md text-xs font-bold cursor-pointer shrink-0"
                >
                  Save
                </button>
              </div>
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-base sm:text-lg lg:text-xl font-bold text-white hover:text-blue-200 cursor-pointer transition-colors truncate inline-flex items-center gap-1.5 group drop-shadow-sm tracking-tight"
                title="Click to rename trip"
              >
                <span className="truncate">{itinerary.title}</span>
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity text-white/60">
                  edit
                </span>
              </h1>
            )}
          </div>

          {/* Subtitle / Trip Metadata & Context Badges */}
          <div className="text-[11px] sm:text-xs text-white/80 font-medium drop-shadow-sm flex items-center gap-2 flex-wrap pl-0.5">
            <span>{itinerary.days.length} {itinerary.days.length === 1 ? 'Day' : 'Days'}</span>
            <span className="text-white/30">•</span>
            <span>{itinerary.travelStyle || 'Bespoke AI Journey'}</span>
            <span className="text-white/30">•</span>
            <span>{itinerary.travelers || 2} Travelers</span>
            {isSingle && (
              <>
                <span className="text-white/30">•</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-600/85 text-white text-[10px] font-bold border border-blue-400/40">
                  Day {activeDayNumber} of {itinerary.days.length}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-medium border border-white/20">
                  <span className="material-symbols-outlined text-amber-400 text-xs">wb_sunny</span>
                  <span>{weatherTemp} {weatherCity}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Minimal Control Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-start">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="bg-black/45 backdrop-blur-md p-0.5 rounded-xl flex items-center border border-white/15 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange('single')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSingle
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Single Day View"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm">calendar_today</span>
                <span className="hidden sm:inline">One Day</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('board')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isSingle
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="All Days Board View"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm">view_column</span>
                <span className="hidden sm:inline">All Days</span>
              </button>
            </div>
          )}

          {/* Minimal Export Icon Button */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border shadow-2xs ${
                isExportMenuOpen
                  ? 'bg-white text-slate-900 border-white'
                  : 'bg-black/45 hover:bg-black/65 border-white/15 text-white/90 hover:text-white hover:border-white/30'
              }`}
              title="Export Itinerary (PDF, CSV, Link)"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">ios_share</span>
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

          {/* Minimal Map Icon Button */}
          <button
            type="button"
            onClick={onViewRouteMap}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-black/45 hover:bg-black/65 active:bg-black/80 backdrop-blur-md border border-white/15 hover:border-white/30 text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-2xs"
            title="View Route & Logistics Map"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">map</span>
          </button>
        </div>
      </div>

      {/* 2. Bottom Row: ROUTE & LOGISTICS */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 flex-wrap text-xs pt-1 border-t border-white/10">
        <div className="flex items-center gap-1 text-white/60 shrink-0">
          <span className="material-symbols-outlined text-xs text-white/50">route</span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-white/60">
            Route:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto no-scrollbar py-0.5">
          {routeStops.map((stop, idx) => {
            const isStopForCurrentDay = isSingle && idx === activeDayNumber - 1;
            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`inline-flex items-center gap-1.5 backdrop-blur-md rounded-full px-2.5 py-0.5 text-xs text-white shadow-2xs transition-all ${
                  isStopForCurrentDay
                    ? 'bg-blue-600/85 border border-blue-300/80 ring-1 ring-blue-400/40'
                    : 'bg-black/40 hover:bg-black/60 border border-white/15'
                }`}
              >
                <span className="font-semibold text-[11px] text-white">
                  {stop.city.replace(/^\d+\.\s*/, '')}
                </span>
                {stop.transitMode && (
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                    {stop.transitMode}
                  </span>
                )}
                {routeStops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCityStop(stop.id)}
                    className="text-white/40 hover:text-white text-xs ml-0.5 cursor-pointer leading-none"
                    title="Remove stop"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            );
          })}

          {/* + Add City Button */}
          {isAddCityOpen ? (
            <form
              onSubmit={handleAddCityStop}
              className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-white/30"
            >
              <input
                type="text"
                value={newCityName}
                onChange={e => setNewCityName(e.target.value)}
                placeholder="City name..."
                autoFocus
                className="px-1 text-xs text-white placeholder:text-neutral-400 bg-transparent focus:outline-none w-24"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[10px] font-bold cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddCityOpen(false)}
                className="text-neutral-300 hover:text-white text-xs px-0.5 cursor-pointer"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddCityOpen(true)}
              className="inline-flex items-center gap-1 border border-dashed border-white/25 hover:border-white/50 bg-black/25 hover:bg-black/45 text-white/70 hover:text-white rounded-full px-2 py-0.5 text-xs font-medium transition-all cursor-pointer"
              title="Add a destination stop"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              <span className="text-[10px]">Add City</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
