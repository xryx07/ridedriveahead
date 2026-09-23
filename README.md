# RideDriveAhead
> **Next-Generation Dual Mobility Platform: On-Demand Chauffeur for Your Car + Cab Booking**

RideDriveAhead is an enterprise-grade, two-sided mobility platform built around two core offerings:
1. **Hire a Driver (Drive My Car / On-Demand Chauffeur)**:
   - For drivers who want flexible gigs driving for a few hours (2h, 4h, 8h), special events/weddings, or 1–2 day outstation road trips without commercial taxi overhead.
   - For private car owners who want to relax during traffic, attend events/weddings without DUI worries, or take weekend road trips.
   - Automatic (AT) and Manual (MT) transmission matching.
2. **Book a Cab (Ola / Uber Model)**:
   - Instant city cabs and guaranteed advance-scheduled airport transfers with upfront locked fares.

---

## Key Differentiators & Highlights

1. **Dual Mobility Platform**:
   - **Hire a Driver**: Hourly packages (2h, 4h, 8h), Party & Wedding Chauffeurs (6h night safe), 1-Day (Agra/Neemrana) and 2-Day (Jaipur/Chandigarh) road trip chauffeurs.
   - **Book a Cab**: Instant city cabs & advance airport scheduled runs (2h to 30 days ahead) with Zero Surge Upfront Locks.
   - **Car Transmission Matching**: Certified drivers for Automatic (AT) and Manual (MT) personal cars.

2. **Driver Gig Marketplace & OS**:
   - Drivers can browse and claim hourly chauffeur gigs, wedding duties, 1-2 day road trips, or airport cab runs.
   - Verified Driving Qualifications: LMV Commercial Pro, Automatic AT, Manual MT, Luxury Car Badge.
   - Customer car handover checklist: initial fuel gauge verification, odometer logging, and scratch check.
   - Live duty elapsed timer with transparent ₹99/hr overtime rate and instant 24x7 IMPS bank cashout.

2. **Bank-Grade Driver KYC & Security (Day 1)**:
   - Sensitive government credentials (Aadhaar, PAN, Driving License, Vehicle RC) encrypted at rest using **AES-256-GCM**.
   - Decoupled Vault Architecture: Raw documents are never stored directly in primary transactional database tables.
   - PII field-level masking (`XXXX-XXXX-3019` for Aadhaar) across all internal and external APIs.
   - Tamper-evident KYC access audit logs tracking every view/download by compliance administrators.

3. **Driver Well-being & Fatigue Protection**:
   - Continuous driving-hours tracking (maximum 8 hours active driving per 24 hours).
   - Mandatory rest break nudges and intelligent scheduling prevents assigning trips that violate driver rest intervals.

4. **Dual Premium Mobile Apps**:
   - **Rider App**: Seamless phone OTP login, instant vs scheduled toggle, interactive airport quick-select, upfront fare breakdown, live tracking with 4-digit start OTP, in-app call/chat, and one-tap emergency SOS.
   - **Driver App**: KYC onboarding & status tracker, Online/Offline availability toggle, 30s instant dispatch modal, **Dedicated Scheduled Airport Rides Pool**, turn-by-turn navigation HUD with OTP verification, earnings dashboard, and rest-break meter.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Mobile Apps** | React Native (Expo), TypeScript, Zustand State Management, Lucide Icons |
| **Backend Services** | Java 17+, Spring Boot 3.2, Spring Cloud Gateway, Spring Security 6 |
| **Databases & Cache** | PostgreSQL 16 (Relational & Audit), Redis 7 (Tokens, Rate-limiting, Geo/PubSub) |
| **Security & Auth** | OAuth2 + JWT (Access + Refresh token rotation), AES-256-GCM Document Vault |
| **API Contract** | OpenAPI 3.0 / Swagger specification (`contracts/openapi.yaml`) |
| **Infrastructure** | Docker, Docker Compose, Multi-stage Maven builds |

---

## Repository Structure

```
ridedriveahead/
├── backend/                                # Spring Boot microservices workspace
│   ├── pom.xml                             # Multi-module root build descriptor
│   ├── docker-compose.yml                  # PostgreSQL, Redis & service definitions
│   ├── docker/init-db.sql                  # Database bootstrap schema & initial seeds
│   ├── common-lib/                         # Shared DTOs, Security Utils (AES-256 Vault), Exceptions
│   ├── api-gateway/                        # Spring Cloud API Gateway (Port 8080)
│   ├── auth-service/                       # JWT Authentication, Phone OTP & RBAC (Port 8081)
│   ├── booking-service/                    # Instant & Advance-Scheduled Lifecycle (Port 8082)
│   ├── driver-service/                     # KYC Vault, Availability, Fatigue Tracker (Port 8083)
│   ├── payment-service/                    # Fare Engine & Upfront Pricing (Port 8084)
│   └── notification-service/               # FCM Stub & Scheduled Trip Reminders (Port 8085)
├── apps/
│   ├── rider-app/                          # React Native Rider Application
│   │   ├── package.json
│   │   ├── src/screens/                    # 8 Core Rider Screens
│   │   ├── src/store/                      # Zustand state store
│   │   └── src/api/                        # Typed API client with mock/live toggle
│   └── driver-app/                         # React Native Driver Application
│       ├── package.json
│       ├── src/screens/                    # 7 Core Driver Screens
│       ├── src/store/                      # Zustand state store
│       └── src/api/                        # Typed API client with mock/live toggle
├── contracts/
│   └── openapi.yaml                        # Complete OpenAPI 3.0 Contract Specification
└── README.md                               # Project documentation & runbook
```

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v22) & npm
- **Java**: OpenJDK 17 or higher
- **Maven**: 3.8+ (or bundled `mvnw`)
- **Docker & Docker Compose** (optional for running local databases)

---

### 2. Running Local Infrastructure (PostgreSQL & Redis)

```bash
cd backend
docker-compose up -d postgres redis
```

This will initialize:
- **PostgreSQL** on port `5432` (`ridedriveahead_db` with user `postgres` and password `postgres`)
- **Redis** on port `6379`

---

### 3. Running Backend Services

You can build all services using Maven from the `backend/` directory:

```bash
cd backend
mvn clean install -DskipTests
```

Run individual microservices:
```bash
# Terminal 1: Auth Service (Port 8081)
cd backend/auth-service
mvn spring-boot:run

# Terminal 2: Booking Service (Port 8082)
cd backend/booking-service
mvn spring-boot:run

# Terminal 3: Driver Service (Port 8083)
cd backend/driver-service
mvn spring-boot:run

# Terminal 4: API Gateway (Port 8080)
cd backend/api-gateway
mvn spring-boot:run
```

*Note on Testing:* For local development and demo testing, mock OTP is automatically enabled. You can use any phone number (e.g., `+919876543210`) with verification OTP `123456`.

---

### 4. Running the Mobile Apps

#### Rider App
```bash
cd apps/rider-app
npm install
npm start
```
- Press `w` to launch in Web browser preview.
- Press `a` or scan the QR code via Expo Go for Android.
- Press `i` for iOS Simulator.

#### Driver App
```bash
cd apps/driver-app
npm install
npm start
```
- Features a driver-centric dark mode HUD with instant order dispatch cards, scheduled airport ride claims, and live navigation OTP validation.

---

## Advance-Scheduled Trip State Lifecycle

```
[ Rider Books Airport Ride (e.g. tomorrow 05:00 AM) ]
                    │
                    ▼
          [ SCHEDULED_CONFIRMED ] ── Fare locked upfront (No surge surprises)
                    │
                    ▼
          [ ASSIGNED_TO_DRIVER ] ── Driver claims trip from Scheduled Pool
                    │
    ┌───────────────┴───────────────┐
    ▼                               ▼
[ T-12h Evening Alert ]    [ T-2h Wake-up Confirmation ]
(Driver confirms plan)     (If unconfirmed ➔ Auto-reassign to Standby Pool)
                    │
                    ▼
          [ DRIVER_EN_ROUTE ] ── Live GPS tracking begins
                    │
                    ▼
        [ ARRIVED_AT_PICKUP ] ── Rider receives arrival notification
                    │
                    ▼
        [ TRIP_IN_PROGRESS ] ── Driver enters Rider's 4-digit OTP
                    │
                    ▼
              [ COMPLETED ] ── Auto-payment settlement & rating
```

---

## Security & Compliance Architecture

- **KYC Vault**: Aadhaar, PAN, and License documents are encrypted using `AES/GCM/NoPadding` with a 256-bit key stored securely in environment vault configuration.
- **Audit Trails**: Every decryption or compliance review generates an immutable `KycAuditLog` record containing `actorId`, `ipAddress`, and `timestamp`.
- **PII Masking**: Government identifiers are masked at serialization time (`XXXX-XXXX-1234`), ensuring raw numbers are never exposed in log files or mobile clients.
- **Rate Limiting**: Public auth and OTP endpoints are protected by token-bucket rate limiters in the API Gateway.
