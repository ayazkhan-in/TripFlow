import React, { useState, useRef } from 'react';
import { ConsumerTab, SavedJourney } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import { KERALA_HERO_IMAGE } from '../../data/mockData';
import {
  OperatorCuratedPackage,
  INITIAL_OPERATOR_PACKAGES,
  getPackageAmenities,
} from '../../data/operatorPackagesData';
import { useOperator } from '../../context/OperatorContext';
import { LuxuryCard } from '../common/LuxuryCard';

interface HomeScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onOpenPreferences: () => void;
  onOpenDirections: () => void;
  onOpenContactDriver: () => void;
  onSelectJourneyDetails: (journey: SavedJourney) => void;
  onSelectPremadeTrip?: (itinerary: TripItinerary) => void;
  onOpenPayment?: (itinerary: TripItinerary, totalPrice: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenPreferences,
  onOpenDirections,
  onOpenContactDriver,
  onSelectJourneyDetails,
  onSelectPremadeTrip,
  onOpenPayment,
}) => {
  const [filter, setFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const { packages: operatorPackages } = useOperator();
  const sourcePackages = operatorPackages && operatorPackages.length > 0
    ? operatorPackages
    : INITIAL_OPERATOR_PACKAGES;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const filteredPackages = sourcePackages.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'domestic') return pkg.isDomestic;
    if (filter === 'international') return !pkg.isDomestic;
    return true;
  });

  const handleSelectPackage = (pkg: OperatorCuratedPackage) => {
    if (onSelectPremadeTrip) {
      onSelectPremadeTrip(pkg.itineraryTemplate);
    } else {
      const savedJourney: SavedJourney = {
        id: pkg.id,
        title: pkg.title,
        origin: pkg.routeStops[0]?.city || pkg.destination,
        destination: pkg.destination,
        dates: pkg.dates,
        duration: `${pkg.days} Days`,
        travelers: pkg.travelers,
        price: `₹${pkg.totalPriceINR.toLocaleString('en-IN')}`,
        category: pkg.isDomestic ? 'domestic' : 'international',
        isBookmarked: false,
        image: pkg.heroImage,
        rating: `${pkg.operator.rating}/5`,
        description: `${pkg.days} Days · ${pkg.destination}, ${pkg.country} · ${pkg.tag}. Curated by ${pkg.operator.name}.`,
        amenities: getPackageAmenities(pkg),
      };
      onSelectJourneyDetails(savedJourney);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* GREETING HERO SECTION & LIVE TELEMETRY BAR                    */}
      {/* ------------------------------------------------------------- */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              TripFlow Black Tier Concierge
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-600">
                bolt
              </span>
              ADS-B Flight Radar & Private Chauffeur Mesh Active
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl text-slate-900 font-extrabold tracking-tight">
            Good morning, Sarah
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-1 max-w-xl">
            You are currently on <span className="font-semibold text-slate-900">Day 2 of your Kerala Escape</span>.
            Your tea sommelier walk starts at 10:30 AM in Munnar Highlands.
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onOpenPreferences}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-500">
              tune
            </span>
            <span>Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('builder')}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-blue-600">
              auto_awesome
            </span>
            <span>AI Itinerary Builder</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('discover')}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer ring-2 ring-blue-300/40"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Explore Circuits</span>
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME TRAVEL TELEMETRY TICKER                             */}
      {/* ------------------------------------------------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <span className="material-symbols-outlined text-xl">flight</span>
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Flight Telemetry</div>
            <div className="text-xs font-bold text-slate-900 truncate">IndiGo 6E-204 · Landed</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Priority Baggage Belt 02</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <span className="material-symbols-outlined text-xl">directions_car</span>
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Assigned Chauffeur</div>
            <div className="text-xs font-bold text-slate-900 truncate">Arun V. · On Standby</div>
            <div className="text-[11px] text-slate-500 font-mono">Toyota Innova (KL-07-CD)</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <span className="material-symbols-outlined text-xl">partly_cloudy_day</span>
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Highland Climate</div>
            <div className="text-xs font-bold text-slate-900">24°C Munnar Hills</div>
            <div className="text-[11px] text-slate-500">Light mist · Scenic visibility</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <span className="material-symbols-outlined text-xl">support_agent</span>
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Dedicated Concierge</div>
            <div className="text-xs font-bold text-slate-900">Arun V. (Dispatch Desk)</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              90-sec response guarantee
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HERO SHOWCASE: ACTIVE JOURNEY FEATURED BENTO (COMPACT)       */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">
              near_me
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Itinerary</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('trips')}
            className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>Open Living Timeline</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Compact Bento Container */}
        <div className="relative bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:flex-row transition-all hover:border-slate-300 hover:shadow-sm">
          {/* Media Visual Block (Compact Widescreen Accent) */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 relative min-h-[160px] sm:min-h-[180px] lg:min-h-full aspect-video lg:aspect-auto bg-slate-900 overflow-hidden group">
            <img
              alt="Kerala Escape backwaters and Munnar tea hills"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              src={KERALA_HERO_IMAGE}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none"></div>

            {/* Floating Live Pill & Weather */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
              <span className="backdrop-blur-md bg-white/95 px-2.5 py-0.5 rounded-full text-slate-900 text-[11px] font-bold shadow-xs flex items-center gap-1.5 border border-white/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Day 2 of 6 · Live
              </span>
              <span className="backdrop-blur-md bg-white/95 px-2 py-0.5 rounded-full text-slate-800 text-[11px] font-semibold shadow-xs flex items-center gap-1 border border-white/60">
                <span className="material-symbols-outlined text-[13px] text-amber-500">
                  partly_cloudy_day
                </span>
                24°C Munnar
              </span>
            </div>

            {/* Bottom Overlay on Media */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold block">
                Luxury Circuit
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-sm leading-tight">Kerala Escape</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-white/90 mt-0.5 font-medium">
                <span>Kochi</span>
                <span className="text-blue-300">→</span>
                <span>Munnar</span>
                <span className="text-blue-300">→</span>
                <span>Alleppey</span>
              </div>
            </div>
          </div>

          {/* Compact Trip Details & Up Next Content Area */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between bg-white text-left min-w-0">
            {/* Header Strip: Reference, Status & Key Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Confirmed Booking
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-bold tracking-tight">
                  REF #KL-9402
                </span>
              </div>

              {/* Compact Metrics Row */}
              <div className="flex items-center gap-3.5 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px] uppercase font-bold">Dates:</span>
                  <span className="text-slate-900 font-bold text-[11px]">June 14–19</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-slate-400 text-[11px] uppercase font-bold">Party:</span>
                  <span className="text-slate-900 font-bold text-[11px]">2 Guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px] uppercase font-bold">Total:</span>
                  <span className="text-blue-600 font-mono font-extrabold text-[11px]">₹42,800</span>
                </div>
              </div>
            </div>

            {/* Embedded Compact 'Up Next' Live Card */}
            <div className="my-2 bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 relative overflow-hidden text-left space-y-2">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    Up Next
                  </span>
                  <span className="text-slate-900 text-xs font-bold">10:30 AM</span>
                  <span className="text-slate-400 text-xs">• In 2 hrs</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span className="material-symbols-outlined text-sm text-sky-600">directions_car</span>
                  <span>Chauffeur Arun V. (Toyota Innova)</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Munnar Tea Estate Guided Walk & Sommelier Tasting
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-1">
                  Private hand-plucking session with estate botanist. Innova waiting at resort lobby.
                </p>
              </div>

              {/* Action Buttons in single clean row */}
              <div className="pt-2 flex items-center gap-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => onNavigateTab('trips')}
                  className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>View Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenDirections}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98"
                >
                  <span className="material-symbols-outlined text-sm text-blue-600">directions</span>
                  <span>Directions</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenContactDriver}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98 ml-auto sm:ml-0"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-600">call</span>
                  <span>Call Arun</span>
                </button>
              </div>
            </div>

            {/* Compact Footer Guarantee & Live Status */}
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm text-blue-600">verified_user</span>
                TripFlow Guarantee Active
              </span>
              <span className="font-mono text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Innova Mesh GPS: 12m away · KL-07-CD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4-PILLAR CONCIERGE QUICK ACCESS TILES                         */}
      {/* ------------------------------------------------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Travel Vault */}
        <div
          onClick={() => onNavigateTab('vault')}
          className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-500/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              12 Offline Docs
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Travel Vault
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Passports, e-tickets, hotel vouchers, and emergency medical papers cached offline.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center text-xs text-blue-600 font-bold gap-1">
            <span>Open Vault</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Tile 2: Active Timeline & Living Circuit */}
        <div
          onClick={() => onNavigateTab('trips')}
          className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-500/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">timeline</span>
            </span>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Day 2 of 6
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Living Itinerary
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Auto-reconciling chronological schedule with live delay absorption and chauffeur coordination.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center text-xs text-blue-600 font-bold gap-1">
            <span>View Timeline</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Tile 3: Confirmed Bookings & Passes */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-500/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">confirmation_number</span>
            </span>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              4 Passes
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Passes & Vouchers
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              IndiGo boarding tickets, Brunton Boatyard suite confirmations, and luxury houseboat passes.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center text-xs text-blue-600 font-bold gap-1">
            <span>View Vouchers</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Tile 4: Itinerary Builder */}
        <div
          onClick={() => onNavigateTab('builder')}
          className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-500/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">magic_button</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              AI Powered
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Custom Trip Builder
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Design a bespoke circuit, balance budget, and drag-and-drop activities with live routing.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center text-xs text-blue-600 font-bold gap-1">
            <span>Launch Builder</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CURATED OPERATOR PACKAGES SECTION                             */}
      {/* ------------------------------------------------------------- */}
      <section className="mt-8 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl text-slate-900 font-extrabold tracking-tight">
              Curated Operator Packages
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Handcrafted turnkey circuits, boutique accommodations & private transit
            </p>
          </div>

          {/* Segmented Filter Control & Carousel Scroll Controls */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({sourcePackages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('domestic')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'domestic'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Domestic
              </button>
              <button
                type="button"
                onClick={() => setFilter('international')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'international'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                International
              </button>
            </div>

            {/* Scroll navigation arrows */}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Scroll left"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Scroll right"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontally Scrollable Cards Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-3 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch"
          >
            {filteredPackages.map(pkg => (
              <LuxuryCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title}
                description={`${pkg.days} Days · ${pkg.destination} · Curated by ${pkg.operator.name}`}
                image={pkg.heroImage}
                rating={`${pkg.operator.rating}/5`}
                kicker={`${pkg.operator.name} · ${pkg.destination}`}
                badge={pkg.isNewlyCreated ? 'Operator Published' : pkg.badgeText}
                badgeColor={pkg.isDomestic ? 'emerald' : 'dark'}
                amenities={getPackageAmenities(pkg)}
                price={`₹${pkg.totalPriceINR.toLocaleString('en-IN')}`}
                pricePeriod="/package"
                actionVariant="button"
                actionLabel="Reserve Tour"
                theme="light"
                className="w-[320px] sm:w-[340px] shrink-0"
                onActionClick={() => {
                  if (onOpenPayment) {
                    onOpenPayment(pkg.itineraryTemplate, pkg.totalPriceINR);
                  } else {
                    handleSelectPackage(pkg);
                  }
                }}
                onClick={() => handleSelectPackage(pkg)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 24/7 TRAVEL MESH GUARANTEE BANNER                             */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span>Intelligent Autonomous Dispatch Mesh Active</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Rest easy. Your entire Kerala journey is monitored in real-time.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If a flight delay occurs or a weather warning is issued, your chauffeur timing, hotel check-in window, and restaurant reservations adjust automatically without you having to make a single call.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-full font-bold">
            99.8% On-Time Index
          </span>
          <button
            type="button"
            onClick={onOpenContactDriver}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Emergency Concierge
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 text-slate-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-blue-600 tracking-tight">
              TripFlow
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              Discerning travel orchestration & intelligent dispatch mesh
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Privacy & Encryption
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('trips')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Dispatch Hub
            </button>
            <button
              type="button"
              onClick={onOpenContactDriver}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Emergency Assist
            </button>
            <span className="text-slate-400 font-mono text-[11px]">
              v2.4.0-stable
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
