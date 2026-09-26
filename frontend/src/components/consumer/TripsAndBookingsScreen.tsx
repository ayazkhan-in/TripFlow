import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookedTrip, TimelineEvent, ConsumerTab } from '../../types/travel';
import {
  CONCIERGE_AVATAR,
  DAY2_EVENTS,
  INITIAL_DAY1_EVENTS,
  KERALA_HERO_IMAGE,
  KERALA_TIMELINE_HERO,
  RESCHEDULED_DAY1_EVENTS,
  ROUTE_MAP_IMAGE,
} from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';
import { BlurFadeCard } from '../ui/MotionComponents';

interface TripsAndBookingsScreenProps {
  initialView?: 'timeline' | 'bookings';
  isDisruptionResolved: boolean;
  bookedTrips?: BookedTrip[];
  activeTripId?: string;
  onSelectTrip?: (tripId: string) => void;
  onModifyTrip?: (trip: BookedTrip) => void;
  onViewInVault?: (tripId?: string) => void;
  onOpenWhatsApp: () => void;
  onOpenCallConcierge: () => void;
  onDownloadPDF: () => void;
  onShareItinerary: () => void;
  onOpenTripAssistant: () => void;
  onNavigateTab?: (tab: ConsumerTab) => void;
  showToast?: (message: string) => void;
}

// Days 3 to 6 rich events data for comprehensive itinerary exploration
const DAY3_EVENTS: TimelineEvent[] = [
  {
    id: 'd3-breakfast',
    day: 3,
    time: '08:00 AM',
    category: 'dining',
    title: 'Highland Breakfast at The Leaf Pavilion',
    description: 'Buffet of Travancore Appam with stew, fresh organic estate passionfruit, and freshly brewed highland coffee.',
    badge: 'Included in Stay',
    badgeColor: 'blue',
    icon: 'bakery_dining',
  },
  {
    id: 'd3-safari',
    day: 3,
    time: '09:30 AM',
    category: 'activity',
    title: 'Eravikulam National Park & Rajamalai Safari',
    description: 'Special wildlife warden permit. Spot the endangered Nilgiri Tahr mountain goats amidst misty rolling shola grasslands.',
    badge: 'VIP Permit Confirmed',
    badgeColor: 'emerald',
    subBadge: 'Guide: Joseph M.',
    icon: 'hiking',
  },
  {
    id: 'd3-lunch',
    day: 3,
    time: '01:30 PM',
    category: 'dining',
    title: 'Rapsy Restaurant, Fort Munnar',
    description: 'Authentic Malabar parotta with pepper chicken roast and cardamom spiced tea at an iconic heritage establishment.',
    badge: 'Table Reserved',
    badgeColor: 'amber',
    icon: 'restaurant',
  },
  {
    id: 'd3-lake',
    day: 3,
    time: '04:00 PM',
    category: 'activity',
    title: 'Mattupetty Lake & Kundala Eco-Boat Cruise',
    description: 'Private electric speedboat ride across Kundala dam reservoir flanked by eucalyptus forests and wild tea bushes.',
    subBadge: '1.5 hrs',
    icon: 'kayaking',
  },
  {
    id: 'd3-dinner',
    day: 3,
    time: '07:45 PM',
    category: 'dining',
    title: 'Candlelight Plantation Dinner at The Leaf',
    description: 'Four-course organic dinner under starlit Munnar skies featuring Syrian Christian traditional spiced roast duck.',
    badge: 'Table for 2',
    badgeColor: 'emerald',
    icon: 'dinner_dining',
  },
];

const DAY4_EVENTS: TimelineEvent[] = [
  {
    id: 'd4-transfer',
    day: 4,
    time: '08:30 AM',
    category: 'transfer',
    title: 'Munnar Highlands → Alleppey Backwaters (Private SUV)',
    description: 'Chauffeur Arun V. with Toyota Innova Crysta. Scenic drive through rubber plantations and Kottayam backroads.',
    subBadge: '162 km · 4 hrs 15 min',
    icon: 'directions_car',
    chauffeur: 'Arun V.',
    vehicle: 'Toyota Innova Crysta (KL-07-CD-8841)',
  },
  {
    id: 'd4-houseboat',
    day: 4,
    time: '01:00 PM',
    category: 'hotel',
    title: 'Boarding Luxury Private Teak Kettuvallam Houseboat',
    description: 'Welcome tender coconut drink. Check-in to private air-conditioned master suite with panoramic bow sun-deck.',
    badge: 'Overnight Cruise',
    badgeColor: 'blue',
    icon: 'sailing',
    bookingRef: 'HB-LAKE-991',
  },
  {
    id: 'd4-lunch',
    day: 4,
    time: '02:00 PM',
    category: 'dining',
    title: 'Traditional Backwater Karimeen Pollichathu Feast',
    description: 'Pearl spot fish wrapped in scorched banana leaves with coconut red rice and avial, prepared fresh by onboard chef.',
    badge: 'Chef Onboard',
    badgeColor: 'emerald',
    icon: 'restaurant_menu',
  },
  {
    id: 'd4-sunset',
    day: 4,
    time: '05:30 PM',
    category: 'activity',
    title: 'Sunset Canoe Cruise Through Hidden Village Waterways',
    description: 'Quiet hand-rowed canoe through the narrow backwater canals of Kainakary, observing coir making and Chinese nets.',
    subBadge: 'Guided 1 hr',
    icon: 'rowing',
  },
  {
    id: 'd4-dinner',
    day: 4,
    time: '08:00 PM',
    category: 'dining',
    title: 'Starlit Lake Anchor Dinner on Vembanad Lake',
    description: 'Gentle ripples and traditional Kerala country chicken curry with steamed puttu as the houseboat anchors for the night.',
    badge: 'Private Anchor',
    badgeColor: 'emerald',
    icon: 'dinner_dining',
  },
];

const DAY5_EVENTS: TimelineEvent[] = [
  {
    id: 'd5-yoga',
    day: 5,
    time: '07:30 AM',
    category: 'activity',
    title: 'Sunrise Floating Deck Yoga & Pranayama',
    description: 'Gentle guided morning yoga session on the upper deck with morning mist over tranquil Vembanad Lake.',
    subBadge: 'Instructor: Lakshmi N.',
    icon: 'self_improvement',
  },
  {
    id: 'd5-resort',
    day: 5,
    time: '11:00 AM',
    category: 'hotel',
    title: 'Coconut Lagoon Heritage Resort & Spa, Kumarakom',
    description: 'Disembark houseboat and transfer by heritage wooden boat to resort lobby. Lake Front Heritage Pool Mansion.',
    badge: '1 Night Stay',
    badgeColor: 'blue',
    icon: 'hotel',
    bookingRef: 'CL-RESORT-204',
  },
  {
    id: 'd5-ayurveda',
    day: 5,
    time: '03:30 PM',
    category: 'activity',
    title: '90-Minute Signature Abhyanga Herbal Oil Therapy',
    description: 'Authentic synchronized Ayurvedic treatment by traditional practitioners with dosha-tailored warm medicated oils.',
    badge: 'Doctor Consulted',
    badgeColor: 'emerald',
    icon: 'spa',
  },
  {
    id: 'd5-culture',
    day: 5,
    time: '06:30 PM',
    category: 'activity',
    title: 'Live Kathakali & Kalaripayattu Demonstration',
    description: 'Witness the elaborate traditional facial makeup application followed by classical martial arts exhibition.',
    subBadge: 'Amphitheater',
    icon: 'theater_comedy',
  },
  {
    id: 'd5-dinner',
    day: 5,
    time: '08:00 PM',
    category: 'dining',
    title: 'Aymanam Seafood Grill at Coconut Lagoon',
    description: 'Fresh jumbo tiger prawns marinated in raw mango masala grilled over open charcoal embers by the water.',
    badge: 'Table Reserved',
    badgeColor: 'amber',
    icon: 'outdoor_grill',
  },
];

const DAY6_EVENTS: TimelineEvent[] = [
  {
    id: 'd6-breakfast',
    day: 6,
    time: '08:30 AM',
    category: 'dining',
    title: 'Verandah Farewell Breakfast & Artisan Spice Gift Pack',
    description: 'Final breakfast overlooking the bird sanctuary canal. Guest presentation of vacuum-sealed Wayanad black pepper & green cardamom.',
    badge: 'Complimentary Gift',
    badgeColor: 'emerald',
    icon: 'coffee',
  },
  {
    id: 'd6-transfer',
    day: 6,
    time: '11:00 AM',
    category: 'transfer',
    title: 'Kumarakom → Cochin International Airport T3 (SUV)',
    description: 'Chauffeur Arun V. meets at water jetty. Executive highway transfer directly to Departures Gate 3.',
    subBadge: '78 km · 2 hrs 10 min',
    icon: 'directions_car',
    chauffeur: 'Arun V.',
    vehicle: 'Toyota Innova Crysta (KL-07-CD-8841)',
  },
  {
    id: 'd6-flight',
    day: 6,
    time: '02:45 PM',
    category: 'flight',
    title: 'IndiGo 6E-205 (COK → DEL Return Flight)',
    description: 'Terminal 3 · Fast-track security lane · Priority Boarding Zone 1 · Scheduled Arrival Delhi T3 06:15 PM.',
    badge: 'Confirmed Seat 4A, 4B',
    badgeColor: 'emerald',
    icon: 'flight_takeoff',
    pnr: 'K8X29Q',
  },
];

export const TripsAndBookingsScreen: React.FC<TripsAndBookingsScreenProps> = ({
  initialView = 'timeline',
  isDisruptionResolved,
  bookedTrips,
  activeTripId,
  onSelectTrip,
  onModifyTrip,
  onViewInVault,
  onOpenWhatsApp,
  onOpenCallConcierge,
  onDownloadPDF,
  onShareItinerary,
  onOpenTripAssistant,
  onNavigateTab,
  showToast = () => {},
}) => {
  const currentTrip = (bookedTrips && bookedTrips.find(t => t.id === activeTripId)) || (bookedTrips && bookedTrips[0]);

  const flightInfo = currentTrip?.flightDetails || {
    airline: 'IndiGo Airlines',
    flightNumber: '6E-204',
    pnr: 'K8X29Q',
    route: 'BOM (Mumbai) ➔ COK (Kochi)',
    departureTime: '11:30 AM',
    arrivalTime: '01:45 PM',
    terminal: 'Terminal 2',
    gate: 'Gate 4B',
    seat: '14A, 14B (Premium Extra Legroom)',
    baggage: '25 kg Checked + 7 kg Cabin Per Passenger',
    status: 'Confirmed' as const,
  };

  const hotelInfo = currentTrip?.hotelCheckIn || {
    hotelName: 'Brunton Boatyard — CGH Earth Fort Kochi',
    roomType: 'Sea Facing Heritage Suite',
    checkInDate: 'Oct 14, 2025',
    checkInTime: '02:00 PM (Early Check-In Flagged)',
    checkOutDate: 'Oct 19, 2025',
    voucherRef: 'Voucher #BB-7881',
    address: 'Calvathy Road, Fort Kochi, Kerala',
    inclusions: ['Artisanal Breakfast', 'Sunset Harbour Cruise', 'Afternoon High Tea', '24/7 Concierge Desk'],
    nights: 5,
  };

  const carInfo = currentTrip?.carDetails || {
    vehicleType: 'Executive SUV',
    vehicleModel: 'Toyota Innova Crysta (KL-07-CD-8841)',
    licensePlate: 'KL-07-CD-8841',
    chauffeurName: 'Arun V.',
    chauffeurPhone: '+91 98401 22841',
    chauffeurRating: '4.98/5 (184 verified tours)',
    pickupLocation: 'Cochin Airport T3 Arrival Gate (Nameboard)',
    pickupTime: 'Upon Flight Landing (Real-Time Radar Sync)',
    serviceScope: 'Dedicated across all days of your itinerary',
    gpsTrackingActive: true,
  };

  const [activeSection, setActiveSection] = useState<'timeline' | 'bookings'>(initialView);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isFutureExpanded, setIsFutureExpanded] = useState<boolean>(false);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'flight' | 'hotel' | 'transfer' | 'experience'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPaymentReceiptOpen, setIsPaymentReceiptOpen] = useState<boolean>(false);

  const [selectedEventModal, setSelectedEventModal] = useState<TimelineEvent | null>(null);
  const [selectedBookingVoucher, setSelectedBookingVoucher] = useState<{
    id?: string;
    title: string;
    ref: string;
    dates: string;
    details: string;
    image: string;
    rating: string;
    price: string;
    amenities: { icon: string; label: string }[];
    flightInfo?: string;
    hotelInfo?: string;
    driverInfo?: string;
    conciergeInfo?: string;
    isCurrentActiveTrip?: boolean;
  } | null>(null);

  const day1Events = isDisruptionResolved
    ? RESCHEDULED_DAY1_EVENTS
    : INITIAL_DAY1_EVENTS;

  // Category visual mapper: soft tinted badges, crisp colors, perfectly clear icons
  const getTimelineCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('flight')) {
      return {
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
        dot: 'bg-indigo-500',
        label: 'Flight',
        icon: 'flight_takeoff',
      };
    }
    if (cat.includes('transfer') || cat.includes('drive') || cat.includes('transit') || cat.includes('suv')) {
      return {
        bg: 'bg-sky-50 border-sky-200 text-sky-600',
        dot: 'bg-sky-500',
        label: 'Transfer',
        icon: 'directions_car',
      };
    }
    if (cat.includes('hotel') || cat.includes('resort') || cat.includes('stay') || cat.includes('houseboat')) {
      return {
        bg: 'bg-purple-50 border-purple-200 text-purple-600',
        dot: 'bg-purple-500',
        label: 'Hotel & Stay',
        icon: 'hotel',
      };
    }
    if (cat.includes('lunch') || cat.includes('dinner') || cat.includes('dining') || cat.includes('breakfast') || cat.includes('cafe')) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-700',
        dot: 'bg-amber-500',
        label: 'Culinary',
        icon: 'restaurant',
      };
    }
    if (cat.includes('cruise') || cat.includes('boat') || cat.includes('sailing') || cat.includes('rowing') || cat.includes('kayak')) {
      return {
        bg: 'bg-teal-50 border-teal-200 text-teal-700',
        dot: 'bg-teal-500',
        label: 'Cruise & Water',
        icon: 'sailing',
      };
    }
    if (cat.includes('spa') || cat.includes('yoga') || cat.includes('wellness')) {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-600',
        dot: 'bg-rose-500',
        label: 'Wellness & Spa',
        icon: 'spa',
      };
    }
    // Activity, hike, safari, walk
    return {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Experience',
      icon: 'explore',
    };
  };

  const handleCopyCode = (key: string, code: string, label: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedKey(key);
    showToast(`${label} ${code} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Helper to render an event card with sleek, perfectly centered category badges
  const renderEventList = (events: TimelineEvent[]) => {
    return (
      <div className="relative border-l-2 border-slate-200/80 ml-5 sm:ml-6 space-y-6">
        {events.map((event, index) => {
          const catStyle = getTimelineCategoryStyle(event.category);
          const iconToRender = event.icon || catStyle.icon;

          return (
            <BlurFadeCard key={event.id} index={index} className="relative pl-7 sm:pl-8 group">
              {/* Perfectly Centered Category Badge */}
              <div
                className={`absolute -left-[17px] top-3.5 w-8 h-8 rounded-full border ${catStyle.bg} flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:shadow-md z-10`}
                title={event.category}
              >
                <span className="material-symbols-outlined text-[16px] leading-none select-none text-current">
                  {iconToRender}
                </span>
              </div>

              {/* Event Card Container */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-2xs hover:shadow-md transition-all text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Time & Category Metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                        {event.time}
                      </span>
                      {event.originalTime && event.originalTime !== event.time && (
                        <span className="text-[11px] font-mono line-through text-slate-400">
                          {event.originalTime}
                        </span>
                      )}
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        {catStyle.label}
                      </span>

                      {event.badge && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            event.badgeColor === 'emerald'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : event.badgeColor === 'red'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : event.badgeColor === 'amber'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            event.badgeColor === 'emerald' ? 'bg-emerald-500' :
                            event.badgeColor === 'red' ? 'bg-rose-500' :
                            event.badgeColor === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          {event.badge}
                        </span>
                      )}

                      {event.subBadge && (
                        <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200/60">
                          {event.subBadge}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>

                    {/* Secondary Contextual Credentials (PNR, Chauffeur, Booking Ref) */}
                    {(event.pnr || event.chauffeur || event.bookingRef) && (
                      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
                        {event.pnr && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50/80 border border-indigo-100 text-indigo-900 font-mono text-[11px]">
                            <span className="font-semibold text-indigo-600">PNR:</span>
                            <span className="font-bold">{event.pnr}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(`pnr-${event.id}`, event.pnr!, 'Flight PNR')}
                              className="text-indigo-400 hover:text-indigo-700 ml-0.5 p-0.5 cursor-pointer"
                              title="Copy PNR"
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {copiedKey === `pnr-${event.id}` ? 'check' : 'content_copy'}
                              </span>
                            </button>
                          </div>
                        )}

                        {event.chauffeur && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-sky-50/80 border border-sky-100 text-sky-900 text-[11px]">
                            <span className="material-symbols-outlined text-xs text-sky-600">person</span>
                            <span>{event.chauffeur}</span>
                            {event.vehicle && (
                              <span className="text-sky-700 font-mono">({event.vehicle})</span>
                            )}
                          </div>
                        )}

                        {event.bookingRef && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-50/80 border border-purple-100 text-purple-900 font-mono text-[11px]">
                            <span className="font-semibold text-purple-600">Ref:</span>
                            <span className="font-bold">{event.bookingRef}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(`ref-${event.id}`, event.bookingRef!, 'Booking Ref')}
                              className="text-purple-400 hover:text-purple-700 ml-0.5 p-0.5 cursor-pointer"
                              title="Copy Ref"
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {copiedKey === `ref-${event.id}` ? 'check' : 'content_copy'}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col items-center gap-2 self-start mt-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedEventModal(event)}
                      className="px-3 py-1.5 rounded-full text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer font-semibold shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-xs">info</span>
                      <span>Details</span>
                    </button>
                    {event.bookingRef && (
                      <button
                        type="button"
                        onClick={() => setSelectedEventModal(event)}
                        className="px-3 py-1.5 rounded-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors cursor-pointer border border-blue-200/60"
                      >
                        Voucher
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </BlurFadeCard>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* ------------------------------------------------------------- */}
      {/* SUB-HEADER / BREADCRUMB & MASTER SWITCHER                     */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left min-w-0">
            {/* Breadcrumb & Inline Trip Switcher */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-medium text-slate-400">Trips & Bookings</span>
              {currentTrip ? (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-700 font-semibold">
                    {currentTrip.destination}
                  </span>
                </>
              ) : null}

              {/* Multi-Trip Switcher (inline, clean segmented tabs, no bulky pills) */}
              {bookedTrips && bookedTrips.length > 1 && (
                <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg ml-1.5 border border-slate-200/60">
                  {bookedTrips.map(trip => {
                    const isActive = trip.id === currentTrip?.id;
                    const cleanDuration = trip.duration
                      ? trip.duration.split('·')[0].trim().replace('1 Days', '1 Day')
                      : '';
                    return (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => onSelectTrip?.(trip.id)}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {trip.destination} {cleanDuration ? `(${cleanDuration})` : ''}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Page Title */}
            <h1 className="text-xl sm:text-2xl text-slate-900 font-extrabold tracking-tight truncate">
              {currentTrip
                ? activeSection === 'timeline'
                  ? currentTrip.title || `${currentTrip.destination} Luxury Itinerary`
                  : 'Confirmed Passes & Bookings'
                : 'Trips & Bookings'}
            </h1>

            {/* Clean Structured Metadata Row (no unnecessary pills) */}
            {currentTrip ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Confirmed</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-500">
                  Ref #{currentTrip.bookingRef}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <span className="material-symbols-outlined text-[13px] text-slate-400">calendar_today</span>
                  <span>{currentTrip.dates}</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">group</span>
                  <span>{currentTrip.travelers} Travelers</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-slate-900">
                  ₹{currentTrip.totalPrice.toLocaleString('en-IN')}
                </span>

              {/* Payment Plan & Settlement Badge */}
              {currentTrip?.paymentDetails && (
                <>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => setIsPaymentReceiptOpen(true)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:opacity-90 active:scale-95 ${
                      currentTrip.paymentDetails.type === 'group_split'
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : currentTrip.paymentDetails.type === 'installments'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {currentTrip.paymentDetails.type === 'group_split'
                        ? 'groups'
                        : currentTrip.paymentDetails.type === 'installments'
                        ? 'calendar_month'
                        : 'verified'}
                    </span>
                    <span>
                      {currentTrip.paymentDetails.type === 'group_split'
                        ? `Group Split (${currentTrip.paymentDetails.groupSplit?.paidMembersCount || 1}/${currentTrip.paymentDetails.groupSplit?.totalMembers || 4} Settled)`
                        : currentTrip.paymentDetails.type === 'installments'
                        ? `Installments (${currentTrip.paymentDetails.installmentsPlan?.paidInstallments || 1}/${currentTrip.paymentDetails.installmentsPlan?.totalInstallments || 3} Paid)`
                        : 'Settled in Full'}
                    </span>
                    <span className="material-symbols-outlined text-[11px]">receipt_long</span>
                  </button>
                </>
              )}
            </div>
            ) : null}
          </div>

          {/* Right: Modern Segmented View Switcher */}
          <div className="shrink-0 self-start md:self-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveSection('timeline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSection === 'timeline'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">timeline</span>
                <span>Active Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('bookings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSection === 'bookings'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">confirmation_number</span>
                <span>Confirmed Bookings</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  ({bookedTrips?.length ?? 0})
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* VIEW 1: ACTIVE TIMELINE VIEW */}
      {activeSection === 'timeline' && (
        !currentTrip ? (
          <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center space-y-6 animate-in fade-in duration-200">
            <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100 shadow-2xs">
                <span className="material-symbols-outlined text-3xl">route</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  No Active Itinerary Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  You don't have any booked trips or active journeys at the moment. Browse our curated luxury circuits or create your custom itinerary.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('discover')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  <span>Explore Circuits</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('builder')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit_calendar</span>
                  <span>Plan with AI</span>
                </button>
              </div>
            </div>
          </main>
        ) : (
        <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 animate-in fade-in duration-200">
          {/* Hero Banner: Luxury Visual with Live Status */}
          <BlurFadeCard index={0} className="relative rounded-3xl overflow-hidden min-h-[320px] bg-slate-900 shadow-md group flex flex-col justify-between p-4 sm:p-8 text-white">
            <div className="absolute inset-0 pointer-events-none">
              <img
                alt={currentTrip.title || 'Trip hero'}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                src={currentTrip.heroImage || KERALA_TIMELINE_HERO}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent"></div>
            </div>

            {/* Hero Content (in normal flow so it naturally expands container height on mobile) */}
            <div className="relative z-10 flex flex-col justify-between gap-6 min-h-[260px] text-white">
              {/* Top Status & Weather Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-xs border border-white/50">
                    <span className="material-symbols-outlined text-amber-500 text-sm">
                      partly_cloudy_day
                    </span>
                    24°C {currentTrip?.destination || 'Munnar'} · Highland Mist
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-900 text-xs font-bold shadow-xs border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    All Bookings Synced & Live
                  </span>
                </div>

                {/* Quick Actions (Including Modify Trip in Builder) */}
                <div className="flex items-center gap-2 flex-wrap">
                  {onModifyTrip && currentTrip && (
                    <button
                      type="button"
                      onClick={() => onModifyTrip(currentTrip)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 border border-amber-300/60 cursor-pointer"
                      title="Modify this trip in Itinerary Builder"
                    >
                      <span className="material-symbols-outlined text-sm">edit_calendar</span>
                      <span>Modify Trip in Builder</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onDownloadPDF}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-xs transition-all active:scale-95 border border-white/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={onShareItinerary}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-xs transition-all active:scale-95 border border-white/40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">ios_share</span>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenTripAssistant}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-all active:scale-95 cursor-pointer ring-2 ring-blue-300/40"
                  >
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    <span>Trip Assistant</span>
                  </button>
                </div>
              </div>

              {/* Bottom Hero Description */}
              <div className="max-w-2xl text-left">
                <div className="inline-block px-3 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[11px] mb-2 tracking-wide font-bold uppercase">
                  Confirmed Signature Circuit · Ref #{currentTrip?.bookingRef || 'KL-9402'}
                </div>
                <h2 className="text-2xl sm:text-4xl text-white tracking-tight font-extrabold drop-shadow-sm">
                  {currentTrip?.title || 'Monsoon Whispers & Serene Backwaters'}
                </h2>
                <p className="text-white/90 text-xs sm:text-sm mt-1.5 drop-shadow-sm leading-relaxed max-w-xl">
                  {currentTrip?.destination} bespoke luxury circuit with verified flights, boutique stays, and dedicated private chauffeur.
                </p>

                {/* Route Chain Pill */}
                <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex-wrap">
                  <span className="text-white font-bold">Cochin Airport</span>
                  <span className="material-symbols-outlined text-xs text-blue-300">arrow_forward</span>
                  <span className="text-blue-200">Fort Kochi</span>
                  <span className="material-symbols-outlined text-xs text-blue-300">arrow_forward</span>
                  <span className="text-white font-bold">Munnar Highlands</span>
                  <span className="material-symbols-outlined text-xs text-blue-300">arrow_forward</span>
                  <span className="text-blue-200">Alleppey Houseboat</span>
                </div>
              </div>
            </div>
          </BlurFadeCard>

          {/* ========================================================= */}
          {/* TRIP LOGISTICS & DETAILS HUB (FLIGHT, HOTEL, CAR, VAULT)   */}
          {/* ========================================================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Trip Logistics & Active Reservations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onViewInVault?.(currentTrip?.id)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All in Travel Vault</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Flight Details */}
              <BlurFadeCard index={0} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold">
                      <span className="material-symbols-outlined text-xs">flight</span>
                      <span>Flight Details</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {flightInfo.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {flightInfo.airline} ({flightInfo.flightNumber})
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{flightInfo.route}</p>
                  </div>

                  {/* PNR Code Pill with Copy */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs font-mono">
                      <span className="text-slate-400 font-semibold mr-1.5">PNR:</span>
                      <span className="font-extrabold text-indigo-900">{flightInfo.pnr}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode('flight-pnr', flightInfo.pnr, 'Flight PNR')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedKey === 'flight-pnr' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedKey === 'flight-pnr' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Departure:</span>
                      <span className="font-semibold text-slate-800">{flightInfo.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Terminal & Gate:</span>
                      <span className="font-semibold text-slate-800">{flightInfo.terminal} · {flightInfo.gate || 'Gate 4B'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Seats:</span>
                      <span className="font-semibold text-slate-800">{flightInfo.seat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Baggage Allowance:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{flightInfo.baggage}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onViewInVault?.(currentTrip?.id)}
                    className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">qr_code_2</span>
                    <span>View Boarding Pass in Vault</span>
                  </button>
                </div>
              </BlurFadeCard>

              {/* Card 2: Hotel Check-In Details */}
              <BlurFadeCard index={1} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold">
                      <span className="material-symbols-outlined text-xs">hotel</span>
                      <span>Hotel Check-In</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {hotelInfo.nights} Nights
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 truncate" title={hotelInfo.hotelName}>
                      {hotelInfo.hotelName}
                    </h4>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">{hotelInfo.roomType}</p>
                  </div>

                  {/* Voucher Ref */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs font-mono">
                      <span className="text-slate-400 font-semibold mr-1.5">Ref:</span>
                      <span className="font-extrabold text-purple-900">{hotelInfo.voucherRef}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode('hotel-ref', hotelInfo.voucherRef, 'Voucher Ref')}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedKey === 'hotel-ref' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedKey === 'hotel-ref' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Check-in Date:</span>
                      <span className="font-semibold text-slate-800">{hotelInfo.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Check-in Time:</span>
                      <span className="font-semibold text-slate-800">{hotelInfo.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Check-out Date:</span>
                      <span className="font-semibold text-slate-800">{hotelInfo.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inclusions:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">Breakfast & Cruise</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onViewInVault?.(currentTrip?.id)}
                    className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">confirmation_number</span>
                    <span>View Hotel Voucher in Vault</span>
                  </button>
                </div>
              </BlurFadeCard>

              {/* Card 3: Car & Chauffeur Details */}
              <BlurFadeCard index={2} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
                      <span className="material-symbols-outlined text-xs">directions_car</span>
                      <span>Car & Chauffeur</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Radar GPS Active
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {carInfo.vehicleModel}
                    </h4>
                    <p className="text-xs text-sky-700 font-semibold mt-0.5">
                      Chauffeur: {carInfo.chauffeurName} ({carInfo.chauffeurRating})
                    </p>
                  </div>

                  {/* License Plate */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs font-mono">
                      <span className="text-slate-400 font-semibold mr-1.5">Plate:</span>
                      <span className="font-extrabold text-sky-900">{carInfo.licensePlate}</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Assigned
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver Phone:</span>
                      <span className="font-semibold text-slate-800 font-mono">{carInfo.chauffeurPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pickup Point:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{carInfo.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pickup Time:</span>
                      <span className="font-semibold text-slate-800">{carInfo.pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service Scope:</span>
                      <span className="font-semibold text-slate-800">Dedicated 24/7</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewInVault?.(currentTrip?.id)}
                    className="flex-1 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span>Car Manifest</span>
                  </button>
                </div>
              </BlurFadeCard>
            </div>

            {/* Trip Modification Callout Banner */}
            <BlurFadeCard index={3} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <span className="material-symbols-outlined text-xl">tune</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Want to personalize or modify this trip?
                    </h4>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ₹{currentTrip ? currentTrip.totalPrice.toLocaleString('en-IN') : '42,800'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Opening the Itinerary Builder allows you to modify hotels, add experiences, or adjust dates. The total price updates dynamically in real-time.
                  </p>
                </div>
              </div>

              {onModifyTrip && currentTrip && (
                <button
                  type="button"
                  onClick={() => onModifyTrip(currentTrip)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">edit_calendar</span>
                  <span>Modify Trip in Builder</span>
                </button>
              )}
            </BlurFadeCard>
          </section>

          {/* Dynamic Disruption Reconcile Notice */}
          {isDisruptionResolved && (
            <BlurFadeCard index={4} className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-base">auto_fix_high</span>

                </span>
                <div>
                  <span className="font-bold text-slate-900">Schedule Auto-Reconciled by Dispatch Controller:</span>{' '}
                  <span className="text-slate-700">
                    IndiGo flight delay was absorbed seamlessly. Chauffeur pickup moved to 02:30 PM & sunset walking tour aligned for golden hour.
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold bg-white text-blue-800 px-3 py-1 rounded-full border border-blue-200 shrink-0 self-start sm:self-auto">
                Zero Friction Guaranteed
              </span>
            </BlurFadeCard>
          )}

          {/* Layout Grid: Living Chronological Timeline + Right Intelligence Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Living Chronological Journey Timeline (8 cols) */}
            <section className="lg:col-span-8 flex flex-col gap-6">
              {/* Day Selector Segmented Tabs */}
              <div className="bg-white p-1.5 rounded-2xl sm:rounded-full border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto touch-pan-x custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedDayFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDayFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  All Days (6)
                </button>
                {[
                  { day: 1, label: 'Day 1 — Kochi' },
                  { day: 2, label: 'Day 2 — Munnar' },
                  { day: 3, label: 'Day 3 — Lakes & Treks' },
                  { day: 4, label: 'Day 4 — Houseboat' },
                  { day: 5, label: 'Day 5 — Kumarakom' },
                  { day: 6, label: 'Day 6 — Departure' },
                ].map(item => (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => setSelectedDayFilter(item.day)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedDayFilter === item.day
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Master Timeline Flow Container */}
              <div className="space-y-12">
                {/* DAY 1 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 1) && (
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          1
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 1 — KOCHI
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Saturday, June 14</span>
                          </div>
                          <p className="text-xs text-slate-500">Arrival & Spice Coast Heritage Walk</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {day1Events.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(day1Events)}
                  </div>
                )}

                {/* DAY 2 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 2) && (
                  <div className="relative space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          2
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 2 — MUNNAR
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Sunday, June 15</span>
                          </div>
                          <p className="text-xs text-slate-500">Misty Tea Plantations & Highland Vistas</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {DAY2_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(DAY2_EVENTS)}
                  </div>
                )}

                {/* DAY 3 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 3) && (
                  <div className="relative space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          3
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 3 — MUNNAR HIGHLANDS
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Monday, June 16</span>
                          </div>
                          <p className="text-xs text-slate-500">Rajamalai Safari & Eco-Lake Boat Cruise</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {DAY3_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(DAY3_EVENTS)}
                  </div>
                )}

                {/* DAY 4 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 4) && (
                  <div className="relative space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          4
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 4 — ALLEPPEY BACKWATERS
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Tuesday, June 17</span>
                          </div>
                          <p className="text-xs text-slate-500">Private Wooden Kettuvallam Overnight Cruise</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {DAY4_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(DAY4_EVENTS)}
                  </div>
                )}

                {/* DAY 5 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 5) && (
                  <div className="relative space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          5
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 5 — KUMARAKOM RESORT
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Wednesday, June 18</span>
                          </div>
                          <p className="text-xs text-slate-500">Ayurvedic Rejuvenation & Kathakali Night</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {DAY5_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(DAY5_EVENTS)}
                  </div>
                )}

                {/* DAY 6 */}
                {(selectedDayFilter === 'all' || selectedDayFilter === 6) && (
                  <div className="relative space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-xs">
                          6
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              DAY 6 — COCHIN DEPARTURE
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">Thursday, June 19</span>
                          </div>
                          <p className="text-xs text-slate-500">Executive Chauffeur Transfer & Return Flight</p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {DAY6_EVENTS.length} Events Scheduled
                      </span>
                    </div>

                    {renderEventList(DAY6_EVENTS)}
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Contextual Intelligence & Concierge Inspector (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Card 1: Trip Health & Intelligence Card */}
              <BlurFadeCard index={0} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <h4 className="text-sm font-bold text-slate-900">Trip Health & Intel</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                    Real-time
                  </span>
                </div>

                {/* Flight Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-sm text-indigo-600">flight</span>{' '}
                      IndiGo 6E-204 (DEL → COK)
                    </span>
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded-full border font-bold ${
                        isDisruptionResolved
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      {isDisruptionResolved ? '+5h (Handled)' : 'On Schedule'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDisruptionResolved ? 'bg-amber-500 w-full' : 'bg-emerald-500 w-full'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Weather Stream */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">cloud_queue</span>
                      Highland Climate Watch
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">Munnar & Alleppey</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mild intermittent drizzle predicted for evening walks in Munnar. Roads clear and navigable. Chauffeur equipped with travel umbrellas.
                  </p>
                </div>

                {/* Concierge Live Note */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base mt-0.5 shrink-0">
                    verified_user
                  </span>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">Local Concierge Note:</span> Fort Kochi Chinese Fishing Net restoration was completed yesterday; full evening demonstrations are operating seamlessly.
                  </div>
                </div>
              </BlurFadeCard>

              {/* Card 2: Transparent Budget Breakdown */}
              <BlurFadeCard index={1} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">Budget Breakdown</h4>
                  <span className="font-mono text-xs font-bold text-blue-600">₹42,800 Total</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> Luxury Stays (5 nights)
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹24,500</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-sky-400"></span> Private EV & SUV Transfers
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹9,200</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Guided Tours & Passes
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹6,100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Dining Reserve & Tastings
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹3,000</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5 mt-2">
                    <div className="bg-blue-600 h-full" style={{ width: '57%' }}></div>
                    <div className="bg-sky-400 h-full" style={{ width: '21%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: '7%' }}></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
                    <span>All Taxes & Tolls Included</span>
                    <button
                      type="button"
                      onClick={onDownloadPDF}
                      className="text-blue-600 font-bold cursor-pointer hover:underline"
                    >
                      Download Invoices
                    </button>
                  </div>
                </div>
              </BlurFadeCard>

              {/* Card 3: Assigned Concierge Specialist */}
              <BlurFadeCard index={2} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-bold">
                    Assigned Operations Concierge
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    On Duty
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    alt="Assigned Concierge Arun V."
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
                    src={CONCIERGE_AVATAR}
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Arun V.</div>
                    <p className="text-xs text-slate-500">Senior Dispatch & Guest Experience</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                      <span className="material-symbols-outlined text-xs">star</span>
                      <span className="font-bold">4.98</span>
                      <span className="text-slate-400">· 184 Kerala Tours</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCallConcierge}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Call Desk</span>
                  </button>
                </div>
              </BlurFadeCard>

              {/* Card 4: Quick Navigation Route Map Preview */}
              <BlurFadeCard index={3} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs text-left">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">Route Visualizer</div>
                  <span className="font-mono text-[11px] text-blue-600 font-bold">242 km total circuit</span>
                </div>
                <div className="relative h-44 bg-slate-100 w-full overflow-hidden">
                  <img
                    alt="Kerala Circuit Map Preview"
                    className="w-full h-full object-cover"
                    src={ROUTE_MAP_IMAGE}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-900 shadow-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-blue-600 text-sm">near_me</span>
                      Next leg: Fort Kochi → Munnar
                    </span>
                  </div>
                </div>
              </BlurFadeCard>
            </aside>
          </div>
        </main>
        )
      )}

      {/* ============================================================= */}
      {/* VIEW 2: CONFIRMED BOOKINGS & PASSES VIEW                      */}
      {/* ============================================================= */}
      {activeSection === 'bookings' && (
        <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  Verified Vouchers & Boarding Passes
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {bookedTrips && bookedTrips.length > 0
                    ? `${bookedTrips.length} Active Trip${bookedTrips.length > 1 ? 's' : ''} Confirmed`
                    : '0 Active Bookings'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Confirmed Bookings & Passes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Access your real-time e-tickets, boutique hotel reservations, and private transfer vouchers across all confirmed circuits.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentTrip ? (
                <button
                  type="button"
                  onClick={() => setActiveSection('timeline')}
                  className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">timeline</span>
                  <span>Back to {currentTrip.destination} Timeline</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('discover')}
                  className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  <span>Explore & Book Trips</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: 'all', label: 'All Passes (3 Circuits)', icon: 'confirmation_number' },
              { id: 'flight', label: 'Flight E-Tickets', icon: 'flight' },
              { id: 'hotel', label: 'Boutique Stays', icon: 'hotel' },
              { id: 'transfer', label: 'Private Chauffeur', icon: 'directions_car' },
              { id: 'experience', label: 'Guided Passes', icon: 'explore' },
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setBookingFilter(pill.id as any)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  bookingFilter === pill.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Booked Trips Section */}
          {bookedTrips && bookedTrips.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Your Active Booked Trips ({bookedTrips.length})
                  </h3>
                </div>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
                {bookedTrips.map((trip, tripIdx) => (
                  <div key={trip.id} className="flex flex-col">
                    <LuxuryCard
                      index={tripIdx}
                      id={trip.id}
                      title={trip.title}
                      description={`${trip.duration} with confirmed ${trip.flightDetails.airline} flight, ${trip.hotelCheckIn.hotelName.split('—')[0].trim()}, and dedicated ${trip.carDetails.vehicleModel.split('(')[0].trim()}.`}
                      image={trip.heroImage}
                      rating="4.96/5"
                      amenities={[
                        { icon: 'flight', label: trip.flightDetails.flightNumber },
                        { icon: 'hotel', label: trip.hotelCheckIn.nights + ' Nights' },
                        { icon: 'directions_car', label: trip.carDetails.chauffeurName },
                        { icon: 'verified_user', label: trip.bookingRef },
                        { icon: 'shield', label: 'Allianz' },
                        { icon: 'lock', label: 'In Vault' },
                      ]}
                      price={`₹${trip.totalPrice.toLocaleString('en-IN')}`}
                      pricePeriod="/trip"
                      actionLabel="View Details"
                      actionVariant="button"
                      onClick={() => {
                        onSelectTrip?.(trip.id);
                        setActiveSection('timeline');
                      }}
                    />
                    {/* Actions under card: Modify in Builder & View in Vault */}
                    <div className="mt-2.5 flex items-center gap-2 px-1">
                      <button
                        type="button"
                        onClick={() => onModifyTrip?.(trip)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit_calendar</span>
                        <span>Modify in Builder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewInVault?.(trip.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                        title="View Documents in Vault"
                      >
                        <span className="material-symbols-outlined text-base">lock</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">luggage</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    No Active Bookings on this Account
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select a curated circuit below or customize an itinerary to book and see your boarding passes and confirmed vouchers here.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.('discover')}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                Browse Circuits
              </button>
            </div>
          )}

          {/* Booking Cards Horizontal / Grid Showcase */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Curated Circuits Available for Instant Booking
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab?.('discover')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Catalog</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth items-stretch">
            {/* Booking 1: Kerala Escape */}
            <LuxuryCard
              index={0}
              id="booking-kerala"
              title="Kerala Escape — Luxury Circuit"
              description="6-day luxury circuit with confirmed IndiGo flights, Old Harbour boutique hotel, and private houseboat."
              image={KERALA_HERO_IMAGE}
              rating="4.95/5"
              amenities={[
                { icon: 'flight', label: 'IndiGo 6E-204' },
                { icon: 'hotel', label: 'Old Harbour' },
                { icon: 'directions_car', label: 'Innova Crysta' },
                { icon: 'sailing', label: 'Houseboat' },
                { icon: 'spa', label: 'Ayurveda' },
                { icon: 'verified_user', label: 'Concierge' },
              ]}
              price="₹42,800"
              pricePeriod="/trip"
              actionLabel="View Boarding Pass"
              actionVariant="button"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'kerala-booking',
                  title: 'Kerala Escape — Luxury Circuit',
                  ref: 'REF #KL-92041',
                  dates: 'June 14–19, 2025',
                  details:
                    'IndiGo 6E-204 (BOM→COK) · Old Harbour Hotel Fort Kochi · Private Luxury Teak Houseboat Alleppey · Dedicated Innova Crysta Chauffeur · Spice Plantation & Ayurveda Spa.',
                  image: KERALA_HERO_IMAGE,
                  rating: '4.95/5',
                  price: '₹42,800',
                  amenities: [
                    { icon: 'flight', label: 'IndiGo 6E-204' },
                    { icon: 'hotel', label: 'Old Harbour' },
                    { icon: 'directions_car', label: 'Innova Crysta' },
                    { icon: 'sailing', label: 'Houseboat' },
                    { icon: 'spa', label: 'Ayurveda' },
                    { icon: 'verified_user', label: 'Concierge' },
                  ],
                  flightInfo: 'IndiGo 6E-204 · On-Time · Gate 4B · Terminal 2',
                  hotelInfo: 'Old Harbour Heritage Suite · Check-in confirmed 14:00',
                  driverInfo: 'Arun V. · Toyota Innova Crysta (KL-07-CD-8841)',
                  conciergeInfo: 'Arun V. (Senior Operations Concierge) · +91 98401 22841',
                  isCurrentActiveTrip: Boolean(bookedTrips && bookedTrips.some(t => t.id === 'kerala-escape' || t.destination.toLowerCase().includes('kerala'))),
                })
              }
            />

            {/* Booking 2: Rajasthan Royal Heritage */}
            <LuxuryCard
              index={1}
              id="booking-rajasthan"
              title="Rajasthan Royal Heritage"
              description="6 nights & 7 days palace circuit with private guide, heritage Havelis, and sunset desert dining."
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDYoWQHDLBf3TSHPEbB_b3jDxw2Jt-X5Lzb-yOsbLzxWUJxb5g28sXzxlAl4dslwH4fJE-5f86LN6CojW_Pk9g5t3mzchWVM4uPEMJHgSk-FfatTWCqcuZFSxXBMoWOSEyimkrPWwBBWhFrjlDEqznGjSyQQVqZSTp39EgW--0iPYn6EB7V9B5AlL0934o8WSe7lh9zP1qGOGZ9zEwHjVJdDjr7xjUZDJTpYI4gAx9Mn4PbIWYizLyAfw"
              rating="4.9/5"
              amenities={[
                { icon: 'flight', label: 'SpiceJet' },
                { icon: 'castle', label: 'Haveli Stay' },
                { icon: 'directions_car', label: 'Chauffeur' },
                { icon: 'museum', label: 'Palace Guide' },
                { icon: 'sailing', label: 'Lake Cruise' },
                { icon: 'verified_user', label: 'VIP Pass' },
              ]}
              price="₹68,500"
              pricePeriod="/trip"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'rajasthan-booking',
                  title: 'Rajasthan Royal Heritage',
                  ref: 'REF #RJ-33411',
                  dates: 'Oct 12–18, 2025',
                  details:
                    'SpiceJet SG-8194 · Samode Haveli Jaipur & Taj Lake Palace Udaipur · Private Chauffeur, Royal Historian Guide & Sunset Pichola Cruise.',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDYoWQHDLBf3TSHPEbB_b3jDxw2Jt-X5Lzb-yOsbLzxWUJxb5g28sXzxlAl4dslwH4fJE-5f86LN6CojW_Pk9g5t3mzchWVM4uPEMJHgSk-FfatTWCqcuZFSxXBMoWOSEyimkrPWwBBWhFrjlDEqznGjSyQQVqZSTp39EgW--0iPYn6EB7V9B5AlL0934o8WSe7lh9zP1qGOGZ9zEwHjVJdDjr7xjUZDJTpYI4gAx9Mn4PbIWYizLyAfw',
                  rating: '4.9/5',
                  price: '₹68,500',
                  amenities: [
                    { icon: 'flight', label: 'SpiceJet' },
                    { icon: 'castle', label: 'Haveli Stay' },
                    { icon: 'directions_car', label: 'Chauffeur' },
                    { icon: 'museum', label: 'Palace Guide' },
                    { icon: 'sailing', label: 'Lake Cruise' },
                    { icon: 'verified_user', label: 'VIP Pass' },
                  ],
                  flightInfo: 'SpiceJet SG-8194 · Scheduled On-Time · Gate 2A',
                  hotelInfo: 'Samode Haveli Deluxe Royal Suite & Taj Lake Palace',
                  driverInfo: 'Raghav Singh · Toyota Fortuner (RJ-14-EA-7721)',
                  conciergeInfo: 'Pooja K. (Rajasthan Specialist) · +91 94140 88219',
                  isCurrentActiveTrip: false,
                })
              }
            />

            {/* Booking 3: Bali Cultural Retreat */}
            <LuxuryCard
              index={2}
              id="booking-bali"
              title="Bali Cultural Retreat"
              description="7 nights & 8 days wellness journey with rainforest yoga pavilions, artisanal coffee plantations, and ocean sunsets."
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBByXADs2g9PfqudzYxkj7KyJDF6ZQ9yyFek6w2gqfRr-EML0_oKL0IRb057Qttkd2QyTpq7NoqMACYqbqWrT8Sdx4CH6Qs3MMk2ZESUQwcHAK0RZq1iR1eor7XhZHaO0vGDERLrRIPgd3TwLfh_-PsCEizjAylSSiWgY6BrEFD8lZN0SDu5zx9FsAxi8EpEuNrDrXnRaT9cQSukMkRlYl7pnpkLNeQlZ6PtXLh_Hja1YUULi1FKrjDBA"
              rating="4.85/5"
              amenities={[
                { icon: 'flight', label: 'Air Tickets' },
                { icon: 'villa', label: 'Pool Villa' },
                { icon: 'directions_car', label: 'Chauffeur' },
                { icon: 'spa', label: 'Sound Spa' },
                { icon: 'nature_people', label: 'Artisan Tour' },
                { icon: 'verified_user', label: 'VIP Pass' },
              ]}
              price="₹84,000"
              pricePeriod="/trip"
              onClick={() =>
                setSelectedBookingVoucher({
                  id: 'bali-booking',
                  title: 'Bali Cultural Retreat',
                  ref: 'REF #BL-5502',
                  dates: 'Nov 4–11, 2025',
                  details:
                    'Singapore Airlines SQ-503 · Kamandalu Ubud Pool Villa & Alila Seminyak Beachfront Suite · Sound Healing & Artisanal Coffee Tour.',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBByXADs2g9PfqudzYxkj7KyJDF6ZQ9yyFek6w2gqfRr-EML0_oKL0IRb057Qttkd2QyTpq7NoqMACYqbqWrT8Sdx4CH6Qs3MMk2ZESUQwcHAK0RZq1iR1eor7XhZHaO0vGDERLrRIPgd3TwLfh_-PsCEizjAylSSiWgY6BrEFD8lZN0SDu5zx9FsAxi8EpEuNrDrXnRaT9cQSukMkRlYl7pnpkLNeQlZ6PtXLh_Hja1YUULi1FKrjDBA',
                  rating: '4.85/5',
                  price: '₹84,000',
                  amenities: [
                    { icon: 'flight', label: 'Air Tickets' },
                    { icon: 'villa', label: 'Pool Villa' },
                    { icon: 'directions_car', label: 'Chauffeur' },
                    { icon: 'spa', label: 'Sound Spa' },
                    { icon: 'nature_people', label: 'Artisan Tour' },
                    { icon: 'verified_user', label: 'VIP Pass' },
                  ],
                  flightInfo: 'Singapore Airlines SQ-503 · Scheduled · Terminal 3',
                  hotelInfo: 'Kamandalu Ubud Pool Villa & Alila Seminyak Ocean Suite',
                  driverInfo: 'Wayan Subawa · Private Luxury Alphard (DK-1945-WS)',
                  conciergeInfo: 'Ketut Astawa (Bali Concierge) · +62 812 3456 7890',
                  isCurrentActiveTrip: false,
                })
              }
            />
          </div>

          {/* Quick Informational Notice */}
          <BlurFadeCard index={3} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <span className="material-symbols-outlined text-2xl">qr_code_2</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  All Boarding Passes & Vouchers Synchronized to Travel Vault
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Offline PKPASS boarding cards, hotel reservation confirmations, and emergency doctor numbers are safely encrypted on your device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDownloadPDF}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-900 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              Download All Vouchers (PDF)
            </button>
          </BlurFadeCard>
        </main>
      )}

      {/* Individual Event Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
                  <span className="material-symbols-outlined text-base">
                    {selectedEventModal.icon}
                  </span>
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">Itinerary Event Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Event
                </span>
                <span className="font-bold text-sm text-slate-900">
                  {selectedEventModal.title}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Scheduled Time
                </span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {selectedEventModal.time}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Description
                </span>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>
              {selectedEventModal.chauffeur && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Assigned Chauffeur
                  </span>
                  <span className="text-slate-900 font-bold">
                    {selectedEventModal.chauffeur}
                  </span>
                </div>
              )}
              {selectedEventModal.bookingRef && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-blue-600">
                    {selectedEventModal.bookingRef}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedEventModal(null);
                  onOpenWhatsApp();
                }}
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Ask Concierge to Adjust</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Booking Voucher Pass Modal */}
      {selectedBookingVoucher && (
        <div
          onClick={() => setSelectedBookingVoucher(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          {/* Outer Bezel */}
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#1e242b] p-1.5 sm:p-2 rounded-[28px] sm:rounded-[32px] max-w-lg w-full border border-black/40 shadow-2xl animate-in zoom-in-95 duration-200 text-left"
          >
            {/* Inner Framed Container */}
            <div className="relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#222830] flex flex-col max-h-[88vh] overflow-y-auto custom-scrollbar">
              {/* Top Hero Image Header */}
              <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden">
                <img
                  src={selectedBookingVoucher.image}
                  alt={selectedBookingVoucher.title}
                  className="w-full h-full object-cover"
                />

                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, #1e242b 0%, rgba(30,36,43,0.96) 22%, rgba(30,36,43,0.82) 46%, rgba(30,36,43,0.45) 72%, rgba(30,36,43,0.12) 88%, transparent 100%)',
                  }}
                />

                {/* Top Floating Controls */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                    <span className="material-symbols-outlined text-white text-[13px]">
                      verified
                    </span>
                    <span className="font-mono text-[10.5px]">{selectedBookingVoucher.ref}</span>
                    <span className="text-emerald-400 text-[10px] ml-1 font-bold">· Confirmed</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBookingVoucher(null)}
                    className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                      ★ {selectedBookingVoucher.rating}
                    </span>
                    <span className="text-xs text-white/80">{selectedBookingVoucher.dates}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {selectedBookingVoucher.title}
                  </h3>
                </div>
              </div>

              {/* Voucher Content & Details Strip */}
              <div className="p-4 sm:p-6 text-white space-y-4">
                <p className="text-xs text-white/80 leading-relaxed">
                  {selectedBookingVoucher.details}
                </p>

                {/* Amenities Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedBookingVoucher.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm text-blue-400">
                        {item.icon}
                      </span>
                      <span className="text-[11px] truncate font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Segment Credentials */}
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  {selectedBookingVoucher.flightInfo && (
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-white/60 text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-indigo-400">flight</span>
                        Flight:
                      </span>
                      <span className="font-mono text-white text-[11px] font-bold">
                        {selectedBookingVoucher.flightInfo}
                      </span>
                    </div>
                  )}

                  {selectedBookingVoucher.hotelInfo && (
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-white/60 text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-purple-400">hotel</span>
                        Accommodations:
                      </span>
                      <span className="text-white text-[11px] font-semibold truncate max-w-[200px]">
                        {selectedBookingVoucher.hotelInfo}
                      </span>
                    </div>
                  )}

                  {selectedBookingVoucher.driverInfo && (
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-white/60 text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-sky-400">directions_car</span>
                        Dedicated Chauffeur:
                      </span>
                      <span className="text-white text-[11px] font-semibold">
                        {selectedBookingVoucher.driverInfo}
                      </span>
                    </div>
                  )}

                  {selectedBookingVoucher.conciergeInfo && (
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-white/60 text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-400">support_agent</span>
                        Concierge Desk:
                      </span>
                      <span className="text-emerald-300 font-mono text-[11px] font-bold">
                        {selectedBookingVoucher.conciergeInfo}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Price & Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-white/50 block font-semibold">All-Inclusive Total</span>
                    <span className="text-lg font-bold text-white font-mono">{selectedBookingVoucher.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDownloadPDF();
                        showToast(`Downloaded voucher: ${selectedBookingVoucher.title}`);
                      }}
                      className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      <span>PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingVoucher(null);
                        onOpenWhatsApp();
                      }}
                      className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>WhatsApp Concierge</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================= */}
      {/* VIEW 3: PAYMENT RECEIPT & PLAN SCHEDULE MODAL                 */}
      {/* ============================================================= */}
      {isPaymentReceiptOpen && currentTrip?.paymentDetails && (
        <div
          onClick={() => setIsPaymentReceiptOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90dvh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left font-sans"
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Official Payment Receipt
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">Verified</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                    {currentTrip.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    Ref #{currentTrip.bookingRef} · Txn #{currentTrip.paymentDetails.transactionRef}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentReceiptOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto custom-scrollbar text-xs">
              {/* Payment Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tour Price</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{currentTrip.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Paid to Date</span>
                  <span className="font-extrabold text-emerald-700 text-sm">₹{currentTrip.paymentDetails.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Structure</span>
                  <span className="font-bold text-slate-800 uppercase text-[11px] block truncate">
                    {currentTrip.paymentDetails.type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* GROUP SPLIT ROSTER IF APPLICABLE */}
              {currentTrip.paymentDetails.type === 'group_split' && currentTrip.paymentDetails.groupSplit && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-950 block text-xs">Group Bill Split Status</span>
                      <span className="text-[11px] text-purple-700">
                        {currentTrip.paymentDetails.groupSplit.totalMembers} Members · ₹{currentTrip.paymentDetails.groupSplit.perPersonAmount.toLocaleString('en-IN')} Each
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px]">
                      {currentTrip.paymentDetails.groupSplit.paidMembersCount} of {currentTrip.paymentDetails.groupSplit.totalMembers} Paid
                    </span>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-purple-200">
                    <span className="font-mono text-[11px] text-purple-900 flex-1 truncate">
                      {currentTrip.paymentDetails.groupSplit.splitLink}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(currentTrip.paymentDetails?.groupSplit?.splitLink || '');
                        showToast?.('Split payment link copied to clipboard!');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[10px] hover:bg-purple-700 transition-colors cursor-pointer shrink-0"
                    >
                      Copy Link
                    </button>
                  </div>

                  {/* Member Rows */}
                  <div className="space-y-1.5 pt-1">
                    {currentTrip.paymentDetails.groupSplit.members.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            m.status === 'PAID' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-slate-600">₹{m.amount.toLocaleString('en-IN')}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {m.status === 'PAID' ? 'Settled' : 'Invited'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INSTALLMENTS SCHEDULE IF APPLICABLE */}
              {currentTrip.paymentDetails.type === 'installments' && currentTrip.paymentDetails.installmentsPlan && (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-950 block text-xs">Installment Schedule</span>
                      <span className="text-[11px] text-amber-800">
                        {currentTrip.paymentDetails.installmentsPlan.frequency === 'milestones'
                          ? '3-Stage Milestone Plan (0% Interest)'
                          : `${currentTrip.paymentDetails.installmentsPlan.totalInstallments}-Month No-Cost EMI`}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {currentTrip.paymentDetails.installmentsPlan.paidInstallments} of {currentTrip.paymentDetails.installmentsPlan.totalInstallments} Paid
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {currentTrip.paymentDetails.installmentsPlan.schedule.map((item, idx) => (
                      <div
                        key={item.installmentNumber || idx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          item.status === 'PAID'
                            ? 'bg-white border-amber-300'
                            : 'bg-white/60 border-amber-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            item.status === 'PAID' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block">{item.label}</span>
                            <span className="text-[10px] text-slate-500">{item.dueDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 block">₹{item.amount.toLocaleString('en-IN')}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            item.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status === 'PAID' ? 'Paid' : 'Scheduled'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Method & Security Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Method of Payment:</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {currentTrip.paymentDetails.cardBrand || 'Card'} {currentTrip.paymentDetails.cardLast4 ? `ending in ••${currentTrip.paymentDetails.cardLast4}` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date Paid:</span>
                  <span className="font-mono text-slate-700">{currentTrip.paymentDetails.paidAt || 'Just Now'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Buyer Protection:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    100% Escrow Guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentReceiptOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onDownloadPDF();
                  showToast?.(`Downloaded tax invoice for ${currentTrip.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Tax Invoice (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
