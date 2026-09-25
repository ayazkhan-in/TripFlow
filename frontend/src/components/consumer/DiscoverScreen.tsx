import React, { useState, useRef } from 'react';
import { ConsumerTab } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import {
  PREMADE_KERALA_ITINERARY,
  PREMADE_RAJASTHAN_ITINERARY,
  PREMADE_GOA_ITINERARY,
  AIGenerateParams,
} from '../../data/premadeItineraries';

interface DiscoverScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onSelectPremadeTrip: (itinerary: TripItinerary) => void;
  onGenerateAITrip: (params: AIGenerateParams) => void;
}

interface OrbitDestination {
  id: string;
  name: string;
  country: string;
  flagEmoji: string;
  image: string;
  desktopPosition: string; // Tailwind positioning classes
  prompt: string;
  destination: string;
  subLocations: string;
  days: number;
  budget: number;
  travelStyle: string;
  interests: string[];
}

const ORBIT_DESTINATIONS: OrbitDestination[] = [
  {
    id: 'dest-riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    flagEmoji: '🇸🇦',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'top-2 left-1/2 -translate-x-1/2',
    prompt: '5 days luxury desert escape and modern architecture in Riyadh',
    destination: 'Riyadh',
    subLocations: 'Kingdom Centre · Diriyah · Al Bujairi',
    days: 5,
    budget: 4200,
    travelStyle: 'Luxury Concierge',
    interests: ['Architecture', 'Desert Safari', 'Fine Dining'],
  },
  {
    id: 'dest-ny',
    name: 'New York',
    country: 'United States',
    flagEmoji: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'top-10 left-6 lg:left-16',
    prompt: '4 days skyline penthouses, Broadway, and Michelin dining in New York',
    destination: 'New York',
    subLocations: 'Manhattan · Brooklyn · Central Park',
    days: 4,
    budget: 5500,
    travelStyle: 'Urban & Culture',
    interests: ['Broadway', 'Rooftop Lounges', 'Museums'],
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flagEmoji: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'top-10 right-6 lg:right-16',
    prompt: '7 days historic temples, bullet train excursions, and omakase in Tokyo',
    destination: 'Tokyo',
    subLocations: 'Shibuya · Asakusa · Mount Fuji',
    days: 7,
    budget: 4800,
    travelStyle: 'Cultural Heritage',
    interests: ['Omakase Dining', 'Bullet Train', 'Temples'],
  },
  {
    id: 'dest-seoul',
    name: 'Seoul',
    country: 'South Korea',
    flagEmoji: '🇰🇷',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'bottom-6 left-8 lg:left-24',
    prompt: '5 days royal palaces, night street food, and K-culture in Seoul',
    destination: 'Seoul',
    subLocations: 'Gangnam · Bukchon Hanok · Hongdae',
    days: 5,
    budget: 3400,
    travelStyle: 'Relaxed & Wellness',
    interests: ['Hanok Stays', 'Cafes', 'Palaces'],
  },
  {
    id: 'dest-beijing',
    name: 'Beijing',
    country: 'China',
    flagEmoji: '🇨🇳',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'bottom-2 left-1/2 -translate-x-1/2',
    prompt: '6 days Great Wall private trek and Forbidden City in Beijing',
    destination: 'Beijing',
    subLocations: 'Forbidden City · Great Wall · Summer Palace',
    days: 6,
    budget: 3800,
    travelStyle: 'Cultural Heritage',
    interests: ['Great Wall', 'Imperial History', 'Tea Tasting'],
  },
  {
    id: 'dest-delhi',
    name: 'Delhi & Kerala',
    country: 'India',
    flagEmoji: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80',
    desktopPosition: 'bottom-6 right-8 lg:right-24',
    prompt: '6 days backwaters houseboat, spice plantations, and Kerala coastline',
    destination: 'Kerala',
    subLocations: 'Kochi · Munnar · Alleppey',
    days: 6,
    budget: 2450,
    travelStyle: 'Luxury Concierge',
    interests: ['Houseboat', 'Tea Estates', 'Ayurveda'],
  },
];

const QUICK_SUGGESTIONS = [
  { label: '✦ Inspire me where to go', text: 'Spontaneous 5-day luxury getaway with private chauffeur and boutique villa' },
  { label: '✦ Create a new Trip', text: '5 days personalized adventure with flights, luxury stays, and private car' },
  { label: '✦ Find family hotels in Dubai', text: '4 days family luxury resort in Dubai with Burj Khalifa and desert safari' },
  { label: '✦ Kerala Backwaters escape', text: '6 days Kerala backwaters, Brunton Boatyard, and private teak houseboat' },
  { label: '✦ Royal Palaces of Rajasthan', text: '7 days royal palaces of Jaipur, Jodhpur, and Taj Lake Palace Udaipur' },
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onNavigateTab,
  onSelectPremadeTrip,
  onGenerateAITrip,
}) => {
  // Input & Filter Parameters State
  const [destinationInput, setDestinationInput] = useState<string>('Kerala, India');
  const [selectedDestinationName, setSelectedDestinationName] = useState<string>('Kerala');
  const [subLocations, setSubLocations] = useState<string>('Kochi · Munnar · Alleppey');
  const [days, setDays] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>('2025-10-14');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [budget, setBudget] = useState<number>(3500); // In USD ($)
  const [selectedStyle, setSelectedStyle] = useState<string>('Luxury Concierge');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Tea Estates',
    'Private Houseboat',
    'Ayurveda',
  ]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [selectedOrbitId, setSelectedOrbitId] = useState<string>('dest-delhi');

  const premadeSectionRef = useRef<HTMLDivElement>(null);

  // Travel Styles available in dropdown
  const travelStylesList = [
    { value: 'Luxury Concierge', label: '👑 Luxury Concierge & 5-Star Stays' },
    { value: 'Adventurous', label: '🧗 Adventurous & Nature Trails' },
    { value: 'Cultural Heritage', label: '🏛️ Cultural Heritage & Royal Palaces' },
    { value: 'Relaxed & Wellness', label: '🧘 Relaxed & Wellness Spa Retreat' },
    { value: 'Culinary & Nightlife', label: '🍷 Culinary & Rooftop Gastronomy' },
    { value: 'Family Friendly', label: '👨‍👩‍👧 Family Friendly & Leisure' },
  ];

  // Helper when clicking an orbiting destination card
  const handleSelectOrbit = (orbit: OrbitDestination) => {
    setSelectedOrbitId(orbit.id);
    setDestinationInput(`${orbit.destination}, ${orbit.country}`);
    setSelectedDestinationName(orbit.destination);
    setSubLocations(orbit.subLocations);
    setDays(orbit.days);
    setBudget(orbit.budget);
    setSelectedStyle(orbit.travelStyle);
    setSelectedInterests(orbit.interests);
  };

  // Helper when clicking a suggestion pill
  const handleSelectSuggestion = (text: string) => {
    setDestinationInput(text);
  };

  // Trigger AI Trip Generation
  const handleGenerateAI = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      onGenerateAITrip({
        destination: selectedDestinationName || destinationInput || 'Kerala',
        subLocations,
        days,
        dates: `${startDate} (${days} Days)`,
        travelers: travelersCount,
        budget,
        travelStyle: selectedStyle,
        interests: selectedInterests,
      });
    }, 450);
  };

  const scrollToPremade = () => {
    premadeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] text-[#1E293B] relative overflow-hidden flex flex-col">
      {/* ============================================================= */}
      {/* HERO SECTION: FLOATING ORBIT CANVAS (REFERENCE IMAGE AESTHETIC) */}
      {/* ============================================================= */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center">
        {/* Top Centered Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-sm mb-4 animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-emerald-400 text-sm">
            auto_awesome
          </span>
          <span className="tracking-tight">Powered by TripFlow AI</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 text-center tracking-tight mb-8">
          Where is your next destination?
        </h1>

        {/* ----------------------------------------------------------- */}
        {/* ORBIT CANVAS CONTAINER                                      */}
        {/* ----------------------------------------------------------- */}
        <div className="relative w-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
          {/* FLOATING ORBITING DESTINATION CARDS (Visible on md+ screens) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {ORBIT_DESTINATIONS.map(dest => {
              const isSelected = selectedOrbitId === dest.id;
              return (
                <div
                  key={dest.id}
                  onClick={() => handleSelectOrbit(dest)}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110 group ${dest.desktopPosition}`}
                  title={`Click to plan your journey in ${dest.name}`}
                >
                  {/* Card Container */}
                  <div
                    className={`bg-white p-1.5 rounded-2xl border transition-all duration-200 flex flex-col items-center ${
                      isSelected
                        ? 'border-blue-600 shadow-xl ring-2 ring-blue-500/20 scale-105'
                        : 'border-slate-200/90 shadow-md group-hover:shadow-xl group-hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-24 sm:w-28 h-16 sm:h-18 object-cover rounded-xl"
                      loading="lazy"
                    />
                    <div className="w-full text-center py-1">
                      <span className="text-xs font-bold text-slate-900 tracking-tight">
                        {dest.name}
                      </span>
                    </div>
                  </div>

                  {/* Hanging Pin & Flag Badge */}
                  <div className="flex flex-col items-center -mt-0.5">
                    <span className="w-0.5 h-2 bg-slate-300"></span>
                    <div
                      className={`w-6 h-6 rounded-full bg-white shadow-md border flex items-center justify-center text-xs transition-transform group-hover:scale-125 ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-slate-200'
                      }`}
                    >
                      <span>{dest.flagEmoji}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --------------------------------------------------------- */}
          {/* CENTERED INTERACTIVE SEARCH & GENERATION CARD             */}
          {/* --------------------------------------------------------- */}
          <div className="relative z-20 w-full max-w-xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80 backdrop-blur-xs space-y-5">
            {/* Destination Input Row with Search Arrow Button */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
              <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">
                search
              </span>
              <input
                type="text"
                value={destinationInput}
                onChange={e => {
                  setDestinationInput(e.target.value);
                  setSelectedDestinationName(e.target.value);
                }}
                placeholder="Where do you want to go? (e.g. Kerala, Tokyo, Paris...)"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isBuilding}
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer"
                title="Generate with AI"
              >
                {isBuilding ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                )}
              </button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug.text)}
                  className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-1"></div>

            {/* ------------------------------------------------------- */}
            {/* PARAMETERS: DATES, STYLE DROPDOWN, & BUDGET SLIDER     */}
            {/* ------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* 1. Date & Duration Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-blue-600">
                    calendar_today
                  </span>
                  <span>Travel Dates & Length</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="flex-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                  />
                  <select
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                  >
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={6}>6 Days</option>
                    <option value={7}>7 Days</option>
                    <option value={10}>10 Days</option>
                  </select>
                </div>
              </div>

              {/* 2. Travel Style Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-purple-600">
                    hotel_class
                  </span>
                  <span>Travel Style</span>
                </label>
                <select
                  value={selectedStyle}
                  onChange={e => setSelectedStyle(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  {travelStylesList.map(st => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Budget Slider */}
            <div className="space-y-2 pt-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-600">
                    payments
                  </span>
                  <span>Budget per Traveler</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {budget < 2500 ? 'Comfort' : budget < 5000 ? 'Premium' : 'Ultra-Luxury'}
                  </span>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ${budget.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min={800}
                max={10000}
                step={200}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$800 (Smart)</span>
                <span>$5,000 (Luxury)</span>
                <span>$10,000+ (Presidential)</span>
              </div>
            </div>

            {/* Travelers Selector & Primary AI Generate Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                <span>Travelers:</span>
                <select
                  value={travelersCount}
                  onChange={e => setTravelersCount(Number(e.target.value))}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 (Solo)</option>
                  <option value={2}>2 (Couple)</option>
                  <option value={4}>4 (Family)</option>
                  <option value={6}>6 (Group)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isBuilding}
                className="w-full flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
              >
                {isBuilding ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>AI Crafting Living Itinerary...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_fix_high</span>
                    <span>Generate Itinerary with AI</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* MOBILE/TABLET ORBIT DESTINATIONS ROW                        */}
        {/* ----------------------------------------------------------- */}
        <div className="md:hidden w-full mt-6 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Popular Destinations
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {ORBIT_DESTINATIONS.map(dest => (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelectOrbit(dest)}
                className="shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2.5 hover:border-blue-500 transition-all text-left"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-12 h-12 object-cover rounded-xl shrink-0"
                />
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{dest.name}</span>
                    <span>{dest.flagEmoji}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {dest.days} Days · ${dest.budget}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* EXPLICIT CALLOUT BUTTON: CHECK OUT CURATED PREMADE ITINERARIES */}
        {/* ----------------------------------------------------------- */}
        <div className="pt-10 flex flex-col items-center text-center space-y-3">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Prefer a pre-verified luxury package?
          </div>

          <button
            type="button"
            onClick={scrollToPremade}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-extrabold border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group hover:border-blue-300"
          >
            <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-base">luggage</span>
            </span>
            <span>Check Out Curated Premade Itineraries</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-bold">
              3 Verified Packages
            </span>
            <span className="material-symbols-outlined text-base text-slate-400 group-hover:translate-y-0.5 transition-transform">
              arrow_downward
            </span>
          </button>
        </div>
      </section>

      {/* ============================================================= */}
      {/* PREMADE CURATED ITINERARIES SECTION                           */}
      {/* ============================================================= */}
      <section
        ref={premadeSectionRef}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 space-y-8 border-t border-slate-200/80"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Handcrafted by Senior Concierge Directors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Premade Itineraries
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Each package includes confirmed flight routings, luxury boutique stays, private chauffeurs, and verified reservations. Modify and personalize any day directly in the Builder.
            </p>
          </div>
          <div className="shrink-0 text-xs font-bold text-slate-400">
            Showing 3 circuits
          </div>
        </div>

        {/* Premade Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Kerala */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={PREMADE_KERALA_ITINERARY.heroImage}
                alt={PREMADE_KERALA_ITINERARY.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                🌴 Backwaters & Hills
              </div>
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                Ready to Book
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[11px] font-bold text-white/80">
                  {PREMADE_KERALA_ITINERARY.dates} · {PREMADE_KERALA_ITINERARY.days.length} Days
                </div>
                <h3 className="text-base font-extrabold leading-snug line-clamp-1">
                  {PREMADE_KERALA_ITINERARY.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Route Stops */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PREMADE_KERALA_ITINERARY.routeStops?.map((stop, i) => (
                    <span
                      key={stop.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-700 font-semibold"
                    >
                      <span>{stop.city}</span>
                      {PREMADE_KERALA_ITINERARY.routeStops && i < PREMADE_KERALA_ITINERARY.routeStops.length - 1 && (
                        <span className="text-slate-300">→</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Key Inclusions */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-sm">flight</span>
                    <span>Air India BOM ➔ COK Flight Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">hotel</span>
                    <span>Brunton Boatyard & Teak Houseboat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-600 text-sm">directions_car</span>
                    <span>Dedicated Private Chauffeur Arun V.</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total Package
                  </div>
                  <div className="text-lg font-black text-slate-900">$2,450</div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPremadeTrip(PREMADE_KERALA_ITINERARY)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select & Personalize</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Rajasthan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={PREMADE_RAJASTHAN_ITINERARY.heroImage}
                alt={PREMADE_RAJASTHAN_ITINERARY.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                🏰 Royal Palaces
              </div>
              <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                Top Rated
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[11px] font-bold text-white/80">
                  {PREMADE_RAJASTHAN_ITINERARY.dates} · {PREMADE_RAJASTHAN_ITINERARY.days.length} Days
                </div>
                <h3 className="text-base font-extrabold leading-snug line-clamp-1">
                  {PREMADE_RAJASTHAN_ITINERARY.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Route Stops */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PREMADE_RAJASTHAN_ITINERARY.routeStops?.map((stop, i) => (
                    <span
                      key={stop.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-700 font-semibold"
                    >
                      <span>{stop.city}</span>
                      {PREMADE_RAJASTHAN_ITINERARY.routeStops && i < PREMADE_RAJASTHAN_ITINERARY.routeStops.length - 1 && (
                        <span className="text-slate-300">→</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Key Inclusions */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-sm">flight</span>
                    <span>IndiGo DEL ➔ JAI Flight Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">hotel</span>
                    <span>Rambagh Palace & Taj Lake Palace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-600 text-sm">directions_car</span>
                    <span>Dedicated Chauffeur & Royal Historians</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total Package
                  </div>
                  <div className="text-lg font-black text-slate-900">$3,200</div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPremadeTrip(PREMADE_RAJASTHAN_ITINERARY)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select & Personalize</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Goa */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={PREMADE_GOA_ITINERARY.heroImage}
                alt={PREMADE_GOA_ITINERARY.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                🏖️ Coastal Boutique
              </div>
              <div className="absolute top-3 right-3 bg-purple-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                Private Yacht
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[11px] font-bold text-white/80">
                  {PREMADE_GOA_ITINERARY.dates} · {PREMADE_GOA_ITINERARY.days.length} Days
                </div>
                <h3 className="text-base font-extrabold leading-snug line-clamp-1">
                  {PREMADE_GOA_ITINERARY.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Route Stops */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PREMADE_GOA_ITINERARY.routeStops?.map((stop, i) => (
                    <span
                      key={stop.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-700 font-semibold"
                    >
                      <span>{stop.city}</span>
                      {PREMADE_GOA_ITINERARY.routeStops && i < PREMADE_GOA_ITINERARY.routeStops.length - 1 && (
                        <span className="text-slate-300">→</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Key Inclusions */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-sm">flight</span>
                    <span>Vistara BOM ➔ GOI Flight Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">hotel</span>
                    <span>Ahilya by the Sea — Dolphin Villa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600 text-sm">sailing</span>
                    <span>Private 40ft Catamaran Charter</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total Package
                  </div>
                  <div className="text-lg font-black text-slate-900">$1,850</div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPremadeTrip(PREMADE_GOA_ITINERARY)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select & Personalize</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
