export interface DepartureCity {
  id: string;
  name: string;
  country: string;
  iataCode: string;
  flag: string;
  region: 'India' | 'International';
  popular?: boolean;
}

export const DEPARTURE_CITIES: DepartureCity[] = [
  // Top Indian Hubs
  { id: 'bom', name: 'Mumbai', country: 'India', iataCode: 'BOM', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'del', name: 'New Delhi', country: 'India', iataCode: 'DEL', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'blr', name: 'Bengaluru', country: 'India', iataCode: 'BLR', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'hyd', name: 'Hyderabad', country: 'India', iataCode: 'HYD', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'maa', name: 'Chennai', country: 'India', iataCode: 'MAA', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'ccu', name: 'Kolkata', country: 'India', iataCode: 'CCU', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'amd', name: 'Ahmedabad', country: 'India', iataCode: 'AMD', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'cok', name: 'Kochi (Cochin)', country: 'India', iataCode: 'COK', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'goi', name: 'Goa (Dabolim / Mopa)', country: 'India', iataCode: 'GOI', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'pnq', name: 'Pune', country: 'India', iataCode: 'PNQ', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'jai', name: 'Jaipur', country: 'India', iataCode: 'JAI', flag: '🇮🇳', region: 'India', popular: true },
  { id: 'lko', name: 'Lucknow', country: 'India', iataCode: 'LKO', flag: '🇮🇳', region: 'India' },
  { id: 'chd', name: 'Chandigarh', country: 'India', iataCode: 'IXC', flag: '🇮🇳', region: 'India' },
  { id: 'trv', name: 'Thiruvananthapuram', country: 'India', iataCode: 'TRV', flag: '🇮🇳', region: 'India' },
  { id: 'nag', name: 'Nagpur', country: 'India', iataCode: 'NAG', flag: '🇮🇳', region: 'India' },
  { id: 'idr', name: 'Indore', country: 'India', iataCode: 'IDR', flag: '🇮🇳', region: 'India' },
  { id: 'vns', name: 'Varanasi', country: 'India', iataCode: 'VNS', flag: '🇮🇳', region: 'India' },
  { id: 'atq', name: 'Amritsar', country: 'India', iataCode: 'ATQ', flag: '🇮🇳', region: 'India' },
  { id: 'gau', name: 'Guwahati', country: 'India', iataCode: 'GAU', flag: '🇮🇳', region: 'India' },
  { id: 'ixb', name: 'Bagdogra (Darjeeling)', country: 'India', iataCode: 'IXB', flag: '🇮🇳', region: 'India' },
  { id: 'udr', name: 'Udaipur', country: 'India', iataCode: 'UDR', flag: '🇮🇳', region: 'India' },
  { id: 'ixz', name: 'Port Blair (Andamans)', country: 'India', iataCode: 'IXZ', flag: '🇮🇳', region: 'India' },
  { id: 'sxi', name: 'Srinagar (Kashmir)', country: 'India', iataCode: 'SXR', flag: '🇮🇳', region: 'India' },

  // Middle East & Gulf Hubs
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', iataCode: 'DXB', flag: '🇦🇪', region: 'International', popular: true },
  { id: 'auh', name: 'Abu Dhabi', country: 'United Arab Emirates', iataCode: 'AUH', flag: '🇦🇪', region: 'International' },
  { id: 'doh', name: 'Doha', country: 'Qatar', iataCode: 'DOH', flag: '🇶🇦', region: 'International', popular: true },
  { id: 'ruh', name: 'Riyadh', country: 'Saudi Arabia', iataCode: 'RUH', flag: '🇸🇦', region: 'International', popular: true },
  { id: 'jed', name: 'Jeddah', country: 'Saudi Arabia', iataCode: 'JED', flag: '🇸🇦', region: 'International' },
  { id: 'mct', name: 'Muscat', country: 'Oman', iataCode: 'MCT', flag: '🇴🇲', region: 'International' },
  { id: 'kwi', name: 'Kuwait City', country: 'Kuwait', iataCode: 'KWI', flag: '🇰🇼', region: 'International' },
  { id: 'bah', name: 'Bahrain (Manama)', country: 'Bahrain', iataCode: 'BAH', flag: '🇧🇭', region: 'International' },

  // Southeast Asia & Far East
  { id: 'sin', name: 'Singapore', country: 'Singapore', iataCode: 'SIN', flag: '🇸🇬', region: 'International', popular: true },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', iataCode: 'BKK', flag: '🇹🇭', region: 'International', popular: true },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia', iataCode: 'KUL', flag: '🇲🇾', region: 'International' },
  { id: 'hkt', name: 'Phuket', country: 'Thailand', iataCode: 'HKT', flag: '🇹🇭', region: 'International' },
  { id: 'dps', name: 'Bali (Denpasar)', country: 'Indonesia', iataCode: 'DPS', flag: '🇮🇩', region: 'International', popular: true },
  { id: 'hnd', name: 'Tokyo (Haneda/Narita)', country: 'Japan', iataCode: 'HND', flag: '🇯🇵', region: 'International', popular: true },
  { id: 'icn', name: 'Seoul (Incheon)', country: 'South Korea', iataCode: 'ICN', flag: '🇰🇷', region: 'International' },
  { id: 'hkg', name: 'Hong Kong', country: 'Hong Kong', iataCode: 'HKG', flag: '🇭🇰', region: 'International' },

  // Europe & UK
  { id: 'lhr', name: 'London (Heathrow/Gatwick)', country: 'United Kingdom', iataCode: 'LHR', flag: '🇬🇧', region: 'International', popular: true },
  { id: 'cdg', name: 'Paris (Charles de Gaulle)', country: 'France', iataCode: 'CDG', flag: '🇫🇷', region: 'International', popular: true },
  { id: 'fra', name: 'Frankfurt', country: 'Germany', iataCode: 'FRA', flag: '🇩🇪', region: 'International' },
  { id: 'ams', name: 'Amsterdam (Schiphol)', country: 'Netherlands', iataCode: 'AMS', flag: '🇳🇱', region: 'International' },
  { id: 'zrh', name: 'Zurich', country: 'Switzerland', iataCode: 'ZRH', flag: '🇨🇭', region: 'International' },
  { id: 'ist', name: 'Istanbul', country: 'Turkey', iataCode: 'IST', flag: '🇹🇷', region: 'International', popular: true },
  { id: 'fco', name: 'Rome (Fiumicino)', country: 'Italy', iataCode: 'FCO', flag: '🇮🇹', region: 'International' },
  { id: 'mad', name: 'Madrid (Barajas)', country: 'Spain', iataCode: 'MAD', flag: '🇪🇸', region: 'International' },

  // Americas & Oceania
  { id: 'jfk', name: 'New York (JFK / EWR)', country: 'United States', iataCode: 'JFK', flag: '🇺🇸', region: 'International', popular: true },
  { id: 'sfo', name: 'San Francisco', country: 'United States', iataCode: 'SFO', flag: '🇺🇸', region: 'International', popular: true },
  { id: 'lax', name: 'Los Angeles', country: 'United States', iataCode: 'LAX', flag: '🇺🇸', region: 'International' },
  { id: 'ord', name: 'Chicago (O\'Hare)', country: 'United States', iataCode: 'ORD', flag: '🇺🇸', region: 'International' },
  { id: 'yyz', name: 'Toronto (Pearson)', country: 'Canada', iataCode: 'YYZ', flag: '🇨🇦', region: 'International' },
  { id: 'syd', name: 'Sydney (Kingsford)', country: 'Australia', iataCode: 'SYD', flag: '🇦🇺', region: 'International' },
  { id: 'mel', name: 'Melbourne', country: 'Australia', iataCode: 'MEL', flag: '🇦🇺', region: 'International' },
];

export function filterDepartureCities(query: string): DepartureCity[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEPARTURE_CITIES;
  return DEPARTURE_CITIES.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.iataCode.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
  );
}

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  aliases: string[];
  heroImage: string;
  defaultDays: number;
  highlightCategories: Array<{ id: string; label: string; icon: string; image: string; desc: string }>;
  suggestedDepartureCode?: string;
}

export const VALID_DESTINATIONS: TravelDestination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    aliases: ['tokyo', 'japan', 'kyoto', 'osaka', 'hakone', 'mount fuji', 'fuji', 'shibuya', 'shinjuku', 'ginza'],
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'shibuya_sky', label: 'Tokyo Skyline & Shibuya Sky', icon: 'nightlife', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', desc: 'VIP sunset observatory & subterranean cocktail lounges' },
      { id: 'kyoto_temples', label: 'Kyoto Bamboo Forest & Golden Pavilion', icon: 'temple_buddhist', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', desc: 'Private morning historian guide before crowds' },
      { id: 'hakone_onsen', label: 'Private Mount Fuji Onsen & Ryokan', icon: 'hot_tub', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Mineral thermal waters overlooking volcanic valley' },
      { id: 'omakase_dining', label: 'Ginza Michelin Omakase Feast', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: '18-course master chef counter tasting' },
      { id: 'bullet_train', label: 'Shinkansen Bullet Train Gran Class', icon: 'train', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', desc: 'Scenic bullet transit between Tokyo & Kyoto' },
      { id: 'sumo_training', label: 'Morning Sumo Stable Practice', icon: 'sports_kabaddi', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80', desc: 'Exclusive access to professional rikishi training' },
    ],
  },
  {
    id: 'turkey',
    name: 'Turkey',
    country: 'Turkey',
    aliases: ['turkey', 'istanbul', 'cappadocia', 'antalya', 'bodrum', 'bosphorus', 'goreme', 'izmir'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 7,
    highlightCategories: [
      { id: 'cappadocia_balloon', label: 'Hot Air Balloon in Cappadocia', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Sunrise flight soaring above fairy chimneys' },
      { id: 'bosphorus_yacht', label: 'Private Sunset Bosphorus Yacht', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Cruising between Europe & Asia with champagne' },
      { id: 'historic_sultanahmet', label: 'Hagia Sophia & Blue Mosque VIP', icon: 'temple_buddhist', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Skip-the-line historian guided tour' },
      { id: 'pamukkale_terraces', label: 'Pamukkale Travertines & Hierapolis', icon: 'landscape', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', desc: 'Mineral white calcium thermal pools' },
      { id: 'culinary_bazaar', label: 'Grand Bazaar Culinary Tasting', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Spices, baklava, and Turkish coffee tasting' },
      { id: 'hamam_spa', label: 'Historical Hurrem Sultan Hamam', icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Royal Ottoman scrub and essential oil therapy' },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    aliases: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey', 'kumarakom', 'wayanad', 'kovalam'],
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 6,
    highlightCategories: [
      { id: 'houseboat_cruise', label: 'Private Teak Luxury Houseboat', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Overnight journey with private chef & backwater views' },
      { id: 'munnar_tea', label: 'Munnar Misty Tea Plantation Estate', icon: 'landscape', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: 'Estate bungalow stay with artisanal tea tasting' },
      { id: 'ayurveda_spa', label: 'Authentic Ayurvedic Panchakarma Spa', icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Herbal Abhyanga massage by certified masters' },
      { id: 'fort_kochi_walk', label: 'Fort Kochi Colonial Walk & Kathakali', icon: 'tour', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Chinese nets sunset & classical dance theatre' },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    country: 'India',
    aliases: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'ranthambore', 'pushkar'],
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 7,
    highlightCategories: [
      { id: 'palace_stay', label: 'Historic Royal Palace Heritage Stays', icon: 'castle', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', desc: 'Private courtyards, peacock gardens, royal welcome' },
      { id: 'lake_pichola', label: 'Lake Pichola Private Sunset Boat', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Udaipur palace reflections with flute music' },
      { id: 'desert_safari', label: 'Thar Desert Luxury Glamping & Dunes', icon: 'camping', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Camel sunset caravan and campfire stargazing' },
      { id: 'fort_tours', label: 'Amber & Mehrangarh Fort VIP Guide', icon: 'fort', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Private palace quarters & vintage royal armory' },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    aliases: ['goa', 'panaji', 'north goa', 'south goa', 'candolim', 'vagator', 'palolem', 'anjuna', 'morjim'],
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'yacht_charter', label: 'Private Mandovi River Catamaran Charter', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Sunset cruise, champagne, and dolphin sightings' },
      { id: 'fontainhas_walk', label: 'Fontainhas Latin Quarter Heritage Walk', icon: 'museum', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Portuguese tiled houses & boutique art cafes' },
      { id: 'coastal_dining', label: 'Curated Goan-Portuguese Chef Table', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Fresh seafood tasting with sommelier pairings' },
      { id: 'beach_club', label: 'VIP Cabana at Premium Beach Club', icon: 'beach_access', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Private sunbed, house DJ sets, and cocktails' },
    ],
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    country: 'India',
    aliases: ['delhi', 'new delhi', 'ncr', 'old delhi', 'qutub', 'humayun', 'connaught place'],
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'mughal_heritage', label: 'Mughal Heritage VIP Tour (Qutub & Humayun)', icon: 'fort', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', desc: 'Historian guided tour with early private entry' },
      { id: 'old_delhi_food', label: 'Old Delhi Heritage Food Trail', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Chandni Chowk legendary culinary secrets & rickshaw' },
      { id: 'luxury_dining', label: 'Award-Winning Bukhara & Indian Accent Dinner', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: 'Michelin-listed North Indian fine dining tables' },
      { id: 'sunder_nursery', label: 'Sunder Nursery Private Garden Stroll', icon: 'park', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: '16th-century Mughal tombs and heritage flora' },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    aliases: ['dubai', 'uae', 'emirates', 'burj khalifa', 'palm jumeirah', 'marina', 'downtown dubai'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'burj_vip', label: 'Burj Khalifa Sky Lounge (Level 148)', icon: 'apartment', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', desc: 'Highest outdoor observatory with canapes' },
      { id: 'desert_safari_lux', label: 'Platinum Heritage Vintage Desert Safari', icon: 'terrain', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: '1950s Land Rovers & 6-course royal desert dinner' },
      { id: 'yacht_marina', label: 'Private Yacht Charter around Palm Jumeirah', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Luxury yacht with swim stop at Atlantis' },
      { id: 'michelin_dubai', label: 'Fine Dining at DIFC & Atlantis The Royal', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Celebrity chef tasting menu reservations' },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    aliases: ['paris', 'france', 'louvre', 'eiffel', 'seine', 'versailles', 'champs elysees'],
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 6,
    highlightCategories: [
      { id: 'louvre_vip', label: 'Louvre After-Hours Private Access', icon: 'museum', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', desc: 'Mona Lisa and sculpture halls with art historian' },
      { id: 'seine_champagne', label: 'Private Seine River Yacht at Sunset', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Champagne cruise gliding past Eiffel Tower sparkles' },
      { id: 'michelin_paris', label: 'Michelin 3-Star Gastronomic Dinner', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Classic French haute cuisine with master sommelier' },
      { id: 'versailles_palace', label: 'Versailles King State Apartments Tour', icon: 'castle', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', desc: 'Hall of Mirrors and royal gardens by golf cart' },
    ],
  },
  {
    id: 'switzerland',
    name: 'Swiss Alps',
    country: 'Switzerland',
    aliases: ['swiss', 'switzerland', 'alps', 'zermatt', 'matterhorn', 'interlaken', 'zurich', 'lucerne', 'geneva'],
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 6,
    highlightCategories: [
      { id: 'glacier_express', label: 'Glacier Express Excellence Class Train', icon: 'train', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', desc: 'Panoramic mountain carriage with multi-course meal' },
      { id: 'matterhorn_helicopter', label: 'Matterhorn Alpine Helicopter Flight', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Soar above alpine glaciers and 4,000m summits' },
      { id: 'luxury_chalet', label: 'Private Spa Chalet with Matterhorn View', icon: 'cottage', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Cedar hot tub, open fireplace, and private chef' },
      { id: 'lake_lucerne', label: 'Lake Lucerne Historic Steamboat Cruise', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Serene fjord-like lake surrounded by peaks' },
    ],
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    aliases: ['new york', 'nyc', 'manhattan', 'brooklyn', 'broadway', 'central park'],
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'broadway_vip', label: 'Broadway House Seats & Stage Door Access', icon: 'theater_comedy', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', desc: 'Prime orchestra seating for top Broadway productions' },
      { id: 'central_park_bike', label: 'Private Carriage & Central Park Architecture', icon: 'park', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: 'Historic rambling paths and hidden conservatories' },
      { id: 'skyline_heli', label: 'Manhattan Skyline Sunset Helicopter Tour', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Doors-off aerial views of Statue of Liberty & Empire State' },
      { id: 'michelin_nyc', label: 'Michelin Fine Dining (Le Bernardin / Eleven Madison)', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Exclusive chef counter reservations' },
    ],
  },
  {
    id: 'riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    aliases: ['riyadh', 'saudi', 'saudi arabia', 'diriyah', 'alula', 'kingdom tower'],
    heroImage: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'diriyah_unesco', label: 'At-Turaif UNESCO Heritage & Bujairi Terrace', icon: 'museum', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=600&q=80', desc: 'Historic mud-brick palaces and Michelin dining' },
      { id: 'edge_of_world', label: 'Edge of the World (Jebel Fihrayn) Expedition', icon: 'landscape', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Dramatic 300m cliff vistas & Bedouin sunset tea' },
      { id: 'kingdom_tower', label: 'Kingdom Centre Sky Bridge Observation', icon: 'apartment', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=600&q=80', desc: '300m high glass sky bridge over Riyadh skyline' },
      { id: 'saudi_gastronomy', label: 'Najd Village Traditional Feast & Fine Dining', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Authentic Kabsa, dates, and fragrant Arabic coffee' },
    ],
  },
];

// Invalidation keywords for nonsensical inputs (e.g. "pizza", "burger", random people, nonsense words)
export const INVALID_NONSENSE_KEYWORDS = [
  'pizza', 'burger', 'food', 'biryani', 'chai', 'coffee', 'pasta', 'sandwich', 'ice cream', 'shawarma', 'sushi',
  'arif', 'john', 'alex', 'peter', 'sarah', 'bob', 'tom', 'test', 'demo', 'fake', 'random', 'foo', 'bar', '123',
  'car', 'laptop', 'phone', 'money', 'crypto', 'shoe', 'shirt', 'dog', 'cat', 'water', 'book',
];

export function findValidDestination(input: string): TravelDestination | null {
  const clean = input.trim().toLowerCase();
  if (!clean) return null;

  // 1. Check for nonsense keywords like "pizza", "arif", etc.
  for (const bad of INVALID_NONSENSE_KEYWORDS) {
    // Check if the user is saying "visit pizza" or input is just "pizza"
    const regex = new RegExp(`\\b${bad}\\b`, 'i');
    if (regex.test(clean)) {
      // If it mentions an invalid object as the destination target
      return null;
    }
  }

  // 2. Check if clean matches any destination or alias
  for (const dest of VALID_DESTINATIONS) {
    if (clean === dest.name.toLowerCase() || clean === dest.id) {
      return dest;
    }
    for (const alias of dest.aliases) {
      const aliasRegex = new RegExp(`\\b${alias}\\b`, 'i');
      if (aliasRegex.test(clean)) {
        return dest;
      }
    }
  }

  // 3. Check against departure cities as destination (e.g. "Mumbai", "London", "Dubai")
  for (const city of DEPARTURE_CITIES) {
    const cityRegex = new RegExp(`\\b${city.name.toLowerCase()}\\b`, 'i');
    const iataRegex = new RegExp(`\\b${city.iataCode.toLowerCase()}\\b`, 'i');
    if (cityRegex.test(clean) || iataRegex.test(clean)) {
      return {
        id: city.id,
        name: city.name,
        country: city.country,
        aliases: [city.name.toLowerCase(), city.iataCode.toLowerCase()],
        heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        defaultDays: 5,
        highlightCategories: [
          { id: 'city_landmarks', label: `${city.name} Iconic Landmarks & Heritage Tour`, icon: 'tour', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: `Private historian walking tour of ${city.name}` },
          { id: 'city_dining', label: `${city.name} Curated Gourmet & Chef Table`, icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: `Regional fine dining table reservations` },
          { id: 'city_scenic', label: `${city.name} Private Sunset Excursion`, icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: `Scenic views, private chauffeur, and panoramic sights` },
          { id: 'city_wellness', label: `${city.name} Luxury Spa & Boutique Wellness`, icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: `Full-body rejuvenation and tranquil thermal bath` },
        ],
      };
    }
  }

  return null;
}
