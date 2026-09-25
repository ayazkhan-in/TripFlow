import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import discoverRoutes from './routes/discover.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import vaultRoutes from './routes/vault.routes.js';
import telemetryRoutes from './routes/telemetry.routes.js';
import operatorRoutes from './routes/operator.routes.js';
import mediaRoutes from './routes/media.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));

// Health Check
app.get(['/', '/health', '/api/health', '/api/v1/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'TripFlow Backend API',
    database: 'Neon PostgreSQL Connected',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    cloudinaryConfigured: Boolean(process.env.CLOUDINARY_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mount Versioned API Routes (/api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/discover', discoverRoutes);
app.use('/api/v1/itineraries', itineraryRoutes);
app.use('/api/v1/catalog', itineraryRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/vault', vaultRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/operator', operatorRoutes);
app.use('/api/v1/media', mediaRoutes);

// Mount Legacy Compatibility Routes (/api/*)
app.use('/api/classify-document', (req, res, next) => {
  req.url = '/classify-ai';
  vaultRoutes(req, res, next);
});
app.use('/api/itinerary-ai', (req, res, next) => {
  req.url = '/ai-generate';
  discoverRoutes(req, res, next);
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err?.message || 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TripFlow Backend running on http://localhost:${PORT}`);
  console.log(`📦 Database: Neon PostgreSQL Connected`);
  console.log(`✨ AI Services: Gemini Flash Optical Vision & Trip Planner Active`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`💡 Free the port or stop any duplicate node process running on port ${PORT}.`);
  } else {
    console.error('Server error:', err);
  }
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
