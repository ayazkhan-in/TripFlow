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

export interface CountryInfo {
  name: string;
  flag: string;
  aliases: string[];
  topCities: string[];
  heroImage: string;
}

export const COUNTRY_DIRECTORY: CountryInfo[] = [
  {
    name: 'Italy',
    flag: '🇮🇹',
    aliases: ['italy', 'italia', 'italian'],
    topCities: ['Rome', 'Florence', 'Venice', 'Milan', 'Amalfi Coast'],
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    aliases: ['japan', 'nippon', 'nihon', 'japanese'],
    topCities: ['Tokyo', 'Kyoto', 'Osaka', 'Hakone', 'Sapporo'],
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'France',
    flag: '🇫🇷',
    aliases: ['france', 'french'],
    topCities: ['Paris', 'Nice', 'Lyon', 'Bordeaux', 'Marseille'],
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Turkey',
    flag: '🇹🇷',
    aliases: ['turkey', 'turkiye', 'turkish'],
    topCities: ['Istanbul', 'Cappadocia', 'Antalya', 'Bodrum', 'Izmir'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Spain',
    flag: '🇪🇸',
    aliases: ['spain', 'espana', 'spanish'],
    topCities: ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Ibiza'],
    heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'India',
    flag: '🇮🇳',
    aliases: ['india', 'bharat', 'indian'],
    topCities: ['Jaipur', 'Udaipur', 'Kerala (Kochi)', 'Goa', 'New Delhi', 'Mumbai'],
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'United States',
    flag: '🇺🇸',
    aliases: ['united states', 'usa', 'us', 'america', 'american'],
    topCities: ['New York', 'San Francisco', 'Los Angeles', 'Miami', 'Chicago'],
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    aliases: ['united kingdom', 'uk', 'britain', 'great britain', 'england', 'scotland'],
    topCities: ['London', 'Edinburgh', 'Manchester', 'Oxford', 'Bath'],
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    aliases: ['switzerland', 'swiss', 'schweiz', 'suisse'],
    topCities: ['Zurich', 'Zermatt', 'Lucerne', 'Interlaken', 'Geneva'],
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    aliases: ['greece', 'hellas', 'greek'],
    topCities: ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes'],
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Thailand',
    flag: '🇹🇭',
    aliases: ['thailand', 'thai'],
    topCities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Koh Samui', 'Krabi'],
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    aliases: ['uae', 'united arab emirates', 'emirates'],
    topCities: ['Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    aliases: ['germany', 'deutschland', 'german'],
    topCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
    heroImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Indonesia',
    flag: '🇮🇩',
    aliases: ['indonesia', 'indonesian'],
    topCities: ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok', 'Komodo'],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    aliases: ['australia', 'aussie', 'australian'],
    topCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Cairns'],
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    aliases: ['canada', 'canadian'],
    topCities: ['Toronto', 'Vancouver', 'Montreal', 'Banff', 'Quebec City'],
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Portugal',
    flag: '🇵🇹',
    aliases: ['portugal', 'portuguese'],
    topCities: ['Lisbon', 'Porto', 'Faro', 'Sintra', 'Madeira'],
    heroImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Netherlands',
    flag: '🇳🇱',
    aliases: ['netherlands', 'holland', 'dutch'],
    topCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague'],
    heroImage: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Egypt',
    flag: '🇪🇬',
    aliases: ['egypt', 'egyptian'],
    topCities: ['Cairo', 'Luxor', 'Aswan', 'Sharm El Sheikh'],
    heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Vietnam',
    flag: '🇻🇳',
    aliases: ['vietnam', 'vietnamese'],
    topCities: ['Hanoi', 'Da Nang', 'Ho Chi Minh City', 'Hoi An'],
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Austria',
    flag: '🇦🇹',
    aliases: ['austria', 'osterreich', 'austrian'],
    topCities: ['Vienna', 'Salzburg', 'Innsbruck', 'Hallstatt'],
    heroImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    aliases: ['saudi arabia', 'saudi', 'ksa'],
    topCities: ['Riyadh', 'Jeddah', 'AlUla', 'Medina'],
    heroImage: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mexico',
    flag: '🇲🇽',
    aliases: ['mexico', 'mexican'],
    topCities: ['Mexico City', 'Cancun', 'Oaxaca', 'Cabo San Lucas'],
    heroImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Brazil',
    flag: '🇧🇷',
    aliases: ['brazil', 'brasil', 'brazilian'],
    topCities: ['Rio de Janeiro', 'Sao Paulo', 'Salvador', 'Florianopolis'],
    heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'South Africa',
    flag: '🇿🇦',
    aliases: ['south africa'],
    topCities: ['Cape Town', 'Johannesburg', 'Kruger National Park', 'Durban'],
    heroImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Norway',
    flag: '🇳🇴',
    aliases: ['norway', 'norwegian'],
    topCities: ['Oslo', 'Bergen', 'Tromso', 'Flam'],
    heroImage: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Iceland',
    flag: '🇮🇸',
    aliases: ['iceland', 'icelandic'],
    topCities: ['Reykjavik', 'Vik', 'Akureyri'],
    heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Morocco',
    flag: '🇲🇦',
    aliases: ['morocco', 'moroccan'],
    topCities: ['Marrakech', 'Casablanca', 'Fes', 'Chefchaouen'],
    heroImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    aliases: ['new zealand', 'nz'],
    topCities: ['Auckland', 'Queenstown', 'Christchurch', 'Rotorua'],
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Singapore',
    flag: '🇸🇬',
    aliases: ['singapore'],
    topCities: ['Singapore City', 'Sentosa Island'],
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Czech Republic',
    flag: '🇨🇿',
    aliases: ['czech republic', 'czechia', 'czech'],
    topCities: ['Prague', 'Cesky Krumlov'],
    heroImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    aliases: ['croatia', 'croatian'],
    topCities: ['Dubrovnik', 'Split', 'Zagreb'],
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    aliases: ['south korea', 'korea', 'korean'],
    topCities: ['Seoul', 'Busan', 'Jeju Island'],
    heroImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Maldives',
    flag: '🇲🇻',
    aliases: ['maldives', 'maldivian'],
    topCities: ['Male', 'Maafushi', 'Baa Atoll'],
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  },
];

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
  // Italy Cities
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    aliases: ['rome', 'roma', 'colosseum', 'vatican', 'trastevere'],
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'colosseum_vip', label: 'Colosseum & Roman Forum VIP Access', icon: 'castle', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', desc: 'Gladiator arena floor & underground private historian tour' },
      { id: 'vatican_afterhours', label: 'Vatican Museums & Sistine Chapel Privé', icon: 'museum', image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80', desc: 'Early admission before general opening with art curator' },
      { id: 'trastevere_culinary', label: 'Trastevere Artisanal Wine & Pasta Trail', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Handmade cacio e pepe, private cellar wine pairings' },
      { id: 'rooftop_sunset', label: 'Piazza Navona Rooftop Terrace & Cocktails', icon: 'local_bar', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80', desc: 'Golden hour sunset over dome of St. Peter\'s Basilica' },
    ],
  },
  {
    id: 'florence',
    name: 'Florence',
    country: 'Italy',
    aliases: ['florence', 'firenze', 'tuscany', 'uffizi'],
    heroImage: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'uffizi_curator', label: 'Uffizi & Accademia David Masterpieces', icon: 'museum', image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80', desc: 'Private Botticelli and Michelangelo Renaissance tour' },
      { id: 'chianti_wine', label: 'Chianti Wine Estate & Truffle Hunt', icon: 'terrain', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', desc: 'Private vintage Ferrari drive through rolling Tuscan hills' },
      { id: 'arno_sunset', label: 'Ponte Vecchio Sunset Wooden Boat Cruise', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Traditional barchetto navigation with chilled Prosecco' },
      { id: 'florence_steak', label: 'Bistecca alla Fiorentina Michelin Dining', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: 'Authentic Chianina beef with aged Brunello di Montalcino' },
    ],
  },
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    aliases: ['venice', 'venezia', 'gondola', 'murano', 'burano'],
    heroImage: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'grand_canal_yacht', label: 'Private Wooden Riva Yacht along Grand Canal', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80', desc: 'Historical palazzo architecture tour with sommelier' },
      { id: 'st_marks_afterhours', label: 'St. Mark\'s Basilica After-Hours Crypt Tour', icon: 'temple_buddhist', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Intimate night lighting of the golden mosaics' },
      { id: 'murano_glass', label: 'Murano Maestro Glassblowing Studio', icon: 'palette', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Exclusive workshop with world-renowned glass masters' },
      { id: 'venetian_cicchetti', label: 'Curated Venetian Cicchetti & Bellini Walk', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Hidden bacari bars in authentic Cannaregio quarter' },
    ],
  },
  {
    id: 'milan',
    name: 'Milan',
    country: 'Italy',
    aliases: ['milan', 'milano', 'duomo', 'lake como'],
    heroImage: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'duomo_terrace', label: 'Duomo di Milano Rooftop & Spire Access', icon: 'castle', image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=600&q=80', desc: 'Panoramic marble rooftop views of Milan skyline' },
      { id: 'last_supper_vip', label: 'Da Vinci\'s Last Supper Private Viewing', icon: 'museum', image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80', desc: 'Private evening slot at Santa Maria delle Grazie' },
      { id: 'quadrilatero_fashion', label: 'Via Montenapoleone Private VIP Styling', icon: 'checkroom', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80', desc: 'Atelier salon visits with Italian fashion concierge' },
      { id: 'lake_como_day', label: 'Lake Como Villa Balbianello Speedboat', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', desc: 'Day excursion with private chauffeur to Bellagio' },
    ],
  },
  // Japan Cities
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    aliases: ['tokyo', 'shibuya', 'shinjuku', 'ginza', 'roppongi'],
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'shibuya_sky', label: 'Tokyo Skyline & Shibuya Sky VIP', icon: 'nightlife', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', desc: 'Sunset observatory & subterranean cocktail lounges' },
      { id: 'omakase_dining', label: 'Ginza Michelin Omakase Feast', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: '18-course master chef counter tasting' },
      { id: 'teamlab_private', label: 'teamLab Planets Immersive Digital Art', icon: 'palette', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', desc: 'VIP early entrance to interactive boundless art' },
      { id: 'sumo_training', label: 'Morning Sumo Stable Practice', icon: 'sports_kabaddi', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80', desc: 'Exclusive access to professional rikishi training' },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    aliases: ['kyoto', 'gion', 'arashiyama', 'fushimi inari', 'kinkakuji'],
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'arashiyama_bamboo', label: 'Private Sunrise Arashiyama Bamboo Forest', icon: 'forest', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', desc: 'Early peaceful stroll before crowds with historian guide' },
      { id: 'geisha_tea', label: 'Gion Ochaya Private Tea Ceremony', icon: 'local_cafe', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80', desc: 'Traditional matcha with Geiko / Maiko host in private tea house' },
      { id: 'fushimi_shrine', label: 'Fushimi Inari 1,000 Torii Gates VIP Path', icon: 'temple_buddhist', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', desc: 'Mountain meditation path with Shinto priest blessings' },
      { id: 'kaiseki_ryokan', label: 'Michelin Kaiseki Multi-Course Banquet', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: 'Seasonal Kyoto seasonal culinary mastercraft' },
    ],
  },
  // Turkey Cities
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    aliases: ['istanbul', 'bosphorus', 'sultanahmet', 'taksim', 'galata'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'bosphorus_yacht', label: 'Private Sunset Bosphorus Yacht Charter', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Cruising between Europe and Asia with champagne' },
      { id: 'historic_sultanahmet', label: 'Hagia Sophia & Topkapi Palace VIP', icon: 'temple_buddhist', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Skip-the-line historian guided tour of Ottoman relics' },
      { id: 'grand_bazaar_spice', label: 'Grand Bazaar & Spice Market Secret Trail', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Artisanal spices, Turkish delight, and rooftop views' },
      { id: 'hamam_spa', label: 'Historical Hurrem Sultan Hamam Experience', icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Royal Ottoman scrub and rosewater aromatherapy' },
    ],
  },
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    aliases: ['cappadocia', 'goreme', 'urgup', 'uchisar'],
    heroImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'cappadocia_balloon', label: 'Sunrise Hot Air Balloon Flight', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Soar above fairy chimneys and volcanic rock formations' },
      { id: 'cave_suite', label: 'Luxury Cave Suite Valley Panorama', icon: 'castle', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', desc: 'Carved stone suites with heated private terrace plunge pool' },
      { id: 'underground_city', label: 'Derinkuyu Underground City Historian Tour', icon: 'landscape', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Subterranean tunnels and 8th-century stone chambers' },
      { id: 'pottery_workshop', label: 'Avanos Red River Master Pottery Studio', icon: 'palette', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Hands-on pottery throwing with Hittite clay techniques' },
    ],
  },
  // France Cities
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    aliases: ['paris', 'louvre', 'eiffel', 'seine', 'versailles'],
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'louvre_vip', label: 'Louvre After-Hours Private Access', icon: 'museum', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', desc: 'Mona Lisa and sculpture halls with art historian' },
      { id: 'seine_champagne', label: 'Private Seine River Yacht at Sunset', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Champagne cruise gliding past Eiffel Tower sparkles' },
      { id: 'michelin_paris', label: 'Michelin 3-Star Gastronomic Dinner', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Classic French haute cuisine with master sommelier' },
      { id: 'versailles_palace', label: 'Versailles King State Apartments Tour', icon: 'castle', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', desc: 'Hall of Mirrors and royal gardens by golf cart' },
    ],
  },
  {
    id: 'nice',
    name: 'Nice & French Riviera',
    country: 'France',
    aliases: ['nice', 'cannes', 'monaco', 'french riviera', 'antibes', 'saint tropez'],
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'monaco_yacht', label: 'Monaco & Eze Cliffside Catamaran Charter', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Coastal cruise between Nice, Cap Ferrat, and Monte Carlo' },
      { id: 'promenade_anglais', label: 'Promenade des Anglais & Old Town Walk', icon: 'tour', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', desc: 'Vibrant Cours Saleya flower market and gelato' },
      { id: 'provencal_dining', label: 'Michelin Seafood & Provençal Wine Tasting', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Catch of the day with crisp Bandol rosé' },
      { id: 'riviera_beachclub', label: 'VIP Cabana at Cap d\'Antibes Beach Club', icon: 'beach_access', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Private Mediterranean sunbed and chilled cocktails' },
    ],
  },
  // Spain Cities
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    aliases: ['barcelona', 'bcn', 'sagrada familia', 'gaudi', 'ramblas'],
    heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'sagrada_vip', label: 'Sagrada Familia & Park Guell VIP Tour', icon: 'castle', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80', desc: 'Gaudi architectural masterworks with private historian' },
      { id: 'gothic_tapas', label: 'Gothic Quarter Tapas & Wine Crawl', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Iberico ham, patatas bravas, and Rioja reserve pairings' },
      { id: 'barcelona_yacht', label: 'Sunset Catamaran Sail along Barceloneta', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Coastline views, live Spanish acoustic guitar, and Cava' },
      { id: 'flamenco_private', label: 'Authentic Tablao Flamenco VIP Table', icon: 'music_note', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', desc: 'Front-row passionate performance in 17th-century palace' },
    ],
  },
  // UAE Cities
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    aliases: ['dubai', 'burj khalifa', 'palm jumeirah', 'marina', 'downtown dubai'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'burj_vip', label: 'Burj Khalifa Sky Lounge (Level 148)', icon: 'apartment', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', desc: 'Highest outdoor observatory with canapes' },
      { id: 'desert_safari_lux', label: 'Platinum Heritage Vintage Desert Safari', icon: 'terrain', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: '1950s Land Rovers & 6-course royal desert dinner' },
      { id: 'yacht_marina', label: 'Private Yacht Charter around Palm Jumeirah', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Luxury yacht with swim stop at Atlantis' },
      { id: 'michelin_dubai', label: 'Fine Dining at DIFC & Atlantis The Royal', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Celebrity chef tasting menu reservations' },
    ],
  },
  // Switzerland Cities
  {
    id: 'zermatt',
    name: 'Zermatt (Swiss Alps)',
    country: 'Switzerland',
    aliases: ['zermatt', 'matterhorn', 'swiss alps', 'zurich', 'interlaken', 'lucerne'],
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'glacier_express', label: 'Glacier Express Excellence Class Train', icon: 'train', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', desc: 'Panoramic mountain carriage with multi-course meal' },
      { id: 'matterhorn_helicopter', label: 'Matterhorn Alpine Helicopter Flight', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Soar above alpine glaciers and 4,000m summits' },
      { id: 'luxury_chalet', label: 'Private Spa Chalet with Matterhorn View', icon: 'cottage', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Cedar hot tub, open fireplace, and private chef' },
      { id: 'lake_lucerne', label: 'Lake Lucerne Historic Steamboat Cruise', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Serene fjord-like lake surrounded by peaks' },
    ],
  },
  // India Cities
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    aliases: ['jaipur', 'pink city', 'amer fort', 'rajasthan'],
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'amer_fort_vip', label: 'Amber Fort Private Royal Quarters Tour', icon: 'castle', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', desc: 'Sheesh Mahal mirror palace with royal historian' },
      { id: 'palace_stay', label: 'Rambagh Palace Afternoon High Tea', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', desc: 'Peacock gardens, flute melodies, and royal silver service' },
      { id: 'bazaar_gems', label: 'Johari Bazaar Private Gem & Textile Walk', icon: 'checkroom', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Block print artisan workshops and jewelry masters' },
      { id: 'nahargarh_sunset', label: 'Nahargarh Fort Sunset Skyline Vistas', icon: 'landscape', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Golden panoramic views over the Pink City ramparts' },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala (Kochi & Munnar)',
    country: 'India',
    aliases: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey', 'kumarakom'],
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 6,
    highlightCategories: [
      { id: 'houseboat_cruise', label: 'Private Teak Luxury Houseboat Cruise', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Overnight journey with private chef & backwater views' },
      { id: 'munnar_tea', label: 'Munnar Misty Tea Plantation Estate', icon: 'landscape', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: 'Estate bungalow stay with artisanal tea tasting' },
      { id: 'ayurveda_spa', label: 'Authentic Ayurvedic Panchakarma Spa', icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Herbal Abhyanga massage by certified masters' },
      { id: 'fort_kochi_walk', label: 'Fort Kochi Colonial Walk & Kathakali', icon: 'tour', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: 'Chinese nets sunset & classical dance theatre' },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    aliases: ['goa', 'panaji', 'north goa', 'south goa', 'candolim', 'vagator'],
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
    aliases: ['delhi', 'new delhi', 'ncr', 'old delhi'],
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 4,
    highlightCategories: [
      { id: 'mughal_heritage', label: 'Mughal Heritage VIP Tour (Qutub & Humayun)', icon: 'fort', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', desc: 'Historian guided tour with early private entry' },
      { id: 'old_delhi_food', label: 'Old Delhi Heritage Food Trail', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Chandni Chowk legendary culinary secrets & rickshaw' },
      { id: 'luxury_dining', label: 'Award-Winning Bukhara & Indian Accent Dinner', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: 'Michelin-listed North Indian fine dining tables' },
      { id: 'sunder_nursery', label: 'Sunder Nursery Private Garden Stroll', icon: 'park', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: '16th-century Mughal tombs and heritage flora' },
    ],
  },
  // USA Cities
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    aliases: ['new york', 'nyc', 'manhattan', 'brooklyn'],
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'broadway_vip', label: 'Broadway House Seats & Stage Door Access', icon: 'theater_comedy', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', desc: 'Prime orchestra seating for top Broadway productions' },
      { id: 'central_park_bike', label: 'Private Carriage & Central Park Architecture', icon: 'park', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: 'Historic rambling paths and hidden conservatories' },
      { id: 'skyline_heli', label: 'Manhattan Skyline Sunset Helicopter Tour', icon: 'flight_takeoff', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', desc: 'Doors-off aerial views of Statue of Liberty & Empire State' },
      { id: 'michelin_nyc', label: 'Michelin Fine Dining (Le Bernardin / Eleven Madison)', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Exclusive chef counter reservations' },
    ],
  },
  // UK Cities
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    aliases: ['london', 'westminster', 'soho', 'mayfair', 'kensington'],
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    defaultDays: 5,
    highlightCategories: [
      { id: 'tower_london_vip', label: 'Tower of London & Crown Jewels Private View', icon: 'castle', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', desc: 'Opening of the gates ceremony with Yeoman Warder' },
      { id: 'west_end_show', label: 'West End Premium Theatre & Backstage Access', icon: 'theater_comedy', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', desc: 'Covent Garden dinner and top-tier stall seating' },
      { id: 'thames_yacht', label: 'Private Thames River Cruise past Tower Bridge', icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Historic waterfront navigation with English sparkling wine' },
      { id: 'mayfair_dining', label: 'Afternoon Tea at The Ritz & Mayfair Michelin', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', desc: 'Classic British luxury culinary traditions' },
    ],
  },
  // Saudi Arabia Cities
  {
    id: 'riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    aliases: ['riyadh', 'diriyah', 'alula', 'kingdom tower'],
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

// Invalidation keywords for nonsensical inputs (e.g. food, random people, nonsense words)
export const INVALID_NONSENSE_KEYWORDS = [
  'pizza', 'burger', 'food', 'biryani', 'chai', 'coffee', 'pasta', 'sandwich', 'ice cream', 'shawarma', 'sushi',
  'test', 'demo', 'fake', 'random', 'foo', 'bar', '123', '12345', 'asdf', 'qwerty',
  'car', 'laptop', 'phone', 'money', 'crypto', 'shoe', 'shirt', 'dog', 'cat', 'water', 'book',
];

export type DestinationResolution =
  | {
      kind: 'country';
      country: string;
      flag: string;
      topCities: string[];
      heroImage: string;
      message: string;
    }
  | {
      kind: 'city';
      destination: TravelDestination;
    }
  | {
      kind: 'invalid';
      message: string;
      rawInput: string;
    };

/**
 * Universal resolution engine:
/**
 * Clean origin and departure clauses from prompt text so they don't hijack destination resolution
 */
export function cleanDestinationPrompt(input: string): { cleanPrompt: string; extractedOrigin: string | null } {
  let text = (input || '').trim();
  let extractedOrigin: string | null = null;

  // 1. Parenthetical origin: (Departing from Mumbai (BOM)) or (from Mumbai (BOM)) or (Origin: DEL)
  const parenMatch = text.match(/\((?:departing\s+from|flying\s+from|starting\s+from|from|origin:?)\s+([A-Za-z\s,.\-]+(?:\s*\([A-Za-z0-9\s/–—\-]+\))?)\s*\)/i);
  if (parenMatch) {
    extractedOrigin = parenMatch[1].trim();
    text = text.replace(parenMatch[0], ' ').trim();
  }

  // Strip any leftover dangling parentheses
  text = text.replace(/^[()\s]+|[()\s]+$/g, '').trim();

  // 2. "from <Origin> to <Dest>" pattern
  const fromToMatch = text.match(/\b(?:flying\s+from|departing\s+from|from)\s+([A-Za-z\s()]+?)\s+(?:to|towards)\s+/i);
  if (fromToMatch) {
    if (!extractedOrigin) extractedOrigin = fromToMatch[1].trim();
    text = text.replace(fromToMatch[0], ' to ').trim();
  }

  // 3. "to <Dest> from <Origin>" pattern
  const toDestFromOrigin = text.match(/\bto\s+([A-Za-z\s]+?)\s+(?:from|departing\s+from|flying\s+from)\s+([A-Za-z\s()]+)$/i);
  if (toDestFromOrigin) {
    if (!extractedOrigin) extractedOrigin = toDestFromOrigin[2].trim();
    text = `to ${toDestFromOrigin[1].trim()}`;
  }

  // 4. Trailing "departing from <Origin>" or "flying from <Origin>" or "from <Origin>"
  const trailingOriginMatch = text.match(/\b(?:departing\s+from|flying\s+from|starting\s+from|leaving\s+from)\s+([A-Za-z\s()]+?)(?:\s+(?:for|with|in|\d+)|$)/i);
  if (trailingOriginMatch) {
    if (!extractedOrigin) extractedOrigin = trailingOriginMatch[1].trim();
    text = text.replace(trailingOriginMatch[0], ' ').trim();
  }

  // 5. Clean up duplicate spaces
  text = text.replace(/\s{2,}/g, ' ').trim();

  return { cleanPrompt: text, extractedOrigin };
}

/**
 * Universal destination resolution algorithm:
 * 1. Cleans origin clauses to prevent departure city from being mistaken as destination
 * 2. Checks if input is gibberish/nonsense -> invalid
 * 3. Checks if a specific CITY is in the text (Curated or Country topCities) -> city
 * 4. Checks if ONLY a COUNTRY is in the text -> country (with top cities to ask the user)
 * 5. Checks departure city hubs (skipping origin city) -> city
 * 6. Otherwise, treats any valid custom city entered by the user -> procedural city!
 */
export function resolveDestinationOrCountry(input: string): DestinationResolution {
  const { cleanPrompt, extractedOrigin } = cleanDestinationPrompt(input);
  const clean = cleanPrompt.trim().toLowerCase();

  if (!clean || clean.length < 2) {
    return {
      kind: 'invalid',
      rawInput: input,
      message: 'Please provide a valid destination city or country.',
    };
  }

  // 1. Invalidation check for nonsense keywords
  for (const bad of INVALID_NONSENSE_KEYWORDS) {
    const regex = new RegExp(`\\b${bad}\\b`, 'i');
    if (regex.test(clean)) {
      return {
        kind: 'invalid',
        rawInput: input,
        message: `We noticed "${input}", but that does not appear to be a real travel destination. Please enter a city or country you would like to visit!`,
      };
    }
  }

  // 2. Check curated destinations first
  for (const dest of VALID_DESTINATIONS) {
    if (clean === dest.name.toLowerCase() || clean === dest.id) {
      return { kind: 'city', destination: dest };
    }
    for (const alias of dest.aliases) {
      const aliasRegex = new RegExp(`\\b${alias}\\b`, 'i');
      if (aliasRegex.test(clean)) {
        return { kind: 'city', destination: dest };
      }
    }
  }

  // 3. Check topCities inside COUNTRY_DIRECTORY to see if a specific city was named (e.g. Rome, Paris, Tokyo, Florence, Barcelona)
  for (const country of COUNTRY_DIRECTORY) {
    for (const city of country.topCities) {
      const cityClean = city.toLowerCase().replace(/\s*\(.*?\)/, '');
      const cityRegex = new RegExp(`\\b${cityClean}\\b`, 'i');
      if (cityRegex.test(clean)) {
        const dest: TravelDestination = {
          id: cityClean.replace(/[^a-z0-9]+/g, '-'),
          name: city,
          country: country.name,
          aliases: [cityClean],
          heroImage: country.heroImage,
          defaultDays: 5,
          highlightCategories: [
            { id: 'city_highlights', label: `${city} Iconic Heritage & Cultural Discovery`, icon: 'tour', image: country.heroImage, desc: `Private historian guided tour of ${city}` },
            { id: 'city_dining', label: `${city} Curated Fine Dining & Local Gastronomy`, icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: `Handpicked chef tasting table in ${city}` },
            { id: 'city_sunset', label: `${city} Private Sunset Excursion & Panoramic Vistas`, icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Chauffeured scenic tour and cocktail hour' },
            { id: 'city_wellness', label: `${city} Boutique Luxury Spa & Rejuvenation`, icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Traditional massage and serene relaxation' },
          ],
        };
        return { kind: 'city', destination: dest };
      }
    }
  }

  // 4. Check if a COUNTRY was named! (Prompt user with top cities)
  for (const country of COUNTRY_DIRECTORY) {
    const isCountryDirect = clean === country.name.toLowerCase();
    const isAliasMatch = country.aliases.some(alias => {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      return regex.test(clean);
    });

    if (isCountryDirect || isAliasMatch) {
      return {
        kind: 'country',
        country: country.name,
        flag: country.flag,
        topCities: country.topCities,
        heroImage: country.heroImage,
        message: `${country.flag} **${country.name}** is a spectacular destination with incredible diversity! To build a perfectly paced day-by-day plan with exact suites, private transfers, and curated experiences, **which city would you like to explore?**`,
      };
    }
  }

  // 5. Check departure cities (e.g. "Mumbai", "London", "Dubai", "Singapore", "Sydney", etc.)
  // Skip if this city is the extracted origin departure city!
  for (const city of DEPARTURE_CITIES) {
    const cityNameClean = city.name.toLowerCase().replace(/\s*\(.*?\)/, '');
    if (extractedOrigin && extractedOrigin.toLowerCase().includes(cityNameClean)) {
      continue; // Skip origin city!
    }
    const cityRegex = new RegExp(`\\b${cityNameClean}\\b`, 'i');
    if (cityRegex.test(clean)) {
      const matchedDest: TravelDestination = {
        id: city.id,
        name: city.name.split(' (')[0],
        country: city.country,
        aliases: [city.name.toLowerCase(), city.iataCode.toLowerCase()],
        heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        defaultDays: 5,
        highlightCategories: [
          { id: 'city_landmarks', label: `${city.name.split(' (')[0]} Iconic Landmarks & Heritage Tour`, icon: 'tour', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: `Private historian walking tour of ${city.name.split(' (')[0]}` },
          { id: 'city_dining', label: `${city.name.split(' (')[0]} Curated Gourmet & Chef Table`, icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Regional fine dining table reservations' },
          { id: 'city_scenic', label: `${city.name.split(' (')[0]} Private Sunset Excursion`, icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Scenic views, private chauffeur, and panoramic sights' },
          { id: 'city_wellness', label: `${city.name.split(' (')[0]} Luxury Spa & Boutique Wellness`, icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Full-body rejuvenation and tranquil thermal bath' },
        ],
      };
      return { kind: 'city', destination: matchedDest };
    }
  }

  // 6. Any arbitrary city entered by the user!
  // Strip common conversational words to extract clean city name
  let candidate = cleanPrompt.replace(/(?:plan\s+(?:an?\s+)?itinerary\s+(?:for|in)|itinerary\s+(?:for|in)|trip\s+(?:to|in)|travel\s+(?:to|in)|vacation\s+(?:to|in)|holiday\s+(?:to|in)|visit|explore|going\s+to|days\s+(?:in|for)|nights\s+(?:in|for)|\d+\s+days?|\d+\s+nights?|for\s+\d+\s+people|with\s+(?:family|friends|couple|wife|husband|kids)|from\s+[a-zA-Z\s()]+)/gi, '').trim();
  
  // Strip punctuation
  candidate = candidate.replace(/^[,\-–—\s]+|[,\-–—\s]+$/g, '');

  if (candidate.length >= 2 && candidate.length <= 40) {
    // Title Case candidate
    const cityName = candidate
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const proceduralDest: TravelDestination = {
      id: cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: cityName,
      country: 'International',
      aliases: [cityName.toLowerCase()],
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      defaultDays: 5,
      highlightCategories: [
        { id: 'city_landmarks', label: `${cityName} Heritage Architecture & Historic Walking Tour`, icon: 'tour', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80', desc: `Private historian guided tour of ${cityName}'s iconic landmarks` },
        { id: 'city_scenic', label: `${cityName} Panoramic Sunset Excursion & Scenic Vistas`, icon: 'directions_boat', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: `Scenic outlooks, private chauffeur, and panoramic sights in ${cityName}` },
        { id: 'city_dining', label: `${cityName} Curated Fine Dining & Local Gastronomy`, icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: `Acclaimed chef tasting table and regional delicacies in ${cityName}` },
        { id: 'city_wellness', label: `${cityName} Boutique Luxury Spa & Rejuvenation`, icon: 'spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: `Tranquil wellness spa and soothing therapies in ${cityName}` },
      ],
    };

    return { kind: 'city', destination: proceduralDest };
  }

  return {
    kind: 'invalid',
    rawInput: input,
    message: `We couldn't identify a valid travel destination for "${input}". Please enter a city or country you want to explore.`,
  };
}

export function findValidDestination(input: string): TravelDestination | null {
  const res = resolveDestinationOrCountry(input);
  if (res.kind === 'city') {
    return res.destination;
  }
  return null;
}

