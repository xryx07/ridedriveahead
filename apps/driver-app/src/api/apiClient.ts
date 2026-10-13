import { DriverProfile, EarningsData, KycDocItem, ScheduledRide } from '../types';

export const mockDriver: DriverProfile = {
  id: 'd-driver-01',
  userId: 'u-driver-01',
  fullName: 'Driver Partner',
  phoneNumber: '+919800000000',
  role: 'CHAUFFEUR_ONLY',
  transmissionSkills: ['MANUAL', 'AUTOMATIC'],
  vehicleModel: 'Driver for Hire (Customer Car)',
  vehiclePlate: 'N/A',
  vehicleType: 'SEDAN',
  isOnline: false,
  rating: null,
  totalTrips: 0,
  kycStatus: 'PENDING',
  drivingHoursToday: 0,
  lastRestTime: new Date().toISOString()
};

export const sampleKycDocs: KycDocItem[] = [
  {
    type: 'AADHAAR',
    title: 'Aadhaar Card',
    maskedNumber: 'Verification Pending',
    status: 'PENDING',
    uploadedAt: undefined
  },
  {
    type: 'PAN',
    title: 'PAN Card',
    maskedNumber: 'Verification Pending',
    status: 'PENDING',
    uploadedAt: undefined
  },
  {
    type: 'DRIVING_LICENSE',
    title: 'Commercial Driving License (LMV)',
    maskedNumber: 'Verification Pending',
    status: 'PENDING',
    uploadedAt: undefined
  },
  {
    type: 'VEHICLE_REGISTRATION',
    title: 'Driver Badge & Background Check',
    maskedNumber: 'Verification Pending',
    status: 'PENDING',
    uploadedAt: undefined
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
