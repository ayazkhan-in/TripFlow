import React, { useState, useEffect, useMemo } from 'react';
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
import { TripFlowApi } from '../../services/api';
import { TripItinerary, ItineraryDay, ItineraryItem } from '../../types/itinerary';
import { Skeleton } from '../common/Skeleton';

interface AssistantSession {
  id: string;
  title?: string;
  destination?: string;
  updatedAt?: string;
  proposal?: any;
  messages?: any[];
}

type TripFilter = 'all' | 'purchased' | 'ai_plan';

interface SelectableTrip {
  id: string;
  source: 'purchased' | 'ai_plan';
  title: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  totalPrice?: number;
  currency?: string;
  heroImage?: string;
  status?: string;
  bookedTripRef?: BookedTrip;
  sessionRef?: AssistantSession;
}

interface TripsAndBookingsScreenProps {
  initialView?: 'timeline' | 'bookings';
  isDisruptionResolved: boolean;
  bookedTrips?: BookedTrip[];
  isLoadingTrips?: boolean;
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
  onOpenItineraryInBuilder?: (itinerary: TripItinerary) => void;
  onOpenPayment?: (itinerary: TripItinerary) => void;
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

// ─────────────────────────────────────────────────────────────
// AiItineraryAddPanel — lets users manually pick & add items
// from an AI itinerary into the Itinerary Builder. No buy CTA.
// ─────────────────────────────────────────────────────────────
interface AiItineraryAddPanelProps {
  proposal: any;
  session?: AssistantSession | null;
  onOpenItineraryInBuilder?: (itinerary: TripItinerary) => void;
  onNavigateTab?: (tab: string) => void;
  showToast?: (msg: string) => void;
}

interface NormalizedFlight {
  id: string;
  key: string;
  airline: string;
  flightNumber: string;
  originCode: string;
  destCode: string;
  depTime: string;
  arrTime: string;
  duration: string;
  stops: string;
  price: number;
  label: string;
  badge: string;
  isAiAdded?: boolean;
}

interface NormalizedHotel {
  id: string;
  key: string;
  name: string;
  roomType: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  perks: string[];
  pricePerNight: number;
  label: string;
  badge: string;
  isAiAdded?: boolean;
}

const DEST_AIRPORT_CODES: Record<string, { code: string; name: string }> = {
  goa: { code: 'GOI', name: 'Goa Dabolim / Mopa' },
  kerala: { code: 'COK', name: 'Kochi Cochin' },
  turkey: { code: 'IST', name: 'Istanbul Airport' },
  istanbul: { code: 'IST', name: 'Istanbul Airport' },
  japan: { code: 'HND', name: 'Tokyo Haneda' },
  tokyo: { code: 'HND', name: 'Tokyo Haneda' },
  dubai: { code: 'DXB', name: 'Dubai International' },
  paris: { code: 'CDG', name: 'Paris Charles de Gaulle' },
  bali: { code: 'DPS', name: 'Bali Ngurah Rai' },
  maldives: { code: 'MLE', name: 'Male International' },
};

function getDestCode(dest: string): string {
  const lower = (dest || '').toLowerCase();
  for (const [k, v] of Object.entries(DEST_AIRPORT_CODES)) {
    if (lower.includes(k)) return v.code;
  }
  return dest.slice(0, 3).toUpperCase() || 'DEL';
}

function getInitialFlights(p: any, dest: string): NormalizedFlight[] {
  const destCode = getDestCode(dest);
  const flights: NormalizedFlight[] = [];

  if (p?.flights) {
    if (Array.isArray(p.flights)) {
      p.flights.forEach((f: any, idx: number) => {
        flights.push({
          id: f.id || `flt-${idx}`,
          key: f.id || f.type || `flt-${idx}`,
          airline: f.airline || 'Air India / IndiGo',
          flightNumber: f.flightNumber || `6E-${200 + idx}`,
          originCode: f.originCode || 'BOM',
          destCode: f.destCode || destCode,
          depTime: f.depTime || f.departureTime || '07:30 AM',
          arrTime: f.arrTime || f.arrivalTime || '09:45 AM',
          duration: f.duration || '2h 15m',
          stops: f.stops || 'Non-stop Direct',
          price: f.priceINR || f.priceUSD || f.price || (idx === 0 ? 5400 : idx === 1 ? 7800 : 14200),
          label: f.label || (idx === 0 ? 'Budget' : idx === 1 ? 'Recommended' : 'Luxury'),
          badge: f.badge || (idx === 1 ? '⭐ AI Pick' : idx === 2 ? 'Premium' : 'Best Value'),
        });
      });
    } else if (typeof p.flights === 'object') {
      const keys = ['cheaper', 'recommended', 'luxury'] as const;
      keys.forEach((key, idx) => {
        const f = p.flights[key];
        if (f) {
          flights.push({
            id: `flt-${key}`,
            key,
            airline: f.airline || (key === 'cheaper' ? 'IndiGo / Akasa Air' : key === 'recommended' ? 'Vistara / Air India' : 'Vistara Business Class'),
            flightNumber: f.flightNumber || (key === 'cheaper' ? '6E-412' : key === 'recommended' ? 'UK-819' : 'UK-819 (Biz)'),
            originCode: f.originCode || 'BOM',
            destCode: f.destCode || destCode,
            depTime: f.depTime || (key === 'cheaper' ? '05:45 AM' : key === 'recommended' ? '08:30 AM' : '10:00 AM'),
            arrTime: f.arrTime || (key === 'cheaper' ? '07:30 AM' : key === 'recommended' ? '10:15 AM' : '11:45 AM'),
            duration: f.duration || '1h 45m',
            stops: f.stops || 'Non-Stop Direct',
            price: f.priceINR || (key === 'cheaper' ? 5200 : key === 'recommended' ? 7600 : 15800),
            label: key === 'cheaper' ? 'Budget' : key === 'recommended' ? 'Recommended' : 'Luxury',
            badge: key === 'recommended' ? '⭐ AI Pick' : key === 'luxury' ? 'Premium' : 'Best Value',
          });
        }
      });
    }
  }

  if (flights.length === 0) {
    flights.push(
      {
        id: 'flt-cheaper',
        key: 'cheaper',
        airline: 'IndiGo Airlines',
        flightNumber: '6E-512',
        originCode: 'BOM',
        destCode,
        depTime: '06:00 AM',
        arrTime: '07:25 AM',
        duration: '1h 25m',
        stops: 'Non-stop Direct',
        price: 4900,
        label: 'Budget',
        badge: 'Best Value',
      },
      {
        id: 'flt-recommended',
        key: 'recommended',
        airline: 'Vistara Prime',
        flightNumber: 'UK-825',
        originCode: 'BOM',
        destCode,
        depTime: '09:15 AM',
        arrTime: '10:40 AM',
        duration: '1h 25m',
        stops: 'Non-stop Direct',
        price: 7400,
        label: 'Recommended',
        badge: '⭐ AI Pick',
      },
      {
        id: 'flt-luxury',
        key: 'luxury',
        airline: 'Air India Business Suite',
        flightNumber: 'AI-680',
        originCode: 'BOM',
        destCode,
        depTime: '11:30 AM',
        arrTime: '01:00 PM',
        duration: '1h 30m',
        stops: 'Non-stop Direct',
        price: 16500,
        label: 'Luxury',
        badge: 'Premium',
      }
    );
  }

  return flights;
}

function getInitialHotels(p: any, dest: string): NormalizedHotel[] {
  const hotels: NormalizedHotel[] = [];
  const defaultImgs = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  ];

  if (p?.hotels) {
    if (Array.isArray(p.hotels)) {
      p.hotels.forEach((h: any, idx: number) => {
        hotels.push({
          id: h.id || `htl-${idx}`,
          key: h.id || h.type || `htl-${idx}`,
          name: h.name || `${dest} Boutique Resort`,
          roomType: h.roomType || 'Deluxe Room with Balcony',
          location: h.location || dest,
          image: h.image || defaultImgs[idx % defaultImgs.length],
          rating: h.rating || 4.9,
          reviews: h.reviewsCount || h.reviews || 380,
          perks: h.perks || ['Artisan Breakfast', 'Complimentary WiFi', 'Pool Access'],
          pricePerNight: h.pricePerNightINR || h.pricePerNightUSD || h.price || (idx === 0 ? 8500 : idx === 1 ? 16500 : 28000),
          label: h.label || (idx === 0 ? 'Budget Stay' : idx === 1 ? 'Recommended' : 'Luxury Suite'),
          badge: h.badge || (idx === 1 ? '⭐ AI Pick' : idx === 2 ? 'Ultra Premium' : 'Best Price'),
        });
      });
    } else if (typeof p.hotels === 'object') {
      const keys = ['cheaper', 'recommended', 'luxury'] as const;
      keys.forEach((key, idx) => {
        const h = p.hotels[key];
        if (h) {
          hotels.push({
            id: `htl-${key}`,
            key,
            name: h.name || `${dest} Heritage Stay`,
            roomType: h.roomType || 'Heritage Sea Suite',
            location: h.location || dest,
            image: h.image || defaultImgs[idx % defaultImgs.length],
            rating: h.rating || (key === 'luxury' ? 4.98 : key === 'recommended' ? 4.95 : 4.86),
            reviews: h.reviews || (key === 'recommended' ? 720 : 410),
            perks: h.perks || ['Breakfast Included', 'Ocean View', 'Infinity Pool Access'],
            pricePerNight: h.pricePerNightINR || (key === 'cheaper' ? 9500 : key === 'recommended' ? 18500 : 34000),
            label: key === 'cheaper' ? 'Budget Stay' : key === 'recommended' ? 'Recommended' : 'Luxury Suite',
            badge: key === 'recommended' ? '⭐ AI Pick' : key === 'luxury' ? 'Ultra Premium' : 'Best Price',
          });
        }
      });
    }
  }

  if (hotels.length === 0) {
    hotels.push(
      {
        id: 'htl-cheaper',
        key: 'cheaper',
        name: `${dest} Heritage Portuguese Villa`,
        roomType: 'Heritage Balcony King Suite',
        location: `Central ${dest} Old Quarter`,
        image: defaultImgs[0],
        rating: 4.88,
        reviews: 320,
        perks: ['Authentic Architecture', 'Artisan Breakfast', 'Boutique Courtyard'],
        pricePerNight: 9500,
        label: 'Budget Stay',
        badge: 'Best Price',
      },
      {
        id: 'htl-recommended',
        key: 'recommended',
        name: `Taj Exotica / The Leela ${dest}`,
        roomType: 'Sunset Ocean-Facing Luxury Suite',
        location: `Scenic Waterfront, ${dest}`,
        image: defaultImgs[1],
        rating: 4.97,
        reviews: 890,
        perks: ['Direct Beach Access', 'Infinity Pool', 'VIP Welcome Drinks', 'Gourmet Breakfast'],
        pricePerNight: 21500,
        label: 'Recommended',
        badge: '⭐ AI Pick',
      },
      {
        id: 'htl-luxury',
        key: 'luxury',
        name: `W / Ahilya By The Sea ${dest}`,
        roomType: 'Presidential Oceanfront Plunge Pool Villa',
        location: `Secluded Coastal Sanctuary, ${dest}`,
        image: defaultImgs[2],
        rating: 4.99,
        reviews: 640,
        perks: ['24/7 Dedicated Butler', 'Private Heated Pool', 'VIP Fast-Track Clearance'],
        pricePerNight: 38000,
        label: 'Luxury Suite',
        badge: 'Ultra Premium',
      }
    );
  }

  return hotels;
}

function generateMoreFlights(dest: string, currentOffset: number): NormalizedFlight[] {
  const destCode = getDestCode(dest);
  return [
    {
      id: `flt-ai-add-1-${currentOffset}`,
      key: `ai_flight_1_${currentOffset}`,
      airline: 'Vistara Early Express',
      flightNumber: 'UK-851',
      originCode: 'BOM',
      destCode,
      depTime: '06:30 AM',
      arrTime: '07:45 AM',
      duration: '1h 15m',
      stops: 'Non-stop Sunrise',
      price: 6400,
      label: 'Early Sunrise',
      badge: '🌅 Early Slot',
      isAiAdded: true,
    },
    {
      id: `flt-ai-add-2-${currentOffset}`,
      key: `ai_flight_2_${currentOffset}`,
      airline: 'Air India Direct Premier',
      flightNumber: 'AI-673',
      originCode: 'DEL',
      destCode,
      depTime: '11:15 AM',
      arrTime: '01:50 PM',
      duration: '2h 35m',
      stops: 'Non-stop Direct',
      price: 8200,
      label: 'Mid-Day Direct',
      badge: '✈️ Hot Meal',
      isAiAdded: true,
    },
    {
      id: `flt-ai-add-3-${currentOffset}`,
      key: `ai_flight_3_${currentOffset}`,
      airline: 'IndiGo Stretch XL',
      flightNumber: '6E-5124',
      originCode: 'BOM',
      destCode,
      depTime: '04:15 PM',
      arrTime: '05:35 PM',
      duration: '1h 20m',
      stops: 'Priority XL Legroom',
      price: 7100,
      label: 'Executive Flex',
      badge: '💺 Extra Legroom',
      isAiAdded: true,
    },
    {
      id: `flt-ai-add-4-${currentOffset}`,
      key: `ai_flight_4_${currentOffset}`,
      airline: 'Akasa Air Late Night Saver',
      flightNumber: 'QP-1309',
      originCode: 'BLR',
      destCode,
      depTime: '09:30 PM',
      arrTime: '10:45 PM',
      duration: '1h 15m',
      stops: 'Non-stop Moonlight',
      price: 4300,
      label: 'Evening Saver',
      badge: '🌙 Best Rate',
      isAiAdded: true,
    },
  ];
}

function generateMoreHotels(dest: string, currentOffset: number): NormalizedHotel[] {
  return [
    {
      id: `htl-ai-add-1-${currentOffset}`,
      key: `ai_hotel_1_${currentOffset}`,
      name: `Ahilya by the Sea & Coastal Villa`,
      roomType: 'Portuguese Ocean Villa with Plunge Pool',
      location: `Dolphin Bay, ${dest}`,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      rating: 4.98,
      reviews: 510,
      perks: ['Private Plunge Pool', 'Sea-Facing Verandah', 'Personal Chef On-Call'],
      pricePerNight: 24500,
      label: 'Heritage Villa',
      badge: '🌊 Oceanfront',
      isAiAdded: true,
    },
    {
      id: `htl-ai-add-2-${currentOffset}`,
      key: `ai_hotel_2_${currentOffset}`,
      name: `W Luxury Beachfront Resort`,
      roomType: 'Marvelous Sea View Suite & VIP Access',
      location: `Vagator Coastal Bluff, ${dest}`,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      rating: 4.96,
      reviews: 820,
      perks: ['Rockpool VIP Cabana', 'Direct Beach Trail', 'Complimentary Champagne'],
      pricePerNight: 28000,
      label: 'Beach Luxury',
      badge: '🍸 VIP Cabana',
      isAiAdded: true,
    },
    {
      id: `htl-ai-add-3-${currentOffset}`,
      key: `ai_hotel_3_${currentOffset}`,
      name: `Alila Diwa & Serene Sanctuary`,
      roomType: 'Diwa Club Luxury Pavilion with Paddy View',
      location: `Majorda Serene Fields, ${dest}`,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      rating: 4.94,
      reviews: 670,
      perks: ['Infinity Paddy Pool', 'Chai Bazaar High Tea', 'Spa Alila Access'],
      pricePerNight: 17800,
      label: 'Serene Resort',
      badge: '🌿 Green Oasis',
      isAiAdded: true,
    },
    {
      id: `htl-ai-add-4-${currentOffset}`,
      key: `ai_hotel_4_${currentOffset}`,
      name: `The Postcard Boutique Sanctuary`,
      roomType: 'Signature Presidential Suite',
      location: `Cavelossim Beachfront, ${dest}`,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      rating: 4.99,
      reviews: 430,
      perks: ['Anytime 24/7 Check-in', 'Bespoke Dining', 'Private Garden Trail'],
      pricePerNight: 21500,
      label: 'Boutique Hideaway',
      badge: '✨ Ultra Private',
      isAiAdded: true,
    },
  ];
}

const AiItineraryAddPanel: React.FC<AiItineraryAddPanelProps> = ({
  proposal: p,
  session,
  onOpenItineraryInBuilder,
  onNavigateTab,
  showToast,
}) => {
  const destName = session?.destination || p?.destination || 'Goa';

  // Flight & Hotel options state (allows adding more in-place with AI)
  const [flights, setFlights] = React.useState<NormalizedFlight[]>(() => getInitialFlights(p, destName));
  const [hotels, setHotels] = React.useState<NormalizedHotel[]>(() => getInitialHotels(p, destName));

  const [selectedFlight, setSelectedFlight] = React.useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = React.useState<string | null>(null);
  const [selectedExps, setSelectedExps] = React.useState<Set<number>>(new Set());

  // AI Refine state
  const [isRefining, setIsRefining] = React.useState(false);
  const [hasRefined, setHasRefined] = React.useState(false);

  const totalAdded =
    (selectedFlight ? 1 : 0) +
    (selectedHotel ? 1 : 0) +
    selectedExps.size;

  const toggleExp = (idx: number) => {
    setSelectedExps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // In-place AI Refinement: adds new flights & hotels right here without navigating away
  const handleRefineWithAI = () => {
    setIsRefining(true);
    setTimeout(() => {
      const moreFlights = generateMoreFlights(destName, flights.length);
      const moreHotels = generateMoreHotels(destName, hotels.length);
      setFlights(prev => [...prev, ...moreFlights]);
      setHotels(prev => [...prev, ...moreHotels]);
      setIsRefining(false);
      setHasRefined(true);
      showToast?.(`✨ AI added ${moreFlights.length} flight routes & ${moreHotels.length} hotel options for ${destName}!`);
    }, 600);
  };

  // Open in Builder: constructs full valid TripItinerary and passes to builder
  const handleOpenInBuilder = () => {
    const chosenFlight = flights.find(f => f.key === selectedFlight) || flights[0];
    const chosenHotel = hotels.find(h => h.key === selectedHotel) || hotels[0];
    const daysCount = p?.days || (Array.isArray(p?.daysPlan) && p.daysPlan.length) || 5;

    let totalPrice = 0;
    if (chosenFlight) totalPrice += chosenFlight.price * (p?.travelers || 2);
    if (chosenHotel) totalPrice += chosenHotel.pricePerNight * daysCount;

    const days: ItineraryDay[] = [];

    for (let d = 1; d <= daysCount; d++) {
      const dayPlan = (p?.daysPlan && p.daysPlan[d - 1]) || null;
      const items: ItineraryItem[] = [];

      // Day 1: Flight
      if (d === 1 && chosenFlight) {
        items.push({
          id: `item-flight-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: `${chosenFlight.airline} (${chosenFlight.originCode} ➔ ${chosenFlight.destCode})`,
          category: 'transport',
          price: chosenFlight.price,
          time: chosenFlight.depTime,
          duration: chosenFlight.duration,
          location: `${chosenFlight.originCode} International Airport`,
          description: `Flight ${chosenFlight.flightNumber} · ${chosenFlight.stops}. ${chosenFlight.badge}`,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: [chosenFlight.airline, 'Flight Included'],
        });
      }

      // Every Day: Hotel stay
      if (chosenHotel) {
        items.push({
          id: `item-hotel-d${d}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: `${chosenHotel.name} (${chosenHotel.roomType})`,
          category: 'hotel',
          price: chosenHotel.pricePerNight,
          time: d === 1 ? '03:00 PM' : '08:00 AM',
          duration: 'Overnight',
          location: chosenHotel.location,
          description: `${chosenHotel.label}. Perks: ${chosenHotel.perks.join(' · ')}`,
          image: chosenHotel.image,
          rating: chosenHotel.rating,
          reviewsCount: chosenHotel.reviews,
          tags: ['Luxury Stay', ...chosenHotel.perks.slice(0, 2)],
        });
      }

      // Highlights for this day
      if (dayPlan?.highlights && Array.isArray(dayPlan.highlights)) {
        dayPlan.highlights.forEach((h: any, hIdx: number) => {
          const titleStr = typeof h === 'string' ? h : h.title;
          const actPrice = hIdx === 0 ? 3000 : 4500;
          items.push({
            id: `item-act-d${d}-${hIdx}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: titleStr,
            category: hIdx === 0 ? 'activity' : 'meal',
            price: actPrice,
            time: hIdx === 0 ? '11:00 AM' : '01:30 PM',
            duration: '2 hrs',
            location: destName,
            description: `Curated highlight: ${titleStr}. VIP access arranged through your Bookit concierge.`,
            image: p?.heroImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
            rating: 4.92,
            tags: ['AI Curated Highlight'],
          });
          totalPrice += actPrice;
        });
      }

      // Any selected experiences assigned to this day
      if (Array.isArray(p?.highlights)) {
        p.highlights.forEach((exp: any, expIdx: number) => {
          if (selectedExps.has(expIdx)) {
            const assignedDay = exp.suggestedDayNumber || ((expIdx % daysCount) + 1);
            if (assignedDay === d) {
              const expPrice = exp.price || 3500;
              items.push({
                id: `item-exp-${expIdx}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                title: exp.title,
                category: (exp.category as any) || 'experience',
                price: expPrice,
                time: '04:30 PM',
                duration: '2.5 hrs',
                location: exp.location || destName,
                description: exp.desc || exp.title,
                image: exp.image || p?.heroImage,
                rating: 4.95,
                tags: ['Selected Experience'],
              });
              totalPrice += expPrice;
            }
          }
        });
      }

      days.push({
        id: `day-${destName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${d}`,
        dayNumber: d,
        date: `Day ${d}`,
        title: dayPlan?.title || `Day ${d} in ${destName}`,
        subtitle: dayPlan?.title || 'Curated Discoveries',
        items,
      });
    }

    const compiledItinerary: TripItinerary = {
      id: `trip-ai-${session?.id || 'gen'}-${Date.now()}`,
      title: session?.title || p?.title || `${destName} AI Journey`,
      destination: destName,
      country: p?.country || 'India',
      dates: p?.dates || `${daysCount} Days · Bespoke AI Journey`,
      startDate: new Date().toISOString().split('T')[0],
      travelers: p?.travelers || 2,
      currency: 'INR',
      totalPrice,
      heroImage: p?.heroImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
      days,
    };

    if (onOpenItineraryInBuilder) {
      onOpenItineraryInBuilder(compiledItinerary);
      showToast?.(`✨ Loaded "${compiledItinerary.title}" in Itinerary Builder!`);
    } else {
      onNavigateTab?.('builder');
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Info banner ── */}
      <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
        <span className="material-symbols-outlined text-violet-500 text-[20px] shrink-0 mt-0.5">info</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-violet-800 leading-relaxed">
            <strong>Pick what you want.</strong> Select your preferred flight, hotel, and experiences below, or click <strong>Refine with AI</strong> to add more options in-place. Then click <strong>Open in Builder</strong> to customize dates, activities &amp; save.
          </p>
        </div>
      </div>

      {/* ── Flights ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Flight Options</h3>
              <p className="text-[11px] text-slate-400">Select one flight to add to your plan ({flights.length} options available)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefineWithAI}
            disabled={isRefining}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span className={`material-symbols-outlined text-[15px] ${isRefining ? 'animate-spin' : ''}`}>
              {isRefining ? 'sync' : 'auto_awesome'}
            </span>
            {isRefining ? 'Finding routes…' : '+ Add More Flight Options'}
          </button>
        </div>

        {isRefining && (
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-800 animate-pulse">
            <span className="material-symbols-outlined text-indigo-600 text-[18px] animate-spin">auto_awesome</span>
            <span>AI is querying live airline schedules, early bird routes and prime slots for {destName}…</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((f) => {
            const isSelected = selectedFlight === f.key;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFlight(isSelected ? null : f.key)}
                className={`bg-white rounded-2xl border p-4 space-y-3 cursor-pointer transition-all select-none relative ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                    : f.key === 'recommended'
                    ? 'border-indigo-300 shadow-sm hover:border-indigo-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : f.key === 'recommended' ? 'text-indigo-700' : 'text-slate-700'}`}>{f.label}</span>
                    {f.isAiAdded && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span>AI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${f.key === 'recommended' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{f.badge}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                      {isSelected && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">{f.airline}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{f.flightNumber}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-center">
                    <p className="font-extrabold text-slate-900 text-base">{f.originCode}</p>
                    <p className="text-slate-500">{f.depTime}</p>
                  </div>
                  <div className="flex-1 mx-2 text-center">
                    <div className="relative flex items-center">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="material-symbols-outlined text-[14px] text-slate-400 mx-1">flight</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{f.duration}</p>
                    <p className="text-[10px] text-slate-400">{f.stops}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-slate-900 text-base">{f.destCode}</p>
                    <p className="text-slate-500">{f.arrTime}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-extrabold text-slate-900">₹{f.price.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-400 ml-0.5">/pax</span></span>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setSelectedFlight(isSelected ? null : f.key); }}
                    className={`py-1 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{isSelected ? 'check_circle' : 'add_circle'}</span>
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Hotels ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">hotel</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Hotel Options</h3>
              <p className="text-[11px] text-slate-400">Select one hotel to add to your plan ({hotels.length} options available)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefineWithAI}
            disabled={isRefining}
            className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span className={`material-symbols-outlined text-[15px] ${isRefining ? 'animate-spin' : ''}`}>
              {isRefining ? 'sync' : 'auto_awesome'}
            </span>
            {isRefining ? 'Searching stays…' : '+ Add More Hotel Options'}
          </button>
        </div>

        {isRefining && (
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center gap-2.5 text-xs text-purple-800 animate-pulse">
            <span className="material-symbols-outlined text-purple-600 text-[18px] animate-spin">auto_awesome</span>
            <span>AI is curating private villas, beachfront hideaways &amp; heritage estates in {destName}…</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((h) => {
            const isSelected = selectedHotel === h.key;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedHotel(isSelected ? null : h.key)}
                className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all select-none relative flex flex-col ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                    : h.key === 'recommended'
                    ? 'border-purple-300 shadow-sm hover:border-purple-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {h.image && (
                  <div className="h-36 overflow-hidden relative">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${h.key === 'recommended' ? 'bg-purple-600 text-white' : 'bg-slate-800/90 text-white'}`}>{h.badge}</span>
                      {h.isAiAdded && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-violet-600 text-white shadow-xs flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">auto_awesome</span>AI Pick
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{h.name}</p>
                        <p className="text-xs text-slate-500">{h.roomType}</p>
                      </div>
                      {h.rating && (
                        <span className="flex items-center gap-0.5 text-amber-600 text-xs font-bold shrink-0">
                          <span className="material-symbols-outlined text-[13px]">star</span>
                          {h.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {h.location}
                    </p>
                    {Array.isArray(h.perks) && h.perks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {h.perks.slice(0, 3).map((perk: string, pi: number) => (
                          <span key={pi} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">{perk}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">₹{h.pricePerNight.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400">per night</p>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setSelectedHotel(isSelected ? null : h.key); }}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{isSelected ? 'check_circle' : 'add_circle'}</span>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Curated Experiences ── */}
      {Array.isArray(p?.highlights) && p.highlights.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">explore</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Curated Experiences</h3>
              <p className="text-[11px] text-slate-400">Add as many as you like to enrich your days</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {p.highlights.map((exp: any, idx: number) => {
              const isAdded = selectedExps.has(idx);
              const catColors: Record<string, string> = {
                experience: 'bg-blue-50 text-blue-700 border-blue-200',
                activity:   'bg-emerald-50 text-emerald-700 border-emerald-200',
                meal:       'bg-amber-50 text-amber-700 border-amber-200',
                transfer:   'bg-sky-50 text-sky-700 border-sky-200',
              };
              const catColor = catColors[exp.category] || 'bg-slate-50 text-slate-700 border-slate-200';
              return (
                <div
                  key={idx}
                  onClick={() => toggleExp(idx)}
                  className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer select-none flex items-start gap-4 ${
                    isAdded ? 'border-emerald-400 ring-1 ring-emerald-200 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isAdded ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : catColor}`}>
                    <span className="material-symbols-outlined text-[18px]">{isAdded ? 'check_circle' : (exp.icon || 'star')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{exp.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {exp.price > 0 && (
                          <span className="text-xs font-extrabold text-emerald-700">₹{exp.price.toLocaleString('en-IN')}</span>
                        )}
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAdded ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                          {isAdded && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.desc}</p>
                    {exp.location && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-1.5">
                        <span className="material-symbols-outlined text-[11px]">location_on</span>
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Day-by-Day Timeline (read-only reference) ── */}
      {Array.isArray(p?.daysPlan) && p.daysPlan.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">timeline</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Day-by-Day Plan</h3>
              <p className="text-[11px] text-slate-400">Reference guide — loaded automatically when opened in Builder</p>
            </div>
          </div>
          <div className="relative border-l-2 border-violet-200 ml-5 space-y-5">
            {p.daysPlan.map((day: any, idx: number) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[21px] top-3 w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-md">
                  {day.dayNumber || idx + 1}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{day.title}</h4>
                  {Array.isArray(day.highlights) && day.highlights.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {day.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="material-symbols-outlined text-[14px] text-violet-400 mt-0.5 shrink-0">check_circle</span>
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky bottom: Open in Builder & Refine with AI — NO buy button ── */}
      <div className="sticky bottom-4 z-20 pb-2">
        <div className={`backdrop-blur-md border rounded-2xl shadow-xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between transition-all ${totalAdded > 0 ? 'bg-emerald-50/95 border-emerald-300' : 'bg-white/95 border-slate-200'}`}>
          <div className="text-center sm:text-left">
            {totalAdded > 0 ? (
              <>
                <p className="text-sm font-extrabold text-emerald-800">{totalAdded} preference{totalAdded !== 1 ? 's' : ''} selected</p>
                <p className="text-xs text-emerald-600">Click &ldquo;Open in Builder&rdquo; to customize dates, arrange items &amp; finalize itinerary</p>
              </>
            ) : (
              <>
                <p className="text-sm font-extrabold text-slate-900">Pick your preferences above</p>
                <p className="text-xs text-slate-500">Select flight, hotel &amp; experiences — or refine with AI for more options</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefineWithAI}
              disabled={isRefining}
              className="px-4 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className={`material-symbols-outlined text-[15px] ${isRefining ? 'animate-spin' : ''}`}>
                {isRefining ? 'sync' : 'auto_awesome'}
              </span>
              {isRefining ? 'Refining…' : hasRefined ? 'Add More Options' : 'Refine with AI'}
            </button>
            <button
              type="button"
              id="ai-plan-open-builder"
              onClick={handleOpenInBuilder}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                totalAdded > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-700 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">edit_calendar</span>
              Open in Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TripsAndBookingsScreen: React.FC<TripsAndBookingsScreenProps> = ({
  initialView = 'timeline',
  isDisruptionResolved,
  bookedTrips,
  isLoadingTrips,
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
  onOpenItineraryInBuilder,
  onOpenPayment,
}) => {
  // ──────────────────────────────────────────────────────────────────────
  // TRIP SELECTION HUB STATE
  // ──────────────────────────────────────────────────────────────────────
  // null = show the hub (trip picker), string = show detail for that trip
  const [selectedTripInHub, setSelectedTripInHub] = useState<string | null>(null);
  const [tripFilter, setTripFilter] = useState<TripFilter>('all');
  const [tripSearch, setTripSearch] = useState('');
  const [aiSessions, setAiSessions] = useState<AssistantSession[]>([]);
  const [aiSessionsLoading, setAiSessionsLoading] = useState(true);

  const isTripsLoading = Boolean(isLoadingTrips) || aiSessionsLoading;

  const isFilterLoading = useMemo(() => {
    if (tripFilter === 'ai_plan') return aiSessionsLoading;
    if (tripFilter === 'purchased') return Boolean(isLoadingTrips);
    return isTripsLoading;
  }, [tripFilter, aiSessionsLoading, isLoadingTrips, isTripsLoading]);

  // Fetch AI sessions on mount
  useEffect(() => {
    let cancelled = false;
    setAiSessionsLoading(true);
    TripFlowApi.getAssistantSessions()
      .then(sessions => {
        if (!cancelled) {
          // Only sessions that have a destination (meaningful trip plans)
          const withDestination = sessions.filter((s: any) => s.destination && s.destination.trim().length > 0);
          setAiSessions(withDestination);
        }
      })
      .catch(() => {
        if (!cancelled) setAiSessions([]);
      })
      .finally(() => {
        if (!cancelled) setAiSessionsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Build unified selectable trips list
  const allSelectableTrips = useMemo((): SelectableTrip[] => {
    const trips: SelectableTrip[] = [];

    // Purchased / Confirmed trips
    if (bookedTrips) {
      for (const bt of bookedTrips) {
        trips.push({
          id: bt.id,
          source: 'purchased',
          title: bt.title,
          destination: bt.destination,
          dates: bt.dates,
          duration: bt.duration,
          travelers: bt.travelers,
          totalPrice: bt.totalPrice,
          currency: bt.currency,
          heroImage: bt.heroImage,
          status: bt.status,
          bookedTripRef: bt,
        });
      }
    }

    // AI-crafted itinerary sessions (de-duplicate by destination+title)
    const seenAiKeys = new Set<string>();
    for (const s of aiSessions) {
      const key = `${(s.title || '').toLowerCase()}_${(s.destination || '').toLowerCase()}`;
      if (!seenAiKeys.has(key)) {
        seenAiKeys.add(key);
        trips.push({
          id: `ai_${s.id}`,
          source: 'ai_plan',
          title: s.title || `${s.destination} Journey`,
          destination: s.destination || 'Unknown',
          dates: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'AI Plan',
          duration: '',
          travelers: 2,
          heroImage: undefined,
          status: 'AI Plan',
          sessionRef: s,
        });
      }
    }

    return trips;
  }, [bookedTrips, aiSessions]);

  // Filtered trips for hub view
  const filteredTrips = useMemo(() => {
    let result = allSelectableTrips;
    if (tripFilter === 'purchased') result = result.filter(t => t.source === 'purchased');
    if (tripFilter === 'ai_plan') result = result.filter(t => t.source === 'ai_plan');
    if (tripSearch.trim()) {
      const q = tripSearch.toLowerCase();
      result = result.filter(t =>
        t.destination.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allSelectableTrips, tripFilter, tripSearch]);

  // Determine current trip from hub selection or activeTripId
  const resolvedTripId = selectedTripInHub ?? activeTripId;
  const currentTrip =
    (bookedTrips && bookedTrips.find(t => t.id === resolvedTripId)) ||
    (bookedTrips && !selectedTripInHub ? undefined : undefined);

  // If hub selection points to an AI trip, grab it
  const currentAiSession = selectedTripInHub?.startsWith('ai_')
    ? aiSessions.find(s => `ai_${s.id}` === selectedTripInHub)
    : null;

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

  // ──────────────────────────────────────────────────────────────────────
  // TRIP SELECTION HUB — shown when no trip is selected
  // ──────────────────────────────────────────────────────────────────────
  if (selectedTripInHub === null) {
    const DESTINATION_IMAGES: Record<string, string> = {
      kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      turkey: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
      istanbul: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
      japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    };

    const getHeroImage = (trip: SelectableTrip) => {
      if (trip.heroImage) return trip.heroImage;
      const dest = trip.destination.toLowerCase();
      for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
        if (dest.includes(key)) return url;
      }
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
    };

    return (
      <div className="w-full min-h-screen bg-slate-50">
        {/* ── Hub Header ── */}
        <section className="bg-white border-b border-slate-200 px-4 sm:px-6 py-5 sticky top-14 z-30 shadow-2xs">
          <div className="max-w-[1280px] mx-auto space-y-4">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">My Journeys</h1>
                {isFilterLoading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-xs text-slate-400 font-medium">Loading your journeys &amp; AI plans…</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {allSelectableTrips.length} trip{allSelectableTrips.length !== 1 ? 's' : ''} — select one to view full details &amp; bookings
                  </p>
                )}
              </div>
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  id="trip-hub-search"
                  type="text"
                  value={tripSearch}
                  onChange={e => setTripSearch(e.target.value)}
                  placeholder="Search destination…"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'purchased', 'ai_plan'] as TripFilter[]).map(f => {
                const labels: Record<TripFilter, string> = {
                  all: 'All Journeys',
                  purchased: '✓ Purchased & Confirmed',
                  ai_plan: '✦ AI-Crafted Plans',
                };
                const counts: Record<TripFilter, number> = {
                  all: allSelectableTrips.length,
                  purchased: allSelectableTrips.filter(t => t.source === 'purchased').length,
                  ai_plan: allSelectableTrips.filter(t => t.source === 'ai_plan').length,
                };
                const isTabLoading = f === 'ai_plan' ? aiSessionsLoading : f === 'purchased' ? Boolean(isLoadingTrips) : isTripsLoading;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTripFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      tripFilter === f
                        ? f === 'ai_plan'
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                          : f === 'purchased'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {labels[f]}
                    <span className={`ml-1.5 ${
                      tripFilter === f ? 'text-white/80' : 'text-slate-400'
                    } font-normal`}>
                      {isTabLoading && counts[f] === 0 ? '…' : `(${counts[f]})`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Trip Cards Grid ── */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          {isFilterLoading ? (
            /* Premium Trip Cards Loading Skeleton */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-blue-500 animate-spin">sync</span>
                  <span className="font-semibold text-slate-600">Loading your journeys and AI-crafted itineraries…</span>
                </div>
                <span className="hidden sm:inline text-slate-400">Syncing with travel vault &amp; concierge</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col"
                  >
                    {/* Hero image placeholder with shimmer */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden flex-shrink-0">
                      <Skeleton className="w-full h-full rounded-none" />
                      {/* Shimmering Badge */}
                      <div className="absolute top-3 left-3">
                        <Skeleton className="w-28 h-6 rounded-full bg-slate-200/90" />
                      </div>
                      {/* Shimmering Title Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                        <Skeleton className="w-3/4 h-5 rounded-lg bg-slate-300/80" />
                        <Skeleton className="w-1/3 h-3.5 rounded bg-slate-300/60" />
                      </div>
                    </div>

                    {/* Card body skeleton */}
                    <div className="p-4 flex flex-col gap-3.5 flex-1 justify-between">
                      {/* Metadata row: dates, duration, travelers */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="w-3.5 h-3.5 rounded-full" />
                          <Skeleton className="w-20 h-3 rounded" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="w-3.5 h-3.5 rounded-full" />
                          <Skeleton className="w-14 h-3 rounded" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="w-3.5 h-3.5 rounded-full" />
                          <Skeleton className="w-16 h-3 rounded" />
                        </div>
                      </div>

                      {/* Pricing placeholder */}
                      <div className="space-y-1">
                        <Skeleton className="w-28 h-5 rounded" />
                      </div>

                      {/* Full-width CTA button placeholder */}
                      <Skeleton className="w-full h-10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">luggage</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">No trips found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {tripSearch ? 'Try a different search term.' : 'Start planning your next adventure!'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('discover')}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  Browse Circuits
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('assistant')}
                  className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Plan with AI
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrips.map(trip => {
                const isPurchased = trip.source === 'purchased';
                const heroImg = getHeroImage(trip);
                return (
                  <div
                    key={trip.id}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    {/* Hero image */}
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <img
                        src={heroImg}
                        alt={trip.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      {/* Source badge */}
                      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                        isPurchased
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-violet-600/90 text-white'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {isPurchased ? 'verified' : 'auto_awesome'}
                        </span>
                        {isPurchased ? 'Confirmed Booking' : 'AI-Crafted Plan'}
                      </div>
                      {/* Destination overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-base leading-tight drop-shadow">
                          {trip.title}
                        </h3>
                        <p className="text-white/80 text-xs mt-0.5">{trip.destination}</p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                          {trip.dates}
                        </span>
                        {trip.duration && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                            {trip.duration.split('·')[0].trim()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">group</span>
                          {trip.travelers} Travelers
                        </span>
                      </div>

                      {trip.totalPrice && trip.totalPrice > 0 && (
                        <div className="text-sm font-extrabold text-slate-900">
                          ₹{trip.totalPrice.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-400 ml-1">total</span>
                        </div>
                      )}



                      {/* Primary CTA */}
                      <button
                        type="button"
                        id={`select-trip-${trip.id}`}
                        onClick={() => {
                          if (isPurchased && trip.bookedTripRef) {
                            onSelectTrip?.(trip.bookedTripRef.id);
                            setSelectedTripInHub(trip.bookedTripRef.id);
                          } else {
                            // For AI trips, open the detail view (AI plan mode)
                            setSelectedTripInHub(trip.id);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                          isPurchased
                            ? 'bg-slate-900 hover:bg-slate-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isPurchased ? 'open_in_new' : 'visibility'}
                        </span>
                        {isPurchased ? 'View Trip & Bookings →' : 'View AI Itinerary →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Start Planning CTA at bottom if has trips */}
          {filteredTrips.length > 0 && (
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Plan a new journey</p>
                  <p className="text-xs text-slate-500">Let AI craft your perfect itinerary</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('assistant')}
                  className="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Start Planning
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // DETAIL VIEW — show when a trip is selected
  // ──────────────────────────────────────────────────────────────────────
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
              {/* Back to hub button */}
              <button
                id="back-to-all-trips"
                type="button"
                onClick={() => setSelectedTripInHub(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer hover:border-slate-400"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                All My Trips
              </button>
              {currentTrip ? (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-700 font-semibold">
                    {currentTrip.destination}
                  </span>
                </>
              ) : currentAiSession ? (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-violet-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    {currentAiSession.destination || 'AI Plan'}
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
          currentAiSession ? (
            /* AI Itinerary Full Detail View */
            <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8 animate-in fade-in duration-200">
              {(() => {
                const p = currentAiSession.proposal;
                const DEST_IMAGES: Record<string, string> = {
                  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
                  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
                  turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
                  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
                  japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
                  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
                  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80',
                  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
                  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
                  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
                };
                const dest = (currentAiSession.destination || '').toLowerCase();
                let heroImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
                for (const [k, v] of Object.entries(DEST_IMAGES)) {
                  if (dest.includes(k)) { heroImg = v; break; }
                }
                if (p?.heroImage) heroImg = p.heroImage;

                return (
                  <>
                    {/* ── Hero Banner ── */}
                    <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[340px] shadow-lg group">
                      <img src={heroImg} alt={currentAiSession.title || dest} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
                      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 min-h-[280px] sm:min-h-[340px]">
                        <div className="absolute top-5 left-5">
                          <span className="px-3 py-1.5 rounded-full bg-violet-600/80 backdrop-blur text-white text-xs font-bold flex items-center gap-1.5 border border-violet-400/30">
                            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                            AI-Crafted Itinerary
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest">Your AI Travel Plan</p>
                          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight drop-shadow">
                            {currentAiSession.title || `${currentAiSession.destination} Journey`}
                          </h2>
                          <p className="text-white/70 text-sm">{currentAiSession.destination}</p>
                          {p?.daysPlan && (
                            <div className="flex items-center gap-3 pt-1 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                                <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                                {p.daysPlan.length} Days
                              </span>
                              {p.flights?.recommended && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                                  <span className="material-symbols-outlined text-[13px]">flight_takeoff</span>
                                  {p.flights.recommended.stops || 'Direct'}
                                </span>
                              )}
                              {p.hotels?.recommended && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                                  <span className="material-symbols-outlined text-[13px]">hotel</span>
                                  {p.hotels.recommended.name?.split('+')[0]?.trim() || 'Luxury Hotel'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!p ? (
                      /* No proposal fallback */
                      <div className="text-center py-12 space-y-4 bg-white rounded-2xl border border-slate-200">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-400 mx-auto flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">No detailed plan yet</p>
                          <p className="text-sm text-slate-500">Continue your conversation with the AI Assistant to generate a full itinerary.</p>
                        </div>
                        <button type="button" onClick={() => onNavigateTab?.('assistant')} className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all cursor-pointer">
                          Continue in AI Assistant
                        </button>
                      </div>
                    ) : (
                      <AiItineraryAddPanel
                        proposal={p}
                        session={currentAiSession}
                        onOpenItineraryInBuilder={onOpenItineraryInBuilder}
                        onNavigateTab={onNavigateTab as ((tab: string) => void) | undefined}
                        showToast={showToast}
                      />
                    )}
                  </>
                );
              })()}
            </main>
          ) : isTripsLoading ? (
            /* Active Timeline Loading Skeleton */
            <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 space-y-8 animate-in fade-in duration-200">
              <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] bg-slate-100 border border-slate-200 shadow-sm flex flex-col justify-end p-6 sm:p-8">
                <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
                <div className="relative space-y-3 z-10">
                  <Skeleton className="w-28 h-6 rounded-full bg-slate-300/80" />
                  <Skeleton className="w-3/5 h-8 rounded-xl bg-slate-300/80" />
                  <Skeleton className="w-1/3 h-4 rounded bg-slate-300/60" />
                </div>
              </div>
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 animate-spin text-[16px]">sync</span>
                  <span className="text-xs font-semibold text-slate-500">Loading timeline events and bookings…</span>
                </div>
                {[1, 2, 3].map(idx => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <Skeleton className="w-32 h-4 rounded" />
                      <Skeleton className="w-20 h-5 rounded-full" />
                    </div>
                    <Skeleton className="w-2/3 h-5 rounded" />
                    <Skeleton className="w-full h-3.5 rounded" />
                  </div>
                ))}
              </div>
            </main>
          ) : (
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
          )
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
