import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '../config/db.js';

const router = Router();
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'tripflow-backend',
      },
    },
  });
}

// GET /api/v1/discover/premade - Get all premade circuits
router.get('/premade', async (_req: Request, res: Response) => {
  try {
    const premadeTrips = await prisma.tripItinerary.findMany({
      where: { isPremade: true },
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' } },
        days: {
          orderBy: { dayNumber: 'asc' },
          include: { items: true },
        },
      },
    });

    res.json({ success: true, count: premadeTrips.length, trips: premadeTrips });
  } catch (err: any) {
    console.error('Error fetching premade trips:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch premade trips' });
  }
});

// GET /api/v1/discover/saved-journeys - Get user saved journeys
router.get('/saved-journeys', async (_req: Request, res: Response) => {
  try {
    const journeys = await prisma.savedJourney.findMany();
    res.json({ success: true, count: journeys.length, journeys });
  } catch (err: any) {
    console.error('Error fetching saved journeys:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch saved journeys' });
  }
});

// POST /api/v1/discover/ai-generate - Generate custom living itinerary using Gemini
router.post('/ai-generate', async (req: Request, res: Response) => {
  try {
    const {
      destination,
      subLocations,
      days = 5,
      startDate = '2025-10-14',
      travelers = 2,
      budget = 3500,
      travelStyle = 'Luxury Concierge',
      interests = ['Heritage', 'Local Dining', 'Private Chauffeur'],
    } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    if (aiClient) {
      try {
        const prompt = `You are the lead travel concierge director at TripFlow luxury travel platform.
Create a rich, verified ${days}-day luxury travel itinerary for:
- Destination: ${destination} (${subLocations || ''})
- Style: ${travelStyle}
- Budget per person: $${budget} USD
- Group size: ${travelers} travelers
- Interests: ${interests.join(', ')}

Return a strict, valid JSON object without markdown fences, matching this structure:
{
  "title": "Evocative Title (e.g. Kerala Monsoon Whispers & Backwaters)",
  "destination": "${destination}",
  "country": "Country name",
  "dates": "${days} Days · Personalized Circuit",
  "startDate": "${startDate}",
  "travelers": ${travelers},
  "currency": "USD",
  "totalPrice": ${budget},
  "heroImage": "High quality Unsplash image URL relevant to destination",
  "routeStops": [
    { "city": "City 1", "weather": "26°C Sunny", "hotel": "5-Star Hotel Name", "transitMode": "flight" }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1",
      "title": "Day title",
      "subtitle": "Short bullet summary",
      "items": [
        {
          "title": "Activity or Transfer Name",
          "category": "transport" | "hotel" | "activity" | "meal",
          "price": 120,
          "time": "10:00 AM",
          "duration": "2 hrs",
          "location": "Location name",
          "description": "Detailed description",
          "image": "Unsplash URL",
          "rating": 4.9,
          "tags": ["Tag1", "Tag2"],
          "transitToNext": { "mode": "car", "duration": "30 min" }
        }
      ]
    }
  ]
}`;

        const geminiRes = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const rawText = geminiRes.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const generatedPlan = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, aiGenerated: true, itinerary: generatedPlan });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to heuristic builder:', geminiErr);
      }
    }

    // Heuristic Fallback Itinerary
    const fallbackItinerary = {
      title: `${destination} Luxury Concierge Circuit`,
      destination,
      country: 'Global Destination',
      dates: `${days} Days · Personalized Circuit`,
      startDate,
      travelers,
      currency: 'USD',
      totalPrice: budget,
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      routeStops: [
        { city: destination, weather: '25°C Ideal', hotel: 'The Grand Heritage', transitMode: 'flight' },
      ],
      days: Array.from({ length: days }, (_, i) => ({
        dayNumber: i + 1,
        date: `Day ${i + 1}`,
        title: i === 0 ? `Arrival in ${destination} & Private Check-in` : `Exploring ${destination} Highlights`,
        subtitle: 'Executive Chauffeur • Curated Concierge Experiences',
        items: [
          {
            title: i === 0 ? 'Private Airport Chauffeur Meet & Greet' : 'Curated Guided Heritage Walk',
            category: i === 0 ? 'transport' : 'activity',
            price: Math.round(budget * 0.1),
            time: '10:00 AM',
            duration: '2.5 hrs',
            location: destination,
            description: `Exclusive VIP access and private transfer service in ${destination}.`,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
            rating: 4.95,
            tags: ['Private', 'VIP'],
          },
        ],
      })),
    };

    res.json({ success: true, fallback: true, itinerary: fallbackItinerary });
  } catch (err: any) {
    console.error('Error generating AI itinerary:', err);
    res.status(500).json({ error: err.message || 'Itinerary generation failed' });
  }
});

export default router;
