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
- One-touch Emergency SOS dispatch sharing real-time GPS with police and emergency contacts.
