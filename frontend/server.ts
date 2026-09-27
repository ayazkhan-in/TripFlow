import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import http from 'http';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;


// Initialize GoogleGenAI clients with spare / backup key failover support
function resolveFrontendGeminiKeys() {
  const keys: { label: string; key: string }[] = [];
  const seen = new Set<string>();

  const add = (label: string, raw?: string) => {
    if (!raw) return;
    const clean = raw.trim().replace(/^["']|["']$/g, '');
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      keys.push({ label, key: clean });
    }
  };

  add('Primary Key', process.env.GEMINI_API_KEY);
  add('Backup Key 1', process.env.GEMINI_API_KEY_BACKUP);
  add('Backup Key 2', process.env.GEMINI_BACKUP_API_KEY);
  add('Spare Key', process.env.GEMINI_API_KEY_SPARE);
  add('Spare Key Alias', process.env.GEMINI_SPARE_API_KEY);

  if (process.env.GEMINI_API_KEYS) {
    process.env.GEMINI_API_KEYS.split(',').forEach((k, i) => add(`Additional Key #${i + 1}`, k));
  }
  return keys;
}

const geminiClientEntries = resolveFrontendGeminiKeys().map(({ label, key }) => ({
  label,
  client: new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  }),
}));

async function executeFrontendGeminiFailover<T>(
  operation: (client: GoogleGenAI, label: string) => Promise<T>,
  callerTag: string
): Promise<T> {
  if (geminiClientEntries.length === 0) {
    throw new Error(`[${callerTag}] No Gemini API key configured.`);
  }

  let lastError: any = null;
  for (let i = 0; i < geminiClientEntries.length; i++) {
    const entry = geminiClientEntries[i];
    try {
      const result = await operation(entry.client, entry.label);
      if (i > 0) {
        console.log(`✨ [${callerTag}] Recovered successfully with spare key (${entry.label})`);
      }
      return result;
    } catch (err: any) {
      lastError = err;
      console.warn(`⚠️ [${callerTag}] Key #${i + 1} (${entry.label}) failed: ${err?.message || err}`);
      if (i + 1 < geminiClientEntries.length) {
        console.info(`🔄 [${callerTag}] Switching to spare key (${geminiClientEntries[i + 1].label})...`);
      }
    }
  }
  throw lastError || new Error(`[${callerTag}] All Gemini API keys failed.`);
}



// POST /api/classify-document
app.post('/api/classify-document', express.json({ limit: '25mb' }), async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', hint } = req.body;

    if (!imageBase64 && !hint) {
      return res.status(400).json({ error: 'Missing document image data' });
    }

    if (geminiClientEntries.length > 0 && imageBase64) {
      // Strip base64 prefix if present
      const base64Data = imageBase64.replace(/^data:[a-zA-Z0-9\/+-]+;base64,/, '');

      const response = await executeFrontendGeminiFailover((client) =>
        client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: `You are an expert travel document classification AI for luxury travel concierge platform TripFlow.
Analyze the attached document capture carefully.
Classify it into EXACTLY ONE of these categories:
- 'passport' (Personal or biometric passport)
- 'visa' (Tourist visa, eVisa, arrival clearance)
- 'flight' (Boarding pass, flight e-ticket, airline reservation)
- 'hotel' (Hotel confirmation, resort suite voucher, lodging reservation)
- 'insurance' (Medical travel insurance policy, evacuation coverage)
- 'id' (National ID card, Aadhaar, driver license, IDP)
- 'activity' (Sightseeing tour, safari pass, cultural show pass, wine/tea tasting)
- 'transit' (Private chauffeur voucher, train ticket, ferry pass, boat charter)
- 'permit' (National park permit, wildlife sanctuary entry, forest permit)
- 'emergency' (Medical emergency sheet, consular assistance pass)
- 'other' (General travel receipts or documents)

Extract key fields accurately. Return a JSON object with this EXACT structure (valid JSON only, no markdown backticks):
{
  "category": "passport" | "visa" | "flight" | "hotel" | "insurance" | "id" | "activity" | "transit" | "permit" | "emergency" | "other",
  "title": "Clean concise title (e.g., 'Air India AI-682 Boarding Pass' or 'Sarah Mehta — Passport')",
  "travelerName": "Name on document or 'Sarah Mehta'",
  "documentNumber": "Reference, PNR, Ticket, or Passport Number",
  "issueDate": "Date or 'Recently Verified'",
  "expiryDate": "Expiration or validity date if applicable",
  "status": "verified",
  "confidence": 0.98,
  "fields": {
    "Document Type": "...",
    "Route or Venue": "...",
    "Reference": "..."
  },
  "notes": "Concise summary of document contents and validity."
}`,
                },
              ],
            },
          ],
        }),
        'Frontend Document Scanner'
      );

      const responseText = response.text?.trim() || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
    }

    // Fallback response signaling client heuristics can provide rich metadata
    return res.json({ fallback: true });
  } catch (error: any) {
    console.error('Error in /api/classify-document:', error?.message || error);
    return res.status(200).json({ fallback: true, error: error?.message });
  }
});

// POST /api/itinerary-ai - Natural language modifications using Gemini
app.post('/api/itinerary-ai', express.json({ limit: '25mb' }), async (req, res) => {
  try {
    const { prompt, currentItinerary, catalog } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (geminiClientEntries.length > 0) {
      const systemInstruction = `You are TripFlow AI, an intelligent luxury travel concierge and itinerary architect.
The user wants to modify their day-based itinerary via natural language.
Analyze the current itinerary and the user request: "${prompt}".

Return a strict JSON object with:
{
  "explanation": "Concise, friendly 1-2 sentence description of what you modified and why (e.g. 'Added a sunset dinner at Sukiyabashi Jiro on Day 2 for $360 and shifted evening timings.')",
  "action": "add" | "remove" | "move" | "replace" | "add_day" | "update_budget" | "custom",
  "targetDayNumber": 1, // which day (1-indexed) was modified or where item was added
  "modifiedDays": [ ... ] // either updated days array or updated day objects matching the format of ItineraryDay: { id, dayNumber, date, title, subtitle, items: [...] }
}
Do not wrap in markdown quotes if possible, output pure JSON.`;

      const response = await executeFrontendGeminiFailover((client) =>
        client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nCURRENT ITINERARY:\n${JSON.stringify(currentItinerary, null, 2)}\n\nAVAILABLE CATALOG ITEMS FOR INSPIRATION:\n${JSON.stringify((catalog || []).slice(0, 15), null, 2)}\n\nUSER PROMPT: ${prompt}`,
                },
              ],
            },
          ],
        }),
        'Frontend Itinerary AI'
      );

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, ...parsed });
      }
    }

    return res.json({ fallback: true });
  } catch (err: any) {
    console.error('Error in /api/itinerary-ai:', err?.message || err);
    return res.json({ fallback: true, error: err?.message });
  }
});

// Forward all /api/v1 calls to Backend with auto-retry and multi-port resolution
let activeBackendPort: number | null = null;

function resolveBackendPort(): number {
  if (activeBackendPort) return activeBackendPort;
  if (process.env.BACKEND_PORT) return Number(process.env.BACKEND_PORT);

  const candidatePaths = [
    path.resolve(import.meta.dirname, '../backend/.env'),
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), '../backend/.env'),
  ];

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const match = fs.readFileSync(envPath, 'utf-8').match(/^PORT\s*=\s*(\d+)/m);
        if (match && match[1]) {
          return Number(match[1]);
        }
      }
    } catch {
      // continue
    }
  }

  return 5000;
}

app.use('/api/v1', (req, res) => {
  const tryProxy = (targetPort: number, canRetry: boolean) => {
    const options = {
      hostname: '127.0.0.1',
      port: targetPort,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${targetPort}`,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      activeBackendPort = targetPort;
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err: any) => {
      if (err.code === 'ECONNREFUSED' && canRetry) {
        const fallbackPort = targetPort === 5000 ? 5001 : 5000;
        console.warn(`[Proxy] Port ${targetPort} refused, attempting fallback to port ${fallbackPort}...`);
        tryProxy(fallbackPort, false);
        return;
      }

      console.error(`Proxy error to backend /api/v1 (port ${targetPort}):`, err?.message || err);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Backend unreachable', details: err?.message });
      }
    });

    req.pipe(proxyReq);
  };

  tryProxy(resolveBackendPort(), true);
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  function startListening(port: number, attemptsLeft = 10) {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`TripFlow server running on http://localhost:${port}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
        console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
        startListening(port + 1, attemptsLeft - 1);
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  }

  startListening(PORT);
}

startServer();
