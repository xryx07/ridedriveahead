# Advance-Scheduled Ride Lifecycle & Dispatch Engine

Advance scheduling is the core differentiator of RideDriveAhead. Unlike traditional on-demand platforms where trips are requested minutes before departure, our platform guarantees high driver commitment and predictable early morning pickups.

---

## 1. Advance Scheduling Lifecycle State Machine

```
   [ Rider Inputs Pickup, Drop & Future Time ]
                      │
                      ▼
            [ SCHEDULED_CONFIRMED ] ── Fare locked upfront (No surge surprises)
                      │
                      ▼
            [ ASSIGNED_TO_DRIVER ] ── Driver claims ride from Scheduled Pool
                      │
     ┌────────────────┴────────────────┐
     ▼                                 ▼
[ T-12h Evening Alert ]      [ T-2h Readiness Check ]
(Driver confirms plan)       (If unconfirmed ➔ Auto-repool to standby driver)
                      │
                      ▼
            [ DRIVER_EN_ROUTE ] ── Live GPS location sharing starts
                      │
                      ▼
          [ ARRIVED_AT_PICKUP ] ── Rider arrival alert dispatched
                      │
                      ▼
          [ TRIP_IN_PROGRESS ] ── Driver enters Rider's 4-digit OTP
                      │
                      ▼
                [ COMPLETED ] ── Auto-payment settlement & rating
```

---

## 2. Dispatch Timeline & Driver Safety Rules

| Timeline | Action | Automated Workflow |
| :--- | :--- | :--- |
| **Booking Creation** | Rider books 2 hours to 30 days ahead | Upfront fare calculated & locked; ride published to Scheduled Pool. |
| **Claim Window** | Drivers view airport rides in pool | High-reputation drivers claim trip; system checks driver fatigue limits. |
| **T-12h (Evening Alert)** | Driver evening check | Push notification: *"Confirm tomorrow's 05:00 AM Airport drop"*. |
| **T-2h (Morning Check)** | Driver readiness confirmation | Driver confirms wake-up. If unconfirmed within 15 min, auto-repool. |
| **T-45m (En Route)** | Driver begins navigation | Rider receives live GPS tracking with 4-digit start OTP. |
| **Arrival & Start** | Boarding vehicle | Driver must enter Rider's 4-digit OTP to start trip meter. |
| **Drop-off** | Destination reached | Fare settles without meter fluctuation; rating & tip prompt. |

---

## 3. Cancellation Policy

- **Free Cancellation**: Riders can cancel without any charge up to **2 hours** prior to the scheduled pickup time.
- **Late Cancellation Fee**: Cancellations within 2 hours of scheduled pickup incur a **₹100 late cancellation fee**, which is credited directly to the driver as compensation for their reserved time window.
