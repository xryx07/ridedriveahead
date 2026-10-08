import { DriverProfile, EarningsData, KycDocItem, ScheduledRide } from '../types';

export const mockDriver: DriverProfile = {
  id: 'd-verified-01',
  userId: 'u-driver-01',
  fullName: 'Verified Captain',
  phoneNumber: '+919800000000',
  role: 'ALL_ROUNDER',
  transmissionSkills: ['MANUAL', 'AUTOMATIC', 'LUXURY'],
  vehicleModel: 'Executive Vehicle',
  vehiclePlate: 'DL 01 AB 0001',
  vehicleType: 'SEDAN',
  isOnline: false,
  rating: 5.0,
  totalTrips: 0,
  kycStatus: 'APPROVED',
  drivingHoursToday: 0,
  lastRestTime: new Date().toISOString()
};

export const sampleKycDocs: KycDocItem[] = [
  {
    type: 'AADHAAR',
    title: 'Aadhaar Card',
    maskedNumber: 'XXXX-XXXX-0000',
    status: 'APPROVED',
    uploadedAt: '2026-10-01'
  },
  {
    type: 'PAN',
    title: 'PAN Card',
    maskedNumber: 'ABCDE****F',
    status: 'APPROVED',
    uploadedAt: '2026-10-01'
  },
  {
    type: 'DRIVING_LICENSE',
    title: 'Commercial Driving License (LMV)',
    maskedNumber: 'DL-04********001',
    status: 'APPROVED',
    uploadedAt: '2026-10-01'
  },
  {
    type: 'VEHICLE_REGISTRATION',
    title: 'Vehicle RC & Chauffeur Badge',
    maskedNumber: 'DL 01 AB 0001',
    status: 'APPROVED',
    uploadedAt: '2026-10-01'
  }
];

export const initialScheduledPool: ScheduledRide[] = [];

export const sampleEarnings: EarningsData = {
  todayEarnings: 0,
  weeklyEarnings: 0,
  monthlyEarnings: 0,
  todayCompletedTrips: 0,
  scheduledTripsCompleted: 0,
  incentivesEarned: 0,
  pendingPayoutAmount: 0
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
