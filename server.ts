import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support large payload for high-resolution document scans
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/classify-document
app.post('/api/classify-document', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', hint } = req.body;

    if (!imageBase64 && !hint) {
      return res.status(400).json({ error: 'Missing document image data' });
    }

    if (aiClient && imageBase64) {
      // Strip base64 prefix if present
      const base64Data = imageBase64.replace(/^data:[a-zA-Z0-9\/+-]+;base64,/, '');

      const response = await aiClient.models.generateContent({
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
      });

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TripFlow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
