import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

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

// ============================================================================
// HELPERS & FALLBACKS
// ============================================================================

interface ClarifyQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single_choice' | 'multi_choice' | 'budget' | 'text';
  options?: Array<{ id: string; label: string; icon?: string; badge?: string; desc?: string }>;
  allowCustomText?: boolean;
  customTextPlaceholder?: string;
  defaultValue?: any;
}

function parseDestinationAndDays(text: string): { destination: string; days: number; travelers: number } {
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

  let destination = 'Turkey';
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
    switzerland: 'Switzerland',
    alps: 'Switzerland',
    france: 'France',
    paris: 'France',
    italy: 'Italy',
    rome: 'Italy',
    amalfi: 'Italy',
    dubai: 'Dubai, UAE',
    uae: 'Dubai, UAE',
    bali: 'Bali, Indonesia',
    thailand: 'Thailand',
    greece: 'Greece',
    santorini: 'Greece',
  };

  for (const [key, val] of Object.entries(destKeywords)) {
    if (lower.includes(key)) {
      destination = val;
      break;
    }
  }

  return { destination, days, travelers };
}

// Fallback questions generator based on destination
function getFallbackQuestions(destination: string, days: number, travelers: number): ClarifyQuestion[] {
  const isTurkey = destination.toLowerCase().includes('turkey');
  const isJapan = destination.toLowerCase().includes('japan');

  const highlightOptions = isTurkey
    ? [
        { id: 'cappadocia_balloon', label: 'Hot Air Balloon in Cappadocia', icon: 'flight_takeoff', badge: 'Signature' },
        { id: 'bosphorus_yacht', label: 'Private Sunset Bosphorus Yacht', icon: 'directions_boat', badge: 'Popular' },
        { id: 'historic_sultanahmet', label: 'Hagia Sophia & Blue Mosque VIP Tour', icon: 'temple_buddhist' },
        { id: 'pamukkale_terraces', label: 'Pamukkale Travertines & Hierapolis', icon: 'landscape' },
        { id: 'culinary_bazaar', label: 'Grand Bazaar & Spice Market Tasting Walk', icon: 'restaurant' },
        { id: 'hamam_spa', label: 'Traditional Sultan Hamam Turkish Bath', icon: 'spa' },
      ]
    : isJapan
    ? [
        { id: 'shibuya_sky', label: 'Tokyo Skyline & Shibuya Hidden Bar Walk', icon: 'nightlife' },
        { id: 'kyoto_temples', label: 'Kyoto Bamboo Forest & Golden Pavilion', icon: 'temple_buddhist', badge: 'Signature' },
        { id: 'hakone_onsen', label: 'Private Mount Fuji Onsen & Ryokan', icon: 'hot_tub' },
        { id: 'omakase_dining', label: 'Ginza Michelin Omakase Experience', icon: 'restaurant', badge: 'Luxury' },
        { id: 'bullet_train', label: 'Shinkansen Gran Class Green Car', icon: 'train' },
      ]
    : [
        { id: 'landmark_tour', label: 'Iconic Historical Landmarks & Hidden Alleys', icon: 'tour' },
        { id: 'private_yacht', label: 'Private Sunset Cruise / Panoramic Tour', icon: 'directions_boat' },
        { id: 'fine_dining', label: 'Curated Gastronomy & Chef Table Dinner', icon: 'restaurant' },
        { id: 'wellness_retreat', label: 'Luxury Wellness & Traditional Spa Day', icon: 'spa' },
        { id: 'art_culture', label: 'Private Guided Art Galleries & Heritage Sites', icon: 'palette' },
      ];

  const baseSmartBudget = Math.round(days * 180 * travelers);
  const basePremiumBudget = Math.round(days * 350 * travelers);
  const baseLuxuryBudget = Math.round(days * 650 * travelers);

  return [
    {
      id: 'travel_party_pace',
      title: 'Who is traveling and what is your travel pace?',
      subtitle: 'This helps us tune the itinerary balance between downtime and exploration.',
      type: 'single_choice',
      defaultValue: travelers === 1 ? 'solo_balanced' : 'couple_relaxed',
      options: [
        { id: 'couple_relaxed', label: 'Couple · Romantic & Relaxed', desc: 'Scenic leisurely mornings, candlelit dinners, stress-free transfers', icon: 'favorite' },
        { id: 'family_balanced', label: 'Family · Balanced & Comfortable', desc: 'Kid-friendly private transport, flexible pace, spacious suites', icon: 'family_restroom' },
        { id: 'friends_active', label: 'Friends / Group · Active & Immersive', desc: 'Exciting nightlife, high-energy tours, adventure activities', icon: 'groups' },
        { id: 'solo_explorer', label: 'Solo Explorer · Cultural Discovery', desc: 'Immersive culinary walks, bespoke private guides, freedom to wander', icon: 'person' },
      ],
    },
    {
      id: 'must_do_highlights',
      title: `What experiences in ${destination} are on your bucket list?`,
      subtitle: 'Select any that appeal to you, or write your own specific places below.',
      type: 'multi_choice',
      options: highlightOptions,
      allowCustomText: true,
      customTextPlaceholder: 'e.g. Cappadocia Cave suite with valley view, authentic pottery workshop...',
      defaultValue: [highlightOptions[0].id, highlightOptions[1].id],
    },
    {
      id: 'budget_tier',
      title: 'What is your target total budget for this journey?',
      subtitle: 'All flights, hotels, and activities will be strictly calibrated to match this budget.',
      type: 'budget',
      defaultValue: {
        currency: 'USD',
        targetAmount: basePremiumBudget,
        selectedTier: 'premium',
      },
      options: [
        {
          id: 'smart_value',
          label: 'Smart Value / Boutique',
          badge: `~$${baseSmartBudget.toLocaleString()} Total`,
          desc: 'High-value 4★ boutique stays, reliable economy flights, essential highlights',
          icon: 'savings',
        },
        {
          id: 'premium_comfort',
          label: 'Premium Comfort (Recommended)',
          badge: `~$${basePremiumBudget.toLocaleString()} Total`,
          desc: '5★ landmark luxury properties, optimal direct flights, private chauffeur',
          icon: 'stars',
        },
        {
          id: 'ultra_luxury',
          label: 'Ultra-Luxury VIP Concierge',
          badge: `~$${baseLuxuryBudget.toLocaleString()}+ Total`,
          desc: 'Iconic Palace / Penthouse suites, Business Class lie-flat suites, private yachts',
          icon: 'diamond',
        },
      ],
      allowCustomText: true,
      customTextPlaceholder: 'Or enter custom amount (e.g. $3,500 total or ₹3,00,000)',
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
        { id: 'JFK', label: 'New York (JFK)', desc: 'John F. Kennedy International' },
        { id: 'LHR', label: 'London (LHR)', desc: 'London Heathrow' },
        { id: 'DXB', label: 'Dubai (DXB)', desc: 'Dubai International' },
      ],
      allowCustomText: true,
      customTextPlaceholder: 'Other city or airport code (e.g. SFO, BLR, SIN)...',
    },
  ];
}

// ============================================================================
// 1. POST /api/v1/assistant/clarify
// ============================================================================
router.post('/clarify', async (req: Request, res: Response) => {
  try {
    const { prompt = '' } = req.body;
    if (!prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { destination, days, travelers } = parseDestinationAndDays(prompt);
    let questions = getFallbackQuestions(destination, days, travelers);

    if (aiClient) {
      try {
        const systemPrompt = `You are the chief concierge director at TripFlow luxury travel.
Analyze this traveler prompt: "${prompt}".
Target Destination: ${destination}, Days: ${days}, Travelers: ${travelers}.
Generate 4-5 interactive, rich questions to tailor their trip.
IMPORTANT: You MUST include a budget question with options and a custom input.
Return a strict JSON object with this shape:
{
  "destination": "${destination}",
  "country": "Country name",
  "days": ${days},
  "travelers": ${travelers},
  "questions": [
    {
      "id": "question_id",
      "title": "Clear friendly question title",
      "subtitle": "Short explanatory subtitle",
      "type": "single_choice" | "multi_choice" | "budget" | "text",
      "defaultValue": "default option id or array",
      "options": [
        { "id": "opt1", "label": "Option label", "desc": "Brief detail", "icon": "material_symbol_name", "badge": "optional badge" }
      ],
      "allowCustomText": true,
      "customTextPlaceholder": "Helpful placeholder"
    }
  ]
}
Output only valid JSON without markdown wrapping.`;

        const geminiRes = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        });

        const rawText = geminiRes.text?.trim() || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            questions = parsed.questions;
          }
        }
      } catch (aiErr: any) {
        console.warn('Gemini clarify failed, using resilient fallback:', aiErr?.message || aiErr);
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
router.post('/generate-proposal', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      destination = 'Turkey',
      days = 7,
      travelers = 2,
      answers = {},
      targetBudgetUSD,
      currency = 'USD',
    } = req.body;

    const budget = Number(targetBudgetUSD) || Math.round(days * 350 * travelers);

    // Call Gemini to generate calibrated flight, hotel, and itinerary options
    if (aiClient) {
      try {
        const systemPrompt = `You are TripFlow's Lead Luxury Concierge AI.
Generate a comprehensive, budget-calibrated travel proposal.
Traveler Prompt: "${prompt}"
Destination: ${destination}
Duration: ${days} Days (${days - 1} Nights)
Travelers: ${travelers}
Target Total Budget: $${budget} USD
User Answer Details: ${JSON.stringify(answers)}

CRITICAL BUDGET INSTRUCTIONS:
1. Provide 3 FLIGHT options:
   - "cheaper": Economy 1-stop or high-value airline. Total price must be ~25-35% BELOW the target flight share of the budget.
   - "recommended": Direct/Optimal non-stop flight with prime times (e.g. Turkish Airlines for Turkey). Fits target budget precisely.
   - "luxury": Business Class lie-flat suite with VIP lounge access. Upgraded premium price.
2. Provide 3 HOTEL options:
   - "cheaper": Highly rated 4★ boutique or authentic heritage stay (e.g. Goreme Cave Hotel). Saves money.
   - "recommended": Iconic 5★ landmark luxury property (e.g. Bosphorus luxury view + Museum Hotel Cave Suite). Matches target budget.
   - "luxury": Palace / Presidential Suite (e.g. Çırağan Palace Kempinski Bosphorus Palace Suite).
3. Provide 3 TRANSFER options:
   - "cheaper": Standard private sedan
   - "recommended": Luxury Mercedes Chauffeur with English-speaking driver
   - "luxury": Executive VIP Mercedes V-Class Maybach
4. Day-by-day preview for ${days} days with authentic activities.
5. Provide 4-6 extra catalog activities relevant to ${destination}.

Return a STRICT JSON object matching this structure (no markdown fences):
{
  "id": "prop-${Date.now()}",
  "title": "Evocative Title (e.g. 7-Day Grand Turkey: Bosphorus Whispers & Cappadocia Balloons)",
  "destination": "${destination}",
  "country": "${destination}",
  "days": ${days},
  "travelers": ${travelers},
  "startDate": "2025-10-15",
  "basePriceUSD": ${budget},
  "heroImage": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
  "summary": "2-3 sentence overview highlighting the journey tailored to user answers.",
  "flights": [
    {
      "id": "fl-cheap-1",
      "airline": "IndiGo / Air Arabia",
      "flightNumber": "6E 1741",
      "origin": "Mumbai",
      "originCode": "BOM",
      "destination": "Istanbul",
      "destCode": "IST",
      "departureTime": "04:30 AM",
      "arrivalTime": "11:15 AM",
      "duration": "8h 45m",
      "cabinClass": "Economy Value",
      "priceUSD": ${Math.round(budget * 0.28)},
      "priceDeltaUSD": -${Math.round(budget * 0.1)},
      "type": "cheaper",
      "label": "Cheapest Option",
      "badge": "Best Value (Saves Money)",
      "baggage": "20 kg checked",
      "stops": "1 Stop (Sharjah)"
    },
    {
      "id": "fl-rec-1",
      "airline": "Turkish Airlines",
      "flightNumber": "TK 721",
      "origin": "Mumbai",
      "originCode": "BOM",
      "destination": "Istanbul",
      "destCode": "IST",
      "departureTime": "06:15 AM",
      "arrivalTime": "10:30 AM",
      "duration": "6h 15m",
      "cabinClass": "Economy Prime (Non-Stop)",
      "priceUSD": ${Math.round(budget * 0.38)},
      "priceDeltaUSD": 0,
      "type": "recommended",
      "label": "Recommended (Direct)",
      "badge": "Best Timing & Non-Stop",
      "baggage": "30 kg checked + meals",
      "stops": "Non-Stop Direct"
    },
    {
      "id": "fl-lux-1",
      "airline": "Turkish Airlines",
      "flightNumber": "TK 721 (Biz)",
      "origin": "Mumbai",
      "originCode": "BOM",
      "destination": "Istanbul",
      "destCode": "IST",
      "departureTime": "06:15 AM",
      "arrivalTime": "10:30 AM",
      "duration": "6h 15m",
      "cabinClass": "Business Class Lie-Flat",
      "priceUSD": ${Math.round(budget * 0.75)},
      "priceDeltaUSD": ${Math.round(budget * 0.37)},
      "type": "luxury",
      "label": "Luxury Business",
      "badge": "Lounge + Fast Track + Lie-Flat",
      "baggage": "40 kg + 2 Cabin",
      "stops": "Non-Stop Direct"
    }
  ],
  "selectedFlightId": "fl-rec-1",
  "hotels": [
    {
      "id": "ht-cheap-1",
      "name": "Hagia Sofia Mansions & Goreme Heritage Cave",
      "roomType": "Deluxe Queen Suite",
      "location": "Sultanahmet & Goreme",
      "pricePerNightUSD": ${Math.round((budget * 0.28) / (days - 1))},
      "priceDeltaPerNightUSD": -${Math.round((budget * 0.12) / (days - 1))},
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "rating": 4.88,
      "reviewsCount": 420,
      "type": "cheaper",
      "label": "Smart Boutique (Budget-Saver)",
      "perks": ["Authentic Cave Experience", "Complimentary Breakfast", "Central Location"]
    },
    {
      "id": "ht-rec-1",
      "name": "Four Seasons Bosphorus + Museum Hotel Cave",
      "roomType": "Bosphorus View Room + Imperial Cave Suite",
      "location": "Besiktas & Uchisar Valley",
      "pricePerNightUSD": ${Math.round((budget * 0.42) / (days - 1))},
      "priceDeltaPerNightUSD": 0,
      "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "rating": 4.97,
      "reviewsCount": 890,
      "type": "recommended",
      "label": "Signature Luxury (Target Match)",
      "perks": ["Waterfront Bosphorus Terrace", "Infinity Cave Pool", "VIP Welcome Amenities", "Breakfast Included"]
    },
    {
      "id": "ht-lux-1",
      "name": "Çırağan Palace Kempinski + Sultan Cave Penthouse",
      "roomType": "Palace Bosphorus Suite + Presidential Cave Villa",
      "location": "Ottoman Imperial Palace, Istanbul",
      "pricePerNightUSD": ${Math.round((budget * 0.85) / (days - 1))},
      "priceDeltaPerNightUSD": ${Math.round((budget * 0.43) / (days - 1))},
      "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "rating": 4.99,
      "reviewsCount": 612,
      "type": "luxury",
      "label": "Ultra-Luxury Palace Heritage",
      "perks": ["Private Butler Service", "Helipad Transfer Available", "Royal Ottoman Breakfast", "Private Heated Pool"]
    }
  ],
  "selectedHotelId": "ht-rec-1",
  "transfers": [
    {
      "id": "tr-cheap",
      "vehicle": "Premium Private Sedan (Volkswagen Passat)",
      "chauffeur": "Verified English-speaking driver",
      "rating": 4.85,
      "priceDeltaUSD": -80,
      "type": "cheaper",
      "label": "Private Sedan",
      "description": "Direct airport pickup and daily touring for 2 passengers with luggage."
    },
    {
      "id": "tr-rec",
      "vehicle": "Mercedes-Benz E-Class Luxury Chauffeur",
      "chauffeur": "Uniformed Concierge Driver",
      "rating": 4.98,
      "priceDeltaUSD": 0,
      "type": "recommended",
      "label": "Mercedes Luxury Chauffeur",
      "description": "Dedicated chauffeur throughout Istanbul & Cappadocia, bottled spring water & WiFi onboard."
    },
    {
      "id": "tr-lux",
      "vehicle": "Mercedes-Benz V-Class VIP Executive Lounge",
      "chauffeur": "Personal Concierge Driver & Host",
      "rating": 5.0,
      "priceDeltaUSD": 260,
      "type": "luxury",
      "label": "VIP Executive Lounge Van",
      "description": "Reclining leather captain chairs, Apple TV, mini-fridge with chilled refreshments, fast airport clearance."
    }
  ],
  "selectedTransferId": "tr-rec",
  "schedulePreview": [
    {
      "dayNumber": 1,
      "title": "Imperial Istanbul Arrival & Sunset Bosphorus Cruise",
      "highlights": ["Private Mercedes airport transfer", "Check-in with welcome champagne", "Private sunset yacht on the Bosphorus Strait"]
    },
    {
      "dayNumber": 2,
      "title": "Byzantine & Ottoman Heritage VIP Access",
      "highlights": ["Skip-the-line VIP entry to Hagia Sophia", "Topkapi Palace Secret Harem tour", "Historic Sultan Hamam bath"]
    },
    {
      "dayNumber": 3,
      "title": "Flight to Cappadocia & Underground Valley Discovery",
      "highlights": ["Short flight to Kayseri/Nevsehir", "Check-in to historic Cave Suite", "Kaymakli Underground City exploration"]
    },
    {
      "dayNumber": 4,
      "title": "Cappadocia Sunrise Hot Air Balloon & Love Valley",
      "highlights": ["Sunrise private basket balloon flight over fairy chimneys", "Champagne toast in the valley", "Private pottery masterclass in Avanos"]
    },
    {
      "dayNumber": 5,
      "title": "Ihlara Canyon Hike & Whirling Dervishes",
      "highlights": ["Scenic nature walk along Melendiz River", "Lunch in floating river gazebo", "Sacred Sema whirling dervish ceremony"]
    }
  ],
  "extraActivities": [
    {
      "id": "act-balloon",
      "title": "Royal Hot Air Balloon Flight over Goreme",
      "category": "experience",
      "price": 280,
      "rating": 4.99,
      "location": "Goreme, Cappadocia",
      "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
      "suggestedDayNumber": 4,
      "isIncluded": true
    },
    {
      "id": "act-yacht",
      "title": "Private 2-Hour Bosphorus Sunset Yacht Cruise",
      "category": "experience",
      "price": 220,
      "rating": 4.95,
      "location": "Bosphorus Strait, Istanbul",
      "image": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
      "suggestedDayNumber": 1,
      "isIncluded": true
    },
    {
      "id": "act-hamam",
      "title": "Historical Hurrem Sultan Hamam VIP Ritual",
      "category": "activity",
      "price": 140,
      "rating": 4.92,
      "location": "Sultanahmet, Istanbul",
      "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      "suggestedDayNumber": 2,
      "isIncluded": false
    },
    {
      "id": "act-foodtour",
      "title": "Two Continents Culinary Tasting Walk (Europe to Asia)",
      "category": "meal",
      "price": 95,
      "rating": 4.89,
      "location": "Kadikoy & Karakoy, Istanbul",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "suggestedDayNumber": 3,
      "isIncluded": false
    }
  ]
}`;

        const geminiRes = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        });

        const rawText = geminiRes.text?.trim() || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const proposal = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, proposal });
        }
      } catch (aiErr: any) {
        console.warn('Gemini generate-proposal failed, falling back to local generator:', aiErr?.message || aiErr);
      }
    }

    // Default fallback proposal
    res.json({
      success: true,
      proposal: {
        id: `prop-${Date.now()}`,
        title: `${days}-Day ${destination} Curated Luxury Odyssey`,
        destination,
        country: destination,
        days,
        travelers,
        startDate: '2025-10-15',
        basePriceUSD: budget,
        heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
        summary: `A bespoke ${days}-day itinerary through ${destination} crafted to match your target budget of $${budget.toLocaleString()}. Featuring calibrated flight routes, 5-star landmark stays, and private transfers.`,
        flights: [
          {
            id: 'fl-cheap-1',
            airline: 'Value Carrier / 1-Stop',
            flightNumber: 'FL-714',
            origin: 'Origin City',
            originCode: 'BOM',
            destination,
            destCode: 'DEST',
            departureTime: '04:30 AM',
            arrivalTime: '11:15 AM',
            duration: '8h 45m',
            cabinClass: 'Economy Value',
            priceUSD: Math.round(budget * 0.28),
            priceDeltaUSD: -Math.round(budget * 0.1),
            type: 'cheaper',
            label: 'Cheapest Option',
            badge: 'Budget Saver',
            baggage: '20 kg checked',
            stops: '1 Stop',
          },
          {
            id: 'fl-rec-1',
            airline: 'National Carrier (Non-Stop)',
            flightNumber: 'TK-721',
            origin: 'Origin City',
            originCode: 'BOM',
            destination,
            destCode: 'DEST',
            departureTime: '06:15 AM',
            arrivalTime: '10:30 AM',
            duration: '6h 15m',
            cabinClass: 'Prime Economy (Direct)',
            priceUSD: Math.round(budget * 0.38),
            priceDeltaUSD: 0,
            type: 'recommended',
            label: 'Recommended (Direct)',
            badge: 'Target Budget Match',
            baggage: '30 kg checked + meals',
            stops: 'Non-Stop Direct',
          },
          {
            id: 'fl-lux-1',
            airline: 'National Carrier Business',
            flightNumber: 'TK-721-BIZ',
            origin: 'Origin City',
            originCode: 'BOM',
            destination,
            destCode: 'DEST',
            departureTime: '06:15 AM',
            arrivalTime: '10:30 AM',
            duration: '6h 15m',
            cabinClass: 'Business Class Lie-Flat',
            priceUSD: Math.round(budget * 0.75),
            priceDeltaUSD: Math.round(budget * 0.37),
            type: 'luxury',
            label: 'Luxury Business',
            badge: 'Lounge + Lie-Flat',
            baggage: '40 kg + 2 Cabin',
            stops: 'Non-Stop Direct',
          },
        ],
        selectedFlightId: 'fl-rec-1',
        hotels: [
          {
            id: 'ht-cheap-1',
            name: `${destination} Central Heritage Boutique`,
            roomType: 'Deluxe Suite with Breakfast',
            location: 'Central Prime District',
            pricePerNightUSD: Math.round((budget * 0.28) / (days - 1)),
            priceDeltaPerNightUSD: -Math.round((budget * 0.12) / (days - 1)),
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            rating: 4.86,
            reviewsCount: 310,
            type: 'cheaper',
            label: 'Smart Boutique (Budget Saver)',
            perks: ['Central Prime Location', 'Daily Artisan Breakfast', 'Free High-Speed WiFi'],
          },
          {
            id: 'ht-rec-1',
            name: `${destination} 5-Star Landmark Luxury Resort`,
            roomType: 'Signature Panoramic Suite',
            location: 'Scenic Waterfront / Historic Quarter',
            pricePerNightUSD: Math.round((budget * 0.42) / (days - 1)),
            priceDeltaPerNightUSD: 0,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            rating: 4.97,
            reviewsCount: 840,
            type: 'recommended',
            label: 'Signature Luxury (Target Match)',
            perks: ['Panoramic View Balcony', 'Infinity Pool & Spa Access', 'VIP Welcome Refreshments', 'Full Breakfast'],
          },
          {
            id: 'ht-lux-1',
            name: `${destination} Imperial Palace Heritage Hotel`,
            roomType: 'Presidential Royal Suite',
            location: 'Exclusive Heritage Reserve',
            pricePerNightUSD: Math.round((budget * 0.85) / (days - 1)),
            priceDeltaPerNightUSD: Math.round((budget * 0.43) / (days - 1)),
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            rating: 4.99,
            reviewsCount: 520,
            type: 'luxury',
            label: 'Ultra-Luxury Palace Heritage',
            perks: ['24/7 Private Butler', 'Private Heated Plunge Pool', 'VIP Airport Fast-Track Transfer'],
          },
        ],
        selectedHotelId: 'ht-rec-1',
        transfers: [
          {
            id: 'tr-cheap',
            vehicle: 'Private Sedan (Executive Clean)',
            chauffeur: 'Professional Local Driver',
            rating: 4.84,
            priceDeltaUSD: -70,
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
            priceDeltaUSD: 240,
            type: 'luxury',
            label: 'VIP Executive Lounge',
            description: 'Leather captain recliner seats, premium sound system, cold refreshments bar.',
          },
        ],
        selectedTransferId: 'tr-rec',
        schedulePreview: [
          {
            dayNumber: 1,
            title: `Arrival in ${destination} & Private VIP Welcome`,
            highlights: ['Chauffeur airport meet & greet', 'Check-in & welcome cocktails', 'Scenic evening panorama dinner'],
          },
          {
            dayNumber: 2,
            title: 'Historic Quarter & Cultural Heritage Tour',
            highlights: ['Private guided walking tour', 'VIP access to iconic monuments', 'Traditional culinary tasting'],
          },
          {
            dayNumber: 3,
            title: 'Scenic Landscapes & Local Artisan Workshops',
            highlights: ['Panoramic view drive', 'Private artisan workshop visit', 'Sunset cocktail vantage point'],
          },
          {
            dayNumber: 4,
            title: 'Signature Experience & Nature Exploration',
            highlights: ['Sunrise signature adventure', 'Valley / Waterfront leisure', 'Chef tasting table dinner'],
          },
          {
            dayNumber: 5,
            title: 'Leisure Morning & Departure Chauffeur',
            highlights: ['Relaxed breakfast', 'Last-minute boutique shopping', 'Private transfer to airport'],
          },
        ],
        extraActivities: [
          {
            id: 'act-sig-1',
            title: `${destination} Signature Private Sunset Cruise`,
            category: 'experience',
            price: 210,
            rating: 4.98,
            location: `${destination} Waterfront`,
            image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
            suggestedDayNumber: 1,
            isIncluded: true,
          },
          {
            id: 'act-sig-2',
            title: `${destination} VIP Heritage & Hidden Alleys Tour`,
            category: 'activity',
            price: 130,
            rating: 4.93,
            location: `${destination} Old Town`,
            image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
            suggestedDayNumber: 2,
            isIncluded: true,
          },
          {
            id: 'act-sig-3',
            title: `${destination} Michelin Star Chef Table Tasting`,
            category: 'meal',
            price: 180,
            rating: 4.96,
            location: `${destination} Fine Dining District`,
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            suggestedDayNumber: 3,
            isIncluded: false,
          },
        ],
      },
    });
  } catch (err: any) {
    console.error('Error in /api/v1/assistant/generate-proposal:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate proposal' });
  }
});

export default router;
