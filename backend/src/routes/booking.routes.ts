import { Router, Response } from 'express';
import { prisma } from '../config/db.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/bookings/my-trips - List user booked trips
router.get('/my-trips', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-sarah-1024';

    const bookedTrips = await prisma.bookedTrip.findMany({
      where: { userId },
      orderBy: { bookedAt: 'desc' },
      include: {
        itinerary: {
          include: {
            routeStops: { orderBy: { stopOrder: 'asc' } },
            days: {
              orderBy: { dayNumber: 'asc' },
              include: { items: true },
            },
          },
        },
      },
    });

    res.json({ success: true, count: bookedTrips.length, trips: bookedTrips });
  } catch (err: any) {
    console.error('Error fetching booked trips:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/bookings/:id - Single booked trip
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const trip = await prisma.bookedTrip.findUnique({
      where: { id: req.params.id },
      include: {
        itinerary: {
          include: {
            routeStops: true,
            days: { include: { items: true } },
          },
        },
        vaultDocuments: true,
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Booked trip not found' });
    }

    res.json({ success: true, trip });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/bookings/checkout - Convert itinerary to booked trip
router.post('/checkout', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'user-sarah-1024';
    const { itinerary, totalPrice = 2450, paymentMethod = 'Amex Concierge Card ending in ••8842' } = req.body;

    if (!itinerary) {
      return res.status(400).json({ error: 'Itinerary payload is required' });
    }

    const bookingRef = `TF-${(itinerary.destination || 'TRIP').substring(0, 3).toUpperCase()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    // 1. Ensure or save a dedicated TripItinerary record for this booking
    let itineraryId = itinerary.id;
    const existing = itineraryId
      ? await prisma.tripItinerary.findUnique({
          where: { id: itineraryId },
          include: { bookedTrip: true },
        })
      : null;

    if (!existing || existing.bookedTrip || existing.isPremade) {
      const savedItinerary = await prisma.tripItinerary.create({
        data: {
          userId,
          title: itinerary.title || 'Personalized Luxury Circuit',
          destination: itinerary.destination || 'Kerala',
          country: itinerary.country || 'India',
          dates: itinerary.dates || `${itinerary.days?.length || 5} Days · Personalized Circuit`,
          startDate: new Date(itinerary.startDate || Date.now()),
          travelers: Number(itinerary.travelers || 2),
          totalPrice: Number(totalPrice),
          isPremade: false,
          heroImageUrl:
            itinerary.heroImageUrl ||
            itinerary.heroImage ||
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          routeStops: {
            create: (itinerary.routeStops || []).map((s: any, idx: number) => ({
              stopOrder: s.stopOrder || idx + 1,
              city: s.city || s,
              weatherInfo: s.weatherInfo || s.weather,
              hotelName: s.hotelName || s.hotel,
              transitMode: s.transitMode || 'car',
            })),
          },
          days: {
            create: (itinerary.days || []).map((d: any, dIdx: number) => ({
              dayNumber: d.dayNumber || dIdx + 1,
              dateStr: d.dateStr || d.date || `Day ${dIdx + 1}`,
              title: d.title || `Day ${dIdx + 1}`,
              subtitle: d.subtitle,
              items: {
                create: (d.items || []).map((item: any) => ({
                  title: item.title,
                  category: ['activity', 'dining', 'hotel', 'transit', 'wellness'].includes(item.category)
                    ? item.category
                    : 'activity',
                  price: Number(item.price || 0),
                  timeSlot: item.timeSlot || item.time || '10:00 AM',
                  duration: item.duration,
                  location: item.location || itinerary.destination || 'Destination',
                  description: item.description || '',
                  imageUrl:
                    item.imageUrl ||
                    item.image ||
                    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
                  rating: item.rating ? Number(item.rating) : 4.9,
                  tags: Array.isArray(item.tags) ? item.tags : [],
                })),
              },
            })),
          },
        },
      });
      itineraryId = savedItinerary.id;
    }

    // 2. Synthesize Logistics Bento Details
    const flightDetails = {
      airline: 'Air India',
      flightNumber: 'AI-682',
      pnr: `KOK${Math.floor(100 + Math.random() * 900)}`,
      route: 'BOM ➔ COK',
      departureTime: '11:30 AM',
      arrivalTime: '01:30 PM',
      terminal: 'Terminal 2',
      gate: 'Gate 42B',
      seat: '14A & 14B (Premium Economy)',
      baggage: '2 x 30kg Priority Tagged',
      status: 'Confirmed',
    };

    const hotelCheckIn = {
      hotelName: 'Brunton Boatyard — CGH Earth',
      roomType: 'Sea Facing Heritage Suite',
      checkInDate: 'Oct 14, 2025',
      checkInTime: '02:00 PM',
      checkOutDate: 'Oct 17, 2025',
      voucherRef: `VCHR-BB-${Math.floor(1000 + Math.random() * 9000)}`,
      address: '1/498, Calvathy Road, Fort Kochi, Kerala 682001',
      inclusions: ['Breakfast Buffet', 'High Tea', 'Sunset Harbour Cruise', 'Complimentary WiFi'],
      nights: 3,
    };

    const carDetails = {
      vehicleType: 'Executive MPV',
      vehicleModel: 'Toyota Innova Crysta (Dual AC)',
      licensePlate: 'KL-07-CD-4092',
      chauffeurName: 'Arun V.',
      chauffeurPhone: '+91 98470 12345',
      chauffeurRating: '4.98 ★ (420+ tours)',
      pickupLocation: 'Cochin International Airport T3 (Arrival Gate 4)',
      pickupTime: '01:45 PM',
      serviceScope: 'Dedicated 24/7 on standby for entirety of circuit',
      gpsTrackingActive: true,
    };

    // 3. Create BookedTrip in Neon DB
    const bookedTrip = await prisma.bookedTrip.create({
      data: {
        itineraryId,
        userId,
        bookingRef,
        title: itinerary.title || 'Personalized Luxury Circuit',
        destination: itinerary.destination || 'Kerala',
        dates: itinerary.dates || '5 Days · Personalized Circuit',
        duration: `${itinerary.days?.length || 5} Days`,
        travelers: Number(itinerary.travelers || 2),
        totalPrice: Number(totalPrice),
        currency: 'USD',
        status: 'CONFIRMED',
        heroImageUrl:
          itinerary.heroImage ||
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        flightDetails,
        hotelCheckIn,
        carDetails,
        transactions: {
          create: {
            transactionRef: `TXN-${Date.now()}`,
            party: 'Stripe / Amex Concierge Checkout',
            type: 'inbound',
            amount: Number(totalPrice),
            currency: 'USD',
            status: 'SETTLED',
            paymentMethod,
            description: `Payment confirmed for ${itinerary.title}`,
          },
        },
        vaultDocuments: {
          create: [
            {
              userId,
              category: 'flight',
              title: `${flightDetails.airline} ${flightDetails.flightNumber} E-Ticket`,
              travelerName: 'Sarah Mehta',
              documentNumber: flightDetails.pnr,
              issueDate: 'Today',
              expiryDate: 'Oct 14, 2025',
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
              filePublicId: `flight_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '1.4 MB',
              notes: 'Air India non-stop flight confirmed. Priority boarding tags.',
            },
            {
              userId,
              category: 'hotel',
              title: `${hotelCheckIn.hotelName} Luxury Stay Voucher`,
              travelerName: 'Sarah Mehta',
              documentNumber: hotelCheckIn.voucherRef,
              issueDate: 'Today',
              expiryDate: hotelCheckIn.checkOutDate,
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
              filePublicId: `hotel_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '2.1 MB',
              notes: 'Sea Facing Heritage Suite reserved with high tea and breakfast included.',
            },
            {
              userId,
              category: 'transit',
              title: `Dedicated Chauffeur Manifest — ${carDetails.chauffeurName}`,
              travelerName: 'Sarah Mehta',
              documentNumber: carDetails.licensePlate,
              issueDate: 'Today',
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
              filePublicId: `chauffeur_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '890 KB',
              notes: 'Chauffeur on standby with chilled tender coconuts on arrival.',
            },
          ],
        },
      },
      include: {
        itinerary: {
          include: { routeStops: true, days: { include: { items: true } } },
        },
        vaultDocuments: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed and documents synchronized to Travel Vault!',
      bookedTrip,
    });
  } catch (err: any) {
    console.error('Error during booking checkout:', err);
    res.status(500).json({ error: err.message || 'Checkout failed' });
  }
});

// POST /api/v1/bookings/:id/modify - Modify trip in builder with price delta
router.post('/:id/modify', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { updatedItinerary, newTotalPrice } = req.body;
    const bookedTripId = req.params.id;

    const existingTrip = await prisma.bookedTrip.findUnique({
      where: { id: bookedTripId },
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Booked trip not found' });
    }

    const originalPrice = Number(existingTrip.totalPrice);
    const newPrice = Number(newTotalPrice || originalPrice);
    const priceDelta = newPrice - originalPrice;

    // Update BookedTrip and Itinerary
    const updated = await prisma.bookedTrip.update({
      where: { id: bookedTripId },
      data: {
        totalPrice: newPrice,
        title: updatedItinerary?.title || existingTrip.title,
        dates: `${updatedItinerary?.days?.length || 5} Days · Personalized Circuit`,
        itinerary: {
          update: {
            title: updatedItinerary?.title || existingTrip.title,
            totalPrice: newPrice,
          },
        },
      },
      include: {
        itinerary: {
          include: { routeStops: true, days: { include: { items: true } } },
        },
        vaultDocuments: true,
      },
    });

    res.json({
      success: true,
      bookingRef: existingTrip.bookingRef,
      priceDelta,
      action: priceDelta > 0 ? 'ADDITIONAL_CHARGE_SUCCESSFUL' : priceDelta < 0 ? 'REFUND_PROCESSED' : 'NO_PRICE_CHANGE',
      newTotal: newPrice,
      updatedBookedTrip: updated,
    });
  } catch (err: any) {
    console.error('Error modifying trip:', err);
    res.status(500).json({ error: err.message || 'Trip modification failed' });
  }
});

export default router;
