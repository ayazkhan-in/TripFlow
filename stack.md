# TripFlow Tech Stack Architecture

A comprehensive overview of the technologies, libraries, frameworks, database architecture, and AI systems powering **TripFlow** (Bookit) — a luxury travel concierge, dynamic itinerary builder, and real-time operations platform.

---

## 1. High-Level Architecture Overview

TripFlow is architected as a high-performance **full-stack TypeScript monorepo** with clear separation of concerns:

```
TripFlow/
├── frontend/                # React 19 SPA, Tailwind CSS v4, Framer Motion, Leaflet
├── backend/                 # Node.js + Express API, Prisma ORM, Neon PostgreSQL
├── package.json             # Root monorepo orchestration scripts
└── stack.md                 # System architecture documentation
```

- **Client**: Single Page Application (SPA) with responsive consumer and operator control panels.
- **Server**: Express.js REST API with modular route controllers and typed service layers.
- **Database**: Serverless PostgreSQL accessed through Prisma ORM.
- **AI Engine**: Google Gemini API multimodal integration for conversational travel planning, optical document scanning, and weather-driven contingency simulations.

---

## 2. Frontend Technology Stack

| Layer | Technology | Version | Purpose / Highlights |
|---|---|---|---|
| **Runtime & Core** | **React** | `v19.0.1` | Concurrent rendering, modern hooks, zero-lag UI transitions |
| **Language** | **TypeScript** | `v7.0.2 / v5.6` | Strict end-to-end typing for itinerary models, cards, and state |
| **Build & Tooling** | **Vite** | `v8.3.0` | Ultra-fast HMR (Hot Module Replacement) and optimized production bundles |
| **Styling & Design** | **Tailwind CSS** | `v4.3.3` | Next-gen CSS engine with `@tailwindcss/vite` plugin, design tokens, responsive breakpoints |
| **Animations** | **Framer Motion** & **Motion** | `v12.43.0` | Micro-interactions, spring physics, modal transitions, parallax video backgrounds |
| **Mapping & Geospatial** | **Leaflet** & `@types/leaflet` | `v1.9.4` | Interactive day-by-day route maps, custom waypoint markers, and circuit paths |
| **Iconography** | **Lucide React** & **Google Material Symbols** | `v0.546.0` | Lightweight SVG icons paired with travel and luxury concierge glyphs |
| **Media Delivery** | **HTML5 Video & Image Pipelines** | Native | Unsplash curated CDNs, Cloudinary CDN delivery, adaptive video stream hero |

### Key Frontend Architectural Components
- **`AssistantScreen`**: Interactive concierge chat with zero-guesswork city resolution, question cards, and proposal comparison deck.
- **`DiscoverScreen`**: Curated packages, departure city selectors, destination inspirations, and intelligent query bar.
- **`ItineraryBuilder`**: Drag-and-drop day-by-day trip customizer with dynamic price recalculation.
- **`TravelVault`**: Encrypted travel documents storage with optical badge scanning and status indicators.
- **`DigitalTwinDashboard`**: Real-time operational simulation cockpit for weather disruptions and guest cohort tracking.

---

## 3. Backend Technology Stack

| Layer | Technology | Version | Purpose / Highlights |
|---|---|---|---|
| **Runtime** | **Node.js** | `v20+` / `v22` | High-throughput asynchronous event loop |
| **Framework** | **Express.js** | `v4.21.2` | RESTful API server with modular routing and JSON middleware |
| **Execution Tooling** | **tsx** | `v4.21.0` | TypeScript execution without precompilation; live hot reload in development |
| **Authentication** | **JWT & bcryptjs** | `v9.0.2 / v2.4.3` | Stateless bearer token authentication and salted password hashing |
| **Cross-Origin** | **CORS** | `v2.8.5` | Safe origin handling across dev ports (`5173`, `5000`) and production origins |
| **Cloud Media** | **Cloudinary SDK** | `v2.5.1` | Cloud media uploads, transformation, and document asset hosting |

### Modular API Route Architecture (`backend/src/routes/`)
1. **`assistant.routes.ts`**: AI trip clarification, dynamic questionnaire generation, and tailored proposal generation in INR (₹).
2. **`auth.routes.ts`**: Traveler and operator signup, login, profile retrieval, and session verification.
3. **`booking.routes.ts`**: Itinerary checkout, payment settlement, split-group payments, and booking modifications.
4. **`digitalTwin.routes.ts`**: Weather scenario simulation (rain, wind, flood), first/second/third-order ripple effect analysis.
5. **`discover.routes.ts`**: Premade curated packages, departure city hub listings, and live search.
6. **`itinerary.routes.ts`**: Custom itinerary persistence, day schedule saving, and item catalog additions.
7. **`operator.routes.ts`**: Tour cohort management, guide assignments, vendor records, and operational disruption alerts.
8. **`telemetry.routes.ts`**: Real-time flight tracking by PNR and chauffeur GPS coordinates.
9. **`vault.routes.ts`**: Secure document storage, metadata indexing, and Gemini Optical Scanner.
10. **`media.routes.ts`**: Signature asset uploads and Cloudinary integration.

---

## 4. Database & ORM Layer

| Component | Technology | Description |
|---|---|---|
| **Database** | **PostgreSQL** | Serverless relational database (Neon Postgres) with connection pooling |
| **ORM** | **Prisma ORM (`v6.4.1`)** | Declarative schema modeling, automatic migrations, type-safe query generation |
| **Binary Targets** | Native, `rhel-openssl-3.0.x`, `debian-openssl-3.0.x` | Production cross-platform deployment compatibility |

### Core Prisma Schema Entities
- **`User`**: Role-based access (`TRAVELER`, `OPERATOR`, `ADMIN`), secure credentials, and preferences.
- **`BookedTrip`**: Booked itineraries, status (`DRAFT`, `CONFIRMED`, `IN_PROGRESS`, etc.), total pricing, and payment records.
- **`ItineraryItem`**: Segment items (`hotel`, `flight`, `transport`, `activity`, `meal`, `experience`).
- **`VaultDocument`**: Passports, visas, flight passes, insurance, and medical clearances.
- **`OperatorCohort` & `TourGuide`**: Group tracking, active circuits, passenger counts, and assigned personnel.
- **`AssistantChatSession`**: Persistent conversation history, saved proposals, and questionnaire states.

---

## 5. Artificial Intelligence & Intelligent Engines

TripFlow integrates **Google Gemini API** (`@google/genai v2.4.0`) across three core domains:

### A. Intelligent Trip Concierge & Planner
- **Multi-Model Cascade**: Prioritizes `gemini-2.5-flash` for low latency, falling back to `gemini-1.5-flash` and `gemini-1.5-pro`.
- **Zero-Guesswork Geographic Resolution**: Intelligent parser separates origin flight hubs (e.g. *"from Mumbai"*) from target cities/countries (*"Rome"*, *"Japan"*, *"Vienna"*), preventing destination hijacking.
- **Dynamic Pricing Engine**: Computes flights, 5★ luxury suites, chauffeur transfers, and experiences strictly calibrated in INR (₹).

### B. Travel Vault Gemini Optical Scanner
- **Multimodal Document Understanding**: Analyzes uploaded document images/PDFs to extract passport numbers, expiry dates, PNR codes, ticket flight details, and visa validity dates without manual entry.

### C. Weather-Driven Digital Twin & Contingency Simulator
- **Live Disruption Modeling**: Simulates adverse weather conditions (precipitation rate, wind speed, flooding).
- **Ripple Effect Graph**: Calculates impact across transport delays, hotel lobby backlogs, and guide shifts.
- **Executive Operational Briefings**: Synthesizes two-sentence situational summaries and actionable mitigations for tour operators.

---

## 6. Monorepo Scripts & Workflow

All operations are coordinated from the project root via standard `npm` scripts:

```bash
# Start Frontend Development Server (Port 5173)
npm run dev:frontend

# Start Backend API Server with live reload (Port 5000)
npm run dev:backend

# Production Builds
npm run build:frontend
npm run build:backend

# Install dependencies across all workspaces
npm run install:all
```

---

## 7. Security, Performance & Scalability Highlights

- **Stateless Authentication**: JWT tokens with expiration verification passed via Bearer headers.
- **Role Guards**: Separation between consumer traveler features and operator control room actions.
- **Bundle Optimization**: Code-splitting and CSS minification via Vite production compilation.
- **Resilient Fallbacks**: Deterministic local fallback catalogs guarantee 100% platform availability even when third-party AI APIs or external networks experience latency.
