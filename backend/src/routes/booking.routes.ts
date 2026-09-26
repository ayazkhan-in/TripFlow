import { Router, Response } from 'express';
import { prisma } from '../config/db.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/bookings/my-trips - List user booked trips
router.get('/my-trips', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Require an authenticated user — don't fall back to demo account
    const userId = req.user?.id;
    if (!userId) {
      // Return empty trips for unauthenticated/new users instead of Sarah's demo data
      return res.json({ success: true, count: 0, trips: [] });
    }

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
    // Require auth for checkout — don't assign bookings to the demo account
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to book a trip' });
    }
    const {
      itinerary,
      totalPrice = 2450,
      paymentMethod = 'Amex Concierge Card ending in ••8842',
      paymentDetails,
    } = req.body;

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

    // Fetch user details for real personalization of booking and vault docs
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    const travelerName = currentUser?.name || req.user?.name || 'Traveler';

    // 2. Synthesize Logistics Details dynamically based on Destination & Itinerary
    const dest = itinerary.destination || 'Kerala';
    const firstCity = itinerary.routeStops?.[0]?.city || dest;
    const destCode = dest.substring(0, 3).toUpperCase();
    const flightNumber = `AI-${Math.floor(200 + Math.random() * 700)}`;
    const pnr = `${destCode}${Math.floor(100 + Math.random() * 900)}`;

    const flightDetails = {
      airline: 'Air India',
      flightNumber,
      pnr,
      route: `BOM ➔ ${destCode}`,
      departureTime: '11:30 AM',
      arrivalTime: '01:30 PM',
      terminal: 'Terminal 2',
      gate: `Gate ${Math.floor(10 + Math.random() * 40)}B`,
      seat: '14A & 14B (Premium Economy)',
      baggage: '2 x 30kg Priority Tagged',
      status: 'Confirmed',
    };

    // Extract hotel from itinerary if present, otherwise default to destination luxury resort
    const hotelItem = itinerary.days?.flatMap((d: any) => d.items || []).find((it: any) => it.category === 'hotel');
    const hotelName = hotelItem?.title || itinerary.routeStops?.[0]?.hotelName || `${dest} Palace & Heritage Resort`;
    const hotelCheckIn = {
      hotelName,
      roomType: 'Sea / Mountain Facing Heritage Suite',
      checkInDate: itinerary.dates?.split('–')[0]?.trim() || 'Day 1 of Circuit',
      checkInTime: '02:00 PM',
      checkOutDate: itinerary.dates?.split('–')[1]?.trim() || 'Circuit Departure',
      voucherRef: `VCHR-${destCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `1/498, Prime Boulevard, ${firstCity}`,
      inclusions: ['Breakfast Buffet', 'High Tea', 'Sunset Harbour Cruise', 'Complimentary WiFi'],
      nights: itinerary.days?.length ? Math.max(1, itinerary.days.length - 1) : 3,
    };

    const chauffeurNames = ['Arun V.', 'Rajesh K.', 'Sandeep M.', 'Deepak N.'];
    const chauffeurName = chauffeurNames[Math.floor(Math.random() * chauffeurNames.length)];
    const plateLetters = ['KL', 'DL', 'MH', 'KA', 'RJ'][Math.floor(Math.random() * 5)];
    const carDetails = {
      vehicleType: 'Executive MPV',
      vehicleModel: 'Toyota Innova Crysta (Dual AC)',
      licensePlate: `${plateLetters}-07-CD-${Math.floor(1000 + Math.random() * 9000)}`,
      chauffeurName,
      chauffeurPhone: '+91 98470 12345',
      chauffeurRating: '4.98 ★ (420+ tours)',
      pickupLocation: `${firstCity} Airport (Arrival Gate 4)`,
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
        title: itinerary.title || `${dest} Luxury Circuit`,
        destination: dest,
        dates: itinerary.dates || `${itinerary.days?.length || 5} Days · Personalized Circuit`,
        duration: `${itinerary.days?.length || 5} Days`,
        travelers: Number(itinerary.travelers || 2),
        totalPrice: Number(totalPrice),
        currency: 'USD',
        status: 'CONFIRMED',
        heroImageUrl:
          itinerary.heroImage ||
          itinerary.heroImageUrl ||
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        flightDetails,
        hotelCheckIn,
        carDetails,
        transactions: {
          create: {
            transactionRef: paymentDetails?.transactionRef || `TXN-${Date.now()}`,
            party:
              paymentDetails?.type === 'group_split'
                ? 'Group Split Escrow · TripFlow'
                : paymentDetails?.type === 'installments'
                ? 'Installment Flex Pay · TripFlow'
                : 'Stripe / Amex Concierge Checkout',
            type: 'inbound',
            amount: Number(paymentDetails?.amountPaid || totalPrice),
            currency: 'USD',
            status: 'SETTLED',
            paymentMethod: paymentMethod || 'Amex Concierge Card',
            description: `Payment confirmed for ${itinerary.title} (${paymentDetails?.type || 'full'})`,
          },
        },
        vaultDocuments: {
          create: [
            {
              userId,
              category: 'flight',
              title: `${flightDetails.airline} ${flightDetails.flightNumber} E-Ticket`,
              travelerName,
              documentNumber: flightDetails.pnr,
              issueDate: 'Today',
              expiryDate: 'Valid for Travel',
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
              filePublicId: `flight_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '1.4 MB',
              notes: `${flightDetails.airline} non-stop flight confirmed. Priority boarding tags for ${travelerName}.`,
            },
            {
              userId,
              category: 'hotel',
              title: `${hotelCheckIn.hotelName} Luxury Stay Voucher`,
              travelerName,
              documentNumber: hotelCheckIn.voucherRef,
              issueDate: 'Today',
              expiryDate: hotelCheckIn.checkOutDate,
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
              filePublicId: `hotel_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '2.1 MB',
              notes: `Luxury suite reserved with high tea and gourmet breakfast included for ${travelerName}.`,
            },
            {
              userId,
              category: 'transit',
              title: `Dedicated Chauffeur Manifest — ${carDetails.chauffeurName}`,
              travelerName,
              documentNumber: carDetails.licensePlate,
              issueDate: 'Today',
              status: 'confirmed',
              fileUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
              filePublicId: `chauffeur_${Date.now()}`,
              fileType: 'pdf',
              fileSize: '890 KB',
              notes: `Chauffeur ${carDetails.chauffeurName} on standby with executive MPV on arrival for ${travelerName}.`,
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
      bookedTrip: {
        ...bookedTrip,
        paymentDetails: paymentDetails || undefined,
      },
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
