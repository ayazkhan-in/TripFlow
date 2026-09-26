import { CatalogItem, ItineraryCategory, ItineraryDay, ItineraryItem, RouteStop, TripItinerary } from '../types/itinerary';

export interface AIFlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cabinClass: string;
  priceUSD: number;
  priceDeltaUSD: number;
  type: 'recommended' | 'cheaper' | 'luxury';
  label: string;
  badge: string;
  baggage: string;
  stops: string;
}

export interface AIHotelOption {
  id: string;
  name: string;
  roomType: string;
  location: string;
  pricePerNightUSD: number;
  priceDeltaPerNightUSD: number;
  image: string;
  rating: number;
  reviewsCount: number;
  type: 'recommended' | 'cheaper' | 'luxury';
  label: string;
  perks: string[];
}

export interface AITransferOption {
  id: string;
  vehicle: string;
  chauffeur: string;
  rating: number;
  priceDeltaUSD: number;
  type: 'recommended' | 'cheaper' | 'luxury';
  label: string;
  description: string;
}

export interface AIActivityOption extends CatalogItem {
  suggestedDayNumber: number;
  isIncluded?: boolean;
}

export interface AITripDetails {
  destination: string;
  country: string;
  days: number;
  startDate: string;
  travelers: number;
  travelStyle: 'Luxury Concierge' | 'Boutique Heritage' | 'Balanced Comfort';
  interests: string[];
  rawPrompt?: string;
}

export interface AIGeneratedProposal {
  id: string;
  title: string;
  destination: string;
  country: string;
  days: number;
  travelers: number;
  startDate: string;
  basePriceUSD: number;
  heroImage: string;
  summary: string;
  flights: AIFlightOption[];
  selectedFlightId: string;
  hotels: AIHotelOption[];
  selectedHotelId: string;
  transfers: AITransferOption[];
  selectedTransferId: string;
  schedulePreview: Array<{
    dayNumber: number;
    title: string;
    highlights: string[];
  }>;
  extraActivities: AIActivityOption[];
}

// ============================================================================
// 1. PROMPT PARSER
// ============================================================================

export function parseInitialPrompt(text: string): AITripDetails {
  const lower = text.toLowerCase();

  // Detect days
  let days = 5;
  const daysMatch = lower.match(/(\d+)\s*(?:day|days|d)/);
  if (daysMatch) {
    days = Math.min(10, Math.max(2, parseInt(daysMatch[1], 10)));
  }

  // Detect travelers
  let travelers = 2;
  if (lower.includes('solo') || lower.includes('myself') || lower.includes('alone') || lower.includes('1 traveler')) {
    travelers = 1;
  } else if (lower.includes('family') || lower.includes('kids') || lower.includes('4 people') || lower.includes('4 travelers')) {
    travelers = 4;
  } else if (lower.includes('friends') || lower.includes('group') || lower.includes('6 people') || lower.includes('6 travelers')) {
    travelers = 6;
  }

  // Detect travel style
  let travelStyle: AITripDetails['travelStyle'] = 'Luxury Concierge';
  if (lower.includes('boutique') || lower.includes('heritage') || lower.includes('charm')) {
    travelStyle = 'Boutique Heritage';
  } else if (lower.includes('budget') || lower.includes('affordable') || lower.includes('balanced')) {
    travelStyle = 'Balanced Comfort';
  }

  // Detect interests
  const interests: string[] = [];
  if (lower.includes('food') || lower.includes('dining') || lower.includes('michelin') || lower.includes('culinary') || lower.includes('wine')) {
    interests.push('Gourmet Dining');
  }
  if (lower.includes('temple') || lower.includes('history') || lower.includes('heritage') || lower.includes('culture') || lower.includes('palace')) {
    interests.push('Historical Heritage');
  }
  if (lower.includes('spa') || lower.includes('relax') || lower.includes('wellness') || lower.includes('onsen') || lower.includes('beach')) {
    interests.push('Wellness & Relaxation');
  }
  if (lower.includes('hike') || lower.includes('trek') || lower.includes('nature') || lower.includes('mountain') || lower.includes('safari')) {
    interests.push('Scenic Nature & Wildlife');
  }
  if (lower.includes('shop') || lower.includes('modern') || lower.includes('night') || lower.includes('skyline') || lower.includes('city')) {
    interests.push('Modern City & Nightlife');
  }
  if (interests.length === 0) {
    interests.push('Historical Heritage', 'Gourmet Dining', 'Wellness & Relaxation');
  }

  // Detect Destination & Country
  let destination = 'Tokyo';
  let country = 'Japan';

  if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('kyoto') || lower.includes('osaka')) {
    destination = 'Tokyo';
    country = 'Japan';
  } else if (lower.includes('kerala') || lower.includes('kochi') || lower.includes('cochin') || lower.includes('munnar') || lower.includes('alleppey')) {
    destination = 'Kerala';
    country = 'India';
  } else if (lower.includes('rajasthan') || lower.includes('jaipur') || lower.includes('udaipur') || lower.includes('jodhpur')) {
    destination = 'Rajasthan';
    country = 'India';
  } else if (lower.includes('goa') || lower.includes('panaji')) {
    destination = 'Goa';
    country = 'India';
  } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('emirates')) {
    destination = 'Dubai';
    country = 'United Arab Emirates';
  } else if (lower.includes('paris') || lower.includes('france')) {
    destination = 'Paris';
    country = 'France';
  } else if (lower.includes('swiss') || lower.includes('switzerland') || lower.includes('alps') || lower.includes('zermatt')) {
    destination = 'Swiss Alps';
    country = 'Switzerland';
  } else if (lower.includes('riyadh') || lower.includes('saudi')) {
    destination = 'Riyadh';
    country = 'Saudi Arabia';
  } else if (lower.includes('new york') || lower.includes('nyc') || lower.includes('manhattan')) {
    destination = 'New York';
    country = 'United States';
  } else if (lower.includes('seoul') || lower.includes('korea')) {
    destination = 'Seoul';
    country = 'South Korea';
  } else if (lower.includes('bali') || lower.includes('indonesia')) {
    destination = 'Bali';
    country = 'Indonesia';
  } else if (lower.includes('maldives')) {
    destination = 'Maldives';
    country = 'Maldives';
  } else if (lower.includes('rome') || lower.includes('italy') || lower.includes('amalfi')) {
    destination = 'Rome';
    country = 'Italy';
  } else {
    // Try to extract capitalized destination from prompt
    const matches = text.match(/(?:to|in|visit|explore|trip\s+to)\s+([A-Z][a-zA-Z\s]{2,20})/i);
    if (matches && matches[1]) {
      const candidate = matches[1].trim().split(/\s+/)[0];
      if (candidate.length > 2) {
        destination = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
        country = 'International';
      }
    }
  }

  // Default start date: 20 days from now
  const now = new Date();
  now.setDate(now.getDate() + 20);
  const startDate = now.toISOString().split('T')[0];

  return {
    destination,
    country,
    days,
    startDate,
    travelers,
    travelStyle,
    interests,
    rawPrompt: text,
  };
}

// ============================================================================
// 2. KNOWLEDGE BASE & ALTERNATIVES CATALOG
// ============================================================================

interface DestinationPreset {
  title: string;
  country: string;
  heroImage: string;
  summary: string;
  baseFlightPrice: number;
  baseHotelPricePerNight: number;
  flights: AIFlightOption[];
  hotels: AIHotelOption[];
  transfers: AITransferOption[];
  scheduleTemplates: Array<{ title: string; highlights: string[] }>;
  extraActivities: AIActivityOption[];
}

const PRESET_DESTINATIONS: Record<string, DestinationPreset> = {
  Tokyo: {
    title: 'Tokyo & Hakone Imperial Luxury Discovery',
    country: 'Japan',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    summary: 'A curated balance of ultra-modern skyline penthouses, Michelin culinary experiences, private kimono tea ceremonies, and serene Hakone mountain hot springs.',
    baseFlightPrice: 920,
    baseHotelPricePerNight: 380,
    flights: [
      {
        id: 'flt-tokyo-rec',
        airline: 'ANA / Air India Direct',
        flightNumber: 'AI-306',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Tokyo Haneda',
        destCode: 'HND',
        departureTime: '08:15 AM',
        arrivalTime: '07:40 PM',
        duration: '8h 55m',
        cabinClass: 'Premium Economy',
        priceUSD: 920,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Recommended Direct',
        badge: 'Non-Stop · Best Timing',
        baggage: '2x 23kg Checked Bags Included',
        stops: 'Non-stop',
      },
      {
        id: 'flt-tokyo-cheap',
        airline: 'VietJet / Cathay 1-Stop',
        flightNumber: 'VJ-824',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Tokyo Narita',
        destCode: 'NRT',
        departureTime: '11:30 PM',
        arrivalTime: '01:15 PM (+1)',
        duration: '11h 15m',
        cabinClass: 'Economy Saver',
        priceUSD: 640,
        priceDeltaUSD: -280,
        type: 'cheaper',
        label: 'Budget Friendly (Save $280)',
        badge: '1 Short Layover · High Value',
        baggage: '1x 20kg Checked Bag Included',
        stops: '1 stop (2h layover)',
      },
      {
        id: 'flt-tokyo-lux',
        airline: 'Singapore Airlines First Suites',
        flightNumber: 'SQ-638',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Tokyo Haneda',
        destCode: 'HND',
        departureTime: '09:45 AM',
        arrivalTime: '09:20 PM',
        duration: '9h 05m',
        cabinClass: 'Business / First Suite',
        priceUSD: 1400,
        priceDeltaUSD: 480,
        type: 'luxury',
        label: 'VIP Flagship Business (+$480)',
        badge: 'Lie-flat Beds · Dom Pérignon',
        baggage: '3x 32kg Priority Luggage',
        stops: 'Non-stop Direct',
      },
    ],
    hotels: [
      {
        id: 'htl-tokyo-rec',
        name: 'Aman Tokyo & Gora Kadan Hakone',
        roomType: 'Premier Grand King Room with Imperial Palace View',
        location: 'Otemachi, Tokyo & Hakone National Park',
        pricePerNightUSD: 380,
        priceDeltaPerNightUSD: 0,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        rating: 4.96,
        reviewsCount: 840,
        type: 'recommended',
        label: 'Curated 5-Star Luxury',
        perks: ['Artisanal Japanese Breakfast', 'Private Cedar Onsen Access', '24/7 Concierge Service', 'Early Check-In'],
      },
      {
        id: 'htl-tokyo-cheap',
        name: 'Trunk Hotel Yoyogi & Traditional Ryokan',
        roomType: 'Boutique Heritage Suite with Balcony',
        location: 'Shibuya / Yoyogi Park, Tokyo',
        pricePerNightUSD: 240,
        priceDeltaPerNightUSD: -140,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.88,
        reviewsCount: 1120,
        type: 'cheaper',
        label: 'Charming Boutique (Save $140/nt)',
        perks: ['Complimentary Craft Cocktails', 'Direct Park Proximity', 'Modern Japanese Minimalism'],
      },
      {
        id: 'htl-tokyo-lux',
        name: 'The Ritz-Carlton Club Penthouse & Private Villa',
        roomType: 'Presidential Skyline Suite with Mt. Fuji Vista',
        location: 'Roppongi Tokyo Midtown (Top Floor)',
        pricePerNightUSD: 620,
        priceDeltaPerNightUSD: 240,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        rating: 4.99,
        reviewsCount: 520,
        type: 'luxury',
        label: 'Ultra-Luxury Presidential (+$240/nt)',
        perks: ['Private Butler & Rolls Royce Shuttles', 'Executive Club Lounge All Day', 'Private Chef Dining'],
      },
    ],
    transfers: [
      {
        id: 'trf-tokyo-rec',
        vehicle: 'Executive Toyota Alphard VIP Lounge',
        chauffeur: 'Kenji Takahashi',
        rating: 4.98,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Dedicated Executive Van (Included)',
        description: 'Captain reclining leather seats, Wi-Fi hotspot, iced matcha & mineral water, English speaking chauffeur.',
      },
      {
        id: 'trf-tokyo-cheap',
        vehicle: 'JR Bullet Train Green Class & Private Taxi Pass',
        chauffeur: 'Station Meet & Greet Concierge',
        rating: 4.85,
        priceDeltaUSD: -60,
        type: 'cheaper',
        label: 'High-Speed Rail & Taxi (Save $60)',
        description: 'Shinkansen Green Car luxury passes with pre-arranged luggage forwarding directly between hotels.',
      },
      {
        id: 'trf-tokyo-lux',
        vehicle: 'Mercedes-Benz Maybach S-Class Flagship',
        chauffeur: 'Master Chauffeur Ryuichi',
        rating: 5.0,
        priceDeltaUSD: 180,
        type: 'luxury',
        label: 'Mercedes Maybach VIP (+$180)',
        description: 'Ultimate German executive sedan, chilled champagne bar, panoramic roof, priority fast-track lanes.',
      },
    ],
    scheduleTemplates: [
      {
        title: 'Arrival in Tokyo, Skyline Sunset & Welcome Omakase',
        highlights: ['Private airport meet & greeting', 'Check-in to luxury suite', 'Shibuya Sky sunset observation', 'Private 8-course Edomae Sushi dinner'],
      },
      {
        title: 'Ancient Asakusa, Silk Kimono Stroll & teamLab Planets',
        highlights: ['VIP Senso-ji temple private historian tour', 'Artisan silk kimono tailoring', 'teamLab Planets immersive light experience', 'Ginza wagyu teppanyaki'],
      },
      {
        title: 'Bullet Train to Hakone & Private Hot Spring Onsen',
        highlights: ['Morning scenic drive past Mt. Fuji', 'Lake Ashi pirate ship cruise', 'Owakudani volcanic valley', 'Traditional multi-course Kaiseki banquet'],
      },
      {
        title: 'Kyoto Bamboo Forest & Dawn Fushimi Inari Torii Shrine',
        highlights: ['Sunrise walk through 10,000 torii gates', 'Whispering Arashiyama bamboo forest', 'Zen rock garden meditation', 'Gion geisha district evening walk'],
      },
      {
        title: 'Tsukiji Market Masterclass & Farewell Tea Ceremony',
        highlights: ['Early dawn sushi chef tour at outer market', 'Private matcha tea ceremony with grandmaster', 'Luxury souvenir shopping', 'Executive transfer to airport'],
      },
    ],
    extraActivities: [
      {
        id: 'act-tokyo-sushi-master',
        title: 'Private Omakase Masterclass with 2-Star Michelin Chef',
        category: 'meal',
        price: 180,
        timeSlotDefault: '12:30 PM',
        duration: '2.5 hrs',
        location: 'Ginza, Tokyo',
        description: 'Stand beside a generational sushi master, learn authentic knife skills, and dine on seasonal otoro and Hokkaido uni.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        rating: 4.98,
        reviewsCount: 310,
        tags: ['✨ AI Recommendation', 'Michelin Chef', 'Hands-On'],
        suggestedDayNumber: 2,
      },
      {
        id: 'act-tokyo-heli',
        title: 'Tokyo Tower & Bay Sunset Helicopter Flight',
        category: 'experience',
        price: 260,
        timeSlotDefault: '05:30 PM',
        duration: '45 min',
        location: 'Tokyo Heliport, Koto City',
        description: 'Breathtaking 600m altitude flight over Shibuya crossing, Tokyo Skytree, and Rainbow Bridge at sunset with champagne.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        rating: 4.95,
        reviewsCount: 180,
        tags: ['✨ AI Recommendation', 'Aerial View', 'Champagne'],
        suggestedDayNumber: 1,
      },
      {
        id: 'act-tokyo-sumo',
        title: 'Exclusive Morning Sumo Stable Training & Chanko Nabe',
        category: 'activity',
        price: 95,
        timeSlotDefault: '07:30 AM',
        duration: '2.5 hrs',
        location: 'Ryogoku, Tokyo',
        description: 'Watch professional rikishi heavyweights practice ancient wrestling rituals up close, followed by an authentic warrior stew.',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        rating: 4.92,
        reviewsCount: 420,
        tags: ['✨ AI Recommendation', 'VIP Access', 'Cultural'],
        suggestedDayNumber: 3,
      },
      {
        id: 'act-tokyo-tea-ceremony',
        title: 'Zen Garden Private Tea Ceremony with 15th-Gen Master',
        category: 'experience',
        price: 75,
        timeSlotDefault: '03:00 PM',
        duration: '1.5 hrs',
        location: 'Ueno Park Heritage Pavilion',
        description: 'Quiet meditative preparation of ceremonial Uji green tea inside a 300-year-old tatami tearoom overlooking koi ponds.',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        rating: 4.89,
        reviewsCount: 260,
        tags: ['✨ AI Recommendation', 'Zen Garden', 'Tranquil'],
        suggestedDayNumber: 4,
      },
      {
        id: 'act-tokyo-vintage-vinyl',
        title: 'Hidden Tokyo: Jazz Kissa & Vinyl Lounges Evening Tour',
        category: 'activity',
        price: 65,
        timeSlotDefault: '08:30 PM',
        duration: '3 hrs',
        location: 'Shimokitazawa & Shinjuku Golden Gai',
        description: 'Local music connoisseur leads you to obscure audiophile subterranean bars playing rare analog records through tube amplifiers.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        rating: 4.96,
        reviewsCount: 390,
        tags: ['✨ AI Recommendation', 'Nightlife', 'Music'],
        suggestedDayNumber: 2,
      },
    ],
  },

  Kerala: {
    title: 'Kerala Monsoon Whispers & Backwaters Escape',
    country: 'India',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNN2qoyEfvyOtZqIr504qTiJEZNQBFvkTNvnO1WbRHP3yVW547MfCw_uDAhSKK1GiCdNjUe-aRn8-L_63RS7R5Mwy4YqnpRnqP57KQq_CU-YFBVffy0PLU7ZdcbMNrxFCo6iB6Avjx862fxPTlkaaqd3BGyUp-55-M5LzxAfFv7qHZZE61cBMvjceJO4nQcz_Dorwpv3LBbNmV9TuAEfTYveWHC3LBVHpfXmUBrAgH70wL-s9i3orMA',
    summary: 'A tranquil tropical retreat through mist-shrouded tea plantations, private teak kettuvallam houseboats, and authentic Ayurvedic wellness.',
    baseFlightPrice: 120,
    baseHotelPricePerNight: 190,
    flights: [
      {
        id: 'flt-kerala-rec',
        airline: 'Air India / IndiGo Non-Stop',
        flightNumber: 'AI-682',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Cochin International',
        destCode: 'COK',
        departureTime: '11:30 AM',
        arrivalTime: '01:45 PM',
        duration: '2h 15m',
        cabinClass: 'Premium Economy',
        priceUSD: 120,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Recommended Prime Flight',
        badge: 'Direct · Priority Boarding',
        baggage: '25kg Checked + 7kg Cabin',
        stops: 'Non-stop',
      },
      {
        id: 'flt-kerala-cheap',
        airline: 'IndiGo Early Morning Saver',
        flightNumber: '6E-421',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Cochin International',
        destCode: 'COK',
        departureTime: '06:00 AM',
        arrivalTime: '08:15 AM',
        duration: '2h 15m',
        cabinClass: 'Economy Saver',
        priceUSD: 85,
        priceDeltaUSD: -35,
        type: 'cheaper',
        label: 'Early Morning Saver (Save $35)',
        badge: 'Early Arrival · Great Value',
        baggage: '15kg Checked Bag',
        stops: 'Non-stop',
      },
      {
        id: 'flt-kerala-lux',
        airline: 'Vistara / Air India Club Business',
        flightNumber: 'UK-882',
        origin: 'Mumbai / Delhi',
        originCode: 'BOM',
        destination: 'Cochin International',
        destCode: 'COK',
        departureTime: '01:15 PM',
        arrivalTime: '03:30 PM',
        duration: '2h 15m',
        cabinClass: 'Business Club',
        priceUSD: 195,
        priceDeltaUSD: 75,
        type: 'luxury',
        label: 'Club Business Class (+$75)',
        badge: 'Lounge Access · Gourmet Meal',
        baggage: '35kg Checked Bags',
        stops: 'Non-stop',
      },
    ],
    hotels: [
      {
        id: 'htl-kerala-rec',
        name: 'Brunton Boatyard & Teak Luxury Houseboat',
        roomType: 'Sea Facing Heritage Suite & Private Bow Master Deck',
        location: 'Fort Kochi & Alleppey Backwaters',
        pricePerNightUSD: 190,
        priceDeltaPerNightUSD: 0,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        rating: 4.95,
        reviewsCount: 680,
        type: 'recommended',
        label: 'Heritage 5-Star & Houseboat',
        perks: ['Artisanal South Indian Breakfast', 'Sunset Harbour Cruise', 'Chef Prepared Onboard Meals', '24/7 Butler'],
      },
      {
        id: 'htl-kerala-cheap',
        name: 'Fragrant Nature & Boutique Water Villa',
        roomType: 'Canal View Deluxe Suite',
        location: 'Kochi & Kollam Lakes',
        pricePerNightUSD: 120,
        priceDeltaPerNightUSD: -70,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.82,
        reviewsCount: 490,
        type: 'cheaper',
        label: 'Boutique Nature Retreat (Save $70/nt)',
        perks: ['Complimentary Lake Canoeing', 'Herbal Breakfast', 'Lush Tropical Gardens'],
      },
      {
        id: 'htl-kerala-lux',
        name: 'Kumarakom Lake Resort Presidential Pool Villa',
        roomType: 'Private Meandering Pool Heritage Pavilion',
        location: 'Vembanad Lakefront, Kumarakom',
        pricePerNightUSD: 340,
        priceDeltaPerNightUSD: 150,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        rating: 4.99,
        reviewsCount: 710,
        type: 'luxury',
        label: 'Ultra-Luxury Pool Villa (+$150/nt)',
        perks: ['Private Plunge Pool', 'Direct Lake Lagoon Access', 'Complimentary Sunset Flute Recital'],
      },
    ],
    transfers: [
      {
        id: 'trf-kerala-rec',
        vehicle: 'Executive Toyota Innova Crysta SUV',
        chauffeur: 'Arun V.',
        rating: 4.98,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Dedicated Private Chauffeur (Included)',
        description: 'Air-conditioned luxury SUV, cold bottled coconut water, highway tolls included, veteran local guide.',
      },
      {
        id: 'trf-kerala-cheap',
        vehicle: 'Sedan (Toyota Etios) with Driver',
        chauffeur: 'Suresh Kumar',
        rating: 4.86,
        priceDeltaUSD: -40,
        type: 'cheaper',
        label: 'Standard Air-Conditioned Sedan (Save $40)',
        description: 'Reliable air-conditioned private sedan suitable for 1-2 passengers.',
      },
      {
        id: 'trf-kerala-lux',
        vehicle: 'Mercedes-Benz GLC Luxury SUV',
        chauffeur: 'Master Driver Joseph',
        rating: 5.0,
        priceDeltaUSD: 140,
        type: 'luxury',
        label: 'Mercedes GLC Luxury (+$140)',
        description: 'German premium SUV with panoramic sunroof, leather upholstery, and chilled refreshments.',
      },
    ],
    scheduleTemplates: [
      {
        title: 'Arrival in Kochi & Colonial Heritage Walk',
        highlights: ['Chauffeur pickup with coconut water', 'Check-in to Brunton Boatyard', 'Chinese fishing nets sunset walk', 'Kathakali cultural dance performance'],
      },
      {
        title: 'Scenic Hill Climb to Munnar Tea Plantations',
        highlights: ['Waterfall stops at Cheeyappara', 'Check-in to misty estate bungalow', 'Private tea factory tasting tour', 'Campfire dinner with hill views'],
      },
      {
        title: 'Eravikulam National Park & Alleppey Houseboat Boarding',
        highlights: ['Nilgiri Tahr mountain goat safari', 'Scenic transfer to backwater jetty', 'Welcome tender coconut aboard luxury houseboat', 'Sunset cruise & pearl spot fish feast'],
      },
      {
        title: 'Backwater Village Canoe Safari & Spice Gardens',
        highlights: ['Gentle sunrise cruise through narrow canals', 'Ayurvedic herbal massage session', 'Organic cardamom & vanilla plantation stroll', 'Candlelight lake dinner'],
      },
      {
        title: 'Farewell Verandah Breakfast & Airport Transfer',
        highlights: ['Fresh appam & Travancore stew breakfast', 'Artisan spice souvenir shopping', 'Executive transfer to Cochin International Airport T3'],
      },
    ],
    extraActivities: [
      {
        id: 'act-kl-ayurveda',
        title: 'Authentic 90-Min Ayurvedic Abhyanga & Shirodhara',
        category: 'experience',
        price: 65,
        timeSlotDefault: '04:00 PM',
        duration: '1.5 hrs',
        location: 'CGH Earth Wellness Center, Fort Kochi',
        description: 'Warm herbal medicated oils poured in a continuous stream over the forehead, releasing stress and restoring vitality.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        rating: 4.96,
        reviewsCount: 420,
        tags: ['✨ AI Recommendation', 'Ayurveda', 'Relaxation'],
        suggestedDayNumber: 1,
      },
      {
        id: 'act-kl-sunset-cruise',
        title: 'Private 40ft Catamaran Sunset Champagne Cruise',
        category: 'activity',
        price: 110,
        timeSlotDefault: '05:00 PM',
        duration: '2 hrs',
        location: 'Vembanad Lake Lagoon',
        description: 'Sail the vast expanse of Vembanad Lake as the sun melts into the water, accompanied by canapés and sparkling wine.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        rating: 4.94,
        reviewsCount: 230,
        tags: ['✨ AI Recommendation', 'Sunset', 'Private Yacht'],
        suggestedDayNumber: 3,
      },
      {
        id: 'act-kl-cooking-class',
        title: 'Syrian Christian Heritage Cooking with Chef Nimmy',
        category: 'meal',
        price: 55,
        timeSlotDefault: '11:00 AM',
        duration: '2.5 hrs',
        location: 'Traditional Tharavadu Home, Kochi',
        description: 'Hands-on culinary class preparing Karimeen Pollichathu and fresh appams with stone-ground coconut milk.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        rating: 4.97,
        reviewsCount: 310,
        tags: ['✨ AI Recommendation', 'Cooking', 'Authentic'],
        suggestedDayNumber: 2,
      },
      {
        id: 'act-kl-canoe-safari',
        title: 'Hidden Backwater Village Guided Wooden Canoe Safari',
        category: 'activity',
        price: 45,
        timeSlotDefault: '06:30 AM',
        duration: '2 hrs',
        location: 'Kainakary Canals, Alleppey',
        description: 'Glide quietly through narrow palm-canopied canals where motorboats cannot enter. Observe coir making and kingfishers.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        rating: 4.91,
        reviewsCount: 190,
        tags: ['✨ AI Recommendation', 'Sunrise', 'Local Village'],
        suggestedDayNumber: 4,
      },
    ],
  },
};

// ============================================================================
// 3. GENERIC PROCEDURAL DESTINATION GENERATOR
// ============================================================================

function generateProceduralDestination(details: AITripDetails): DestinationPreset {
  const dest = details.destination;
  const country = details.country || 'International';

  const baseFlightPrice = details.travelStyle === 'Luxury Concierge' ? 850 : 550;
  const baseHotelPrice = details.travelStyle === 'Luxury Concierge' ? 320 : 200;

  return {
    title: `${dest} Bespoke ${details.travelStyle} Journey`,
    country,
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    summary: `An exclusive ${details.days}-day itinerary in ${dest} tailored around ${details.interests.join(', ')}, complete with private transfers, handpicked boutique luxury stays, and curated local discoveries.`,
    baseFlightPrice,
    baseHotelPricePerNight: baseHotelPrice,
    flights: [
      {
        id: `flt-${dest.toLowerCase()}-rec`,
        airline: 'Premier National Flagship Carrier',
        flightNumber: 'FL-402',
        origin: 'Major International Hub',
        originCode: 'INT',
        destination: `${dest} International`,
        destCode: dest.slice(0, 3).toUpperCase(),
        departureTime: '09:00 AM',
        arrivalTime: '04:30 PM',
        duration: '7h 30m',
        cabinClass: 'Premium Economy / Club',
        priceUSD: baseFlightPrice,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Recommended Direct',
        badge: 'Priority Check-in · 2x Checked Bags',
        baggage: '2x 23kg Checked Bags Included',
        stops: 'Non-stop Direct',
      },
      {
        id: `flt-${dest.toLowerCase()}-cheap`,
        airline: 'Value Express 1-Stop',
        flightNumber: 'VE-912',
        origin: 'Major International Hub',
        originCode: 'INT',
        destination: `${dest} International`,
        destCode: dest.slice(0, 3).toUpperCase(),
        departureTime: '11:15 PM',
        arrivalTime: '11:45 AM (+1)',
        duration: '10h 30m',
        cabinClass: 'Economy Saver',
        priceUSD: Math.round(baseFlightPrice * 0.7),
        priceDeltaUSD: -Math.round(baseFlightPrice * 0.3),
        type: 'cheaper',
        label: `Economy Saver (Save $${Math.round(baseFlightPrice * 0.3)})`,
        badge: '1 Short Connection · Top Value',
        baggage: '1x 20kg Checked Bag',
        stops: '1 stop (2h connection)',
      },
      {
        id: `flt-${dest.toLowerCase()}-lux`,
        airline: 'First Class International Flagship',
        flightNumber: 'FC-101',
        origin: 'Major International Hub',
        originCode: 'INT',
        destination: `${dest} International`,
        destCode: dest.slice(0, 3).toUpperCase(),
        departureTime: '10:30 AM',
        arrivalTime: '05:45 PM',
        duration: '7h 15m',
        cabinClass: 'Lie-Flat Business / First Suite',
        priceUSD: Math.round(baseFlightPrice * 1.5),
        priceDeltaUSD: Math.round(baseFlightPrice * 0.5),
        type: 'luxury',
        label: `VIP First Class (+$${Math.round(baseFlightPrice * 0.5)})`,
        badge: 'Chauffeur to Airport · Champagne Lounge',
        baggage: '3x 32kg Priority Bags',
        stops: 'Non-stop Direct',
      },
    ],
    hotels: [
      {
        id: `htl-${dest.toLowerCase()}-rec`,
        name: `The Grand Heritage & Spa Resort ${dest}`,
        roomType: 'Executive Panoramic Suite with Balcony',
        location: `Central ${dest} District`,
        pricePerNightUSD: baseHotelPrice,
        priceDeltaPerNightUSD: 0,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.94,
        reviewsCount: 650,
        type: 'recommended',
        label: 'Curated 5-Star Hotel',
        perks: ['Artisanal Buffet Breakfast Included', 'Private Spa Access', 'Early Check-In Guaranteed', '24/7 Concierge'],
      },
      {
        id: `htl-${dest.toLowerCase()}-cheap`,
        name: `Boutique Historic Haven ${dest}`,
        roomType: 'Deluxe Heritage King Room',
        location: `Historic Quarter, ${dest}`,
        pricePerNightUSD: Math.round(baseHotelPrice * 0.65),
        priceDeltaPerNightUSD: -Math.round(baseHotelPrice * 0.35),
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        rating: 4.86,
        reviewsCount: 420,
        type: 'cheaper',
        label: `Boutique Historic (Save $${Math.round(baseHotelPrice * 0.35)}/nt)`,
        perks: ['Complimentary Continental Breakfast', 'Charming Local Architecture', 'Prime Walkable Location'],
      },
      {
        id: `htl-${dest.toLowerCase()}-lux`,
        name: `The Imperial Palace Villa ${dest}`,
        roomType: 'Presidential Penthouse with Private Pool',
        location: `Exclusive Waterfront / Hilltop ${dest}`,
        pricePerNightUSD: Math.round(baseHotelPrice * 1.6),
        priceDeltaPerNightUSD: Math.round(baseHotelPrice * 0.6),
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        rating: 4.99,
        reviewsCount: 310,
        type: 'luxury',
        label: `Ultra-Luxury Villa (+$${Math.round(baseHotelPrice * 0.6)}/nt)`,
        perks: ['Dedicated Private Butler', 'Private Heated Pool', 'Rolls Royce Chauffeur Transfers Included'],
      },
    ],
    transfers: [
      {
        id: `trf-${dest.toLowerCase()}-rec`,
        vehicle: 'Dedicated Executive SUV with Private Chauffeur',
        chauffeur: 'Licensed Executive Chauffeur',
        rating: 4.97,
        priceDeltaUSD: 0,
        type: 'recommended',
        label: 'Dedicated Private SUV (Included)',
        description: 'Spacious air-conditioned SUV dedicated across all days with chilled refreshments, tolls, and flight radar sync.',
      },
      {
        id: `trf-${dest.toLowerCase()}-cheap`,
        vehicle: 'Standard Private Sedan & Airport Shuttles',
        chauffeur: 'Airport Concierge Team',
        rating: 4.82,
        priceDeltaUSD: -50,
        type: 'cheaper',
        label: 'Private Sedan (Save $50)',
        description: 'Comfortable air-conditioned private sedan suitable for airport and local transfers.',
      },
      {
        id: `trf-${dest.toLowerCase()}-lux`,
        vehicle: 'Mercedes S-Class / Maybach VIP Fleet',
        chauffeur: 'Executive Senior Chauffeur',
        rating: 5.0,
        priceDeltaUSD: 160,
        type: 'luxury',
        label: 'Mercedes S-Class VIP (+$160)',
        description: 'First-class luxury sedan with reclining leather massage seats, champagne cooler, and VIP parking access.',
      },
    ],
    scheduleTemplates: [
      {
        title: `Arrival in ${dest}, Private Check-in & Sunset Welcome Dinner`,
        highlights: ['Chauffeur meet & greet at airport', `Check-in to luxury suite in ${dest}`, 'Panoramic city / bay view cocktail hour', 'Gourmet multi-course welcome dinner'],
      },
      {
        title: `Historical Landmarks, Heritage Architecture & Old Town Stroll`,
        highlights: [`Guided private historian tour of ${dest}'s iconic monuments`, 'Artisan lunch at acclaimed heritage restaurant', 'Boutique craft and local artisan shopping', 'Evening sunset promenade'],
      },
      {
        title: `Scenic Nature Excursion, Panoramic Lookouts & Fine Dining`,
        highlights: ['Private morning excursion to dramatic lookout point', 'Scenic private boat or cable car ride', 'Farm-to-table lunch overlooking the vistas', 'Relaxing afternoon spa treatment'],
      },
      {
        title: `Hidden Neighborhoods, Culinary Masterclass & Cultural Evening`,
        highlights: ['Morning food market tasting walk with local chef', 'Hands-on culinary or artisan craft workshop', 'Private performance or cultural exhibition', 'Exclusive rooftop tasting menu'],
      },
      {
        title: `Leisure Morning, Artisan Souvenirs & VIP Airport Transfer`,
        highlights: ['Gourmet verandah breakfast at your hotel', 'Final stroll through scenic gardens', 'Personalized souvenir gift presentation', 'Executive chauffeur transfer to airport'],
      },
    ],
    extraActivities: [
      {
        id: `act-${dest.toLowerCase()}-heli`,
        title: `Scenic Sunset Helicopter Tour of ${dest}`,
        category: 'experience',
        price: 220,
        timeSlotDefault: '05:30 PM',
        duration: '45 min',
        location: `${dest} Heliport`,
        description: `Breathtaking aerial perspective of ${dest}'s natural and architectural landmarks with champagne service.`,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        rating: 4.96,
        reviewsCount: 140,
        tags: ['✨ AI Recommendation', 'Helicopter', 'Panoramic View'],
        suggestedDayNumber: 1,
      },
      {
        id: `act-${dest.toLowerCase()}-chef`,
        title: `Private Chef's Table & Wine Pairing in ${dest}`,
        category: 'meal',
        price: 135,
        timeSlotDefault: '07:30 PM',
        duration: '2.5 hrs',
        location: `Historic Quarter, ${dest}`,
        description: `Seven-course tasting menu paired with regional sommelier reserves inside a historic stone vault.`,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        rating: 4.94,
        reviewsCount: 220,
        tags: ['✨ AI Recommendation', 'Chef Tasting', 'Wine Pairing'],
        suggestedDayNumber: 2,
      },
      {
        id: `act-${dest.toLowerCase()}-boat`,
        title: `Private Luxury Yacht / Boat Charter at Sunset`,
        category: 'activity',
        price: 175,
        timeSlotDefault: '04:00 PM',
        duration: '3 hrs',
        location: `${dest} Marina`,
        description: `Private coastal / river yacht charter with fresh fruit platters, champagne, and swimming stop.`,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        rating: 4.97,
        reviewsCount: 180,
        tags: ['✨ AI Recommendation', 'Private Boat', 'Sunset'],
        suggestedDayNumber: 3,
      },
      {
        id: `act-${dest.toLowerCase()}-spa`,
        title: `Signature Holistic Rejuvenation & Thermal Spa Ritual`,
        category: 'experience',
        price: 85,
        timeSlotDefault: '02:00 PM',
        duration: '2 hrs',
        location: `The Grand Spa, ${dest}`,
        description: `Full-body exfoliation, botanical aromatics, and hydrotherapy pools designed to banish travel fatigue.`,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        rating: 4.91,
        reviewsCount: 290,
        tags: ['✨ AI Recommendation', 'Spa & Wellness', 'Rejuvenation'],
        suggestedDayNumber: 4,
      },
      {
        id: `act-${dest.toLowerCase()}-photo`,
        title: `Private Professional Photographer & Iconic Landmark Shoot`,
        category: 'activity',
        price: 90,
        timeSlotDefault: '09:00 AM',
        duration: '2 hrs',
        location: `Key Landmarks of ${dest}`,
        description: `Personal fashion/travel photographer captures 40+ edited high-resolution memories at the most scenic backdrops.`,
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        rating: 4.95,
        reviewsCount: 310,
        tags: ['✨ AI Recommendation', 'Photography', 'Memories'],
        suggestedDayNumber: 2,
      },
    ],
  };
}

// ============================================================================
// 4. GENERATE PROPOSAL FROM USER DETAILS
// ============================================================================

export function generateProposalFromDetails(details: AITripDetails): AIGeneratedProposal {
  // Find preset or generate procedural
  const presetKey = Object.keys(PRESET_DESTINATIONS).find(
    k => k.toLowerCase() === details.destination.toLowerCase()
  );

  const preset = presetKey ? PRESET_DESTINATIONS[presetKey] : generateProceduralDestination(details);

  const daysCount = Math.max(2, Math.min(10, details.days || 5));
  const nights = Math.max(1, daysCount - 1);
  const travelers = Math.max(1, details.travelers || 2);

  // Calculate base price
  const baseFlight = preset.flights[0].priceUSD * travelers;
  const baseHotel = preset.hotels[0].pricePerNightUSD * nights;
  const baseActivitiesEstimate = 180 * daysCount;
  const totalBasePrice = Math.round(baseFlight + baseHotel + baseActivitiesEstimate);

  // Generate day preview highlights
  const schedulePreview: Array<{ dayNumber: number; title: string; highlights: string[] }> = [];
  for (let i = 1; i <= daysCount; i++) {
    const templateIndex = Math.min(i - 1, preset.scheduleTemplates.length - 1);
    const tmpl = preset.scheduleTemplates[templateIndex];
    schedulePreview.push({
      dayNumber: i,
      title: i === 1 ? tmpl.title : i === daysCount ? tmpl.title : `Day ${i}: ${tmpl.title}`,
      highlights: tmpl.highlights,
    });
  }

  // Adjust suggested days on extra activities so they fall within [1..daysCount]
  const extraActivities: AIActivityOption[] = preset.extraActivities.map((act, idx) => ({
    ...act,
    suggestedDayNumber: (idx % (daysCount - 1)) + 1,
    isIncluded: false,
  }));

  return {
    id: `prop-${details.destination.toLowerCase()}-${Date.now()}`,
    title: preset.title,
    destination: details.destination,
    country: preset.country,
    days: daysCount,
    travelers,
    startDate: details.startDate,
    basePriceUSD: totalBasePrice,
    heroImage: preset.heroImage,
    summary: preset.summary,
    flights: preset.flights,
    selectedFlightId: preset.flights[0].id,
    hotels: preset.hotels,
    selectedHotelId: preset.hotels[0].id,
    transfers: preset.transfers,
    selectedTransferId: preset.transfers[0].id,
    schedulePreview,
    extraActivities,
  };
}

// ============================================================================
// 5. COMPILE TO REAL TRIP ITINERARY
// ============================================================================

export function compileFinalItinerary(
  proposal: AIGeneratedProposal,
  selectedFlightId: string,
  selectedHotelId: string,
  selectedTransferId: string,
  selectedActivityIds: string[]
): TripItinerary {
  const chosenFlight = proposal.flights.find(f => f.id === selectedFlightId) || proposal.flights[0];
  const chosenHotel = proposal.hotels.find(h => h.id === selectedHotelId) || proposal.hotels[0];
  const chosenTransfer = proposal.transfers.find(t => t.id === selectedTransferId) || proposal.transfers[0];

  const days: ItineraryDay[] = [];

  for (let dayNum = 1; dayNum <= proposal.days; dayNum++) {
    const items: ItineraryItem[] = [];

    // Day 1: Flight & Chauffeur
    if (dayNum === 1) {
      items.push({
        id: `item-flight-${Date.now()}`,
        title: `${chosenFlight.airline} (${chosenFlight.originCode} ➔ ${chosenFlight.destCode})`,
        category: 'transport',
        price: chosenFlight.priceUSD,
        time: chosenFlight.departureTime,
        duration: chosenFlight.duration,
        location: `${chosenFlight.origin} Airport`,
        description: `${chosenFlight.cabinClass} · ${chosenFlight.stops} · Flight Number ${chosenFlight.flightNumber}. ${chosenFlight.baggage}.`,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        tags: [chosenFlight.airline, chosenFlight.cabinClass, 'Flight Included'],
        transitToNext: { mode: 'car', duration: '35 min' },
      });

      items.push({
        id: `item-car-${Date.now()}`,
        title: `Airport Transfer: ${chosenTransfer.vehicle}`,
        category: 'transport',
        price: 60,
        time: chosenFlight.arrivalTime,
        duration: '1 hr',
        location: `${proposal.destination} International Airport`,
        description: `Chauffeur ${chosenTransfer.chauffeur} greets at arrivals. ${chosenTransfer.description}`,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        rating: chosenTransfer.rating,
        tags: ['Private Chauffeur', 'Direct Transfer'],
      });
    }

    // Every Day: Hotel check-in or stay record
    items.push({
      id: `item-hotel-d${dayNum}-${Date.now()}`,
      title: `${chosenHotel.name} (${chosenHotel.roomType})`,
      category: 'hotel',
      price: chosenHotel.pricePerNightUSD,
      time: dayNum === 1 ? '03:00 PM' : '08:00 AM',
      duration: 'Overnight',
      location: chosenHotel.location,
      description: `${chosenHotel.label}. Perks: ${chosenHotel.perks.join(' · ')}`,
      image: chosenHotel.image,
      rating: chosenHotel.rating,
      reviewsCount: chosenHotel.reviewsCount,
      tags: ['Luxury Stay', 'Breakfast Included'],
    });

    // Activities for this day
    const preview = proposal.schedulePreview.find(p => p.dayNumber === dayNum);
    if (preview) {
      preview.highlights.slice(1, 3).forEach((h, hIdx) => {
        items.push({
          id: `item-act-d${dayNum}-${hIdx}-${Date.now()}`,
          title: h,
          category: hIdx === 0 ? 'activity' : 'meal',
          price: hIdx === 0 ? 45 : 75,
          time: hIdx === 0 ? '10:30 AM' : '01:00 PM',
          duration: '2 hrs',
          location: `${proposal.destination} Landmark District`,
          description: `Curated highlight: ${h}. VIP access arranged through your TripFlow concierge.`,
          image: proposal.heroImage,
          rating: 4.92,
          tags: ['Curated Highlight'],
        });
      });
    }

    // Any user-selected extra activities assigned to this day
    const extraForThisDay = proposal.extraActivities.filter(
      act => selectedActivityIds.includes(act.id) && act.suggestedDayNumber === dayNum
    );

    extraForThisDay.forEach(act => {
      items.push({
        id: `item-extra-${act.id}-${Date.now()}`,
        catalogId: act.id,
        title: act.title,
        category: act.category,
        price: act.price,
        time: act.timeSlotDefault,
        duration: act.duration,
        location: act.location,
        description: act.description,
        image: act.image,
        rating: act.rating,
        reviewsCount: act.reviewsCount,
        tags: act.tags,
      });
    });

    days.push({
      id: `day-${proposal.destination.toLowerCase()}-${dayNum}`,
      dayNumber: dayNum,
      date: `Day ${dayNum}`,
      title: preview?.title || `Day ${dayNum} in ${proposal.destination}`,
      subtitle: preview?.highlights.slice(0, 2).join(' • ') || 'Curated Discoveries',
      items,
    });
  }

  const routeStops: RouteStop[] = [
    {
      id: `stop-${proposal.destination.toLowerCase()}-1`,
      city: proposal.destination,
      weather: '24°C Pleasant',
      hotel: chosenHotel.name,
      transitMode: 'flight',
    },
  ];

  return {
    id: `trip-ai-${proposal.destination.toLowerCase()}-${Date.now()}`,
    title: proposal.title,
    destination: proposal.destination,
    country: proposal.country,
    dates: `${proposal.days} Days · Bespoke AI Journey`,
    startDate: proposal.startDate,
    travelers: proposal.travelers,
    currency: 'USD',
    heroImage: proposal.heroImage,
    routeStops,
    days,
  };
}
