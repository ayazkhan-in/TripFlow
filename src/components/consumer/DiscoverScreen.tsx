import React, { useState } from 'react';
import { ConsumerTab, CuratedDestination } from '../../types/travel';
import { CURATED_DESTINATIONS } from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';

interface DiscoverScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onBuildTrip: (params: {
    destination: string;
    subLocations: string;
    days: number;
    dates: string;
    travelers: number;
    budget: number;
    travelStyle: string;
    interests: string[];
  }) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onNavigateTab,
  onBuildTrip,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('Kerala');
  const [subLocations, setSubLocations] = useState<string>('Kochi · Munnar · Alleppey');
  const [days, setDays] = useState<number>(5);
  const [datesText, setDatesText] = useState<string>('Oct 14 – 19, 2025');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [budget, setBudget] = useState<number>(40000);
  const [selectedStyle, setSelectedStyle] = useState<string>('Adventurous');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Trekking',
    'Tea Estates',
    'Culinary',
  ]);
  const [nlpInput, setNlpInput] = useState<string>(
    '5 days in Kerala, ₹40,000, adventurous, 2 people'
  );
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  const travelStyles = ['Adventurous', 'Relaxed', 'Cultural', 'Luxury', 'Slow Travel'];
  const allInterests = ['Trekking', 'Tea Estates', 'Kayaking', 'Culinary', 'Local Crafts'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleApplyPreset = (dest: CuratedDestination, index: number) => {
    setActivePresetIndex(index);
    if (dest.presetParams) {
      setSelectedDestination(dest.presetParams.destination);
      setSubLocations(dest.presetParams.subLocations);
      setDays(dest.presetParams.days);
      setDatesText(dest.presetParams.dates);
      setBudget(dest.presetParams.budget);
      setTravelersCount(dest.presetParams.travelers);
      setSelectedStyle(dest.presetParams.travelStyle);
      setSelectedInterests(dest.presetParams.interests);
      setNlpInput(
        `${dest.presetParams.days} days in ${dest.presetParams.destination}, ₹${dest.presetParams.budget.toLocaleString(
          'en-IN'
        )}, ${dest.presetParams.travelStyle.toLowerCase()}, ${dest.presetParams.travelers} people`
      );
    }
  };

  const handlePromptClick = (
    promptText: string,
    dest: string,
    subLoc: string,
    daysNum: number,
    datesStr: string,
    budgetNum: number,
    style: string,
    interests: string[]
  ) => {
    setNlpInput(promptText);
    setSelectedDestination(dest);
    setSubLocations(subLoc);
    setDays(daysNum);
    setDatesText(datesStr);
    setBudget(budgetNum);
    setSelectedStyle(style);
    setSelectedInterests(interests);
  };

  const handleBuild = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      onBuildTrip({
        destination: selectedDestination,
        subLocations,
        days,
        dates: datesText,
        travelers: travelersCount,
        budget,
        travelStyle: selectedStyle,
        interests: selectedInterests,
      });
      onNavigateTab('trips');
    }, 600);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12 flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Main Stage: Discovery & Conversational Canvas */}
      <div className="flex-1 w-full min-w-0 space-y-10">
        {/* Editorial Header Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFF6FF] border border-[#DBEAFE] rounded-full text-[#004AC6] text-[11px] font-semibold">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span>Adaptive Travel Intelligence v3.4</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl text-[#151c27] font-bold tracking-tight">
              Where do you want to go?
            </h1>
            <p className="text-base text-[#575E70] max-w-2xl leading-relaxed">
              Explore handpicked destinations or describe your dream journey in your
              own words.
            </p>
          </div>

          {/* Destination Search Bar */}
          <div className="relative max-w-3xl pt-2">
            <div className="flex items-center bg-white border border-[#E5E7EB] hover:border-[#C3C6D7] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 rounded-xl px-4 py-2.5 shadow-2xs transition-all">
              <span className="material-symbols-outlined text-[#737686] text-[22px] mr-3">
                search
              </span>
              <input
                className="w-full bg-transparent border-0 p-0 text-[#151c27] placeholder:text-[#737686]/70 text-sm focus:ring-0 focus:outline-none"
                placeholder="Search destinations, experiences, or scenic stays..."
                type="text"
              />
              <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
                <button className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#575E70] font-medium rounded-full transition-colors text-xs whitespace-nowrap cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>All regions</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Destinations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#151c27]">
                Curated Destinations
              </h2>
              <span className="px-2 py-0.5 bg-[#F0F3FF] text-[#575E70] font-mono text-[11px] rounded-full">
                5 Handpicked
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setActivePresetIndex(prev =>
                    prev > 0 ? prev - 1 : CURATED_DESTINATIONS.length - 1
                  )
                }
                className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#737686] hover:text-[#151c27] transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button
                onClick={() =>
                  setActivePresetIndex(prev =>
                    prev < CURATED_DESTINATIONS.length - 1 ? prev + 1 : 0
                  )
                }
                className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#737686] hover:text-[#151c27] transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Luxury Horizontal Scrollable Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
            {CURATED_DESTINATIONS.map((dest, idx) => {
              const isSelected = activePresetIndex === idx;
              return (
                <LuxuryCard
                  key={dest.id}
                  id={dest.id}
                  title={dest.title}
                  description={dest.description}
                  image={dest.image}
                  rating={dest.rating || '4.9/5'}
                  amenities={dest.amenities}
                  price={dest.startsFrom}
                  pricePeriod="/person"
                  isSelected={isSelected}
                  onClick={() => handleApplyPreset(dest, idx)}
                />
              );
            })}
          </div>
        </section>

        {/* Conversational Trip Builder Section */}
        <section className="space-y-4 pt-2">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#151c27] flex items-center gap-2">
              <span>Or tell us what you're looking for</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-[#E7EEFE] text-[#004AC6] rounded font-mono text-[11px] font-semibold">
                NLP Engine
              </span>
            </h2>
            <p className="text-xs text-[#575E70]">
              TripFlow's intelligence turns your natural thoughts into a living,
              synchronized itinerary.
            </p>
          </div>

          {/* Conversational Input Bento Box */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs hover:border-[#C3C6D7] transition-all relative">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
                <span
                  className="material-symbols-outlined text-[#004AC6] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_fix_high
                </span>
                <input
                  type="text"
                  value={nlpInput}
                  onChange={e => setNlpInput(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-[#151c27] text-sm font-medium focus:ring-0 focus:outline-none"
                  placeholder="Type your spontaneous trip idea..."
                />
              </div>
              <button
                onClick={handleBuild}
                disabled={isBuilding}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold rounded-full shadow-xs transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <span>{isBuilding ? 'Syncing...' : 'Plan my trip'}</span>
                <span className="material-symbols-outlined text-base">
                  auto_awesome
                </span>
              </button>
            </div>

            {/* Quick Suggestion Prompt Chips */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#737686] text-[11px] font-medium">
                Try prompts:
              </span>
              <button
                onClick={() =>
                  handlePromptClick(
                    'Relaxing Goa weekend, ₹25,000, 2 adults, beach and sunset dining',
                    'Goa',
                    'Panaji · Vagator · Palolem',
                    3,
                    'Nov 20 – 23, 2025',
                    25000,
                    'Relaxed',
                    ['Culinary', 'Kayaking']
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#575E70] hover:text-[#151c27] text-xs rounded-full border border-[#C3C6D7]/40 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  beach_access
                </span>
                Relaxing Goa weekend
              </button>

              <button
                onClick={() =>
                  handlePromptClick(
                    'Adventure in Himachal, ₹45,000, high altitude treks & camping',
                    'Himachal',
                    'Manali · Solang · Kasol',
                    5,
                    'Dec 2 – 7, 2025',
                    45000,
                    'Adventurous',
                    ['Trekking']
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#575E70] hover:text-[#151c27] text-xs rounded-full border border-[#C3C6D7]/40 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">hiking</span>
                Adventure in Himachal
              </button>

              <button
                onClick={() =>
                  handlePromptClick(
                    'Food-focused Kerala trip, ₹40,000, spice trails and coastal seafood',
                    'Kerala',
                    'Kochi · Munnar · Alleppey',
                    5,
                    'Oct 14 – 19, 2025',
                    40000,
                    'Adventurous',
                    ['Culinary', 'Tea Estates', 'Trekking']
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] border border-[#DBEAFE] text-[#004AC6] text-xs rounded-full font-semibold cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  ramen_dining
                </span>
                Food-focused Kerala trip
              </button>

              <button
                onClick={() =>
                  handlePromptClick(
                    'Cultural immersion in Kyoto ryokans & temples, ₹90,000',
                    'Japan',
                    'Tokyo · Kyoto · Osaka',
                    7,
                    'Mar 24 – 31, 2026',
                    90000,
                    'Cultural',
                    ['Local Crafts', 'Tea Estates']
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#575E70] hover:text-[#151c27] text-xs rounded-full border border-[#C3C6D7]/40 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  temple_buddhist
                </span>
                Cultural immersion in Kyoto
              </button>
            </div>
          </div>

          {/* Dynamic Ripple & Dependency Indicator Preview */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[#151c27] font-semibold">
                Auto-Sync Network:
              </span>
              <span className="text-[#575E70]">
                Live routes available for {subLocations}.
              </span>
            </div>
            <span className="hidden sm:inline-flex font-mono text-[11px] text-[#004AC6] bg-[#EFF6FF] px-2.5 py-0.5 rounded border border-[#DBEAFE] font-medium">
              ↳ Zero Disruption Latency
            </span>
          </div>
        </section>
      </div>

      {/* Right-Side Docked Refinement Drawer: Trip Parameters & Preferences */}
      <aside className="w-full lg:w-[400px] xl:w-[420px] shrink-0 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs flex flex-col sticky top-20 self-start">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004AC6] text-[20px]">
                tune
              </span>
              <h3 className="text-base font-bold text-[#151c27]">
                Trip Parameters & Preferences
              </h3>
            </div>
            <p className="text-xs text-[#575E70] mt-1">
              Fine-tune your living itinerary before generation
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDestination('Kerala');
              setSubLocations('Kochi · Munnar · Alleppey');
              setDays(5);
              setTravelersCount(2);
              setBudget(40000);
              setSelectedStyle('Adventurous');
              setSelectedInterests(['Trekking', 'Tea Estates', 'Culinary']);
            }}
            className="text-[#737686] hover:text-[#151c27] p-1.5 rounded-full transition-colors cursor-pointer"
            title="Reset parameters"
          >
            <span className="material-symbols-outlined text-[18px]">
              restart_alt
            </span>
          </button>
        </div>

        {/* Drawer Interactive Form Body */}
        <div className="p-5 space-y-5 max-h-[calc(100vh-270px)] overflow-y-auto custom-scrollbar">
          {/* 1. Destination Selected Chip */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
                Destination
              </label>
              <span
                onClick={() => {
                  const nextDest =
                    selectedDestination === 'Kerala'
                      ? 'Goa'
                      : selectedDestination === 'Goa'
                      ? 'Rajasthan'
                      : 'Kerala';
                  setSelectedDestination(nextDest);
                }}
                className="text-[11px] text-[#004AC6] font-semibold cursor-pointer hover:underline"
              >
                Change
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl text-[#004AC6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                <span className="font-semibold text-xs text-[#151c27]">
                  {selectedDestination}
                </span>
                <span className="text-[#737686] text-xs">({subLocations})</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#004AC6]">
                edit
              </span>
            </div>
          </div>

          {/* 2. Dates & Duration */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
              Dates & Duration
            </label>
            <div className="flex items-center justify-between p-2.5 bg-[#F0F3FF] border border-[#E5E7EB] hover:border-[#737686] rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#737686] text-[18px]">
                  calendar_month
                </span>
                <div>
                  <span className="text-xs font-bold text-[#151c27] block">
                    {days} Days
                  </span>
                  <span className="text-[11px] text-[#575E70] font-mono">
                    {datesText}
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-[#C3C6D7]/40 font-mono text-[#151c27] font-semibold">
                Autumn Break
              </span>
            </div>
          </div>

          {/* 3. Travelers Counter Widget */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
              Travelers
            </label>
            <div className="flex items-center justify-between p-2.5 bg-[#F0F3FF] border border-[#E5E7EB] rounded-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#737686] text-[18px]">
                  group
                </span>
                <span className="text-xs font-semibold text-[#151c27]">
                  Party Size
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737686] hover:text-[#151c27] transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    remove
                  </span>
                </button>
                <span className="font-mono text-xs font-bold px-2 text-[#151c27]">
                  {travelersCount} Adult{travelersCount > 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setTravelersCount(travelersCount + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#737686] hover:text-[#151c27] transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Budget Slider Widget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
                Budget Target
              </label>
              <span className="px-2 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-mono text-[11px] font-semibold rounded-full">
                Comfort Tier
              </span>
            </div>
            <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-[#004AC6] font-mono">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-mono text-[#737686]">
                  Target: ₹35,000 — ₹55,000
                </span>
              </div>
              {/* Range Slider Track */}
              <input
                type="range"
                min="20000"
                max="100000"
                step="5000"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-[#2563EB] h-1.5 bg-[#E2E8F8] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#737686] font-mono">
                <span>Budget (₹20k)</span>
                <span>Balanced</span>
                <span>Luxury (₹100k+)</span>
              </div>
            </div>
          </div>

          {/* 5. Travel Style Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
              Travel Style
            </label>
            <div className="flex flex-wrap gap-1.5">
              {travelStyles.map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    selectedStyle === style
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#151c27] border border-[#E5E7EB]'
                  }`}
                >
                  {selectedStyle === style && (
                    <span className="material-symbols-outlined text-[14px]">
                      check
                    </span>
                  )}
                  <span>{style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Interests Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
              Interests & Vibes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allInterests.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border border-[#DBEAFE] text-[#004AC6]'
                        : 'bg-[#F0F3FF] hover:bg-[#E7EEFE] text-[#151c27] border border-[#E5E7EB]'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                    )}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Living Constraints */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#151c27]">
              Living Constraints
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F0F3FF] border border-[#E5E7EB] cursor-pointer hover:bg-[#E7EEFE] transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#C3C6D7]"
                />
                <span className="text-xs text-[#151c27] font-medium">
                  Vegetarian friendly culinary focus
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F0F3FF] border border-[#E5E7EB] cursor-pointer hover:bg-[#E7EEFE] transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#C3C6D7]"
                />
                <span className="text-xs text-[#151c27] font-medium">
                  Max 3h road transit per day
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F0F3FF] border border-[#E5E7EB] cursor-pointer hover:bg-[#E7EEFE] transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#C3C6D7]"
                />
                <span className="text-xs text-[#151c27] font-medium">
                  Eco-certified boutique stays only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl space-y-2">
          <button
            onClick={handleBuild}
            disabled={isBuilding}
            className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>{isBuilding ? 'Generating Living Itinerary...' : 'Build my trip'}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
          <p className="text-[11px] text-center text-[#737686] leading-tight">
            Generates synchronized flights, stays, transfers, and activities. Living
            plan adaptable anytime.
          </p>
        </div>
      </aside>
    </div>
  );
};
