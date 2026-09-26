import React from 'react';
import { motion } from 'framer-motion';
import { TripItinerary, RouteStop } from '../../types/itinerary';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: TripItinerary;
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  onClose,
  itinerary,
}) => {
  if (!isOpen) return null;

  const routeStops: RouteStop[] = itinerary.routeStops && itinerary.routeStops.length > 0
    ? itinerary.routeStops
    : [
        { id: 'stop-1', city: 'Tokyo', weather: '24°C Pleasant', hotel: 'Palace Hotel Tokyo', transitMode: 'flight' },
        { id: 'stop-2', city: 'Kyoto', weather: '22°C Clear', hotel: 'Hoshinoya Ryokan', transitMode: 'train' },
        { id: 'stop-3', city: 'Osaka', weather: '23°C Sunny', hotel: 'W Osaka', transitMode: 'train' },
      ];

  const totalActivities = itinerary.days.reduce((acc, d) => acc + d.items.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90dvh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-400 text-xl">map</span>
            <div>
              <h3 className="font-bold text-sm text-white">Route & Logistics Map</h3>
              <p className="text-[11px] text-slate-300">
                {itinerary.title} • {itinerary.days.length} Days Circuit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          {/* Visual Route Canvas */}
          <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            {/* Background Map Graphic / Satellite Silhouette */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 800 240" fill="none">
                <path
                  d="M50 120 C 150 70, 250 160, 400 110 C 550 60, 650 150, 750 110"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                <circle cx="150" cy="100" r="30" fill="#3b82f6" fillOpacity="0.1" />
                <circle cx="400" cy="110" r="35" fill="#10b981" fillOpacity="0.1" />
                <circle cx="650" cy="120" r="30" fill="#f59e0b" fillOpacity="0.1" />
              </svg>
            </div>

            {/* Circuit Stops Visualization */}
            <div className="relative z-10 w-full flex items-center justify-between px-6 sm:px-12">
              {routeStops.map((stop, index) => {
                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.35, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-blue-500 text-white flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <span className="text-sm font-extrabold text-blue-400">
                        0{index + 1}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white mt-2 drop-shadow-sm">
                      {stop.city.replace(/^\d+\.\s*/, '')}
                    </span>
                    <span className="text-[10px] text-sky-300 font-medium">
                      {stop.weather || '24°C Pleasant'}
                    </span>
                    {stop.hotel && (
                      <span className="text-[9px] text-slate-400 truncate max-w-[100px] mt-0.5">
                        🏨 {stop.hotel}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Total Route
              </span>
              <span className="text-base font-extrabold text-slate-800">515 km</span>
              <span className="text-[10px] text-slate-500 block">High-speed rail</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Journey Days
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {itinerary.days.length} Days
              </span>
              <span className="text-[10px] text-slate-500 block">Curated circuit</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Total Activities
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {totalActivities} Items
              </span>
              <span className="text-[10px] text-slate-500 block">Experiences & dining</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Travelers
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {itinerary.travelers || 2} Guests
              </span>
              <span className="text-[10px] text-slate-500 block">Bespoke luxury</span>
            </div>
          </div>

          {/* Detailed Stops Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Circuit Breakdown & Accommodations
            </h4>
            <div className="space-y-2.5">
              {routeStops.map((stop, idx) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, x: -12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.35, delay: 0.2 + idx * 0.06, ease: 'easeOut' }}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-xs text-slate-900">
                          {stop.city.replace(/^\d+\.\s*/, '')}
                        </h5>
                        {stop.transitMode && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {stop.transitMode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {stop.hotel ? `🏨 Accommodation: ${stop.hotel}` : 'Luxury partner hotel'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 block">
                      {stop.weather || '24°C Pleasant'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">On Track</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Map
          </button>
        </div>
      </motion.div>
    </div>
  );
};
