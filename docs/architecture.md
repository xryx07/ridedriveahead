# System Architecture: RideDriveAhead

This document provides an overview of the microservices architecture, data storage layers, communication protocols, and security boundaries.

---

## 1. High-Level Architecture

```
                                  ┌─────────────────────────────┐
                                  │   Rider App (React Native)  │
                                  │   Driver App (React Native) │
                                  └──────────────┬──────────────┘
                                                 │ HTTPS / WSS
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Spring Cloud Gateway    │
                                  │  (Port 8080 - Unified Entry)│
                                  └──────────────┬──────────────┘
                     ┌───────────────────────────┼───────────────────────────┐
                     ▼                           ▼                           ▼
          ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
          │     Auth Service    │     │   Booking Service   │     │    Driver Service   │
          │     (Port 8081)     │     │     (Port 8082)     │     │     (Port 8083)     │
          │  - Phone OTP        │     │  - Instant Trips    │     │  - KYC Vault (AES)  │
          │  - JWT + Rotation   │     │  - Advance Schedule │     │  - Online/Offline   │
          │  - RBAC (Rider/Drv) │     │  - State Machine    │     │  - Fatigue/Rest Mon │
          └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘
                     │                           │                           │
                     └───────────────────────────┼───────────────────────────┘
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │       Payment Service       │
                                  │         (Port 8084)         │
                                  │  - Upfront Fare Calculation │
                                  │  - UPI / Cards / Wallet     │
                                  └──────────────┬──────────────┘
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │    Notification Service     │
                                  │         (Port 8085)         │
                                  │  - Push Notifications (FCM) │
                                  │  - Scheduled Trip Reminders │
                                  └─────────────────────────────┘
```

---

## 2. Microservice Boundaries

### API Gateway (`backend/api-gateway` • Port 8080)
- Single entrypoint for mobile clients.
- Routes `/api/v1/auth/**`, `/api/v1/bookings/**`, `/api/v1/drivers/**`, `/api/v1/payments/**`, `/api/v1/notifications/**`.
- Global CORS configuration and centralized rate-limiting.

### Auth Service (`backend/auth-service` • Port 8081)
- Phone OTP issuance & verification.
- HMAC-SHA256 signed JWT tokens with expiration (24 hours).
- Refresh Token Rotation (30 days) with revocation.
- Role-Based Access Control (`ROLE_RIDER`, `ROLE_DRIVER`, `ROLE_ADMIN`).

### Booking Service (`backend/booking-service` • Port 8082)
- Upfront fare calculation engine with vehicle tier pricing.
- Creation of Instant and Advance-Scheduled rides (60 min to 30 days ahead).
- 4-digit trip start OTP generation (`otpCode`).
- State machine lifecycle (`DRAFT`, `SCHEDULED_CONFIRMED`, `ASSIGNED`, `EN_ROUTE`, `ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- Background job `ScheduledRideReminderJob` running every minute to detect rides approaching reminder windows.

### Driver Service (`backend/driver-service` • Port 8083)
- Bank-grade AES-256 KYC Document Vault storing Aadhaar, PAN, DL, and RC encrypted at rest.
- PII field masking (`XXXX-XXXX-3019`).
- Immutable compliance audit logging for document access.
- Online/Offline availability toggle.
- Available scheduled rides pool for drivers to claim in advance.
- Continuous driving-hours tracking (max 8 hours/day limit to prevent driver fatigue).

### Payment Service (`backend/payment-service` • Port 8084)
- Upfront pricing guarantee engine (zero surge on scheduled rides).
- Mock UPI, Card, and In-App Wallet settlement.
- Itemized invoice and tax calculation (5% GST).

### Notification Service (`backend/notification-service` • Port 8085)
- Firebase Cloud Messaging (FCM) push notification triggers.
- Multi-tier scheduled trip reminders (T-12h evening alert, T-2h morning readiness).
- Emergency roadside and safety dispatch telemetry.

### Rental Marketplace & Partner Service (`backend/rental-service` • Modular Monolith / Port 8086)
- Multi-category fleet catalog (Cars & Bikes) with dual booking modes:
  - `SELF_DRIVE`: Daily/Hourly rental with fixed deposit and free km allowance.
  - `WITH_DRIVER`: Rent car/bike paired with a certified professional captain.
- Flexible delivery fulfillment:
  - `CUSTOMER_PICKUP`: Collect directly from host/hub location.
  - `DOORSTEP_DELIVERY`: Vehicle delivered and collected at customer's doorstep.
- Digital Handover & Inspection Protocol:
  - Pre-trip handover: Odometer reading, fuel/battery percentage, 360° photo upload, and pre-existing damage checklist.
  - Post-trip return: Odometer delta, extra km computation, fuel/battery reconciliation, damage audit, and instant security deposit release.
- Rental Partner / Host Console: Vehicle registration, RC/PUC/Insurance verification, delivery radius tuning, and payout tracking.

---

## 3. Data Architecture & Normalized PostgreSQL Schema

PostgreSQL serves as the primary relational source of truth for all operational entities, guaranteeing ACID transactions for rides, rentals, payments, and audits. Redis is utilized for high-throughput ephemeral states (driver Geo-indices, live telemetry, and rate limiting).

```sql
-- =============================================================
-- RIDEDRIVEAHEAD NORMALIZED POSTGRESQL RELATIONAL SCHEMA
-- =============================================================

-- 1. USERS & IDENTITY
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120),
    role VARCHAR(20) NOT NULL CHECK (role IN ('RIDER', 'DRIVER', 'RENTAL_HOST', 'ADMIN')),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    corporate_account_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DRIVER PROFILES & AES-256 ENCRYPTED KYC VAULT
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL,
    active_mode VARCHAR(30) DEFAULT 'CAB' CHECK (active_mode IN ('CAB', 'AUTO', 'BIKE', 'CHAUFFEUR', 'DELIVERY', 'RENTAL_DELIVERY')),
    is_online BOOLEAN DEFAULT FALSE,
    current_lat NUMERIC(9, 6),
    current_lng NUMERIC(9, 6),
    today_driving_minutes INT DEFAULT 0,
    max_daily_minutes INT DEFAULT 480, -- 8-hour fatigue limit
    is_fatigue_locked BOOLEAN DEFAULT FALSE,
    completed_trips INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_kyc_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES driver_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL CHECK (document_type IN ('AADHAAR', 'PAN', 'DRIVING_LICENSE', 'VEHICLE_RC', 'POLICE_VERIFICATION')),
    encrypted_doc_number BYTEA NOT NULL, -- AES-256 encrypted
    masked_doc_number VARCHAR(30) NOT NULL, -- e.g. "XXXX-XXXX-3019"
    doc_file_url VARCHAR(255) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MOBILITY RIDES (CAB, AUTO, BIKE, CHAUFFEUR, DELIVERY)
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES driver_profiles(id),
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('CAB', 'AUTO', 'BIKE', 'CHAUFFEUR', 'AIRPORT', 'OUTSTATION', 'DELIVERY')),
    tier_name VARCHAR(50) NOT NULL, -- 'Sedan Premium', 'Auto Standard', '4-Hour Chauffeur'
    booking_status VARCHAR(30) NOT NULL CHECK (booking_status IN ('DRAFT', 'SCHEDULED_CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    is_advance_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE,
    pickup_address TEXT NOT NULL,
    pickup_lat NUMERIC(9, 6) NOT NULL,
    pickup_lng NUMERIC(9, 6) NOT NULL,
    drop_address TEXT NOT NULL,
    drop_lat NUMERIC(9, 6) NOT NULL,
    drop_lng NUMERIC(9, 6) NOT NULL,
    locked_base_fare NUMERIC(10, 2) NOT NULL,
    toll_charges NUMERIC(10, 2) DEFAULT 0.00,
    total_fare NUMERIC(10, 2) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    customer_car_details JSONB, -- For Chauffeur jobs: { "model": "Honda City ZX", "transmission": "AT", "odometer": 48291 }
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RENTAL MARKETPLACE (CARS & BIKES)
CREATE TABLE rental_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES users(id),
    vehicle_type VARCHAR(10) NOT NULL CHECK (vehicle_type IN ('CAR', 'BIKE')),
    brand VARCHAR(60) NOT NULL,
    model VARCHAR(60) NOT NULL,
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('AUTOMATIC', 'MANUAL')),
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID')),
    seating_capacity INT NOT NULL,
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    daily_rate_self_drive NUMERIC(10, 2) NOT NULL,
    daily_rate_with_driver NUMERIC(10, 2),
    hourly_rate NUMERIC(10, 2),
    security_deposit NUMERIC(10, 2) NOT NULL,
    free_km_per_day INT DEFAULT 250,
    extra_km_rate NUMERIC(6, 2) DEFAULT 12.00,
    doorstep_delivery_available BOOLEAN DEFAULT TRUE,
    doorstep_delivery_fee NUMERIC(8, 2) DEFAULT 350.00,
    hub_address TEXT NOT NULL,
    insurance_valid_until DATE NOT NULL,
    puc_valid_until DATE NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rental_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES rental_listings(id),
    renter_id UUID NOT NULL REFERENCES users(id),
    assigned_driver_id UUID REFERENCES driver_profiles(id), -- If booked WITH_DRIVER
    rental_mode VARCHAR(20) NOT NULL CHECK (rental_mode IN ('SELF_DRIVE', 'WITH_DRIVER')),
    pickup_type VARCHAR(30) NOT NULL CHECK (pickup_type IN ('CUSTOMER_PICKUP', 'DOORSTEP_DELIVERY')),
    delivery_address TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    base_rental_amount NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(8, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_status VARCHAR(30) NOT NULL CHECK (booking_status IN ('BOOKED', 'DISPATCHED', 'HANDOVER_PENDING', 'ACTIVE_RENTAL', 'RETURN_PENDING', 'COMPLETED', 'CANCELLED')),
    handover_otp VARCHAR(6) NOT NULL,
    return_otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DIGITAL HANDOVER & DAMAGE INSPECTION AUDIT
CREATE TABLE rental_handovers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_booking_id UUID NOT NULL REFERENCES rental_bookings(id) ON DELETE CASCADE,
    stage VARCHAR(30) NOT NULL CHECK (stage IN ('PICKUP_HANDOVER', 'RETURN_HANDOVER')),
    odometer_reading INT NOT NULL,
    fuel_or_battery_percent INT NOT NULL CHECK (fuel_or_battery_percent BETWEEN 0 AND 100),
    damages_noted JSONB, -- Array of noted scratches, dents, condition tags
    photo_urls JSONB, -- Array of exterior 360 & interior photo URLs
    inspected_by UUID NOT NULL REFERENCES users(id),
    customer_signature_confirmed BOOLEAN DEFAULT TRUE,
    inspection_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PAYMENTS & GST SETTLEMENT
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('RIDE', 'RENTAL')),
    entity_id UUID NOT NULL,
    payer_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    gst_amount NUMERIC(10, 2) NOT NULL, -- 5% GST on transport, 18% on self-drive
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'CORPORATE_WALLET', 'CASH')),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('INITIATED', 'SUCCESS', 'REFUNDED', 'FAILED')),
    deposit_refund_status VARCHAR(20) CHECK (deposit_refund_status IN ('NOT_APPLICABLE', 'HELD', 'REFUNDED', 'PARTIALLY_DEDUCTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Real-time Telemetry & Messaging Stack

| Layer | Technology | Responsibility |
|---|---|---|
| **Relational Store** | PostgreSQL 16 | ACID source of truth for users, bookings, rental fleet, handover records, KYC vault. |
| **Spatial State** | Redis 7 (GEO commands) | Low-latency driver tracking (`GEOADD`, `GEORADIUS`), active vehicle telemetry, surge heatmaps. |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | T-12h and T-2h trip reminders, dispatch alerts, and digital handover OTPs. |
| **Live WebSockets** | Spring WebSocket (STOMP) | Driver-to-rider real-time coordinates broadcast and in-app chat. |
| **Document Vault** | AES-256 CBC + AWS S3 | Encrypted storage of government identity cards (Aadhaar, PAN, DL, RC). |

