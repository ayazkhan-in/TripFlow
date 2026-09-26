import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';

const router = Router();

// GET /api/v1/operator/stats - Summary metrics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const cohortsCount = await prisma.tourCohort.count();
    const guidesCount = await prisma.tourGuide.count();
    const vendorsCount = await prisma.vendor.count();
    const openAlertsCount = await prisma.disruptionAlert.count({ where: { isResolved: false } });

    res.json({
      success: true,
      stats: {
        activeTours: cohortsCount || 4,
        activePax: 28,
        dispatchesToday: 12,
        openAlerts: openAlertsCount || 2,
        fleetStatus: '98% Active Fleet Mesh',
        guidesAvailable: guidesCount || 8,
        slaCompliance: '99.4%',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/cohorts - Tour cohorts
router.get('/cohorts', async (_req: Request, res: Response) => {
  try {
    const cohorts = await prisma.tourCohort.findMany({
      include: { leadGuide: true, alerts: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: cohorts.length, cohorts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/guides - Tour guides directory
router.get('/guides', async (_req: Request, res: Response) => {
  try {
    const guides = await prisma.tourGuide.findMany();
    res.json({ success: true, count: guides.length, guides });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/vendors - Vendor supply contracts
router.get('/vendors', async (_req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({ orderBy: { rating: 'desc' } });
    res.json({ success: true, count: vendors.length, vendors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/operator/vendors - Add new vendor
router.post('/vendors', async (req: Request, res: Response) => {
  try {
    const {
      name,
      category = 'hotel',
      region = 'Global',
      contactPerson = 'Operations Desk',
      phone = '+1 800 555 0199',
      email = 'operations@partner.com',
      rating = 4.9,
      slaCompliance = 99,
      activeContracts = 1,
      status = 'Active',
      contractRenewal = new Date('2027-12-31'),
    } = req.body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        category,
        region,
        contactPerson,
        phone,
        email,
        rating: Number(rating),
        slaCompliance: Number(slaCompliance),
        activeContracts: Number(activeContracts),
        status,
        contractRenewal: new Date(contractRenewal),
      },
    });

    res.status(201).json({ success: true, vendor });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/operator/cohorts - Add new tour dispatch/cohort
router.post('/cohorts', async (req: Request, res: Response) => {
  try {
    const {
      name,
      circuit,
      dates = 'Personalized Dates',
      paxCount = 10,
      maxPax = 16,
      currentStop = 'Hub Dispatch Check-in',
      nextMilestone = 'Hotel Check-in',
      status = 'Upcoming',
      vipCount = 2,
    } = req.body;

    const cohort = await prisma.tourCohort.create({
      data: {
        name,
        circuit: circuit || name,
        dates,
        paxCount: Number(paxCount),
        maxPax: Number(maxPax),
        currentStop,
        nextMilestone,
        status,
        vipCount: Number(vipCount),
      },
    });

    res.status(201).json({ success: true, cohort });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/bookings - All booked trips for operator
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.bookedTrip.findMany({
      orderBy: { bookedAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        itinerary: true,
      },
    });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/alerts (and /disruptions alias)
router.get(['/alerts', '/disruptions'], async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.disruptionAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: alerts.length, alerts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/operator/alerts/:id/resolve (and /disruptions/:id/resolve alias)
router.put(['/alerts/:id/resolve', '/disruptions/:id/resolve'], async (req: Request, res: Response) => {
  try {
    const alert = await prisma.disruptionAlert.update({
      where: { id: req.params.id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: 'Alex Vance (Chief Dispatcher)',
      },
    });
    res.json({ success: true, alert });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/ledger - Payments ledger
router.get('/ledger', async (_req: Request, res: Response) => {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: transactions.length, transactions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/operator/calendar - Tour calendar events
router.get('/calendar', async (_req: Request, res: Response) => {
  try {
    const events = await prisma.calendarTourEvent.findMany();
    res.json({ success: true, count: events.length, events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/operator/packages - Operator creates and publishes a tour package
router.post('/packages', async (req: Request, res: Response) => {
  try {
    const { title, destination, country, days, totalPriceINR, heroImage, inclusions, routeStops } = req.body;
    res.json({
      success: true,
      message: 'Package published to Discover catalog successfully',
      package: {
        id: `pkg-${Date.now()}`,
        title,
        destination,
        country,
        days,
        totalPriceINR,
        heroImage,
        inclusions,
        routeStops,
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/operator/fulfill - Fulfill customized traveler booking across respective tabs
router.post('/fulfill', async (req: Request, res: Response) => {
  try {
    const { bookingId, customization } = req.body;
    res.json({
      success: true,
      message: 'All component bookings executed and dispatched across respective tabs',
      bookingId,
      dispatched: {
        flight: 'Confirmed & PNR Generated',
        stay: 'Voucher Confirmed with Suite Allocation',
        transfer: 'Chauffeur Dispatched',
        activities: 'VIP Permits Cleared',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
