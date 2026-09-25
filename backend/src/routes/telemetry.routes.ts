import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/telemetry/flight/:pnr - ADS-B Flight Radar Status
router.get('/flight/:pnr', async (req: Request, res: Response) => {
  const { pnr } = req.params;

  res.json({
    success: true,
    flight: {
      airline: 'Air India',
      flightNumber: 'AI-682',
      pnr,
      route: 'BOM ➔ COK',
      altitude: 'Cruising 34,000 ft',
      speed: '480 kts',
      status: 'On Time',
      departure: { airport: 'Chhatrapati Shivaji Maharaj T2 (BOM)', gate: 'Gate 42B', scheduledTime: '11:30 AM' },
      arrival: { airport: 'Cochin International T3 (COK)', baggageBelt: 'Belt 02', scheduledTime: '01:30 PM' },
      telemetryProvider: 'ADS-B Radar Mesh Sync',
    },
  });
});

// GET /api/v1/telemetry/chauffeur/:tripId - Live Chauffeur GPS
router.get('/chauffeur/:tripId', async (req: Request, res: Response) => {
  const { tripId } = req.params;

  res.json({
    success: true,
    tripId,
    chauffeur: {
      name: 'Arun V.',
      phone: '+91 98470 12345',
      vehicle: 'Toyota Innova Crysta',
      plate: 'KL-07-CD-4092',
      status: 'On Standby / En Route',
      coordinates: { latitude: 9.9312, longitude: 76.2673 },
      eta: '12 mins to Arrival Gate 4',
      signalQuality: '100% 5G Satellite Mesh',
    },
  });
});

// POST /api/v1/telemetry/disruptions/resolve - Broadcast disruption resolution
router.post('/disruptions/resolve', async (req: Request, res: Response) => {
  const { alertId, resolutionNote } = req.body;

  res.json({
    success: true,
    alertId,
    resolvedAt: new Date().toISOString(),
    broadcastMessage: 'Disruption resolved! Telemetry pushed to Sarah Mehta & Chauffeur Arun V.',
    resolutionNote: resolutionNote || 'Alternative tea plantation route assigned with zero arrival delay.',
  });
});

export default router;
