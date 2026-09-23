-- =============================================================
-- RideDriveAhead Database Initialization Schema
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    email VARCHAR(150),
    role VARCHAR(20) NOT NULL DEFAULT 'RIDER', -- RIDER, DRIVER, ADMIN
    rating NUMERIC(3, 2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- REFRESH TOKENS (Rotation)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DRIVERS & VEHICLE DETAILS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_model VARCHAR(100),
    vehicle_plate VARCHAR(30),
    vehicle_type VARCHAR(20) NOT NULL DEFAULT 'SEDAN', -- HATCHBACK, SEDAN, SUV, PREMIER
    is_online BOOLEAN DEFAULT FALSE,
    current_lat NUMERIC(10, 7),
    current_lng NUMERIC(10, 7),
    kyc_status VARCHAR(20) DEFAULT 'PENDING', -- NOT_SUBMITTED, PENDING, APPROVED, REJECTED
    driving_hours_today NUMERIC(4, 2) DEFAULT 0.0,
    last_rest_time TIMESTAMP WITH TIME ZONE,
    total_trips INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. KYC DOCUMENT VAULT TABLE (Encrypted at rest with AES-256)
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- AADHAAR, PAN, DRIVING_LICENSE, VEHICLE_REGISTRATION
    masked_number VARCHAR(50) NOT NULL,
    vault_document_id VARCHAR(100) NOT NULL,
    encrypted_payload TEXT NOT NULL, -- AES-256-GCM Encrypted Blob
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    rejection_reason TEXT,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. KYC ACCESS AUDIT LOG (Compliance & Tamper-evidence)
CREATE TABLE IF NOT EXISTS kyc_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kyc_document_id UUID NOT NULL REFERENCES kyc_documents(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- VIEW_DECRYPTED, DOWNLOAD, APPROVE, REJECT
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BOOKINGS TABLE (Instant + Advance-Scheduled)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES drivers(id),
    booking_type VARCHAR(20) NOT NULL DEFAULT 'INSTANT', -- INSTANT, SCHEDULED
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED_CONFIRMED, ASSIGNED, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE,
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_lat NUMERIC(10, 7),
    pickup_lng NUMERIC(10, 7),
    drop_lat NUMERIC(10, 7),
    drop_lng NUMERIC(10, 7),
    vehicle_type VARCHAR(20) NOT NULL,
    fare_amount NUMERIC(10, 2) NOT NULL,
    otp_code VARCHAR(10) NOT NULL, -- 4-digit trip start OTP
    flight_number VARCHAR(30),
    rider_notes TEXT,
    cancellation_reason TEXT,
    service_mode VARCHAR(30) DEFAULT 'BOOK_CAB',
    chauffeur_package VARCHAR(50),
    car_transmission VARCHAR(30),
    customer_car_model VARCHAR(100),
    duty_hours_included INT,
    overtime_rate_per_hour NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- UPI, CARD, WALLET, CASH
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    receipt_number VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL DEMO DATA
-- Demo Rider
INSERT INTO users (id, phone_number, full_name, email, role, rating)
VALUES ('a1000000-0000-0000-0000-000000000001', '+919876543210', 'Arjun Verma', 'arjun@example.com', 'RIDER', 4.95)
ON CONFLICT (phone_number) DO NOTHING;

-- Demo Driver User
INSERT INTO users (id, phone_number, full_name, email, role, rating)
VALUES ('b2000000-0000-0000-0000-000000000002', '+919812345678', 'Rajesh Kumar', 'rajesh.driver@example.com', 'DRIVER', 4.88)
ON CONFLICT (phone_number) DO NOTHING;

-- Demo Driver Profile
INSERT INTO drivers (id, user_id, vehicle_model, vehicle_plate, vehicle_type, is_online, current_lat, current_lng, kyc_status, driving_hours_today, total_trips)
VALUES ('d3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'Honda City (White)', 'DL 01 AB 9988', 'SEDAN', TRUE, 28.5562, 77.1000, 'APPROVED', 3.5, 412)
ON CONFLICT DO NOTHING;

-- Demo Advance-Scheduled Airport Booking
INSERT INTO bookings (id, rider_id, driver_id, booking_type, status, scheduled_pickup_time, pickup_address, drop_address, pickup_lat, pickup_lng, drop_lat, drop_lng, vehicle_type, fare_amount, otp_code, flight_number, rider_notes)
VALUES (
    'c4000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000001',
    'd3000000-0000-0000-0000-000000000003',
    'SCHEDULED',
    'SCHEDULED_CONFIRMED',
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    'Sector 43, Golf Course Road, Gurugram',
    'Indira Gandhi International Airport, Terminal 3, New Delhi',
    28.4595, 77.0266, 28.5562, 77.1000,
    'SEDAN',
    750.00,
    '4821',
    'AI 102',
    'Early morning airport drop. 2 medium luggage.'
) ON CONFLICT DO NOTHING;
