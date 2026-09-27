# Bookit — Design System & Platform Architecture Specification

> **Platform:** Bookit (formerly TripFlow) — Intelligent Tour Planning & Operations Platform  
> **Tagline:** *"Where bespoke journey design meets automated operations."*  
> **Architecture:** Dual-Surface Cloud Platform (Consumer Traveler Portal + Tour Operator Command Cockpit)  
> **Frontend Technologies:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Material Symbols  
> **Typography:** Plus Jakarta Sans (Brand & UI), JetBrains Mono (Telemetry & Codes)  
> **Color Identity:** Electric Royal Blue (`#004AC6`), Deep Midnight Navy (`#0A1224`), Alpine Slate (`#F4F5F8`)

---

## Table of Contents
1. [Design Philosophy & Core Pillars](#1-design-philosophy--core-pillars)
2. [Design Tokens & UI Foundation](#2-design-tokens--ui-foundation)
   - 2.1 [Color Palette & Semantic Tokens](#21-color-palette--semantic-tokens)
   - 2.2 [Typography Hierarchy](#22-typography-hierarchy)
   - 2.3 [Glassmorphism & Surface Elevation](#23-glassmorphism--surface-elevation)
   - 2.4 [Micro-Animations & Interaction Motion](#24-micro-animations--interaction-motion)
3. [Dual-Surface Architecture](#3-dual-surface-architecture)
4. [Public & Entryway Surfaces](#4-public--entryway-surfaces)
   - 4.1 [Landing Page (Marketing & Discovery Experience)](#41-landing-page)
   - 4.2 [Auth Screen (Secure Access Portal)](#42-auth-screen)
5. [Traveler Surface (Consumer Experience)](#5-traveler-surface-consumer-experience)
   - 5.1 [Home & Live Concierge Portal](#51-home--live-concierge-portal)
   - 5.2 [Trips & Bookings (Bento Logistics & Timeline)](#52-trips--bookings)
   - 5.3 [Itinerary Builder (AI & Manual Journey Architect)](#53-itinerary-builder)
   - 5.4 [Travel Vault (Biometric Digital Safe & OCR)](#54-travel-vault)
   - 5.5 [AI Travel Assistant (Conversational Concierge)](#55-ai-travel-assistant)
   - 5.6 [Travel Stories (UGC Social Showcase & Itinerary Cloner)](#56-travel-stories)
6. [Operator Surface (Operations Command Cockpit)](#6-operator-surface-operations-command-cockpit)
   - 6.1 [Ops Command Hub (Live Telemetry Radar)](#61-ops-command-hub)
   - 6.2 [Tour Detail Cockpit (Granular Cohort Dispatch)](#62-tour-detail-cockpit)
   - 6.3 [Bookings & Inventory Tracker](#63-bookings--inventory-tracker)
   - 6.4 [Traveler Bookings Manager (Ticketing & Manifests)](#64-traveler-bookings-manager)
   - 6.5 [Vendors & Supply Network](#65-vendors--supply-network)
   - 6.6 [Tour Cohorts & Dispatches](#66-tour-cohorts--dispatches)
   - 6.7 [Tour Guides & Staff Directory](#67-tour-guides--staff-directory)
   - 6.8 [Itinerary Disruption Alerts & Resolution Engine](#68-itinerary-disruption-alerts--resolution-engine)
   - 6.9 [Payments Ledger & Treasury](#69-payments-ledger--treasury)
   - 6.10 [Global Operations Calendar](#610-global-operations-calendar)
   - 6.11 [Tour Package Creator Studio](#611-tour-package-creator-studio)
   - 6.12 [Weather-Driven Digital Twin & Simulation Cockpit](#612-weather-driven-digital-twin--simulation-cockpit)
7. [Global Modals & Shared Overlays](#7-global-modals--shared-overlays)
   - 7.1 [Payment & Tour Reservation Overlay](#71-payment--tour-reservation-overlay)
   - 7.2 [Command Palette (`Cmd+K`)](#72-command-palette-cmdk)
   - 7.3 [Themed Toast Notification System](#73-themed-toast-notification-system)
   - 7.4 [Traveler Profile & Preferences Modal](#74-traveler-profile--preferences-modal)
   - 7.5 [WhatsApp Concierge Drawer](#75-whatsapp-concierge-drawer)

---

## 1. Design Philosophy & Core Pillars

Bookit is built upon a fundamental design insight: **Luxury travel planning requires serene, emotional visual storytelling, while tour operations require high-density, real-time situational control.**

Rather than separating these into two disconnected products, Bookit unifies them into a **synchronized dual-surface platform**:

1. **Editorial Luxury for Travelers:** Clean whitespace, breathtaking 4K cinematic backgrounds, glassmorphic floating cards, and stress-free logistics.
2. **Mission-Critical Cockpit for Operators:** Live radar maps, ADS-B telemetry indicators, cohort status grids, and instant disruption mitigation.
3. **The Synchronization Bridge:** When an operator resolves a rain disruption or reassigns a private chauffeur in the operations hub, the traveler's live timeline, GPS widget, and digital vault update in real time with zero manual intervention.

---

## 2. Design Tokens & UI Foundation

### 2.1 Color Palette & Semantic Tokens

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BOOKIT COLOR PALETTE                            │
├─────────────────────┬──────────────────┬───────────────────────────────┤
│ Role                │ Value            │ Description                   │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ Primary Brand       │ #004AC6 / Blue   │ Electric Royal Blue           │
│ Deep Canvas Dark    │ #0A1224 / Navy   │ Command cockpit & hero darks  │
│ Light Surface       │ #F4F5F8 / Slate  │ Ultra-soft neutral background │
│ Pure Canvas Light   │ #FFFFFF / White  │ Card foreground & clean panels│
│ Telemetry On-Track  │ #10B981 / Emerald│ Active GPS, on-time, verified │
│ Telemetry Alert     │ #F59E0B / Amber  │ Weather warning, budget delta │
│ Telemetry Critical │ #EF4444 / Rose   │ Road closure, flight delay    │
│ VIP Concierge       │ #6366F1 / Indigo │ Elite tier, agency isolation  │
└─────────────────────┴──────────────────┴───────────────────────────────┘
```

### 2.2 Typography Hierarchy

- **Primary Typeface:** `Plus Jakarta Sans`, sans-serif  
  *Characteristics:* Warm, geometric, high legibility across dense dashboard data and large editorial marketing headlines.
- **Monospace Typeface:** `JetBrains Mono`, monospace  
  *Used for:* Flight numbers (`EK-502`), vehicle license plates (`KL-07-BW-4412`), voucher authorization hashes (`VCHR-KER-8891`), and live radar coordinates.

```
• Display 1: text-4xl to text-6xl / font-black / tracking-tight
• Heading 2: text-2xl to text-3xl / font-extrabold / tracking-tight
• Section Title: text-lg to text-xl / font-bold / text-slate-900
• Body Text: text-sm to text-base / font-normal / leading-relaxed
• Caption / Tag: text-xs / font-semibold / uppercase / tracking-wider
• Mono Telemetry: text-[11px] / font-mono / font-medium / tracking-tight
```

### 2.3 Glassmorphism & Surface Elevation

Bookit utilizes multi-layered backdrop-blur surfaces to achieve depth without clutter:
- **Light Frosted Surface:** `bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl`
- **Deep Navy Command Surface:** `bg-[#0A1224]/95 backdrop-blur-2xl border border-white/15 shadow-2xl`
- **Minimal Input Wrapper:** `rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15`

### 2.4 Micro-Animations & Interaction Motion

- **Continuous Infinite Marquee:** `@keyframes marquee-scroll` with `animation-play-state: paused` on hover for reading ease.
- **Staggered Fade-Slide Entry:** `fadeSlideIn` (`0.5s cubic-bezier(0.16, 1, 0.3, 1)`) with `animate-delay-100` through `animate-delay-1400`.
- **Telemetry Pulses:** Emerald and Amber pinging dots on live chauffeur GPS and flight trackers.
- **Subtle Orbiting Floating Cards:** `@keyframes float-card-1` to `float-card-4` simulating floating glass cards over scenic destinations.

---

## 3. Dual-Surface Architecture

```
                                  ┌───────────────────────────┐
                                  │      BOOKIT PLATFORM      │
                                  └─────────────┬─────────────┘
                                                │
                      ┌─────────────────────────┴─────────────────────────┐
                      ▼                                                   ▼
        ┌───────────────────────────┐                       ┌───────────────────────────┐
        │     TRAVELER SURFACE      │                       │     OPERATOR SURFACE      │
        │    (Consumer Portal)      │                       │     (Command Cockpit)     │
        ├───────────────────────────┤                       ├───────────────────────────┤
        │ • Home & Concierge Hub    │ ◄─── Telemetry ───►   │ • Ops Radar & Disruption  │
        │ • Multi-Day Itinerary     │       Sync Mesh       │ • Cohort Dispatch Cockpit │
        │ • Living Builder (AI)     │                       │ • Fleet & Driver Telemetry│
        │ • Digital Vault & Passports│                      │ • Vendor Supply Mesh      │
        │ • AI Concierge Companion  │                       │ • Treasury & B2B Escrow   │
        │ • Travel Stories Social   │                       │ • Global Calendar Matrix  │
        └───────────────────────────┘                       └───────────────────────────┘
```

---

## 4. Public & Entryway Surfaces

### 4.1 Landing Page
- **Route:** `/` (`currentRoute === 'landing'`)
- **Primary Objective:** Convert visitors into travelers and operators through visual luxury and interactive demonstration of the dual-surface engine.
- **Key Visual Elements:**
  - **4K Hero Video Background:** Full-screen background player running `/hero4k.mp4` with high-framerate destination footage and webm fallback.
  - **Transparent Brand Header:** Minimal Bookit brand logo, navigation links (*Destinations*, *Builder*, *Operations*, *Vault*, *Features*), and dual CTA (*Sign In* and *Register Now*).
  - **Hero Headline & AI Search Bar:** "Where bespoke journey design meets automated operations." with destination pill triggers (*Kyoto*, *Kashmir*, *Kerala*, *Swiss Alps*, *Amalfi*).
  - **Interactive Dual-Surface Selector:** Side-by-side interactive interactive preview demonstrating how Traveler view and Operator cockpit synchronize.
  - **Curated Circuits Showcase:** Bento-grid of premier global circuits featuring pricing, duration, flight tags, and 1-click booking preview.
  - **Digital Vault Showcase:** Visual breakdown of biometrically verified flight tickets, hotel vouchers, and GDRFA visas.
  - **FAQ & Footer:** Accordion-based answers covering data isolation, AI itinerary generation, and 24/7 human concierge dispatch.

### 4.2 Auth Screen (Secure Access Portal)
- **Route:** `currentRoute === 'auth'`
- **Primary Objective:** Frictionless authentication, multi-role registration, and 1-click sandbox persona exploration.
- **Layout Architecture:** Edge-to-edge split screen (`h-screen`, zero outer gaps):
  - **Left Section (Auth Form Panel):**
    - Clean top navigation with standalone circular back button (`ArrowLeft`).
    - **Floating Slider Switcher:** A segmented pill toggle elevated directly above the form:
      - `Sign In` — Email & password, remember me checkbox, password visibility toggle, forgot password modal, and Continue with Google button.
      - `Sign Up` — Account type switcher (*Traveler* vs. *Tour Operator*), name, phone, email, password, and dedicated *Agency Isolation Profile* fields (Agency Name & Operator Code).
      - `1-Click Demo` — Direct instant entry without passwords into verified personas:
        - *Alex Vance* (Tour Operator Hub — Alpine & Beyond Expeditions).
        - *Sarah Mehta* (Elite Traveler Portal — Active Kerala Expedition).
    - Seamless white background without artificial box drop shadows.
    - Security note: *"Protected by Bookit Enterprise Security • v2.4"*.
  - **Right Section (Hero Card with Marquee Testimonials):**
    - Full viewport height (`h-screen`), full-bleed edge-to-edge luxury landscape photography.
    - Dark cinematic gradient vignette (`bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/40`).
    - Prominent editorial headline: *"Where bespoke journey design meets automated operations."*
    - **Marquee Testimonials Row:** Infinite scrolling horizontal ticker with pause-on-hover:
      - *Sarah Mehta* (Elite Traveler — Concierge Member).
      - *Alex Vance* (Chief Dispatcher — Alpine & Beyond Expeditions).
      - *Elena Rostova* (Operator Partner — Nordic Expeditions).
      - *Vikram Singhania* (Director of Ops — Himalayan Luxury Skyways).

---

## 5. Traveler Surface (Consumer Experience)

### 5.1 Home & Live Concierge Portal
- **Tab:** `consumerTab === 'home'`
- **Key Features:**
  - **Live Active Trip Countdown Card:** Displays current expedition status ("Day 3 of 6 in Kochi & Munnar"), countdown to next transfer, and current weather.
  - **Real-Time Telemetry Bar:** Shows active flight status (`EK-502 On Schedule`) and assigned chauffeur (`Arun Kumar • Toyota Innova Crysta`).
  - **Quick AI Trip Creator:** Destination input, duration slider, vibe selectors (Luxury, Wellness, Adventure, Cultural) triggering Gemini AI trip creation.
  - **Curated Circuits Carousel:** Pre-seeded luxury circuits with high-res imagery, inclusions, pricing in INR, and "View Itinerary" buttons.
  - **Concierge Quick Dispatch:** Floating WhatsApp button for direct line to personal 24/7 human lifestyle manager.

### 5.2 Trips & Bookings
- **Tab:** `consumerTab === 'trips'`
- **Key Features:**
  - **Day-by-Day Interactive Visual Timeline:** Horizontal day picker (Day 1 through Day 6) with weather forecasts and location pins.
  - **Activity Cards:** Detailed timing (09:00 AM - 01:00 PM), activity title, inclusions, dress codes, and booking confirmation status badges.
  - **Live Chauffeur GPS Telemetry Card:** Live car illustration, driver photo, phone trigger, car license plate, and estimated arrival time.
  - **PDF Itinerary Exporter:** Single-click client-side formatted export generating high-resolution printable PDF itineraries.

### 5.3 Itinerary Builder
- **Tab:** `consumerTab === 'builder'`
- **Key Features:**
  - **Dynamic Circuit Architect:** Add, remove, and reorder days and activities across Tokyo, Kyoto, Munnar, Srinagar, or Zurich.
  - **Smart Activity Suggestions:** AI-powered recommendations (e.g. *Private Tea Tasting*, *Helicopter Transfer*, *Michelin Kaiseki Dining*).
  - **Dynamic Budget Calculator:** Real-time calculation of total expenditure including flights, luxury stays, chauffeur fleet, and taxes.
  - **Preset Circuit Selector:** Instant cloning of verified operator itineraries into customizable personal workspaces.

### 5.4 Travel Vault
- **Tab:** `consumerTab === 'vault'`
- **Key Features:**
  - **Biometrically Verified Storage:** Secure encrypted holding for GDRFA Dubai visas, Indian Aadhaar/Passports, and flight e-tickets.
  - **Interactive Voucher Viewer:** High-fidelity digital vouchers with barcode/QR verification, confirmation hashes, and offline download capabilities.
  - **AI OCR Document Scanner:** Upload passport photos or flight tickets for automated entity extraction via Google Gemini Vision.

### 5.5 AI Travel Assistant
- **Tab:** `consumerTab === 'assistant'`
- **Key Features:**
  - **Conversational Concierge:** Instant streaming travel advice powered by Google Gemini (`gemini-2.5-flash`).
  - **Context-Aware Assistance:** Understands active trip context, recommending restaurants near the traveler's current hotel.
  - **Disruption Guidance:** Offers advice when flight delays or rain alerts are detected on the active itinerary.

### 5.6 Travel Stories
- **Tab:** `consumerTab === 'story'`
- **Key Features:**
  - **User-Generated Content Feed:** Full-height visual reels and photo carousels from verified travelers.
  - **Cost & Stay Breakdown:** Transparent budget breakdowns ("How I did luxury Kashmir in under ₹21k").
  - **1-Click "Clone Journey":** Duplicates the exact route, stays, and activities into the user's personal builder.

---

## 6. Operator Surface (Operations Command Cockpit)

### 6.1 Ops Command Hub
- **Tab:** `operatorTab === 'overview'`
- **Key Features:**
  - **Live Radar Map Telemetry:** Interactive map tracking active cohort buses, private chauffeur cars, and flight paths in real time.
  - **Active Disruption Queue:** Triage panel for flight delays, rain warnings, and driver delays with severity badges (Critical, Moderate, Low).
  - **Interactive Disruption Simulator:** Allows operators to test automated cascade updates (e.g. reschedule airport transfer from 01:00 PM to 02:30 PM with one click).
  - **Operational Metrics Bar:** Real-time count of Active Cohorts, Travelers In Transit, On-Time Dispatch %, and Pending Disruption Cards.

### 6.2 Tour Detail Cockpit
- **Triggered via:** `onInspectTour(tourId)`
- **Key Features:**
  - **Granular Cohort Management:** Deep dive into specific group (e.g. *Tour #1024 — Kerala Luxury Spice Route*).
  - **Passenger Roster:** List of travelers, rooming allocations, dietary preferences, and emergency contact numbers.
  - **Vendor Mesh Assignment:** Dedicated Chauffeur and Lead Guide assignment controls with direct call triggers.
  - **Live Dispatch Messenger:** Real-time messaging tool to broadcast updates to travelers in that specific cohort.

### 6.3 Bookings & Inventory Tracker
- **Tab:** `operatorTab === 'inventory'`
- **Key Features:**
  - **Capacity Management:** Real-time visibility into vehicle fleet availability, hotel room block allocations, and activity slot caps.
  - **GDS Amadeus / Sabre Sync:** Simulated synchronization with global flight distribution systems.
  - **Inventory Health Indicators:** Color-coded availability bars (Available, Low Stock, Sold Out).

### 6.4 Traveler Bookings Manager
- **Tab:** `operatorTab === 'bookings'`
- **Key Features:**
  - **Master Passenger Manifest:** Filterable table by traveler name, booking status, cohort ID, and payment status.
  - **Ticket & Voucher Dispatch:** Ability to re-issue flight boarding passes and push updated hotel vouchers directly to the traveler's digital vault.
  - **CSV Manifest Exporter:** Single-click export of full passenger manifests for airline and border compliance.

### 6.5 Vendors & Supply Network
- **Tab:** `operatorTab === 'vendors'`
- **Key Features:**
  - **B2B Partner Registry:** Directory of private chauffeur fleets, 5-star heritage hotels, houseboat operators, and safari guides.
  - **SLA & Performance Governance:** On-time pickup ratings, guest feedback scores, and contractual commission percentages.
  - **Add Partner Modal:** Form to onboard new suppliers with automated document validation.

### 6.6 Tour Cohorts & Dispatches
- **Tab:** `operatorTab === 'cohorts'`
- **Key Features:**
  - **Departure Matrix:** Schedule of all upcoming group departures with passenger counts and lead dispatcher assignment.
  - **Broadcast Notification Tool:** Send push alerts and SMS notices to all passengers in an active cohort.

### 6.7 Tour Guides & Staff Directory
- **Tab:** `operatorTab === 'guides'`
- **Key Features:**
  - **Field Roster:** Profiles of licensed tour guides, naturalists, and mountaineers.
  - **Specializations & Languages:** Language badges (French, German, Japanese, Hindi) and certification statuses (Wilderness First Aid, Ministry of Tourism).
  - **Live Assignment Switcher:** One-click re-assignment of guides to VIP tour cohorts.

### 6.8 Itinerary Disruption Alerts & Resolution Engine
- **Tab:** `operatorTab === 'alerts'`
- **Key Features:**
  - **Meteorological & ADS-B Ingestion:** Real-time monitoring of severe weather events (e.g. *Munnar heavy rainfall*, *Kochi fog delay*).
  - **1-Click Cascade Resolution Engine:** Automatically swaps outdoor activities for indoor luxury experiences, retimes chauffeur transfers, and updates traveler timelines.
  - **Disruption Audit Ledger:** Historical record of resolved disruptions with timestamps and cost impact.

### 6.9 Payments Ledger & Treasury
- **Tab:** `operatorTab === 'payments'`
- **Key Features:**
  - **B2B Escrow & Disbursements:** Tracking of vendor payout schedules, traveler installment receipts, and operator gross margin.
  - **Transaction Audit Trail:** Reference codes, bank transfer statuses, and GST invoice generation.
  - **Statement Export:** Export accounting statements directly to CSV for ERP integration.

### 6.10 Global Operations Calendar
- **Tab:** `operatorTab === 'calendar'`
- **Key Features:**
  - **Multi-Cohort Timeline Grid:** Visual Gantt chart showing overlapping tour circuits across the month.
  - **Resource Conflict Detection:** Automatic highlight of double-booked vehicles or guides.

### 6.11 Tour Package Creator Studio
- **Modal Trigger:** `onOpenCreatePackage`
- **Key Features:**
  - **Circuit Publisher:** Create new branded tour packages with custom cover imagery, destination tags, and inclusions.
  - **Tiered Pricing Engine:** Define luxury, deluxe, and standard pricing tiers.
  - **Instant Live Publication:** Packages publish immediately to the public Discover page and consumer builder.

### 6.12 Weather-Driven Digital Twin & Simulation Cockpit
- **Tab:** `operatorTab === 'digital_twin'` (`/operator/digital-twin`)
- **Key Features:**
  - **Live Weather Integration:** Real-time sensor synchronization via Open-Meteo API (temperature, feels-like, rainfall intensity, wind velocity, humidity, WMO code) with 5-day predictive forecasts for circuits (Kerala, Japan Golden Route, Rajasthan, Goa).
  - **Geospatial Map Visualization:** Interactive Leaflet canvas featuring custom-styled div-icons, operational status rings (optimal, moderate risk, high disruption, diverted, suspended), and animated cascading propagation vectors connecting weather centers to affected corridors, hotels, and attractions.
  - **Real-World Social Signal Integration:** Multi-channel social telemetry aggregator (X/Twitter, Reddit, Instagram, Met Dept alerts, and chauffeur telemetry) with sentiment distribution bars, credibility scoring, geotag inspection, and keyword filters.
  - **Digital Twin What-If & Counterfactual Simulation Engine:**
    - Preset Scenarios: Baseline Normal, Monsoon Cloudburst, Coastal Cyclone Alert, Extreme Heatwave, Mountain Landslide Risk.
    - Granular Slider Controls: Rainfall (0-150 mm/h), Wind Speed (0-130 km/h), Ambient Temperature (5-50°C), Storm Duration (1-48h), Flooding Risk Index (0-100%).
    - Multi-Order Cascading Propagation:
      - *1st Order Direct Physics:* Road traction and speed degradation, outdoor excursion closure, airport holding patterns.
      - *2nd Order Operational Ripples:* Hotel lobby check-in peak backlog, indoor spa & dining capacity surge (+140%), fleet turnaround delays.
      - *3rd Order Ecosystem Ripples:* Chauffeur shift limit duty exceedance, perishable supply chain food delivery delays, customer CSAT volatility.
    - *Probabilistic Predictions & Confidence Intervals:* Modeled delay expectations with $\pm$ uncertainty ranges and revenue impact estimates.
    - *Actionable Autonomous Mitigation Execution:* Virtual counterfactual sandbox mode with a one-click "Execute Mitigation" action that pushes dispatch updates and re-routes directly into Bookit's live operations engine.

---

## 7. Global Modals & Shared Overlays

### 7.1 Payment & Tour Reservation Overlay (`PaymentOverlayModal`)
- **Visual Design:** Centered luxury modal with dark frosted glass accents, animated checkout steps, and verified SSL badge.
- **Workflow:**
  1. *Review Tour Circuit:* Destination cover, days, flight inclusions, private car details.
  2. *Guest Details:* Full name, email, and passport number verification.
  3. *Payment Processing:* Card / Net Banking / UPI simulation with automated escrow holding.
  4. *Confirmation:* Instant generation of booking reference (`BKIT-2026-X89`) and automatic redirection to active trip view.

### 7.2 Command Palette (`CommandPalette`)
- **Keybind:** `Cmd+K` / `Ctrl+K`
- **Visual Design:** Floating spotlight search bar with backdrop blur and keyboard shortcut navigation.
- **Capabilities:**
  - Switch between Consumer and Operator surfaces instantly.
  - Search any active tour, destination, traveler, or vendor.
  - Jump directly to specific itinerary days or disruption alert cards.

### 7.3 Themed Toast Notification System (`ThemedToast`)
- **Visual Design:** Dark navy glassmorphic pill (`bg-[#0A1224]/95`, `border border-white/15`, `shadow-2xl shadow-blue-950/50`) anchored at `bottom-6 right-6`.
- **Features:**
  - Contextual icons (Checkmark for success, Alert triangle for warnings, Sparkles for AI events).
  - Animated duration countdown line tracking remaining display time.
  - Manual dismiss button (`X`).

### 7.4 Traveler Profile & Preferences Modal (`ProfileModal` & `PreferencesModal`)
- **Visual Design:** Minimal white card with avatar management, role switcher button, and currency selector (INR ₹, USD $, EUR €, GBP £).
- **Features:** Direct access to biometric vault, notification toggles, and secure sign-out.

### 7.5 WhatsApp Concierge Drawer (`WhatsAppModal`)
- **Visual Design:** Emerald themed lifestyle concierge drawer simulating direct WhatsApp Web connection to Sarah's assigned Bookit Concierge Manager for bespoke on-demand requests.

---

*Specification maintained by Bookit Core Engineering & Product Design Team.*
