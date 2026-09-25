import React, { useState } from 'react';
import { ConsumerTab, SavedJourney } from '../../types/travel';
import {
  KERALA_HERO_IMAGE,
  SAVED_JOURNEYS,
} from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';

interface HomeScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onOpenPreferences: () => void;
  onOpenDirections: () => void;
  onOpenContactDriver: () => void;
  onSelectJourneyDetails: (journey: SavedJourney) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenPreferences,
  onOpenDirections,
  onOpenContactDriver,
  onSelectJourneyDetails,
}) => {
  const [filter, setFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [journeys, setJourneys] = useState<SavedJourney[]>(SAVED_JOURNEYS);

  const toggleBookmark = (id: string) => {
    setJourneys(prev =>
      prev.map(j => (j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j))
    );
  };

  const filteredJourneys = journeys.filter(j => {
    if (filter === 'all') return true;
    return j.category === filter;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12">
      {/* Greeting Hero Section & Action Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C3C6D7]/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#00174B] text-[11px] tracking-wide font-semibold uppercase">
              Curated Concierge Active
            </span>
            <span className="text-[#737686] text-xs">•</span>
            <span className="text-[#737686] text-xs flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs text-emerald-600">
                bolt
              </span>{' '}
              Syncing live flights & schedules
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl text-[#151c27] font-bold tracking-tight">
            Good morning, Sarah
          </h1>
          <p className="text-[#575E70] text-base mt-1">
            Ready for your next adventure?
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPreferences}
            className="px-4 py-2.5 rounded-full border border-[#C3C6D7] bg-white hover:bg-[#F0F3FF] text-[#151c27] text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#737686]">
              tune
            </span>
            <span>Preferences</span>
          </button>
          <button
            onClick={() => onNavigateTab('discover')}
            className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#004AC6] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Plan a new trip</span>
          </button>
        </div>
      </section>

      {/* Hero Showcase: Large Featured Active Trip Card */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC6] text-xl">
              near_me
            </span>
            <h2 className="text-lg text-[#151c27] font-bold">Active Itinerary</h2>
          </div>
          <button
            onClick={() => onNavigateTab('trips')}
            className="text-xs text-[#004AC6] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>Full journey timeline</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Featured Bento Container */}
        <div className="relative bg-white rounded-2xl border border-[#C3C6D7]/70 shadow-xs overflow-hidden flex flex-col lg:flex-row transition-all hover:border-[#737686]">
          {/* Media Visual Block (Kerala backwaters & Munnar hills) */}
          <div className="lg:w-7/12 relative min-h-[340px] md:min-h-[420px] bg-[#D3DAEA] overflow-hidden group">
            <img
              alt="Kerala Escape backwaters and Munnar tea hills"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              src={KERALA_HERO_IMAGE}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden pointer-events-none"></div>

            {/* Floating Category & Weather Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="backdrop-blur-md bg-white/90 px-3 py-1 rounded-full text-[#151c27] text-[11px] font-semibold shadow-xs flex items-center gap-1.5 border border-white/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Journey · Day 2 of 6
              </span>
              <span className="backdrop-blur-md bg-white/90 px-2.5 py-1 rounded-full text-[#151c27] text-[11px] font-medium shadow-xs flex items-center gap-1 border border-white/40">
                <span className="material-symbols-outlined text-sm text-amber-500">
                  partly_cloudy_day
                </span>
                24°C Munnar
              </span>
            </div>

            {/* Bottom Overlay on Media for Mobile */}
            <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
              <h3 className="text-2xl font-bold drop-shadow-sm">Kerala Escape</h3>
              <p className="text-xs opacity-90 mt-0.5">Kochi → Munnar → Alleppey</p>
            </div>
          </div>

          {/* Trip Details & Embedded 'Up Next' Area */}
          <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-between bg-white">
            {/* Top Block: Title, Badges, Metadata */}
            <div>
              <div className="hidden lg:flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Confirmed
                </div>
                <span className="text-xs font-mono text-[#737686] font-medium tracking-tight">
                  REF #KL-9402
                </span>
              </div>

              <div className="hidden lg:block mt-3">
                <h3 className="text-2xl text-[#151c27] font-bold tracking-tight">
                  Kerala Escape
                </h3>

                {/* Route Badge */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0F3FF] border border-[#C3C6D7]/50 text-[#575E70] text-xs font-medium">
                  <span className="text-[#151c27] font-semibold">Kochi</span>
                  <span className="material-symbols-outlined text-sm text-[#004AC6]">
                    arrow_forward
                  </span>
                  <span className="text-[#004AC6] font-semibold">Munnar</span>
                  <span className="material-symbols-outlined text-sm text-[#737686]">
                    arrow_forward
                  </span>
                  <span className="text-[#737686]">Alleppey</span>
                </div>
              </div>

              {/* Metric Specification Strip */}
              <div className="grid grid-cols-3 gap-3 my-6 py-4 border-y border-[#C3C6D7]/40 text-left">
                <div>
                  <span className="text-[#737686] text-[10px] block uppercase font-medium">
                    Dates
                  </span>
                  <span className="text-[#151c27] text-xs font-semibold mt-0.5 block">
                    June 14–19
                  </span>
                </div>
                <div>
                  <span className="text-[#737686] text-[10px] block uppercase font-medium">
                    Party
                  </span>
                  <span className="text-[#151c27] text-xs font-semibold mt-0.5 block">
                    2 travelers
                  </span>
                </div>
                <div>
                  <span className="text-[#737686] text-[10px] block uppercase font-medium">
                    Total Cost
                  </span>
                  <span className="text-[#151c27] text-xs font-semibold mt-0.5 block">
                    ₹42,800
                  </span>
                </div>
              </div>

              {/* Embedded 'Up Next' Live Card */}
              <div className="bg-[#F0F3FF] rounded-xl p-4 border border-[#C3C6D7]/60 relative overflow-hidden text-left">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2563EB]"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#004AC6] text-[11px] uppercase font-bold tracking-wide flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#004AC6]">
                        schedule
                      </span>
                      Up next
                    </span>
                    <span className="text-[#737686] text-[11px]">• 10:30 AM</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-[#575E70] rounded text-[11px] font-mono border border-[#C3C6D7]/40">
                    2 hrs · 12 min away
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#151c27]">
                  Munnar Tea Estate Guided Walk
                </h4>
                <p className="text-[#575E70] text-xs mt-1 leading-relaxed line-clamp-2">
                  Private tasting session and heritage tea picking walk with estate
                  botanist. Private car waiting at lobby.
                </p>

                {/* Live Card Action Row */}
                <div className="mt-4 flex items-center gap-2 pt-2 border-t border-[#C3C6D7]/30">
                  <button
                    onClick={() => onNavigateTab('trips')}
                    className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#004AC6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                    <span>View trip</span>
                  </button>
                  <button
                    onClick={onOpenDirections}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F0F3FF] text-[#151c27] text-xs font-medium border border-[#C3C6D7] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#004AC6]">
                      directions
                    </span>
                    <span>Directions</span>
                  </button>
                  <button
                    onClick={onOpenContactDriver}
                    className="ml-auto p-2 text-[#737686] hover:text-[#151c27] rounded-full hover:bg-white transition-colors cursor-pointer"
                    title="Contact Driver"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="mt-6 pt-4 flex items-center justify-between text-xs text-[#737686] border-t border-[#C3C6D7]/30">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#004AC6]">
                  verified_user
                </span>
                TripFlow Concierge Guaranteed
              </span>
              <span className="font-mono text-[#434655] font-medium">
                Host: Arun V.
              </span>
            </div>
          </div>
        </div>

        {/* Travel Vault Quick Access Banner */}
        <div className="mt-5 bg-gradient-to-r from-[#F0F3FF] via-white to-[#F7F8FA] rounded-2xl border border-[#BFDBFE] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#111827]">Travel Vault</h3>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  12 Offline Passes Ready
                </span>
              </div>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Passports, Air India AI-682 e-tickets, Brunton Boatyard vouchers & Allianz insurance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('vault')}
              className="px-4 py-2 rounded-full border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View 12 Passes</span>
            </button>
            <button
              onClick={() => onNavigateTab('vault')}
              className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">document_scanner</span>
              <span>Scan New</span>
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming & Saved Journeys Section */}
      <section className="mt-12 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl text-[#151c27] font-bold tracking-tight">
              Upcoming & Saved Journeys
            </h2>
            <p className="text-[#575E70] text-xs mt-0.5">
              Carefully orchestrated upcoming itineraries and booked luxury stays
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#F0F3FF] p-1 rounded-full border border-[#C3C6D7]/60">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-[#151c27] shadow-2xs'
                    : 'text-[#575E70] hover:text-[#151c27]'
                }`}
              >
                All (3)
              </button>
              <button
                onClick={() => setFilter('domestic')}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filter === 'domestic'
                    ? 'bg-white text-[#151c27] shadow-2xs font-semibold'
                    : 'text-[#575E70] hover:text-[#151c27]'
                }`}
              >
                Domestic
              </button>
              <button
                onClick={() => setFilter('international')}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filter === 'international'
                    ? 'bg-white text-[#151c27] shadow-2xs font-semibold'
                    : 'text-[#575E70] hover:text-[#151c27]'
                }`}
              >
                International
              </button>
            </div>
          </div>
        </div>

        {/* Horizontally Scrollable Cards Container */}
        <div className="relative group">
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
            {filteredJourneys.map(journey => (
              <LuxuryCard
                key={journey.id}
                id={journey.id}
                title={journey.title}
                description={journey.description}
                image={journey.image}
                rating={journey.rating || '4.8/5'}
                isFavorite={journey.isBookmarked}
                onToggleFavorite={() => toggleBookmark(journey.id)}
                amenities={journey.amenities}
                price={journey.price}
                pricePeriod="/night"
                onClick={() => onSelectJourneyDetails(journey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contextual Dispatch Insight Banner */}
      <section className="mt-6 mb-12 bg-[#F0F3FF] rounded-2xl border border-[#C3C6D7]/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#C3C6D7]/60 flex items-center justify-center text-[#004AC6] shadow-xs shrink-0">
            <span className="material-symbols-outlined">network_check</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#151c27]">
              Real-Time Travel Mesh Active
            </h4>
            <p className="text-[#575E70] text-xs mt-0.5">
              Your Kerala journey is being monitored 24/7 by Dispatch Hub. All private
              transfers are confirmed with zero transit delays.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            99.8% On-Time Index
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#C3C6D7]/40 pt-8 text-[#737686] text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#004AC6] tracking-tight">
              TripFlow
            </span>
            <span className="text-[#C3C6D7]">•</span>
            <span className="text-[#575E70]">
              Discerning travel orchestration & intelligent dispatch
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPreferences}
              className="hover:text-[#151c27] transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigateTab('trips')}
              className="hover:text-[#151c27] transition-colors cursor-pointer"
            >
              Dispatch Hub
            </button>
            <button
              onClick={onOpenContactDriver}
              className="hover:text-[#151c27] transition-colors cursor-pointer"
            >
              Emergency Assist
            </button>
            <span className="text-[#737686] font-mono text-[11px]">
              v2.4.0-stable
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
