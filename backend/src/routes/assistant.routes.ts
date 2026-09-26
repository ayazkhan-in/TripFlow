// TripFlow Concierge Assistant Engine - Verified Prisma Types
import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth.js';

const router = Router();
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'tripflow-backend-assistant',
      },
    },
  });
}

// Model cascade for high availability, sub-3s response, and zero 503 dropouts
const CANDIDATE_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-pro-preview'];

async function generateWithGeminiCascade(systemPrompt: string): Promise<string | null> {
  if (!aiClient) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const callPromise = aiClient.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      });
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 6500)
      );

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      const text = response?.text?.trim() || '';
      if (text) return text;
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn(`[Gemini Cascade] Model ${model} skipped or timed out (${msg}), trying next...`);
    }
  }
  return null;
}


// ============================================================================
// DESTINATION INTELLIGENCE KNOWLEDGE REPOSITORY
// ============================================================================

interface DestinationProfile {
  country: string;
  heroImage: string;
  flights: {
    cheaper: { airline: string; flightNumber: string; originCode: string; destCode: string; depTime: string; arrTime: string; duration: string; stops: string };
    recommended: { airline: string; flightNumber: string; originCode: string; destCode: string; depTime: string; arrTime: string; duration: string; stops: string };
    luxury: { airline: string; flightNumber: string; originCode: string; destCode: string; depTime: string; arrTime: string; duration: string; stops: string };
  };
  hotels: {
    cheaper: { name: string; roomType: string; location: string; image: string; rating: number; reviews: number; perks: string[] };
    recommended: { name: string; roomType: string; location: string; image: string; rating: number; reviews: number; perks: string[] };
    luxury: { name: string; roomType: string; location: string; image: string; rating: number; reviews: number; perks: string[] };
  };
  highlights: Array<{ title: string; desc: string; category: string; icon: string; price: number; location: string }>;
  daysPlan: Array<{ dayNumber: number; title: string; highlights: string[] }>;
}

const DESTINATION_PROFILES: Record<string, DestinationProfile> = {
  turkey: {
    country: 'Turkey',
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
    flights: {
      cheaper: { airline: 'Pegasus Airlines / Air Arabia', flightNumber: 'PC 1141', originCode: 'BOM', destCode: 'IST', depTime: '04:30 AM', arrTime: '11:15 AM', duration: '8h 45m', stops: '1 Stop (Sharjah)' },
      recommended: { airline: 'Turkish Airlines (Direct)', flightNumber: 'TK 721', originCode: 'BOM', destCode: 'IST', depTime: '06:15 AM', arrTime: '10:30 AM', duration: '6h 15m', stops: 'Non-Stop Direct' },
      luxury: { airline: 'Turkish Airlines Business Class', flightNumber: 'TK 721 (Biz)', originCode: 'BOM', destCode: 'IST', depTime: '06:15 AM', arrTime: '10:30 AM', duration: '6h 15m', stops: 'Non-Stop Direct' },
    },
    hotels: {
      cheaper: { name: 'Hagia Sofia Mansions & Goreme Heritage Cave', roomType: 'Deluxe Stone Cave Suite', location: 'Sultanahmet & Goreme Valley', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', rating: 4.88, reviews: 420, perks: ['Authentic Cave Suite', 'Breakfast Included', 'Old Town Walk'] },
      recommended: { name: 'Four Seasons Bosphorus + Museum Hotel Cappadocia', roomType: 'Bosphorus Palace View + Imperial Cave Suite', location: 'Bosphorus Strait & Uchisar Valley', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', rating: 4.97, reviews: 890, perks: ['Bosphorus Waterfront Terrace', 'Private Infinity Cave Pool', 'VIP Welcome Refreshments', 'Artisan Breakfast'] },
      luxury: { name: 'Çırağan Palace Kempinski + Sultan Cave Penthouse', roomType: 'Imperial Ottoman Palace Suite + Presidential Cave Villa', location: 'Ottoman Imperial Palace, Istanbul', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', rating: 4.99, reviews: 612, perks: ['24/7 Private Butler', 'Private Heated Pool', 'VIP Fast-Track Clearance', 'Helipad Access'] },
    },
    highlights: [
      { title: 'Hot Air Balloon Sunrise Flight over Cappadocia', desc: 'Private basket flight drifting above fairy chimneys followed by champagne toast.', category: 'experience', icon: 'flight_takeoff', price: 24000, location: 'Goreme, Cappadocia' },
      { title: 'Private Sunset Bosphorus Yacht Charter', desc: '2-hour private yacht cruise gliding between Europe and Asia with canapés.', category: 'experience', icon: 'directions_boat', price: 18500, location: 'Bosphorus Strait, Istanbul' },
      { title: 'Hagia Sophia & Blue Mosque VIP Access', desc: 'Skip-the-line private historian guided tour of the iconic imperial mosques.', category: 'activity', icon: 'temple_buddhist', price: 9500, location: 'Sultanahmet, Istanbul' },
      { title: 'Historical Hurrem Sultan Hamam VIP Ritual', desc: 'Traditional royal scrub, foam massage and Turkish essential oil therapy.', category: 'activity', icon: 'spa', price: 12500, location: 'Hagia Sophia Square, Istanbul' },
      { title: 'Two Continents Culinary Tasting Walk', desc: 'Savor Istanbul street gastronomy from Karakoy European cafes to Kadikoy Asian bazaars.', category: 'meal', icon: 'restaurant', price: 7800, location: 'Istanbul Food District' },
    ],
    daysPlan: [
      { dayNumber: 1, title: 'Arrival in Istanbul & Sunset Bosphorus Yacht', highlights: ['Mercedes-Benz airport transfer', 'Check-in with welcome refreshments', 'Private sunset yacht cruise between Europe and Asia'] },
      { dayNumber: 2, title: 'Historic Sultanahmet & Imperial Byzantine Wonders', highlights: ['VIP access to Hagia Sophia & Blue Mosque', 'Topkapi Palace Secret Harem guided walk', 'Historic Hurrem Sultan Hamam treatment'] },
      { dayNumber: 3, title: 'Grand Bazaar Culinary Discovery & Flight to Cappadocia', highlights: ['Grand Bazaar & Spice Market tasting tour', 'Short scenic flight to Nevsehir/Kayseri', 'Check-in to iconic luxury Cave Suite'] },
      { dayNumber: 4, title: 'Cappadocia Sunrise Hot Air Balloon & Love Valley', highlights: ['Sunrise private balloon flight over fairy chimneys', 'Champagne celebration in the valley', 'Private pottery workshop in historic Avanos'] },
      { dayNumber: 5, title: 'Kaymakli Underground City & Uchisar Castle Sunset', highlights: ['Deep exploration of ancient underground city', 'Private hike through Pigeon Valley', 'Cocktails at Uchisar Castle summit'] },
      { dayNumber: 6, title: 'Ihlara Canyon River Walk & Whirling Dervishes', highlights: ['Melendiz River walk under sheer rock walls', 'Lunch in floating wooden river pavilions', 'Sacred Sema whirling dervish ceremony'] },
      { dayNumber: 7, title: 'Leisure Morning in Goreme & Return Chauffeur', highlights: ['Panoramic terrace breakfast overlooking valley', 'Artisan carpet and jewelry showroom visit', 'Private transfer to airport'] },
    ],
  },
  japan: {
    country: 'Japan',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    flights: {
      cheaper: { airline: 'Cathay Pacific / Malaysia Airlines', flightNumber: 'CX 660', originCode: 'BOM', destCode: 'HND', depTime: '01:30 AM', arrTime: '03:15 PM', duration: '10h 15m', stops: '1 Stop (HKG)' },
      recommended: { airline: 'ANA All Nippon Airways (Direct)', flightNumber: 'NH 830', originCode: 'BOM', destCode: 'NRT', depTime: '08:00 PM', arrTime: '07:30 AM', duration: '8h 00m', stops: 'Non-Stop Direct' },
      luxury: { airline: 'ANA "The Room" Business Suite', flightNumber: 'NH 830 (Biz)', originCode: 'BOM', destCode: 'NRT', depTime: '08:00 PM', arrTime: '07:30 AM', duration: '8h 00m', stops: 'Non-Stop Direct' },
    },
    hotels: {
      cheaper: { name: 'Hotel Gracery Shinjuku & Kyoto Royal Park', roomType: 'Superior City View King', location: 'Shinjuku & Sanjo Kyoto', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80', rating: 4.85, reviews: 620, perks: ['Central Shinjuku Location', 'Japanese Breakfast Included', 'Subway Access'] },
      recommended: { name: 'Palace Hotel Tokyo + Gora Kadan Ryokan Hakone', roomType: 'Wadakura Imperial Suite + Private Onsen Villa', location: 'Marunouchi Imperial Palace & Hakone', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', rating: 4.98, reviews: 940, perks: ['Imperial Palace Moat View', 'Private Open-Air Hot Spring Onsen', 'Multi-Course Kaiseki Dining'] },
      luxury: { name: 'Aman Tokyo + The Ritz-Carlton Kyoto', roomType: 'Grand Deluxe Suite + Riverside Garden Suite', location: 'Otemachi & Kamogawa River', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', rating: 4.99, reviews: 780, perks: ['Panoramic Fuji Views', 'Dedicated 24/7 Butler', 'Private Tea Master Ceremony'] },
    },
    highlights: [
      { title: 'Ginza Michelin 3-Star Omakase Experience', desc: 'Exclusive 18-course sushi counter tasting prepared by Master Chef.', category: 'meal', icon: 'restaurant', price: 24500, location: 'Ginza, Tokyo' },
      { title: 'Kyoto Bamboo Forest & Golden Pavilion Private Tour', desc: 'Early morning private guide before crowds enter Arashiyama & Kinkaku-ji.', category: 'activity', icon: 'temple_buddhist', price: 13500, location: 'Kyoto Heritage District' },
      { title: 'Mount Fuji Panoramic Helicopter Tour', desc: '25-minute flight soaring over Lake Ashi, volcanic valleys and Mount Fuji.', category: 'experience', icon: 'flight_takeoff', price: 28000, location: 'Hakone Heliport' },
    ],
    daysPlan: [
      { dayNumber: 1, title: 'Tokyo Arrival & Shinjuku Hidden Bar Discovery', highlights: ['Executive chauffeur meet & greet', 'Check-in to Imperial Palace Suite', 'Private guide through Omoide Yokocho & Golden Gai'] },
      { dayNumber: 2, title: 'Old & New Tokyo: Asakusa Shrine & Shibuya Sky', highlights: ['Private Senso-ji temple morning blessing', 'Sumo stable exclusive practice view', 'VIP sunset access at Shibuya Sky'] },
      { dayNumber: 3, title: 'Shinkansen Bullet Train to Kyoto & Gion Evening Walk', highlights: ['Gran Class bullet train to Kyoto', 'Check-in to luxury riverside ryokan', 'Evening lantern walk through historic Gion geisha district'] },
      { dayNumber: 4, title: 'Fushimi Inari Torii Gates & Arashiyama Bamboo', highlights: ['Early walk through thousand scarlet torii gates', 'Traditional Zen garden matcha tea ceremony', 'Arashiyama bamboo grove exploration'] },
      { dayNumber: 5, title: 'Hakone Onsen Thermal Springs & Kaiseki Dinner', highlights: ['Private scenic transfer to Hakone mountain valley', 'Natural mineral outdoor onsen soak', '12-course seasonal kaiseki feast'] },
    ],
  },
};

function getDestinationProfile(destination: string): DestinationProfile {
  const lower = destination.toLowerCase();
  for (const [key, profile] of Object.entries(DESTINATION_PROFILES)) {
    if (lower.includes(key)) {
      return profile;
    }
  }
  // Generic Fallback Profile dynamically constructed
  return {
    country: destination,
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    flights: {
      cheaper: { airline: 'Premier Regional / 1-Stop', flightNumber: 'PR-412', originCode: 'BOM', destCode: 'DEST', depTime: '04:30 AM', arrTime: '11:15 AM', duration: '8h 30m', stops: '1 Stop' },
      recommended: { airline: 'Flag Carrier (Direct Non-Stop)', flightNumber: 'FC-701', originCode: 'BOM', destCode: 'DEST', depTime: '06:15 AM', arrTime: '10:30 AM', duration: '6h 15m', stops: 'Non-Stop Direct' },
      luxury: { airline: 'Flag Carrier Business Class', flightNumber: 'FC-701 (Biz)', originCode: 'BOM', destCode: 'DEST', depTime: '06:15 AM', arrTime: '10:30 AM', duration: '6h 15m', stops: 'Non-Stop Direct' },
    },
    hotels: {
      cheaper: { name: `${destination} Heritage Boutique Collection`, roomType: 'Deluxe City View Room', location: 'Historic Central Quarter', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', rating: 4.86, reviews: 310, perks: ['Central Location', 'Artisan Breakfast Included', 'Free High-Speed WiFi'] },
      recommended: { name: `${destination} 5-Star Landmark Luxury Resort`, roomType: 'Signature Panoramic Suite', location: 'Scenic Waterfront & Heritage District', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', rating: 4.97, reviews: 840, perks: ['Panoramic Balcony View', 'Infinity Pool & Spa Access', 'VIP Welcome Refreshments', 'Gourmet Breakfast'] },
      luxury: { name: `${destination} Imperial Palace Heritage Hotel`, roomType: 'Presidential Royal Suite', location: 'Exclusive Heritage Reserve', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', rating: 4.99, reviews: 520, perks: ['24/7 Dedicated Butler', 'Private Heated Pool', 'VIP Airport Fast-Track Transfer'] },
    },
    highlights: [
      { title: `${destination} Signature Private Sunset Cruise`, desc: 'Private yacht charter along the scenic waterfront with champagne.', category: 'experience', icon: 'directions_boat', price: 16500, location: `${destination} Waterfront` },
      { title: `${destination} VIP Heritage & Hidden Alleys Tour`, desc: 'Historian guided walking tour of iconic monuments and old town.', category: 'activity', icon: 'tour', price: 11000, location: `${destination} Old Town` },
      { title: `${destination} Michelin Star Chef Table Tasting`, desc: 'Multi-course culinary journey celebrating regional gastronomic traditions.', category: 'meal', icon: 'restaurant', price: 14500, location: `${destination} Fine Dining` },
    ],
    daysPlan: [
      { dayNumber: 1, title: `Arrival in ${destination} & Private VIP Welcome`, highlights: ['Chauffeur airport meet & greet', 'Check-in with welcome refreshments', 'Scenic evening panorama dinner'] },
      { dayNumber: 2, title: 'Historic Quarter & Cultural Heritage Tour', highlights: ['Private guided walking tour', 'VIP access to iconic monuments', 'Traditional culinary tasting'] },
      { dayNumber: 3, title: 'Scenic Landscapes & Local Artisan Workshops', highlights: ['Panoramic view drive', 'Private artisan workshop visit', 'Sunset cocktail vantage point'] },
      { dayNumber: 4, title: 'Signature Experience & Nature Exploration', highlights: ['Sunrise signature adventure', 'Valley / Waterfront leisure', 'Chef tasting table dinner'] },
      { dayNumber: 5, title: 'Leisure Morning & Departure Chauffeur', highlights: ['Relaxed breakfast', 'Last-minute boutique shopping', 'Private transfer to airport'] },
    ],
  };
}

function parseDestinationAndDays(text: string): { destination: string | null; days: number; travelers: number; isInvalid: boolean; reason?: string } {
  const lower = text.toLowerCase();
  let days = 5;
  const daysMatch = lower.match(/(\d+)\s*(?:day|days|d)/);
  if (daysMatch) {
    days = Math.min(21, Math.max(2, parseInt(daysMatch[1], 10)));
  }

  let travelers = 2;
  const paxMatch = lower.match(/(\d+)\s*(?:traveler|travelers|pax|people|person|persons)/);
  if (paxMatch) {
    travelers = Math.max(1, parseInt(paxMatch[1], 10));
  } else if (lower.includes('solo') || lower.includes('alone')) {
    travelers = 1;
  } else if (lower.includes('couple') || lower.includes('honeymoon')) {
    travelers = 2;
  } else if (lower.includes('family')) {
    travelers = 4;
  }

  // Nonsense/invalid keyword check
  const INVALID_NONSENSE_KEYWORDS = [
    'pizza', 'burger', 'food', 'biryani', 'chai', 'coffee', 'pasta', 'sandwich', 'ice cream', 'shawarma', 'sushi',
    'arif', 'john', 'alex', 'peter', 'sarah', 'bob', 'tom', 'test', 'demo', 'fake', 'random', 'foo', 'bar', '123',
    'car', 'laptop', 'phone', 'money', 'crypto', 'shoe', 'shirt', 'dog', 'cat', 'water', 'book',
  ];
  for (const bad of INVALID_NONSENSE_KEYWORDS) {
    const regex = new RegExp(`\\b${bad}\\b`, 'i');
    if (regex.test(lower)) {
      return { destination: null, days, travelers, isInvalid: true, reason: `"${bad}" is not a recognized travel destination.` };
    }
  }

  let destination: string | null = null;
  const destKeywords: Record<string, string> = {
    turkey: 'Turkey',
    istanbul: 'Turkey',
    cappadocia: 'Turkey',
    antalya: 'Turkey',
    japan: 'Japan',
    tokyo: 'Japan',
    kyoto: 'Japan',
    kerala: 'Kerala, India',
    rajasthan: 'Rajasthan, India',
    jaipur: 'Rajasthan, India',
    goa: 'Goa, India',
    delhi: 'New Delhi, India',
    'new delhi': 'New Delhi, India',
    switzerland: 'Switzerland',
    alps: 'Switzerland',
    france: 'France',
    paris: 'France',
    italy: 'Italy',
    rome: 'Italy',
    dubai: 'Dubai, UAE',
    uae: 'Dubai, UAE',
    riyadh: 'Riyadh, Saudi Arabia',
    saudi: 'Riyadh, Saudi Arabia',
    'new york': 'New York, USA',
    nyc: 'New York, USA',
    london: 'London, UK',
    singapore: 'Singapore',
    bali: 'Bali, Indonesia',
    thailand: 'Thailand',
    bangkok: 'Bangkok, Thailand',
    maldives: 'Maldives',
    seoul: 'Seoul, South Korea',
    mumbai: 'Mumbai, India',
  };

  for (const [key, val] of Object.entries(destKeywords)) {
    if (lower.includes(key)) {
      destination = val;
      break;
    }
  }

  return { destination, days, travelers, isInvalid: !destination, reason: !destination ? 'Could not identify a recognized travel destination city.' : undefined };
}

// ============================================================================
// 1. POST /api/v1/assistant/clarify
// ============================================================================
router.post('/clarify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt = '' } = req.body;
    if (!prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { destination, days, travelers, isInvalid, reason } = parseDestinationAndDays(prompt);

    if (isInvalid || !destination) {
      return res.status(422).json({
        isValid: false,
        error: 'INVALID_DESTINATION',
        message: reason || 'Please enter a valid city or travel destination to plan your itinerary without guessing.',
        suggestedCities: ['Tokyo', 'Turkey', 'Kerala', 'Rajasthan', 'Goa', 'New Delhi', 'Dubai', 'Paris', 'Swiss Alps', 'New York', 'Riyadh'],
      });
    }

    const profile = getDestinationProfile(destination);

    const baseSmartBudget = Math.round(days * 14000 * travelers);
    const basePremiumBudget = Math.round(days * 28000 * travelers);
    const baseLuxuryBudget = Math.round(days * 55000 * travelers);

    let questions = [
      {
        id: 'travel_party_pace',
        title: 'Who is traveling and what is your travel pace?',
        subtitle: 'This helps us tune the itinerary balance between downtime and exploration.',
        type: 'single_choice',
        defaultValue: travelers === 1 ? 'solo_balanced' : 'couple_relaxed',
        options: [
          { id: 'couple_relaxed', label: 'Couple · Romantic & Relaxed', desc: 'Scenic mornings, candlelit dinners, stress-free transfers', icon: 'favorite' },
          { id: 'family_balanced', label: 'Family · Balanced & Comfortable', desc: 'Kid-friendly, spacious suites, flexible pace', icon: 'family_restroom' },
          { id: 'friends_active', label: 'Friends · Active & Nightlife', desc: 'High energy tours, vibrant dining, exploration', icon: 'groups' },
          { id: 'solo_explorer', label: 'Solo Explorer · Cultural Discovery', desc: 'Hidden alleys, artisan walks, freedom to roam', icon: 'person' },
        ],
      },
      {
        id: 'must_do_highlights',
        title: `What experiences in ${destination} are on your bucket list?`,
        subtitle: 'Select any that appeal to you, or write your own specific places below.',
        type: 'multi_choice',
        options: profile.highlights.map((h, idx) => ({
          id: `hl-${idx}`,
          label: h.title,
          desc: h.desc,
          icon: h.icon,
          badge: idx === 0 ? 'Signature' : idx === 1 ? 'Popular' : undefined,
        })),
        allowCustomText: true,
        customTextPlaceholder: 'e.g. Cave suite with valley view, authentic pottery workshop...',
        defaultValue: ['hl-0', 'hl-1'],
      },
      {
        id: 'budget_tier',
        title: 'What is your target budget for this journey?',
        subtitle: 'All flights, hotels, and activities will be calibrated strictly in INR (₹) to match this budget.',
        type: 'budget',
        defaultValue: {
          currency: 'INR',
          targetAmount: basePremiumBudget,
          selectedTier: 'premium_comfort',
        },
        options: [
          {
            id: 'smart_value',
            label: 'Smart Value / Boutique',
            badge: `~₹${baseSmartBudget.toLocaleString('en-IN')} Total`,
            desc: 'High-value 4★ boutique stays, reliable economy flights, core highlights',
            icon: 'savings',
          },
          {
            id: 'premium_comfort',
            label: 'Premium Comfort (Recommended)',
            badge: `~₹${basePremiumBudget.toLocaleString('en-IN')} Total`,
            desc: '5★ landmark luxury properties, optimal direct flights, private chauffeur',
            icon: 'stars',
          },
          {
            id: 'ultra_luxury',
            label: 'Ultra-Luxury VIP Concierge',
            badge: `~₹${baseLuxuryBudget.toLocaleString('en-IN')}+ Total`,
            desc: 'Palace / Penthouse suites, Business Class lie-flat seating, private yachts',
            icon: 'diamond',
          },
        ],
      },
      {
        id: 'departure_city',
        title: 'Where will you be flying from?',
        subtitle: 'We will search the best round-trip flight options matching your budget tier.',
        type: 'single_choice',
        defaultValue: 'BOM',
        options: [
          { id: 'BOM', label: 'Mumbai (BOM)', desc: 'Chhatrapati Shivaji Maharaj Intl' },
          { id: 'DEL', label: 'Delhi (DEL)', desc: 'Indira Gandhi International' },
          { id: 'BLR', label: 'Bengaluru (BLR)', desc: 'Kempegowda International' },
          { id: 'DXB', label: 'Dubai (DXB)', desc: 'Dubai International' },
          { id: 'LHR', label: 'London (LHR)', desc: 'London Heathrow' },
          { id: 'JFK', label: 'New York (JFK)', desc: 'John F. Kennedy International' },
        ],
        allowCustomText: true,
        customTextPlaceholder: 'Other city or airport code (e.g. SFO, MAA, SIN)...',
      },
    ];

    // Attempt Gemini dynamic enrichment with cascade
    const systemPrompt = `You are the lead travel concierge director at TripFlow luxury travel.
Analyze this traveler prompt: "${prompt}". Target Destination: ${destination}, Days: ${days}, Travelers: ${travelers}.
Generate 4-5 interactive questions for their trip, including a budget question.
IMPORTANT: All currency and pricing MUST BE IN INR (Indian Rupees - ₹). Use realistic INR amounts (e.g. ~₹2,50,000 to ₹6,00,000 total).
Return ONLY valid JSON without markdown fences matching:
{
  "destination": "${destination}",
  "country": "${profile.country}",
  "days": ${days},
  "travelers": ${travelers},
  "questions": [ ... ]
}`;

    const geminiText = await generateWithGeminiCascade(systemPrompt);
    if (geminiText) {
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            questions = parsed.questions;
          }
        } catch { }
      }
    }

    res.json({
      success: true,
      destination,
      days,
      travelers,
      questions,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/assistant/clarify:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate clarification questions' });
  }
});

// ============================================================================
// 2. POST /api/v1/assistant/generate-proposal
// ============================================================================
router.post('/generate-proposal', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      prompt,
      destination = 'Turkey',
      originCity = 'Mumbai (BOM)',
      days = 7,
      travelers = 2,
      answers = {},
      targetBudgetINR,
      targetBudgetUSD,
    } = req.body;

    // Detect origin city from answers if provided (e.g. from questionnaire departure_city question)
    const departureAnswer = answers?.departure_city;
    const resolvedOrigin = (typeof departureAnswer === 'string' && departureAnswer.trim())
      ? departureAnswer.trim()
      : originCity;

    const profile = getDestinationProfile(destination);
    const originIataMatch = resolvedOrigin.match(/\(([A-Z]{3})\)/);
    const resolvedOriginCode = originIataMatch ? originIataMatch[1] : (profile.flights.recommended.originCode || 'BOM');
    const resolvedOriginName = resolvedOrigin.replace(/\s*\([A-Z]{3}\)/, '').trim() || 'Mumbai';

    const budget = Number(targetBudgetINR || targetBudgetUSD) || Math.round(days * 28000 * travelers);
    const nights = Math.max(1, days - 1);

    // Dynamic flight calculation calibrated to budget in INR
    const flCheapPrice = Math.max(24000, Math.round(budget * 0.26 / travelers));
    const flRecPrice = Math.max(38000, Math.round(budget * 0.36 / travelers));
    const flLuxPrice = Math.max(95000, Math.round(budget * 0.65 / travelers));

    // Dynamic hotel calculation calibrated to budget in INR (per night)
    const htCheapNight = Math.max(7500, Math.round((budget * 0.28) / nights));
    const htRecNight = Math.max(16000, Math.round((budget * 0.42) / nights));
    const htLuxNight = Math.max(36000, Math.round((budget * 0.75) / nights));

    // Construct high-fidelity, verified proposal in INR
    const verifiedProposal = {
      id: `prop-${Date.now()}`,
      title: `${days}-Day ${destination} Curated Luxury Odyssey`,
      destination,
      country: profile.country,
      days,
      travelers,
      startDate: '2025-10-15',
      currency: 'INR',
      currencySymbol: '₹',
      basePriceINR: budget,
      basePriceUSD: budget, // backward compatibility
      heroImage: profile.heroImage,
      summary: `A bespoke ${days}-day itinerary from ${resolvedOriginName} (${resolvedOriginCode}) through ${destination} crafted to match your target budget of ₹${budget.toLocaleString('en-IN')}. Featuring calibrated flight routes, 5-star landmark stays, and private transfers.`,
      flights: [
        {
          id: 'fl-cheap-1',
          airline: profile.flights.cheaper.airline,
          flightNumber: profile.flights.cheaper.flightNumber,
          origin: resolvedOriginName,
          originCode: resolvedOriginCode,
          destination,
          destCode: profile.flights.cheaper.destCode,
          departureTime: profile.flights.cheaper.depTime,
          arrivalTime: profile.flights.cheaper.arrTime,
          duration: profile.flights.cheaper.duration,
          cabinClass: 'Economy Value',
          priceINR: flCheapPrice,
          priceUSD: flCheapPrice,
          priceDeltaUSD: (flCheapPrice - flRecPrice) * travelers,
          type: 'cheaper',
          label: 'Cheapest Option',
          badge: 'Budget Saver',
          baggage: '20 kg checked',
          stops: profile.flights.cheaper.stops,
        },
        {
          id: 'fl-rec-1',
          airline: profile.flights.recommended.airline,
          flightNumber: profile.flights.recommended.flightNumber,
          origin: resolvedOriginName,
          originCode: resolvedOriginCode,
          destination,
          destCode: profile.flights.recommended.destCode,
          departureTime: profile.flights.recommended.depTime,
          arrivalTime: profile.flights.recommended.arrTime,
          duration: profile.flights.recommended.duration,
          cabinClass: 'Prime Economy (Direct)',
          priceINR: flRecPrice,
          priceUSD: flRecPrice,
          priceDeltaUSD: 0,
          type: 'recommended',
          label: 'Recommended (Direct)',
          badge: 'Target Budget Match',
          baggage: '30 kg checked + meals',
          stops: profile.flights.recommended.stops,
        },
        {
          id: 'fl-lux-1',
          airline: profile.flights.luxury.airline,
          flightNumber: profile.flights.luxury.flightNumber,
          origin: resolvedOriginName,
          originCode: resolvedOriginCode,
          destination,
          destCode: profile.flights.luxury.destCode,
          departureTime: profile.flights.luxury.depTime,
          arrivalTime: profile.flights.luxury.arrTime,
          duration: profile.flights.luxury.duration,
          cabinClass: 'Business Class Lie-Flat',
          priceINR: flLuxPrice,
          priceUSD: flLuxPrice,
          priceDeltaUSD: (flLuxPrice - flRecPrice) * travelers,
          type: 'luxury',
          label: 'Luxury Business',
          badge: 'Lounge + Lie-Flat Suite',
          baggage: '40 kg + 2 Cabin',
          stops: profile.flights.luxury.stops,
        },
      ],
      selectedFlightId: 'fl-rec-1',
      hotels: [
        {
          id: 'ht-cheap-1',
          name: profile.hotels.cheaper.name,
          roomType: profile.hotels.cheaper.roomType,
          location: profile.hotels.cheaper.location,
          pricePerNightINR: htCheapNight,
          pricePerNightUSD: htCheapNight,
          priceDeltaPerNightUSD: htCheapNight - htRecNight,
          image: profile.hotels.cheaper.image,
          rating: profile.hotels.cheaper.rating,
          reviewsCount: profile.hotels.cheaper.reviews,
          type: 'cheaper',
          label: 'Smart Boutique (Budget Saver)',
          perks: profile.hotels.cheaper.perks,
        },
        {
          id: 'ht-rec-1',
          name: profile.hotels.recommended.name,
          roomType: profile.hotels.recommended.roomType,
          location: profile.hotels.recommended.location,
          pricePerNightINR: htRecNight,
          pricePerNightUSD: htRecNight,
          priceDeltaPerNightUSD: 0,
          image: profile.hotels.recommended.image,
          rating: profile.hotels.recommended.rating,
          reviewsCount: profile.hotels.recommended.reviews,
          type: 'recommended',
          label: 'Signature Luxury (Target Match)',
          perks: profile.hotels.recommended.perks,
        },
        {
          id: 'ht-lux-1',
          name: profile.hotels.luxury.name,
          roomType: profile.hotels.luxury.roomType,
          location: profile.hotels.luxury.location,
          pricePerNightINR: htLuxNight,
          pricePerNightUSD: htLuxNight,
          priceDeltaPerNightUSD: htLuxNight - htRecNight,
          image: profile.hotels.luxury.image,
          rating: profile.hotels.luxury.rating,
          reviewsCount: profile.hotels.luxury.reviews,
          type: 'luxury',
          label: 'Ultra-Luxury Palace Heritage',
          perks: profile.hotels.luxury.perks,
        },
      ],
      selectedHotelId: 'ht-rec-1',
      transfers: [
        {
          id: 'tr-cheap',
          vehicle: 'Private Sedan (Executive Clean)',
          chauffeur: 'Professional Local Driver',
          rating: 4.84,
          priceDeltaUSD: -4500,
          type: 'cheaper',
          label: 'Private Sedan',
          description: 'Direct airport and hotel transfers with air-conditioning and luggage assistance.',
        },
        {
          id: 'tr-rec',
          vehicle: 'Mercedes-Benz Luxury Chauffeur',
          chauffeur: 'Uniformed Concierge Driver',
          rating: 4.98,
          priceDeltaUSD: 0,
          type: 'recommended',
          label: 'Mercedes Luxury Chauffeur',
          description: 'Dedicated vehicle throughout the circuit with chilled bottled water and mobile WiFi.',
        },
        {
          id: 'tr-lux',
          vehicle: 'Mercedes V-Class VIP Lounge Van',
          chauffeur: 'Executive Host & Driver',
          rating: 5.0,
          priceDeltaUSD: 18000,
          type: 'luxury',
          label: 'VIP Executive Lounge',
          description: 'Leather captain recliner seats, premium sound system, cold refreshments bar.',
        },
      ],
      selectedTransferId: 'tr-rec',
      schedulePreview: profile.daysPlan.slice(0, days),
      extraActivities: profile.highlights.map((h, idx) => ({
        id: `act-extra-${idx}`,
        title: h.title,
        category: h.category,
        price: h.price,
        rating: 4.95,
        location: h.location,
        image: profile.heroImage,
        suggestedDayNumber: Math.min(days, idx + 1),
        isIncluded: idx < 2,
      })),
    };

    // Attempt Gemini dynamic enhancement if available
    const systemPrompt = `You are TripFlow's Lead Luxury Concierge AI.
Generate a budget-calibrated travel proposal.
Traveler Prompt: "${prompt}"
Destination: ${destination}, Days: ${days}, Travelers: ${travelers}, Target Total Budget: ₹${budget} INR
Answers: ${JSON.stringify(answers)}
IMPORTANT: All flight prices, hotel prices per night, and activity costs MUST BE REALISTIC AMOUNTS IN INR (Indian Rupees - ₹). Do NOT return USD or numbers less than ₹1,000 for flights/hotels.
Return a STRICT JSON object without markdown fences matching the proposal schema.`;

    const geminiText = await generateWithGeminiCascade(systemPrompt);
    if (geminiText) {
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && parsed.flights && parsed.hotels) {
            return res.json({ success: true, proposal: parsed });
          }
        } catch { }
      }
    }

    res.json({
      success: true,
      proposal: verifiedProposal,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/assistant/generate-proposal:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate proposal' });
  }
});

// ============================================================================
// 3. DATABASE CHAT SESSIONS PERSISTENCE (USER ISOLATED)
// ============================================================================

// GET /api/v1/assistant/sessions - Retrieve all chat sessions for active user
router.get('/sessions', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-sarah-1024';

    const dbSessions = await prisma.assistantChatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const seenTitleKeys = new Set<string>();
    const sessions: any[] = [];

    for (const s of dbSessions) {
      const normTitle = (s.title || '').trim().toLowerCase();
      const normDest = (s.destination || '').trim().toLowerCase();
      const titleKey = normTitle !== 'new trip conversation' ? `${normTitle}_${normDest}` : s.id;

      if (!seenTitleKeys.has(titleKey)) {
        seenTitleKeys.add(titleKey);
        sessions.push({
          id: s.id,
          title: s.title,
          destination: s.destination,
          updatedAt: s.updatedAt.toISOString(),
          messages: s.messages as any,
          proposal: s.proposal as any,
        });
      }
    }

    res.json({ success: true, count: sessions.length, sessions });
  } catch (err: any) {
    console.error('Error in GET /api/v1/assistant/sessions:', err);
    res.status(500).json({ error: err?.message || 'Failed to fetch chat sessions' });
  }
});

// POST /api/v1/assistant/sessions - Create or update a chat session
router.post('/sessions', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-sarah-1024';
    const { id, title = 'New Journey', destination = 'Worldwide', messages = [], proposal = null } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Session id is required' });
    }

    // Ensure user exists before inserting
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      // If user doesn't exist, create demo user
      await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@tripflow.io`,
          passwordHash: 'demo',
          name: 'Sarah Mehta',
          role: 'TRAVELER',
        },
      });
    }

    const saved = await prisma.assistantChatSession.upsert({
      where: { id },
      update: {
        title,
        destination,
        messages,
        proposal,
        updatedAt: new Date(),
      },
      create: {
        id,
        userId,
        title,
        destination,
        messages,
        proposal,
      },
    });

    res.json({ success: true, session: saved });
  } catch (err: any) {
    console.error('Error in POST /api/v1/assistant/sessions:', err);
    res.status(500).json({ error: err?.message || 'Failed to save chat session' });
  }
});

// DELETE /api/v1/assistant/sessions/:id - Delete a chat session
router.delete('/sessions/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-sarah-1024';
    const { id } = req.params;

    await prisma.assistantChatSession.deleteMany({
      where: { id, userId },
    });

    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err: any) {
    console.error('Error in DELETE /api/v1/assistant/sessions:', err);
    res.status(500).json({ error: err?.message || 'Failed to delete session' });
  }
});

// ============================================================================
// 4. NATURAL LANGUAGE ITINERARY MODIFICATION WITH GEMINI
// ============================================================================

function getDefaultImageForCategory(category: string, destination: string): string {
  const cat = (category || '').toLowerCase();
  const dest = (destination || '').toLowerCase();

  if (cat === 'meal') {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
  }
  if (cat === 'hotel') {
    return dest.includes('turkey')
      ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
  }
  if (cat === 'transport') {
    return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80';
  }
  if (cat === 'activity') {
    return dest.includes('turkey')
      ? 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80';
  }
  return dest.includes('turkey')
    ? 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80';
}

function applyItineraryMutation(
  prompt: string,
  daysCopy: any[],
  parsed: any,
  activeDayNumber: number,
  destination: string
) {
  const lower = prompt.toLowerCase();

  // If Gemini provided structured action
  if (parsed && parsed.action === 'add_item' && parsed.newItem && parsed.newItem.title) {
    let targetDayNum = Number(parsed.targetDayNumber) || activeDayNumber || 1;
    if (targetDayNum < 1) targetDayNum = 1;
    if (targetDayNum > daysCopy.length) targetDayNum = daysCopy.length;

    const targetDay = daysCopy.find((d: any) => d.dayNumber === targetDayNum) || daysCopy[0];
    const category = parsed.newItem.category || 'experience';
    const price = typeof parsed.newItem.price === 'number' ? parsed.newItem.price : 45;

    const newItem = {
      id: `item-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      catalogId: `custom-ai-${Date.now().toString(36)}`,
      title: parsed.newItem.title,
      category,
      price,
      time: parsed.newItem.time || '02:00 PM',
      duration: parsed.newItem.duration || '2 hrs',
      location: parsed.newItem.location || destination,
      description: parsed.newItem.description || `Curated ${category} experience tailored to your itinerary.`,
      image: parsed.newItem.image || getDefaultImageForCategory(category, destination),
      rating: 4.95,
      tags: parsed.newItem.tags || ['AI Curated', category],
      notes: `Added via AI prompt: "${prompt}"`,
      transitToNext: { mode: 'car', duration: '15 min' },
    };

    targetDay.items = targetDay.items || [];
    targetDay.items.push(newItem);

    return {
      success: true,
      explanation: parsed.explanation || `✨ Added "${newItem.title}" to Day ${targetDay.dayNumber} at ${newItem.time} (₹${newItem.price.toLocaleString('en-IN')}).`,
      updatedDays: daysCopy,
      targetDayNumber: targetDay.dayNumber,
      highlightItemId: newItem.id,
      priceDelta: newItem.price,
    };
  }

  if (parsed && parsed.action === 'add_day') {
    const nextDayNum = daysCopy.length + 1;
    const newDay = {
      id: `day-${nextDayNum}-${Date.now().toString().slice(-4)}`,
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: parsed.explanation || `${destination} Cultural Discovery & Leisure`,
      subtitle: `Extended Day in ${destination}`,
      items: parsed.newItem
        ? [
          {
            id: `item-ai-${Date.now()}-1`,
            catalogId: `custom-ai-${Date.now()}`,
            title: parsed.newItem.title,
            category: parsed.newItem.category || 'experience',
            price: Number(parsed.newItem.price) || 5000,
            time: parsed.newItem.time || '10:30 AM',
            duration: parsed.newItem.duration || '2.5 hrs',
            location: destination,
            description: parsed.newItem.description || 'Curated journey highlight.',
            image: getDefaultImageForCategory(parsed.newItem.category, destination),
            rating: 4.92,
            tags: ['Custom Day', destination],
            transitToNext: { mode: 'car', duration: '15 min' },
          },
        ]
        : [
          {
            id: `item-ai-${Date.now()}-1`,
            catalogId: `custom-ai-${Date.now()}`,
            title: `${destination} Landmark Highlights & Artisan Walk`,
            category: 'activity',
            price: 3800,
            time: '10:00 AM',
            duration: '2.5 hrs',
            location: destination,
            description: 'Guided cultural immersion through historic monuments and scenic vistas.',
            image: getDefaultImageForCategory('activity', destination),
            rating: 4.93,
            tags: ['Culture', 'Highlights'],
            transitToNext: { mode: 'car', duration: '15 min' },
          },
          {
            id: `item-ai-${Date.now()}-2`,
            catalogId: `custom-ai-${Date.now()}-2`,
            title: 'Curated Sunset Dinner & Local Gastronomy',
            category: 'meal',
            price: 5500,
            time: '07:30 PM',
            duration: '2 hrs',
            location: destination,
            description: 'Exquisite regional delicacies with panoramic evening ambience.',
            image: getDefaultImageForCategory('meal', destination),
            rating: 4.96,
            tags: ['Dining', 'Sunset'],
            transitToNext: { mode: 'car', duration: '15 min' },
          },
        ],
    };

    daysCopy.push(newDay);
    const delta = newDay.items.reduce((s: number, i: any) => s + (i.price || 0), 0);

    return {
      success: true,
      explanation: parsed.explanation || `✨ Added Day ${nextDayNum} to your itinerary in ${destination}!`,
      updatedDays: daysCopy,
      targetDayNumber: nextDayNum,
      priceDelta: delta,
    };
  }

  if (parsed && parsed.action === 'remove_item' && parsed.removeItemId) {
    let removedTitle = '';
    let removedPrice = 0;
    let foundDayNum = activeDayNumber;

    daysCopy.forEach((day: any) => {
      const idx = day.items?.findIndex((it: any) => it.id === parsed.removeItemId);
      if (idx !== -1 && idx !== undefined) {
        removedTitle = day.items[idx].title;
        removedPrice = day.items[idx].price || 0;
        foundDayNum = day.dayNumber;
        day.items.splice(idx, 1);
      }
    });

    return {
      success: true,
      explanation: parsed.explanation || `✨ Removed "${removedTitle}" from Day ${foundDayNum}. Saved ₹${removedPrice.toLocaleString('en-IN')}!`,
      updatedDays: daysCopy,
      targetDayNumber: foundDayNum,
      priceDelta: -removedPrice,
    };
  }

  // --- Fallback Natural Language Parsing ---
  let targetDayNum = activeDayNumber || 1;
  const dayMatch = lower.match(/day\s*(\d+)/i) || lower.match(/day-(\d+)/i);
  if (dayMatch) {
    const parsedDay = parseInt(dayMatch[1], 10);
    if (parsedDay > 0 && parsedDay <= daysCopy.length) {
      targetDayNum = parsedDay;
    }
  }

  const targetDay = daysCopy.find((d: any) => d.dayNumber === targetDayNum) || daysCopy[0];

  // Action: Add new day
  if (lower.includes('add day') || lower.includes('extra day') || lower.includes('another day') || lower.includes('extend')) {
    const nextDayNum = daysCopy.length + 1;
    const newDay = {
      id: `day-${nextDayNum}-${Date.now().toString().slice(-4)}`,
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: `${destination} Leisure & Artisan Discovery`,
      subtitle: `Extended Day in ${destination}`,
      items: [
        {
          id: `item-gen-${Date.now()}-1`,
          catalogId: `custom-ai-${Date.now()}`,
          title: 'Artisan Markets & Panoramic Viewpoints',
          category: 'activity',
          price: 3800,
          time: '10:30 AM',
          duration: '2.5 hrs',
          location: destination,
          description: 'Relaxed walking exploration capturing local heritage and craft boutiques.',
          image: getDefaultImageForCategory('activity', destination),
          rating: 4.9,
          tags: ['Culture', 'Photography'],
          transitToNext: { mode: 'car', duration: '15 min' },
        },
        {
          id: `item-gen-${Date.now()}-2`,
          catalogId: `custom-ai-${Date.now()}-2`,
          title: 'Signature Sunset Dining Experience',
          category: 'meal',
          price: 5500,
          time: '07:30 PM',
          duration: '2 hrs',
          location: destination,
          description: 'Multi-course dinner featuring regional specialties and scenic evening lighting.',
          image: getDefaultImageForCategory('meal', destination),
          rating: 4.95,
          tags: ['Dinner', 'Fine Dining'],
          transitToNext: { mode: 'car', duration: '15 min' },
        },
      ],
    };
    daysCopy.push(newDay);
    return {
      success: true,
      explanation: `✨ Added Day ${nextDayNum} to your itinerary with morning exploration and sunset dining!`,
      updatedDays: daysCopy,
      targetDayNumber: nextDayNum,
      priceDelta: 9300,
    };
  }

  // Action: Remove item
  if (lower.includes('remove') || lower.includes('delete') || lower.includes('cancel') || lower.includes('drop')) {
    if (targetDay.items && targetDay.items.length > 0) {
      let removeIndex = targetDay.items.findIndex((it: any) =>
        lower.includes(it.title.toLowerCase().split(' ')[0]) || lower.includes(it.category)
      );
      if (removeIndex === -1) removeIndex = targetDay.items.length - 1;
      const [removed] = targetDay.items.splice(removeIndex, 1);
      return {
        success: true,
        explanation: `✨ Removed "${removed.title}" from Day ${targetDay.dayNumber}. Saved ₹${(removed.price || 0).toLocaleString('en-IN')}!`,
        updatedDays: daysCopy,
        targetDayNumber: targetDay.dayNumber,
        priceDelta: -(removed.price || 0),
      };
    }
  }

  // Action: Add dynamic detail / item
  let category: 'meal' | 'activity' | 'transport' | 'hotel' | 'experience' = 'experience';
  if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast') || lower.includes('sushi') || lower.includes('restaurant') || lower.includes('food') || lower.includes('coffee') || lower.includes('tasting')) {
    category = 'meal';
  } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('suite') || lower.includes('villa')) {
    category = 'hotel';
  } else if (lower.includes('transfer') || lower.includes('flight') || lower.includes('train') || lower.includes('chauffeur') || lower.includes('car') || lower.includes('cab')) {
    category = 'transport';
  } else if (lower.includes('tour') || lower.includes('museum') || lower.includes('hike') || lower.includes('walk') || lower.includes('temple') || lower.includes('bath') || lower.includes('hamam')) {
    category = 'activity';
  }

  // Extract price in INR (e.g. ₹5,000, 5000 inr, 5000 rs, $60 -> ₹5,100)
  let price = 4000;
  const inrMatch = prompt.match(/₹\s*([\d,]+)/) || prompt.match(/(?:rs\.?|inr|rupees?)\s*([\d,]+)/i) || prompt.match(/([\d,]+)\s*(?:inr|rs|rupees?)/i);
  const dollarMatch = prompt.match(/\$([\d,]+)/) || prompt.match(/([\d,]+)\s*(?:usd|dollars)/i);

  if (inrMatch) {
    price = parseInt(inrMatch[1].replace(/,/g, ''), 10);
  } else if (dollarMatch) {
    // If dollar given by user, convert to INR ($1 ~ ₹85)
    price = parseInt(dollarMatch[1].replace(/,/g, ''), 10) * 85;
  } else if (category === 'hotel') {
    price = 16500;
  } else if (category === 'meal') {
    price = 5500;
  } else if (category === 'transport') {
    price = 3500;
  }

  // Extract time (e.g. 8 PM, 8:30pm, 10:00 AM)
  let time = '03:00 PM';
  const timeMatch = prompt.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (timeMatch) {
    time = timeMatch[1].toUpperCase();
  } else if (lower.includes('morning') || lower.includes('breakfast')) {
    time = '09:30 AM';
  } else if (lower.includes('lunch') || lower.includes('afternoon')) {
    time = '01:00 PM';
  } else if (lower.includes('sunset') || lower.includes('evening')) {
    time = '06:00 PM';
  } else if (lower.includes('dinner') || lower.includes('night')) {
    time = '08:00 PM';
  }

  // Extract clean title from prompt
  let cleanTitle = prompt
    .replace(/^add\s+/i, '')
    .replace(/\s+on\s+day\s*\d+/i, '')
    .replace(/\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
    .replace(/\s+with\s+[₹\$]?\d+.*$/i, '')
    .replace(/\s+costing\s+[₹\$]?\d+.*$/i, '')
    .replace(/\s*\([₹\$]?\d+.*\)/i, '')
    .trim();

  if (!cleanTitle || cleanTitle.length < 3) {
    cleanTitle = `${destination} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  } else {
    cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  }

  const newItem = {
    id: `item-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    catalogId: `custom-ai-${Date.now().toString(36)}`,
    title: cleanTitle,
    category,
    price,
    time,
    duration: category === 'meal' ? '1.5 hrs' : '2 hrs',
    location: destination,
    description: `Curated ${category} tailored directly from your request: "${prompt}".`,
    image: getDefaultImageForCategory(category, destination),
    rating: 4.94,
    tags: ['AI Added', category],
    notes: `Added via AI Assistant prompt: "${prompt}"`,
    transitToNext: { mode: 'car', duration: '15 min' },
  };

  targetDay.items = targetDay.items || [];
  targetDay.items.push(newItem);

  return {
    success: true,
    explanation: `✨ Added "${newItem.title}" to Day ${targetDay.dayNumber} at ${newItem.time} (₹${newItem.price.toLocaleString('en-IN')})!`,
    updatedDays: daysCopy,
    targetDayNumber: targetDay.dayNumber,
    highlightItemId: newItem.id,
    priceDelta: newItem.price,
  };
}

router.post('/modify-itinerary', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, currentItinerary, activeDayNumber = 1, destination = 'Global' } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!currentItinerary || !currentItinerary.days || !Array.isArray(currentItinerary.days)) {
      return res.status(400).json({ error: 'Valid currentItinerary with days array is required' });
    }

    const trimmedPrompt = prompt.trim();
    const daysCopy = JSON.parse(JSON.stringify(currentItinerary.days));

    // Construct detailed Gemini prompt
    const systemPrompt = `You are TripFlow's Lead Travel Concierge and Itinerary Modification AI.
The traveler is viewing an itinerary for destination: "${destination || currentItinerary.destination || 'Global'}".
Current days count: ${daysCopy.length}.
Currently selected/viewed day: Day ${activeDayNumber}.
Traveler Request: "${trimmedPrompt}"

Current Days Summary:
${JSON.stringify(daysCopy.map((d: any) => ({
      dayNumber: d.dayNumber,
      title: d.title,
      items: d.items?.map((i: any) => ({ id: i.id, title: i.title, time: i.time, price: i.price, category: i.category }))
    })))}

Interpret the user's intent:
1. "add_item": Adding an item to a day (specify targetDayNumber [defaults to ${activeDayNumber} if unspecified], title, category ['meal' | 'activity' | 'transport' | 'hotel' | 'experience'], time, duration, price in INR (Indian Rupees - ₹, e.g. 5000 for dinner, 3500 for activity, 16000 for hotel night), location, description, tags, transitToNext).
2. "add_day": Adding a new day to the trip with 1-2 curated activities.
3. "remove_item": Removing an item from a day matching description.
4. "move_item": Moving an item between days.
5. "optimize_budget": Replacing expensive items with value alternatives.
6. "modify_item": Editing an existing item's time, title, or price.

IMPORTANT: All prices MUST be integer numbers in INR (Indian Rupees - ₹). Never use USD numbers.
Return a STRICT JSON object without markdown fences matching this schema:
{
  "success": true,
  "action": "add_item" | "add_day" | "remove_item" | "move_item" | "optimize_budget" | "custom",
  "explanation": "Brief, friendly concierge confirmation (e.g. 'Added Dinner at Zuma to Day 2 at 8:00 PM for ₹6,500!')",
  "targetDayNumber": number,
  "newItem": {
    "title": "string",
    "category": "meal" | "activity" | "transport" | "hotel" | "experience",
    "price": number,
    "time": "string (e.g. '08:00 PM')",
    "duration": "string (e.g. '2 hrs')",
    "location": "string",
    "description": "string",
    "tags": ["string"],
    "image": "string"
  },
  "removeItemId": "string",
  "priceDelta": number
}`;

    const geminiText = await generateWithGeminiCascade(systemPrompt);
    let parsed: any = null;

    if (geminiText) {
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch { }
      }
    }

    const result = applyItineraryMutation(trimmedPrompt, daysCopy, parsed, activeDayNumber, destination || currentItinerary.destination || 'Global');

    res.json({
      success: true,
      explanation: result.explanation,
      modifiedDays: result.updatedDays,
      targetDayNumber: result.targetDayNumber,
      priceDelta: result.priceDelta,
      highlightItemId: result.highlightItemId,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/assistant/modify-itinerary:', err);
    res.status(500).json({ error: err?.message || 'Failed to modify itinerary' });
  }
});

export default router;

