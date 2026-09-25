import React, { useState } from 'react';
import {
  CURATED_DESTINATIONS,
  KERALA_HERO_IMAGE,
  KERALA_TIMELINE_HERO,
  ROUTE_MAP_IMAGE,
  RADAR_MAP_IMAGE,
  CONCIERGE_AVATAR,
  USER_AVATAR,
  ALEX_DISPATCH_AVATAR,
  SAVED_JOURNEYS,
} from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';

interface LandingPageProps {
  onOpenAuth: (defaultRole?: 'traveler' | 'operator') => void;
  onExploreDemo: () => void;
  onExploreOps: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreDemo,
  onExploreOps,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#151c27] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* LANDING NAVIGATION HEADER                                     */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-xl">flight_takeoff</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[19px] font-bold text-[#004AC6] tracking-tight leading-none">
                TripFlow
              </span>
              <span className="text-[10px] text-[#737686] font-medium tracking-wider uppercase mt-0.5">
                Luxury Concierge & Ops
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#434655]">
            <a href="#features" className="hover:text-[#004AC6] transition-colors">
              Features
            </a>
            <a href="#living-itinerary" className="hover:text-[#004AC6] transition-colors">
              Living Itinerary
            </a>
            <a href="#vault" className="hover:text-[#004AC6] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Travel Vault</span>
            </a>
            <a href="#destinations" className="hover:text-[#004AC6] transition-colors">
              Destinations
            </a>
            <a href="#dual-surface" className="hover:text-[#004AC6] transition-colors">
              Dual-Surface System
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('traveler')}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#434655] hover:text-[#004AC6] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onExploreDemo}
            className="px-5 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Traveler App</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 border-b border-[#E5E7EB] bg-linear-to-b from-white via-[#F7F8FA] to-[#F0F3FF]">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FF] border border-[#BFDBFE] text-[#1E40AF] text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Telemetry & Concierge Orchestration Platform</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.12]">
                Personalized luxury journeys, backed by{' '}
                <span className="text-[#004AC6] underline decoration-[#93C5FD] decoration-wavy underline-offset-8">
                  live operational telemetry
                </span>
                .
              </h1>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
                Experience bespoke, hand-crafted private itineraries that automatically adapt
                to flight delays, weather shifts, and chauffeur tracking in real time. Backed by
                a 24/7 dedicated WhatsApp concierge and regional master drivers.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExploreDemo}
                  className="px-6 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
                >
                  <span>Experience Traveler Concierge</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
                    east
                  </span>
                </button>

                <button
                  onClick={onExploreOps}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#1F2937] border border-[#D1D5DB] text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#004AC6] text-base">
                    hub
                  </span>
                  <span>View Operations Hub Demo</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">
                    verified_user
                  </span>
                  <span>Verified 24/7 Human Concierge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">
                    airline_stops
                  </span>
                  <span>Autonomous Flight Delay Cascade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-600 text-base">
                    lock
                  </span>
                  <span>Curated Luxury Stays & Vouchers</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Live Bento Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-3xl p-5 shadow-xl border border-[#E5E7EB] space-y-4">
                {/* Floating Active Tour Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-[#111827]">Active Tour · LIVE</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF1FF] text-[#1E40AF]">
                    REF #TF-1024
                  </span>
                </div>

                {/* Tour Visual & Header */}
                <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs">
                  <img
                    src={KERALA_HERO_IMAGE}
                    alt="Kerala Backwaters & Tea Hills"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
                      Kochi → Munnar → Alleppey
                    </div>
                    <div className="text-lg font-bold">Kerala 6-Day Luxury Escape</div>
                    <div className="text-xs text-white/80">Oct 14 – 19, 2025 · 2 Travelers</div>
                  </div>
                </div>

                {/* Live Cascade Telemetry Snippet */}
                <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                    bolt
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-amber-900 flex items-center justify-between">
                      <span>Flight AI-682 (+1h 45m Delay)</span>
                      <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded font-medium text-amber-900">
                        Auto-Synchronized
                      </span>
                    </div>
                    <p className="text-amber-800 text-[11px] mt-0.5 leading-snug">
                      Chauffeur Rajesh K. rescheduled to 02:30 PM. Fort Kochi sunset walk moved
                      to 05:30 PM smoothly.
                    </p>
                  </div>
                </div>

                {/* Chauffeur & Concierge Row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-2.5">
                    <img
                      src={CONCIERGE_AVATAR}
                      alt="Arun V."
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-300"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#111827] truncate">
                        Arun V.
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>WhatsApp Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      RK
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#111827] truncate">
                        Rajesh K.
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium truncate">
                        Innova KL-07-DG-4412
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Action button on preview */}
                <button
                  onClick={onExploreDemo}
                  className="w-full py-2.5 rounded-full bg-[#F0F3FF] hover:bg-[#DBE1FF] text-[#004AC6] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Full Itinerary Dashboard</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* KEY METRICS BAR                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white py-10 px-4 sm:px-8 border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#004AC6]">99.4%</div>
            <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
              Chauffeur On-Time Pickup Rate
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              &lt; 14 min
            </div>
            <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
              Autonomous Disruption Re-dispatch
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#004AC6]">4.98 ★</div>
            <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
              Traveler Satisfaction Index
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">₹45M+</div>
            <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
              Curated Luxury Tours Orchestrated
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* LIVING ITINERARY & CORE PILLARS                               */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
            Architected for Luxury & Certainty
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Why traditional travel agencies leave you stranded.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            TripFlow replaces rigid static PDFs with living digital itineraries connected to
            live flight radars, chauffeurs, and local concierges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBF1FF] text-[#004AC6] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Living, Dynamic Itineraries
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              When your flight is delayed or weather closes a mountain pass, our system
              automatically calculates the cascade effect, adjusts arrival chauffeurs,
              and shifts dining reservations seamlessly.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#004AC6] flex items-center gap-1">
              <span>View live cascade resolver</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              24/7 Human WhatsApp Concierge
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              No generic call centers or confusing bots. A dedicated regional concierge (like
              Arun V. in South India) is linked directly to your WhatsApp to handle customized
              dining, spice farm tours, and special requests.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Instant WhatsApp connection</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">radar</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Fleet Radar & Verified Manifest
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Every driver is vetted with clean premium vehicles (Innova Crysta, luxury EV
              SUVs), live GPS beacons, and confirmed passenger vouchers so you never search
              for your chauffeur outside arrivals.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-700 flex items-center gap-1">
              <span>Explore dispatch radar</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE SPOTLIGHT: LIVING ITINERARY DEEP DIVE                  */}
      {/* ------------------------------------------------------------- */}
      <section
        id="living-itinerary"
        className="py-20 px-4 sm:px-8 bg-white border-y border-[#E5E7EB]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#004AC6] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">timeline</span>
              <span>Intelligent Day-by-Day Flow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              A travel timeline that breathes with your trip.
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              Your vacation is not a rigid spreadsheet. TripFlow organizes each day into
              fluid, context-aware segments: flight check-in telemetry, private road transfers,
              hotel vouchers, sunset strolls, and private houseboat sailings.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#374151]">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
                  check_circle
                </span>
                <span>
                  <strong>Interactive Day Selectors:</strong> Effortlessly slide through Day 1 to
                  Day 6 with weather forecast, sunset timings, and dress codes.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#374151]">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
                  check_circle
                </span>
                <span>
                  <strong>One-Tap Offline Vouchers:</strong> Download verified PDF credentials or
                  share live links with family members.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#374151]">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
                  check_circle
                </span>
                <span>
                  <strong>Dynamic Telemetry Badges:</strong> Green &quot;Trip on Track&quot; indices and instant
                  notifications for gate changes or traffic delays.
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={onExploreDemo}
                className="px-6 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>View Kerala Escape Living Timeline</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-4 shadow-lg overflow-hidden">
              <div className="rounded-xl overflow-hidden shadow-xs mb-4">
                <img
                  src={KERALA_TIMELINE_HERO}
                  alt="Kerala Living Timeline"
                  className="w-full h-56 object-cover"
                />
              </div>

              {/* Sample Timeline items preview */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#004AC6] flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">flight_land</span>
                    </span>
                    <div>
                      <div className="font-bold text-[#111827]">
                        Cochin Intl Airport (COK) Arrival
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Flight AI-682 · Rescheduled to 01:45 PM
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                    Live Sync
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">directions_car</span>
                    </span>
                    <div>
                      <div className="font-bold text-[#111827]">
                        Private Transfer to Brunton Boatyard
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Chauffeur Rajesh K. · Innova Crysta
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Confirmed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">hotel</span>
                    </span>
                    <div>
                      <div className="font-bold text-[#111827]">
                        Brunton Boatyard — Sea View Suite
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Early check-in prioritized · Sunset tea included
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-semibold">
                    Voucher #BB-788
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* DUAL-SURFACE ARCHITECTURE                                     */}
      {/* ------------------------------------------------------------- */}
      <section id="dual-surface" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
            Two Unified Views · One Powerful Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            The Dual-Surface System.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            While the traveler enjoys peace of mind, dispatch controllers command an
            enterprise operations radar orchestrating multi-region fleet logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Surface A: Traveler View */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#004AC6] text-xs font-bold">
                  Surface 01 · Consumer Traveler
                </span>
                <span className="text-xs text-[#6B7280]">Sarah Mehta</span>
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                Traveler Concierge Experience
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Clean, distraction-free companion app with active trip countdown, offline
                vouchers, interactive route maps, personalized recommendations, and instant
                WhatsApp concierge help.
              </p>
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB] shadow-2xs">
                <img
                  src={ROUTE_MAP_IMAGE}
                  alt="Traveler Route Visualizer"
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={onExploreDemo}
                className="w-full py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Traveler View (Sarah Mehta)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Surface B: Operations Controller View */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Surface 02 · Dispatch Operations
                </span>
                <span className="text-xs text-[#6B7280]">Alex Vance</span>
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                Operations Command Hub
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Real-time regional fleet radar, multi-hub flight telemetry, disruption cascade
                solver with heuristic budget recalculation, vendor manifests, and instant driver
                dispatch.
              </p>
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB] shadow-2xs">
                <img
                  src={RADAR_MAP_IMAGE}
                  alt="Operations Radar"
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={onExploreOps}
                className="w-full py-3 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-emerald-400">hub</span>
                <span>Launch Operations Hub (Alex Vance)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CURATED DESTINATIONS SHOWCASE                                 */}
      {/* ------------------------------------------------------------- */}
      <section id="destinations" className="py-20 px-4 sm:px-8 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
                Hand-Crafted Itineraries
              </div>
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
                Explore hand-picked destinations
              </h2>
            </div>
            <button
              onClick={onExploreDemo}
              className="text-xs font-bold text-[#004AC6] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore all journeys in Discover</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
            {CURATED_DESTINATIONS.map(dest => (
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
                onClick={onExploreDemo}
              />
            ))}
          </div>

          {/* Secondary Journeys Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {SAVED_JOURNEYS.map(journey => (
              <div
                key={journey.id}
                onClick={onExploreDemo}
                className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center gap-3.5"
              >
                <img
                  src={journey.image}
                  alt={journey.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#111827] truncate">
                    {journey.title}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {journey.duration} · {journey.travelers} Travelers
                  </div>
                  <div className="text-[11px] font-semibold text-[#004AC6] mt-0.5">
                    Luxury Private Tour
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE SPOTLIGHT: TRAVEL VAULT                               */}
      {/* ------------------------------------------------------------- */}
      <section id="vault" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004AC6] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Secure Travel Document Wallet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            The Travel Vault. All your trip passes in one encrypted wallet.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Connected directly to each itinerary. Instant offline access to passports, visas, flight
            boarding passes, hotel vouchers, activity tickets, transit permits, and emergency contacts —
            without requiring cellular roaming.
          </p>
        </div>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {/* Vault Pillar 1 */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </span>
              <h3 className="text-lg font-bold text-[#111827]">
                Passports, Visas & State Permits
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Biometric international passport copies, national ID proofs, and official wildlife
                forest permits (like Eravikulam Sanctuary Pass) ready for instant verification at checkposts.
              </p>
            </div>
            <div className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] font-mono text-[#374151] border border-[#E5E7EB]">
              ✓ Verified by Concierge Arun V.
            </div>
          </div>

          {/* Vault Pillar 2 */}
          <div className="bg-white rounded-3xl p-7 border-2 border-[#2563EB] shadow-lg relative flex flex-col justify-between space-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
              Live Synchronized
            </div>
            <div className="space-y-3">
              <span className="w-12 h-12 rounded-xl bg-blue-50 text-[#004AC6] border border-blue-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </span>
              <h3 className="text-lg font-bold text-[#111827]">
                Flights, Hotels & Transit Vouchers
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                E-tickets with seat assignments, baggage rules, hotel suite confirmation codes, and private
                chauffeur manifests with license plate validation (Innova KL-07-DG-4412).
              </p>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl text-[11px] font-mono text-[#004AC6] border border-blue-100">
              ✓ Auto-updates during flight delay cascades
            </div>
          </div>

          {/* Vault Pillar 3 */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">health_and_safety</span>
              </span>
              <h3 className="text-lg font-bold text-[#111827]">
                Insurance & Emergency Fast-Dial
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Comprehensive Allianz $500k medical travel policy certificates, 1-tap dialer for Aster Medcity
                trauma hospital, regional tourist police, and your assigned 24/7 concierge.
              </p>
            </div>
            <div className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] font-mono text-[#374151] border border-[#E5E7EB]">
              ✓ Cashless hospital admission active
            </div>
          </div>
        </div>

        {/* Vault Interactive CTA Card */}
        <div className="bg-linear-to-r from-[#F0F3FF] via-white to-[#F7F8FA] border border-[#BFDBFE] rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
                Offline 256-Bit Encrypted Vault
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
              12 verified documents secured for Kerala Escape
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Passports, IndiGo & Air India boarding passes, Brunton Boatyard suite vouchers, and medical insurance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreDemo}
              className="px-5 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Open Travel Vault in App</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* TESTIMONIALS                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
              Verified Traveler Experiences
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Trusted by discerning travelers worldwide.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">
                &quot;Our flight into Kochi had a 2-hour delay. Before we even touched down,
                TripFlow had rebooked our driver Rajesh, notified the hotel, and saved our sunset
                boat cruise. That peace of mind is priceless.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={USER_AVATAR}
                  alt="Sarah Mehta"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-[#111827]">Sarah Mehta</div>
                  <div className="text-[10px] text-[#6B7280]">
                    Kerala 6-Day Escape · Mumbai
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">
                &quot;Arun V. was on WhatsApp instantly answering every question from authentic
                spice gardens to hidden tea bungalows. The combination of tech and real local
                concierges is unbeatable.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  DC
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">David Chen</div>
                  <div className="text-[10px] text-[#6B7280]">
                    Rajasthan Royal Heritage · Singapore
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">
                &quot;The offline vouchers and live telemetry worked flawlessly even while we were
                deep in Munnar tea hills without cell reception. Best travel companion we&apos;ve ever
                used.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                  ER
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">Elena Rostova</div>
                  <div className="text-[10px] text-[#6B7280]">
                    Bali Cultural Retreat · London
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ SECTION                                                   */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#004AC6]">
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Everything you need to know about TripFlow
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does live flight delay cascade rescheduling work?',
              a: 'Our dispatch engine connects directly to commercial aviation telemetry. If your flight is delayed or rescheduled, the system automatically checks arrival times, notifies your assigned chauffeur, adjusts pickup times, and preserves downstream dining or sightseeing bookings without you having to make frantic calls.',
            },
            {
              q: 'Can I message my concierge on WhatsApp directly?',
              a: 'Yes! Every active itinerary is linked to a regional concierge team member (like Arun V. in South India). You can click the WhatsApp icon in the app or text them directly for customized requests, restaurant reservations, or on-the-ground support.',
            },
            {
              q: 'Does TripFlow work offline during remote journeys?',
              a: 'Yes. All itinerary vouchers, hotel contacts, flight numbers, and offline GPS maps are cached locally on your device. When you regain connectivity, the app syncs live telemetry automatically.',
            },
            {
              q: 'What is the Operations Command Hub?',
              a: 'The Operations Hub is our dedicated controller surface used by regional dispatch managers. It shows real-time fleet radar, vehicle manifests, and enables instantaneous one-click resolution of disruptions.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#111827] flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{item.q}</span>
                <span
                  className={`material-symbols-outlined text-base text-[#6B7280] transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#4B5563] leading-relaxed border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION BANNER                                   */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-linear-to-r from-[#003B99] via-[#004AC6] to-[#2563EB] text-white py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Immediate Instant Access Available</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to experience effortless luxury travel?
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Test both sides of our ecosystem: Explore the personalized guest itinerary as
            Sarah Mehta, or command the operations dispatch radar as Alex Vance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDemo}
              className="px-6 py-3.5 rounded-full bg-white text-[#004AC6] hover:bg-gray-100 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Launch Traveler Experience (Sarah Mehta)</span>
              <span className="material-symbols-outlined text-base">east</span>
            </button>
            <button
              onClick={onExploreOps}
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition-all backdrop-blur-xs cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base text-emerald-400">hub</span>
              <span>Launch Operations Command Hub</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12 px-4 sm:px-8 text-xs text-[#6B7280]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-base">flight_takeoff</span>
              </span>
              <span className="text-base font-bold text-[#004AC6]">TripFlow</span>
            </div>
            <p className="text-xs text-[#6B7280] max-w-sm">
              The dual-surface travel ecosystem pairing personalized living itineraries with
              real-time autonomous dispatch telemetry and verified 24/7 human concierges.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational · Live Telemetry Engine v2.4</span>
            </div>
          </div>

          <div>
            <div className="font-bold text-[#111827] mb-3">Consumer App</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onExploreDemo}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Living Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreDemo}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Discover & Plan
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreDemo}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Verified Vouchers
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreDemo}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  WhatsApp Concierge
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#111827] mb-3">Operations Hub</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onExploreOps}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Regional Fleet Radar
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreOps}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Flight Disruption Solver
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreOps}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Chauffeur Manifests
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreOps}
                  className="hover:text-[#004AC6] transition-colors cursor-pointer"
                >
                  Dispatch Telemetry
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#111827] mb-3">Company & Trust</div>
            <ul className="space-y-2">
              <li className="hover:text-[#004AC6] cursor-pointer">Privacy & Telemetry</li>
              <li className="hover:text-[#004AC6] cursor-pointer">Security Protocols</li>
              <li className="hover:text-[#004AC6] cursor-pointer">Chauffeur Vetting</li>
              <li className="hover:text-[#004AC6] cursor-pointer">Partner With Us</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9CA3AF]">
          <div>
            © {new Date().getFullYear()} TripFlow Inc. All rights reserved. Built with precision.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#111827] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#111827] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#111827] cursor-pointer">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
