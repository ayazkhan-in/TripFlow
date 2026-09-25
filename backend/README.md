# TripFlow Backend Service

High-touch Luxury Travel Concierge & Real-time Tour Operations Backend Service.

## Technology Stack
- **Runtime:** Node.js (TypeScript) + Express.js
- **Database:** PostgreSQL (with Prisma ORM)
- **AI Engine:** Google Gemini API (`@google/genai` — `gemini-2.5-flash` / `gemini-1.5-pro`)
- **Media & Document Storage:** Cloudinary (PDFs, Boarding Passes, Hotel Folios, Signed URLs)

---

## Complete Specification & Database Schema
For the complete technical blueprint, database ERD, SQL DDL, Prisma schema, and all 40+ API endpoints, refer to:
👉 **[`BACKEND_SPECIFICATION.md`](./BACKEND_SPECIFICATION.md)**

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
*Server runs on `http://localhost:5000`.*
*Health check: `http://localhost:5000/api/health`.*
