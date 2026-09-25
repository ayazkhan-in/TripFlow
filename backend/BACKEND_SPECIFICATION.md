# TripFlow — Backend Architecture, PostgreSQL Schema & API Specification

> **Platform:** TripFlow Luxury Travel Concierge & Real-time Operations  
> **Backend Stack:** Node.js (TypeScript) + Express.js  
> **Database:** PostgreSQL (with Prisma ORM & JSONB support)  
> **AI Services:** Google Gemini API (`@google/genai` — `gemini-2.5-flash` / `gemini-1.5-pro`)  
> **Media & Documents Storage:** Cloudinary (PDFs, Images, Boarding Passes, Signed URLs)  
> **Real-time Protocol:** WebSockets (Socket.io) for telemetry & disruption dispatch

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Third-Party Integrations](#2-third-party-integrations)
   - [PostgreSQL Database Engine](#21-postgresql-database-engine)
   - [Google Gemini API Integration](#22-google-gemini-api-integration)
   - [Cloudinary Media & Document Storage](#23-cloudinary-media--document-storage)
3. [PostgreSQL Relational Database Schema](#3-postgresql-relational-database-schema)
   - [Entity Relationship Diagram (ERD)](#31-entity-relationship-diagram-erd)
   - [SQL DDL & Prisma Data Models](#32-sql-ddl--prisma-data-models)
4. [Complete RESTful API Endpoints](#4-complete-restful-api-endpoints)
   - [Module 1: Authentication & User Profiles](#module-1-authentication--user-profiles)
   - [Module 2: Discover, Curated Circuits & AI Generation](#module-2-discover-curated-circuits--ai-generation)
   - [Module 3: Itinerary Builder & Dynamic Pricing](#module-3-itinerary-builder--dynamic-pricing)
   - [Module 4: Bookings, Payments & Price Delta Modifications](#module-4-bookings-payments--price-delta-modifications)
   - [Module 5: Travel Vault & Document OCR Scanner](#module-5-travel-vault--document-ocr-scanner)
   - [Module 6: Real-time Telemetry & GPS Tracking](#module-6-real-time-telemetry--gps-tracking)
   - [Module 7: Operator Command Hub & Tour Dispatch](#module-7-operator-command-hub--tour-dispatch)
   - [Module 8: Cloudinary Media Uploads](#module-8-cloudinary-media-uploads)
5. [Environment Configuration (`.env`)](#5-environment-configuration-env)
6. [Implementation Roadmap](#6-implementation-roadmap)

---

## 1. System Architecture Overview

```mermaid
graph TD
    Client[TripFlow Frontend React/Vite] -->|REST / JSON| Gateway[Express.js API Gateway]
    Client -->|WebSocket| WSServer[Real-time Telemetry WS]
    
    Gateway --> Auth[JWT & RBAC Middleware]
    Auth --> ItineraryService[Itinerary & Pricing Engine]
    Auth --> BookingService[Booking & Payment Service]
    Auth --> VaultService[Travel Vault Service]
    Auth --> OpsService[Operator Command Service]

    VaultService --> Cloudinary[Cloudinary CDN / Storage]
    VaultService --> GeminiVision[Gemini 2.5 Flash Vision OCR]
    ItineraryService --> GeminiText[Gemini 2.5 Flash Trip Planner]
    
    BookingService --> PostgreSQL[(PostgreSQL Database)]
    ItineraryService --> PostgreSQL
    VaultService --> PostgreSQL
    OpsService --> PostgreSQL
```

---

## 2. Third-Party Integrations

### 2.1 PostgreSQL Database Engine
* **Role:** Single source of truth for users, bookings, itineraries, catalog activities, vault metadata, vendor supply, cohorts, guides, and payment ledgers.
* **Key Features Utilized:**
  * **UUID primary keys** for tamper-proof booking references and distributed scaling.
  * **JSONB fields** for flexible dynamic elements (e.g. `transitToNext`, `flightDetails`, `hotelCheckIn`, `extractedFields`).
  * **B-tree and GIN indexes** on `user_id`, `trip_id`, `category`, and JSONB keys for high-speed queries.
  * **Foreign Key Constraints** with cascading deletes where appropriate.

### 2.2 Google Gemini API Integration (`@google/genai`)
* **SDK:** `@google/genai` (version `^2.4.0`)
* **Primary Models:**
  1. `gemini-2.5-flash` / `gemini-1.5-flash`: Fast, low-latency execution for interactive OCR document extraction and itinerary day recommendations.
  2. `gemini-1.5-pro`: Deep multimodal reasoning for disruption rerouting and itinerary optimization.
* **Core Backend Workflows:**
  * **Document Scanner (OCR & Classification):** Takes Base64 or Cloudinary URL of boarding passes, passports, hotel slips, and national IDs. Extracts PNRs, MRZ strings, dates, traveler names, issuing carriers, and automatically tags the document category.
  * **AI Living Itinerary Generator:** Synthesizes destination, budget slider value, travel dates, style, and interests into a full day-by-day JSON schedule with realistic times, cost estimates, and transit legs.
  * **Incident Resolution Assistant:** Analyzes airline delays or road closures and suggests alternative chauffeur routes or flight rebookings for operators.

### 2.3 Cloudinary Media & Document Storage
* **SDK:** `cloudinary` (version `^2.5.0`)
* **Folder Hierarchy in Cloudinary:**
  * `tripflow/vault/passports/` — Biometric passport scans & national IDs (**Signed, Authenticated URLs** only, strictly confidential).
  * `tripflow/vault/tickets/` — Boarding passes, train tickets, e-ticket PDFs.
  * `tripflow/vault/vouchers/` — Hotel confirmation folios and catamaran passes.
  * `tripflow/itineraries/` — Destination hero covers and activity gallery photos.
  * `tripflow/avatars/` — Traveler and tour guide profile pictures.
* **Key Security & Processing Features:**
  * **Signed Upload Presets:** Frontend requests a cryptographic signature (`/api/media/signature`) and uploads directly to Cloudinary, reducing server memory load.
  * **Authenticated Secure URLs:** Passports and confidential credentials require a time-limited signed URL (`expiry: 3600s`) generated by the backend.
  * **Automatic Transformations:** Image compression (`f_auto,q_auto`), thumbnail creation (`w_300,h_200,c_fill`), and PDF thumbnail rasterization (`page: 1`).

---

## 3. PostgreSQL Relational Database Schema

### 3.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ BOOKED_TRIPS : "places"
    USERS ||--o{ TRIP_ITINERARIES : "authors"
    USERS ||--o{ VAULT_DOCUMENTS : "owns"
    USERS ||--o{ SAVED_JOURNEYS : "bookmarks"
    
    TRIP_ITINERARIES ||--o{ ROUTE_STOPS : "contains"
    TRIP_ITINERARIES ||--o{ ITINERARY_DAYS : "contains"
    ITINERARY_DAYS ||--o{ ITINERARY_ITEMS : "schedules"
    CATALOG_ITEMS ||--o{ ITINERARY_ITEMS : "instantiates"

    TRIP_ITINERARIES ||--o| BOOKED_TRIPS : "converts_to"
    BOOKED_TRIPS ||--o{ VAULT_DOCUMENTS : "generates"
    BOOKED_TRIPS ||--o{ PAYMENT_TRANSACTIONS : "bills"

    TOUR_COHORTS ||--o{ DISRUPTIONS_ALERTS : "experiences"
    TOUR_GUIDES ||--o{ TOUR_COHORTS : "leads"
    VENDORS ||--o{ PAYMENT_TRANSACTIONS : "receives"
```

---

### 3.2 SQL DDL & Prisma Data Models

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  TRAVELER
  OPERATOR
  ADMIN
}

enum TripStatus {
  DRAFT
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum VaultCategory {
  PASSPORT
  VISA
  FLIGHT
  HOTEL
  INSURANCE
  ID
  ACTIVITY
  TRANSIT
  PERMIT
  EMERGENCY
  OTHER
}

enum ItineraryItemCategory {
  ACTIVITY
  HOTEL
  TRANSPORT
  MEAL
  EXPERIENCE
}

enum AlertSeverity {
  CRITICAL
  HIGH
  MODERATE
  RESOLVED
}

enum PaymentStatus {
  SETTLED
  PROCESSING
  HELD
  FAILED
}

model User {
  id              String           @id @default(uuid())
  email           String           @unique
  passwordHash    String
  name            String
  role            Role             @default(TRAVELER)
  avatarUrl       String?
  phone           String?
  membershipTier  String           @default("Concierge Elite Member")
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  trips           TripItinerary[]
  bookedTrips     BookedTrip[]
  vaultDocuments  VaultDocument[]
  savedJourneys   SavedJourney[]
  transactions    PaymentTransaction[]
}

model TripItinerary {
  id              String          @id @default(uuid())
  userId          String
  title           String
  destination     String
  country         String
  dates           String
  startDate       DateTime
  travelers       Int             @default(2)
  currency        String          @default("USD")
  totalPrice      Decimal         @db.Decimal(12, 2)
  heroImageUrl    String?
  isPremade       Boolean         @default(false)
  status          TripStatus      @default(DRAFT)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  routeStops      RouteStop[]
  days            ItineraryDay[]
  bookedTrip      BookedTrip?
}

model RouteStop {
  id              String          @id @default(uuid())
  itineraryId     String
  stopOrder       Int
  city            String
  weatherInfo     String?
  hotelName       String?
  transitMode     String?         // flight, train, car

  itinerary       TripItinerary   @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
}

model ItineraryDay {
  id              String          @id @default(uuid())
  itineraryId     String
  dayNumber       Int
  dateStr         String
  title           String
  subtitle        String?
  
  itinerary       TripItinerary   @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
  items           ItineraryItem[]
}

model ItineraryItem {
  id              String                 @id @default(uuid())
  dayId           String
  catalogItemId   String?
  title           String
  category        ItineraryItemCategory
  price           Decimal                @db.Decimal(10, 2)
  timeSlot        String
  duration        String?
  location        String
  description     String
  imageUrl        String
  rating          Decimal?               @db.Decimal(3, 2)
  reviewsCount    Int?                   @default(0)
  tags            String[]
  notes           String?
  transitToNext   Json?                  // { mode: 'car' | 'flight' | 'walk', duration: string, distance?: string }

  day             ItineraryDay           @relation(fields: [dayId], references: [id], onDelete: Cascade)
  catalogItem     CatalogItem?           @relation(fields: [catalogItemId], references: [id], onDelete: SetNull)
}

model CatalogItem {
  id              String                 @id @default(uuid())
  title           String
  category        ItineraryItemCategory
  price           Decimal                @db.Decimal(10, 2)
  timeSlotDefault String
  duration        String
  location        String
  description     String
  imageUrl        String
  rating          Decimal                @db.Decimal(3, 2)
  reviewsCount    Int                    @default(0)
  tags            String[]
  isActive        Boolean                @default(true)
  createdAt       DateTime               @default(now())

  itineraryItems  ItineraryItem[]
}

model BookedTrip {
  id              String          @id @default(uuid())
  itineraryId     String          @unique
  userId          String
  bookingRef      String          @unique
  title           String
  destination     String
  dates           String
  duration        String
  travelers       Int
  totalPrice      Decimal         @db.Decimal(12, 2)
  currency        String          @default("USD")
  status          TripStatus      @default(CONFIRMED)
  bookedAt        DateTime        @default(now())
  heroImageUrl    String

  // Logistics Bento JSONB Data
  flightDetails   Json            // { airline, flightNumber, pnr, route, departureTime, arrivalTime, terminal, gate, seat, baggage, status }
  hotelCheckIn    Json            // { hotelName, roomType, checkInDate, checkInTime, checkOutDate, voucherRef, address, inclusions: [], nights }
  carDetails      Json            // { vehicleType, vehicleModel, licensePlate, chauffeurName, chauffeurPhone, chauffeurRating, pickupLocation, pickupTime, serviceScope, gpsTrackingActive }

  itinerary       TripItinerary   @relation(fields: [itineraryId], references: [id])
  user            User            @relation(fields: [userId], references: [id])
  vaultDocuments  VaultDocument[]
  transactions    PaymentTransaction[]
}

model VaultDocument {
  id              String          @id @default(uuid())
  userId          String
  tripId          String?
  bookedTripId    String?
  category        VaultCategory
  title           String
  travelerName    String
  documentNumber  String?
  issueDate       String?
  expiryDate      String?
  status          String          @default("verified") // verified | valid | expiring-soon | confirmed
  fileUrl         String          // Cloudinary secure_url
  filePublicId    String          // Cloudinary public_id
  fileType        String          // pdf | png | jpg | qr
  fileSize        String
  uploadedAt      DateTime        @default(now())
  notes           String?
  verifiedBy      String?         @default("TripFlow AI Optical OCR")
  offlineReady    Boolean         @default(true)
  fields          Json?           // Extracted MRZ, Seat, Room, PNR fields
  isEncrypted     Boolean         @default(true)

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookedTrip      BookedTrip?     @relation(fields: [bookedTripId], references: [id], onDelete: SetNull)
}

model EmergencyContact {
  id              String          @id @default(uuid())
  tripId          String?
  role            String
  name            String
  phone           String
  availableHours  String          @default("24/7")
  badge           String
  location        String?
  notes           String?
  isGlobal        Boolean         @default(false)
}

model SavedJourney {
  id              String          @id @default(uuid())
  userId          String
  title           String
  origin          String
  destination     String
  dates           String
  duration        String
  travelers       Int
  price           String
  imageUrl        String
  description     String
  category        String          // domestic | international
  isBookmarked    Boolean         @default(true)
  rating          String?
  amenities       Json?           // [{ icon: string, label: string }]

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// -------------------------------------------------------------
// OPERATOR COMMAND HUB MODELS
// -------------------------------------------------------------

model TourCohort {
  id              String          @id @default(uuid())
  name            String
  circuit         String
  dates           String
  leadGuideId     String?
  paxCount        Int
  maxPax          Int
  progressPercent Int             @default(0)
  currentStop     String
  nextMilestone   String
  status          String          @default("In Progress") // In Progress | Upcoming | Completed
  vipCount        Int             @default(0)
  createdAt       DateTime        @default(now())

  leadGuide       TourGuide?      @relation(fields: [leadGuideId], references: [id])
  alerts          DisruptionAlert[]
}

model TourGuide {
  id              String          @id @default(uuid())
  name            String
  role            String          // Master Guide | Private Concierge | Licensed Chauffeur | Cultural Specialist
  languages       String[]
  rating          Decimal         @db.Decimal(3, 2)
  totalTours      Int             @default(0)
  status          String          @default("Available") // On Tour | Available | Off-Duty
  location        String
  phone           String
  avatarUrl       String
  certifications  String[]

  cohorts         TourCohort[]
}

model Vendor {
  id               String         @id @default(uuid())
  name             String
  category         String         // hotel | flight | train | fleet | dining | experience
  region           String
  rating           Decimal        @db.Decimal(3, 2)
  slaCompliance    Int            @default(99)
  activeContracts  Int            @default(1)
  contactPerson    String
  phone            String
  email            String
  status           String         @default("Active") // Active | Under Review | Suspended
  contractRenewal  DateTime
  imageUrl         String?

  transactions     PaymentTransaction[]
}

model DisruptionAlert {
  id                 String       @id @default(uuid())
  cohortId           String?
  tourTitle          String
  severity           AlertSeverity
  title              String
  description        String
  affectedTravelers  Int
  category           String       // flight | weather | transport | hotel | medical
  actionSuggested    String
  isResolved         Boolean      @default(false)
  resolvedAt         DateTime?
  resolvedBy         String?
  createdAt          DateTime     @default(now())

  cohort             TourCohort?  @relation(fields: [cohortId], references: [id], onDelete: SetNull)
}

model PaymentTransaction {
  id              String          @id @default(uuid())
  transactionRef  String          @unique
  bookedTripId    String?
  vendorId        String?
  userId          String?
  party           String
  type            String          // inbound | outbound | escrow
  amount          Decimal         @db.Decimal(12, 2)
  currency        String          @default("USD")
  status          PaymentStatus   @default(SETTLED)
  paymentMethod   String
  description     String
  createdAt       DateTime        @default(now())

  bookedTrip      BookedTrip?     @relation(fields: [bookedTripId], references: [id])
  vendor          Vendor?         @relation(fields: [vendorId], references: [id])
  user            User?           @relation(fields: [userId], references: [id])
}

model CalendarTourEvent {
  id              String          @id @default(uuid())
  title           String
  cohortName      String
  eventDate       DateTime
  timeSlot        String
  eventType       String          // departure | checkin | transfer | experience | return
  location        String
  color           String
  pax             Int
}
```

---

## 4. Complete RESTful API Endpoints

### Module 1: Authentication & User Profiles
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new traveler or operator | Public |
| `POST` | `/api/v1/auth/login` | Login with email/password; returns JWT token | Public |
| `POST` | `/api/v1/auth/logout` | Revoke session / clear JWT cookie | Private |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile and membership | Private |
| `PUT` | `/api/v1/users/profile` | Update profile details (phone, avatar, name) | Private |
| `GET` | `/api/v1/users/saved-journeys` | Fetch bookmarked/saved journeys for the user | Private |
| `POST` | `/api/v1/users/saved-journeys/:id/bookmark` | Toggle journey bookmark | Private |

#### Sample Request: `POST /api/v1/auth/login`
```json
{
  "email": "sarah.mehta@concierge.tripflow.io",
  "password": "SecurePassword123!"
}
```
#### Sample Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-sarah-1024",
    "name": "Sarah Mehta",
    "email": "sarah.mehta@concierge.tripflow.io",
    "role": "TRAVELER",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "membershipTier": "Concierge Elite Member"
  }
}
```

---

### Module 2: Discover, Curated Circuits & AI Generation
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/discover/premade` | Get all verified premade packages (Kerala, Rajasthan, Goa) | Public |
| `GET` | `/api/v1/discover/premade/:slug` | Get specific premade package with full days & stops | Public |
| `POST` | `/api/v1/discover/ai-generate` | **Gemini 2.5 Flash** generates dynamic custom itinerary from parameters | Private |

#### Sample Request: `POST /api/v1/discover/ai-generate`
```json
{
  "destination": "Kerala, India",
  "subLocations": "Kochi · Munnar · Alleppey",
  "days": 5,
  "startDate": "2025-10-14",
  "travelers": 2,
  "budget": 3500,
  "travelStyle": "Luxury Concierge",
  "interests": ["Tea Estates", "Private Houseboat", "Ayurveda"]
}
```
#### Gemini Integration Logic:
1. Passes structured prompt into `aiClient.models.generateContent({ model: 'gemini-2.5-flash', ... })`.
2. Validates output matches `TripItinerary` JSON format.
3. Automatically sets transit distances and costs based on the specified budget tier.
4. Returns the generated itinerary object ready to be edited in the Builder.

---

### Module 3: Itinerary Builder & Dynamic Pricing
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/catalog/items` | Fetch activities catalog with category and price filters | Public |
| `GET` | `/api/v1/itineraries/:id` | Fetch full itinerary with days, items, and stops | Private |
| `POST` | `/api/v1/itineraries` | Save a new draft itinerary | Private |
| `PUT` | `/api/v1/itineraries/:id` | Update itinerary title, travelers, dates | Private |
| `POST` | `/api/v1/itineraries/:id/days` | Add an extra day to itinerary | Private |
| `DELETE` | `/api/v1/itineraries/:id/days/:dayId` | Remove a day from itinerary | Private |
| `POST` | `/api/v1/itineraries/days/:dayId/items` | Add catalog or custom item to a day | Private |
| `PUT` | `/api/v1/itineraries/items/:itemId` | Update scheduled time, price, notes of an item | Private |
| `DELETE` | `/api/v1/itineraries/items/:itemId` | Remove an item from a day | Private |
| `POST` | `/api/v1/itineraries/:id/recalculate` | Recalculate price breakdown (total, per person, taxes) | Private |

#### Sample Response: `POST /api/v1/itineraries/:id/recalculate`
```json
{
  "success": true,
  "pricing": {
    "subtotal": 2450.00,
    "taxesAndFees": 245.00,
    "conciergeServiceFee": 150.00,
    "total": 2845.00,
    "perPerson": 1422.50,
    "currency": "USD",
    "byCategory": {
      "hotel": 1200.00,
      "transport": 750.00,
      "activity": 500.00,
      "meal": 395.00
    }
  }
}
```

---

### Module 4: Bookings, Payments & Price Delta Modifications
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings/checkout` | Process payment and convert `TripItinerary` to confirmed `BookedTrip` | Private |
| `GET` | `/api/v1/bookings/my-trips` | Retrieve all booked trips for authenticated user | Private |
| `GET` | `/api/v1/bookings/:id` | Retrieve single booked trip with flight, hotel, and car logistics | Private |
| `POST` | `/api/v1/bookings/:id/modify` | **Modify Trip Flow:** Re-open in builder, adjust items, calculate **Price Delta**, charge/refund difference | Private |
| `POST` | `/api/v1/bookings/:id/cancel` | Request cancellation / calculate refund | Private |

#### Sample Request: `POST /api/v1/bookings/:id/modify`
```json
{
  "updatedItinerary": { "...full modified itinerary object..." },
  "newTotalPrice": 3100.00,
  "originalTotalPrice": 2845.00
}
```
#### Sample Response:
```json
{
  "success": true,
  "bookingRef": "TF-KL-88392",
  "priceDelta": 255.00,
  "action": "ADDITIONAL_CHARGE_SUCCESSFUL",
  "newTotal": 3100.00,
  "updatedBookedTrip": {
    "id": "booked-trip-7721",
    "title": "Kerala Monsoon Whispers & Backwaters",
    "status": "CONFIRMED",
    "flightDetails": { "...synced PNR..." },
    "hotelCheckIn": { "...updated voucher..." },
    "carDetails": { "...assigned chauffeur..." }
  },
  "vaultUpdated": true
}
```

---

### Module 5: Travel Vault & Document OCR Scanner
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/vault/documents` | Fetch all vault documents (filtered by `tripId`, `category`, `q`) | Private |
| `POST` | `/api/v1/vault/classify-ai` | **Gemini Vision OCR:** Extract PNR, MRZ, dates, classify category | Private |
| `POST` | `/api/v1/vault/upload` | Upload document to Cloudinary & store encrypted record in DB | Private |
| `GET` | `/api/v1/vault/documents/:id/secure-url` | Generate temporary 1-hour signed Cloudinary download URL | Private |
| `DELETE` | `/api/v1/vault/documents/:id` | Purge document from DB and Cloudinary | Private |
| `GET` | `/api/v1/vault/emergency-contacts` | Fetch 24/7 circuit emergency lines & doctor contacts | Private |
| `GET` | `/api/v1/vault/bundle-export` | Download AES-256 encrypted offline zip of all trip credentials | Private |

#### Sample Request: `POST /api/v1/vault/classify-ai`
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "hint": "Air India boarding pass"
}
```
#### Sample Response:
```json
{
  "success": true,
  "category": "flight",
  "confidence": 0.98,
  "suggestedTitle": "Air India AI-682 Digital Boarding Pass",
  "documentNumber": "AI-682 / PNR: KOK682",
  "travelerName": "Sarah Mehta",
  "issueDate": "Oct 14, 2025",
  "expiryDate": "Oct 14, 2025",
  "extractedFields": {
    "Flight": "AI-682 (BOM → COK)",
    "Seat": "14A (Window, Premium)",
    "Gate": "Terminal 2 · Gate 42B",
    "Boarding Time": "12:45 PM",
    "Class": "Premium Economy"
  },
  "summary": "Air India boarding pass confirmed for BOM to COK flight."
}
```

---

### Module 6: Real-time Telemetry & GPS Tracking
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/telemetry/flight/:pnr` | Live flight status (ADS-B radar, gate changes, delays) | Private |
| `GET` | `/api/v1/telemetry/chauffeur/:tripId` | Live chauffeur GPS coordinates, ETA, vehicle speed | Private |
| `POST` | `/api/v1/telemetry/disruptions/resolve` | Push disruption resolution telemetry to traveler & driver | Private |

#### Sample WebSocket Events (`/socket.io`):
* `flight:status_update` — `{ pnr: "KOK682", status: "Landed", belt: "02" }`
* `chauffeur:location` — `{ tripId: "...", lat: 9.9312, lng: 76.2673, eta: "12 mins" }`
* `disruption:broadcast` — Alert broadcast across operator command console.

---

### Module 7: Operator Command Hub & Tour Dispatch
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/operator/stats` | High-level metrics (active pax, revenue, open issues) | Operator |
| `GET` | `/api/v1/operator/cohorts` | List active, upcoming, and completed tour groups | Operator |
| `POST` | `/api/v1/operator/cohorts` | Create a new tour cohort | Operator |
| `GET` | `/api/v1/operator/guides` | Tour guide staff directory with availability & ratings | Operator |
| `PUT` | `/api/v1/operator/guides/:id/assign` | Assign guide to tour cohort | Operator |
| `GET` | `/api/v1/operator/vendors` | Vendor supply contracts (hotels, transport, flights) | Operator |
| `GET` | `/api/v1/operator/alerts` | Real-time disruption alerts stream | Operator |
| `PUT` | `/api/v1/operator/alerts/:id/resolve`| Mark alert resolved with telemetry notification | Operator |
| `GET` | `/api/v1/operator/ledger` | Inbound, outbound, and escrow payments ledger | Operator |
| `GET` | `/api/v1/operator/calendar` | Global operations calendar events | Operator |

---

### Module 8: Cloudinary Media Uploads
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/signature` | Generate signed upload parameters for direct client upload | Private |
| `DELETE` | `/api/v1/media/:publicId` | Delete media asset from Cloudinary | Private |

#### Sample Request: `POST /api/v1/media/signature`
```json
{
  "folder": "tripflow/vault/passports",
  "tags": ["traveler_credential", "user_1024"]
}
```
#### Sample Response:
```json
{
  "timestamp": 1727289600,
  "signature": "d41d8cd98f00b204e9800998ecf8427e",
  "apiKey": "your_cloudinary_api_key",
  "cloudName": "tripflow-cloud",
  "folder": "tripflow/vault/passports"
}
```

---

## 5. Environment Configuration (`.env`)

```ini
# =============================================================
# SERVER CONFIGURATION
# =============================================================
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# =============================================================
# POSTGRESQL DATABASE
# =============================================================
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/tripflow_db?schema=public"

# =============================================================
# GOOGLE GEMINI API
# =============================================================
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# =============================================================
# CLOUDINARY MEDIA & DOCUMENT STORAGE
# =============================================================
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# =============================================================
# JWT AUTHENTICATION
# =============================================================
JWT_SECRET="super_secret_jwt_encryption_key_at_least_32_chars"
JWT_EXPIRES_IN="7d"

# =============================================================
# OPTIONAL INTEGRATIONS
# =============================================================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 6. Implementation Roadmap

### Phase 1: Database Setup & Prisma Migration
1. Provision local PostgreSQL database `tripflow_db`.
2. Run `npx prisma init` in `backend/` and apply the Prisma schema defined in Section 3.
3. Run `npx prisma migrate dev --name init_tripflow_schema`.
4. Seed initial curated itineraries (Kerala, Rajasthan, Goa) and mock operator data with `npx prisma db seed`.

### Phase 2: Cloudinary & Gemini Services
1. Configure `backend/src/services/cloudinaryService.ts` for signed uploads and private document URLs.
2. Configure `backend/src/services/geminiService.ts` for Vision OCR classification and AI itinerary generation.

### Phase 3: Route Controllers & Middleware
1. Implement JWT auth middleware with role-based permissions (`TRAVELER` vs `OPERATOR`).
2. Implement Itinerary & Booking controllers with price recalculation logic.
3. Implement Vault controller with Cloudinary upload and Gemini extraction.
4. Implement Operator suite endpoints.

### Phase 4: Frontend Hookup
1. Connect `frontend/src/components/consumer/DiscoverScreen.tsx` to `POST /api/v1/discover/ai-generate`.
2. Connect `frontend/src/components/itinerary/BookingSummaryModal.tsx` to `POST /api/v1/bookings/checkout`.
3. Connect `frontend/src/components/consumer/DocumentScannerModal.tsx` to `POST /api/v1/vault/classify-ai`.
4. Connect `frontend/src/components/consumer/TravelVaultScreen.tsx` to `GET /api/v1/vault/documents`.
