import { DriverProfile, EarningsData, KycDocItem, ScheduledRide } from '../types';

export const mockDriver: DriverProfile = {
  id: 'd3000000-0000-0000-0000-000000000003',
  userId: 'b2000000-0000-0000-0000-000000000002',
  fullName: 'Rajesh Kumar',
  phoneNumber: '+919812345678',
  role: 'ALL_ROUNDER',
  transmissionSkills: ['MANUAL', 'AUTOMATIC', 'LUXURY'],
  vehicleModel: 'Honda City (White) / Personal Car Chauffeur',
  vehiclePlate: 'DL 01 AB 9988',
  vehicleType: 'SEDAN',
  isOnline: true,
  rating: 4.92,
  totalTrips: 582,
  kycStatus: 'APPROVED',
  drivingHoursToday: 3.5,
  lastRestTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
};

export const sampleKycDocs: KycDocItem[] = [
  {
    type: 'AADHAAR',
    title: 'Aadhaar Card',
    maskedNumber: 'XXXX-XXXX-3019',
    status: 'APPROVED',
    uploadedAt: '2026-08-10'
  },
  {
    type: 'PAN',
    title: 'PAN Card',
    maskedNumber: 'ABCDE****F',
    status: 'APPROVED',
    uploadedAt: '2026-08-10'
  },
  {
    type: 'DRIVING_LICENSE',
    title: 'Commercial Driving License (LMV)',
    maskedNumber: 'DL-04********921',
    status: 'APPROVED',
    uploadedAt: '2026-08-10'
  },
  {
    type: 'VEHICLE_REGISTRATION',
    title: 'Vehicle RC & Chauffeur Badge',
    maskedNumber: 'DL ** ** 9988',
    status: 'APPROVED',
    uploadedAt: '2026-08-10'
  }
];

export const initialScheduledPool: ScheduledRide[] = [
  {
    id: 'gig-001',
    gigType: 'HOURLY_CHAUFFEUR',
    riderName: 'Arjun Verma',
    riderPhone: '+91 98****3210',
    pickupAddress: 'Sector 43, Golf Course Road, Gurugram',
    dropAddress: 'City Round-Trip (Customer\'s Honda City - Automatic)',
    scheduledPickupTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    fareAmount: 549,
    durationHours: 4,
    overtimeRatePerHour: 99,
    carModel: 'Honda City (Automatic AT)',
    transmissionRequired: 'AUTOMATIC',
    riderNotes: 'Half-day chauffeur for shopping and evening family dinner.',
    distanceKm: 28.0,
    isClaimed: true
  },
  {
    id: 'gig-002',
    gigType: 'EVENT_CHAUFFEUR',
    riderName: 'Kapil Mehra',
    riderPhone: '+91 98****7711',
    pickupAddress: 'Vasant Vihar, South Delhi',
    dropAddress: 'Wedding Venue, Chhatarpur Farmhouses (Return to Vasant Vihar)',
    scheduledPickupTime: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    fareAmount: 799,
    durationHours: 6,
    overtimeRatePerHour: 99,
    carModel: 'Hyundai Creta (Manual MT)',
    transmissionRequired: 'MANUAL',
    riderNotes: 'Wedding party chauffeur duty from 6 PM to 12 Midnight. Zero alcohol assurance.',
    distanceKm: 42.0,
    isClaimed: false
  },
  {
    id: 'gig-003',
    gigType: 'OUTSTATION_2DAY',
    riderName: 'Vikram & Sunita Singhal',
    riderPhone: '+91 99****4422',
    pickupAddress: 'Golf Links, New Delhi',
    dropAddress: 'Jaipur Heritage Resort & Return (2-Day Weekend Road Trip)',
    scheduledPickupTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    fareAmount: 2799,
    durationHours: 24,
    overtimeRatePerHour: 120,
    carModel: 'Toyota Fortuner 4x4 (Automatic AT)',
    transmissionRequired: 'AUTOMATIC',
    riderNotes: '2-Day family road trip to Jaipur. Food and hotel driver room provided.',
    distanceKm: 560.0,
    isClaimed: false
  },
  {
    id: 'gig-004',
    gigType: 'AIRPORT_CAB',
    riderName: 'Dr. Sameer Sen',
    riderPhone: '+91 97****8901',
    pickupAddress: 'Sector 56, Golf Course Ext Road, Gurugram',
    dropAddress: 'IGI Airport Terminal 3, New Delhi',
    scheduledPickupTime: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    fareAmount: 750,
    flightNumber: 'AI 102',
    riderNotes: 'Airport drop. Driver required with commercial sedan.',
    distanceKm: 21.5,
    isClaimed: false
  }
];

export const sampleEarnings: EarningsData = {
  todayEarnings: 3250,
  weeklyEarnings: 18900,
  monthlyEarnings: 74500,
  todayCompletedTrips: 6,
  scheduledTripsCompleted: 3,
  incentivesEarned: 550,
  pendingPayoutAmount: 3800
};

export const driverApi = {
  getProfile: async (): Promise<DriverProfile> => {
    return Promise.resolve(mockDriver);
  },
  getKycStatus: async (): Promise<KycDocItem[]> => {
    return Promise.resolve(sampleKycDocs);
  },
  getScheduledRides: async (): Promise<ScheduledRide[]> => {
    return Promise.resolve(initialScheduledPool);
  },
  getEarnings: async (): Promise<EarningsData> => {
    return Promise.resolve(sampleEarnings);
  }
};
