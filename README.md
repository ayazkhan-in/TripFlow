# TripFlow — Luxury Travel Concierge & Operations Platform

TripFlow is organized into a clean two-folder architecture:

```
TripFlow/
├── frontend/             # React 19 + Vite + Tailwind CSS Client Application
│   ├── src/              # Components, screens, data, and state
│   ├── index.html        # HTML entry point
│   ├── vite.config.ts    # Vite configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Frontend dependencies & scripts
│
└── backend/              # Node.js + Express + PostgreSQL + Gemini AI + Cloudinary
    ├── src/
    │   └── server.ts     # Express API, Document OCR, and AI routes
    ├── tsconfig.json     # TypeScript configuration
    ├── package.json      # Backend dependencies & scripts
    └── BACKEND_SPECIFICATION.md  # Complete DB schema & API Endpoints Blueprint
```

## Backend Blueprint & Database Schema
The complete PostgreSQL schema (DDL & Prisma), entity relationships, Gemini API prompts, Cloudinary folder structure, and 40+ REST API endpoints are documented in:
👉 **[`backend/BACKEND_SPECIFICATION.md`](./backend/BACKEND_SPECIFICATION.md)**

---

## Running the Project

### Frontend
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000` (or `3001` if port 3000 is occupied).*

### Backend
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### From Project Root
```bash
# Run frontend dev server
npm run dev

# Run backend dev server
npm run dev:backend
```
