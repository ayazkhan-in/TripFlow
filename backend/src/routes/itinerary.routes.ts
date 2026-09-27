import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/catalog/items - Activities catalog
router.get(['/catalog/items', '/items'], async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = { isActive: true };
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category;
    }

    const items = await prisma.catalogItem.findMany({
      where,
      orderBy: { rating: 'desc' },
    });

    res.json({ success: true, count: items.length, items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/itineraries/:id - Get itinerary by ID
router.get(['/itineraries/:id', '/:id'], async (req: Request, res: Response) => {
  try {
    const itinerary = await prisma.tripItinerary.findUnique({
      where: { id: req.params.id },
      include: {
        routeStops: { orderBy: { stopOrder: 'asc' } },
        days: {
          orderBy: { dayNumber: 'asc' },
          include: { items: true },
        },
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json({ success: true, itinerary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/itineraries - Save new itinerary
router.post(['/itineraries', '/'], optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to save an itinerary' });
    }
    const {
      title,
      destination,
      country = 'Global',
      dates,
      startDate = new Date(),
      travelers = 2,
      totalPrice = 195000,
      currency = 'INR',
      heroImageUrl,
      routeStops = [],
      days = [],
    } = req.body;

    const created = await prisma.tripItinerary.create({
      data: {
        userId,
        title,
        destination,
        country,
        dates: dates || `${days.length} Days · Personalized Circuit`,
        startDate: new Date(startDate),
        travelers: Number(travelers),
        totalPrice: Number(totalPrice),
        currency,
        heroImageUrl,
        routeStops: {
          create: routeStops.map((stop: any, idx: number) => ({
            stopOrder: idx + 1,
            city: stop.city || stop,
            weatherInfo: stop.weather,
            hotelName: stop.hotel,
            transitMode: stop.transitMode || 'car',
          })),
        },
        days: {
          create: days.map((day: any, dIdx: number) => ({
            dayNumber: day.dayNumber || dIdx + 1,
            dateStr: day.date || `Day ${dIdx + 1}`,
            title: day.title || `Day ${dIdx + 1}`,
            subtitle: day.subtitle,
            items: {
              create: (day.items || []).map((item: any) => ({
                title: item.title,
                category: ['activity', 'hotel', 'transport', 'meal', 'experience'].includes(item.category)
                  ? item.category
                  : item.category === 'dining'
                  ? 'meal'
                  : item.category === 'transit'
                  ? 'transport'
                  : 'activity',
                price: Number(item.price || 0),
                timeSlot: item.time || '10:00 AM',
                duration: item.duration,
                location: item.location || destination,
                description: item.description || '',
                imageUrl: item.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
                rating: item.rating ? Number(item.rating) : 4.9,
                tags: item.tags || [],
                notes: item.notes,
                transitToNext: item.transitToNext || undefined,
              })),
            },
          })),
        },
      },
      include: {
        routeStops: true,
        days: { include: { items: true } },
      },
    });

    res.status(201).json({ success: true, itinerary: created });
  } catch (err: any) {
    console.error('Error creating itinerary:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/itineraries/:id/recalculate - Calculate dynamic pricing
router.post(['/itineraries/:id/recalculate', '/:id/recalculate'], async (req: Request, res: Response) => {
  try {
    const { items = [], travelers = 2 } = req.body;
    let subtotal = 0;
    const byCategory: Record<string, number> = {
      hotel: 0,
      transport: 0,
      activity: 0,
      meal: 0,
      experience: 0,
    };

    for (const item of items) {
      const price = Number(item.price) || 0;
      subtotal += price;
      const cat = item.category || 'activity';
      byCategory[cat] = (byCategory[cat] || 0) + price;
    }

    const taxesAndFees = Math.round(subtotal * 0.08);
    const conciergeFee = 150;
    const total = subtotal + taxesAndFees + conciergeFee;
    const perPerson = Math.round(total / Math.max(1, Number(travelers)));

    res.json({
      success: true,
      pricing: {
        subtotal,
        taxesAndFees,
        conciergeFee,
        total,
        perPerson,
        currency: 'INR',
        byCategory,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
