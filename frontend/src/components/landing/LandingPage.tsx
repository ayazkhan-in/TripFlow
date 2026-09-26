import React, { useState, useRef, useEffect } from 'react';
import {
  CURATED_DESTINATIONS,
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
  onOpenBuilder?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreDemo,
  onExploreOps,
  onOpenBuilder,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(err => {
        console.warn('Video autoPlay prevented:', err);
      });
    }
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#151c27] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* CINEMATIC HERO SECTION WITH FLOATING HEADER (REFERENCE LAYOUT)*/}
      {/* ------------------------------------------------------------- */}
      <section className="relative min-h-screen flex flex-col justify-between text-white overflow-hidden isolate font-sans">
        {/* Background Media with Hero Video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src="/hero4k.mp4" type="video/mp4" />
            <source src="/hero2.webm" type="video/webm" />
          </video>
        </div>

        {/* TOP: Floating Transparent Navigation Header */}
        <header className="relative z-30 w-full px-6 sm:px-12 lg:px-16 py-8 flex items-center justify-between select-none">
          {/* Brand Anchor on Left (Matching DOLANAN style) */}
          <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-black tracking-wider text-black uppercase select-none">
            <img src="/bookit-white.png" alt="Bookit" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            <span>Bookit</span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-semibold text-black absolute left-1/2 -translate-x-1/2">
            <a href="#destinations" className="text-black hover:text-black/70 transition-colors">
              Destinations
            </a>
            {onOpenBuilder && (
              <button
                type="button"
                onClick={onOpenBuilder}
                className="text-black hover:text-black/70 transition-colors cursor-pointer"
              >
                Builder
              </button>
            )}
            <a href="#dual-surface" className="text-black hover:text-black/70 transition-colors">
              Operations
            </a>
            <a href="#vault" className="text-black hover:text-black/70 transition-colors">
              Vault
            </a>
            <a href="#features" className="text-black hover:text-black/70 transition-colors">
              Features
            </a>
          </nav>

          {/* Right CTA Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth('traveler')}
              className="hidden sm:inline-block text-xs font-semibold text-black hover:text-black/70 transition-colors px-3 py-1.5 cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('operator')}
              className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-slate-800 active:scale-95 text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              Register Now
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-black bg-white/80 hover:bg-white backdrop-blur-md border border-black/10 cursor-pointer shadow-sm"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-xl text-black">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-6 right-6 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-sm font-semibold text-black z-50 animate-in fade-in duration-200">
              <a
                href="#destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600 text-black"
              >
                Destinations
              </a>
              {onOpenBuilder && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBuilder();
                  }}
                  className="py-1 text-left hover:text-blue-600 text-black cursor-pointer"
                >
                  Itinerary Builder
                </button>
              )}
              <a
                href="#dual-surface"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600 text-black"
              >
                Operations
              </a>
              <a
                href="#vault"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600 text-black"
              >
                Vault
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600 text-black"
              >
                Features
              </a>
              <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('traveler');
                  }}
                  className="text-xs text-black/80 hover:text-black font-semibold"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onExploreDemo();
                  }}
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold"
                >
                  Register Now
                </button>
              </div>
            </div>
          )}
        </header>

        {/* MIDDLE: Left-Aligned Large Display Headline & Get Started Button */}
        <div className="relative z-20 px-6 sm:px-12 lg:px-16 my-auto py-12 max-w-4xl text-left">
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.04] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Personalized<br />
            Luxury<br />
            Journeys.
          </h1>

          <p className="text-base sm:text-lg text-white/95 leading-relaxed max-w-xl mt-5 font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            Bespoke, hand-crafted private itineraries that automatically adapt
            to flight delays, weather shifts, and chauffeur tracking in real time.
          </p>

          <div className="pt-6">
            <button
              onClick={onExploreDemo}
              className="px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
            </button>
          </div>
        </div>

        {/* BOTTOM: Social Proof Avatars & Category Pills */}
        <div className="relative z-20 px-6 sm:px-12 lg:px-16 pb-10 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Bottom Left: Avatar Stack */}
          <div className="flex items-center gap-3 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white/90 object-cover shadow-sm"
                src={USER_AVATAR}
                alt="Sarah"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white/90 object-cover shadow-sm"
                src={CONCIERGE_AVATAR}
                alt="Arun"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white/90 object-cover shadow-sm"
                src={ALEX_DISPATCH_AVATAR}
                alt="Alex"
              />
            </div>
            <div className="text-xs text-white/95 leading-tight">
              <span className="block text-white/80 font-normal">Booked by over</span>
              <span className="font-bold text-white">10K+ people</span>
            </div>
          </div>

          {/* Bottom Right: Category Pills */}
          <div className="flex items-center gap-2.5 flex-wrap drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            <span className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium hover:bg-black/50 transition-colors cursor-default shadow-xs">
              Curated Circuits
            </span>
            <span className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium hover:bg-black/50 transition-colors cursor-default shadow-xs">
              Live Telemetry
            </span>
            <span className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium hover:bg-black/50 transition-colors cursor-default shadow-xs">
              Chauffeur Mesh
            </span>
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
            Bookit replaces rigid static PDFs with living digital itineraries connected to
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
              Your vacation is not a rigid spreadsheet. Bookit organizes each day into
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
                Bookit had rebooked our driver Rajesh, notified the hotel, and saved our sunset
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
            Everything you need to know about Bookit
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
              q: 'Does Bookit work offline during remote journeys?',
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
            <div className="flex items-center gap-2.5">
              <img src="/bookit.png" alt="Bookit" className="w-7 h-7 object-contain" />
              <span className="text-base font-bold text-[#004AC6]">Bookit</span>
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
            © {new Date().getFullYear()} Bookit Inc. All rights reserved. Built with precision.
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
