import { Booking, FareEstimate, UserProfile, VehicleTier } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1';
export const USE_MOCK_API = true; // Toggle for live API integration

export const mockRider: UserProfile = {
  id: 'a1000000-0000-0000-0000-000000000001',
  phoneNumber: '+919876543210',
  fullName: 'Arjun Verma',
  email: 'arjun@example.com',
  role: 'RIDER',
  rating: 4.95
};

export const sampleScheduledBooking: Booking = {
  id: 'c4000000-0000-0000-0000-000000000004',
  riderId: 'a1000000-0000-0000-0000-000000000001',
  driverId: 'd3000000-0000-0000-0000-000000000003',
  bookingType: 'SCHEDULED',
  status: 'SCHEDULED_CONFIRMED',
  scheduledPickupTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  pickupAddress: 'Sector 43, Golf Course Road, Gurugram',
  dropAddress: 'Indira Gandhi International Airport, Terminal 3',
  pickupLat: 28.4595,
  pickupLng: 77.0266,
  dropLat: 28.5562,
  dropLng: 77.1000,
  vehicleType: 'SEDAN',
  fareAmount: 750,
  otpCode: '4821',
  driverName: 'Rajesh Kumar',
  driverPhone: '+91 98****5678',
  driverRating: 4.88,
  vehicleModel: 'Honda City (White)',
  vehiclePlate: 'DL 01 AB 9988',
  flightNumber: 'AI 102',
  riderNotes: 'Early morning airport pickup. 2 medium luggage.',
  createdAt: new Date().toISOString()
};

export const sampleCompletedBooking: Booking = {
  id: 'b1234567-0000-0000-0000-000000000001',
  riderId: 'a1000000-0000-0000-0000-000000000001',
  driverId: 'd3000000-0000-0000-0000-000000000003',
  bookingType: 'INSTANT',
  status: 'COMPLETED',
  pickupAddress: 'Cyber Hub, DLF Cyber City, Gurugram',
  dropAddress: 'Connaught Place, Inner Circle, New Delhi',
  pickupLat: 28.4952,
  pickupLng: 77.0891,
  dropLat: 28.6304,
  dropLng: 77.2177,
  vehicleType: 'SEDAN',
  fareAmount: 480,
  otpCode: '1924',
  driverName: 'Vikram Singh',
  driverPhone: '+91 99****1234',
  driverRating: 4.91,
  vehicleModel: 'Maruti Dzire (Silver)',
  vehiclePlate: 'HR 26 DQ 4411',
  createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString()
};

export const riderApi = {
  requestOtp: async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_API) {
      return { success: true, message: 'OTP 123456 dispatched to ' + phoneNumber };
    }
    const res = await fetch(`${BASE_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, userRole: 'RIDER' })
    });
    return res.json();
  },

  verifyOtp: async (phoneNumber: string, otpCode: string): Promise<{ accessToken: string; user: UserProfile }> => {
    if (USE_MOCK_API) {
      return {
        accessToken: 'mock-jwt-token-rider-xyz',
        user: { ...mockRider, phoneNumber }
      };
    }
    const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otpCode, userRole: 'RIDER' })
    });
    const data = await res.json();
    return data.data;
  },

  getFareEstimate: async (
    pickupAddress: string,
    dropAddress: string,
    bookingType: 'INSTANT' | 'SCHEDULED',
    scheduledPickupTime?: string
  ): Promise<FareEstimate> => {
    const isScheduled = bookingType === 'SCHEDULED';
    return {
      distanceKm: 18.5,
      estimatedDurationMin: 35,
      bookingType,
      scheduledPickupTime,
      tiers: [
        {
          vehicleType: 'HATCHBACK',
          tierName: 'Go Compact',
          description: 'Affordable, compact rides for everyday travel',
          capacity: 4,
          baseFare: 80,
          distanceFare: 231,
          advanceReservationFee: isScheduled ? 30 : 0,
          totalFare: isScheduled ? 341 : 311,
          currency: 'INR',
          etaMinutes: 4
        },
        {
          vehicleType: 'SEDAN',
          tierName: 'Premier Sedan',
          description: 'Comfortable sedans with top-rated drivers & boot space',
          capacity: 4,
          baseFare: 120,
          distanceFare: 278,
          advanceReservationFee: isScheduled ? 50 : 0,
          totalFare: isScheduled ? 448 : 398,
          currency: 'INR',
          etaMinutes: 6
        },
        {
          vehicleType: 'SUV',
          tierName: 'XL 6-Seater',
          description: 'Spacious SUVs for luggage & airport family groups',
          capacity: 6,
          baseFare: 180,
          distanceFare: 407,
          advanceReservationFee: isScheduled ? 70 : 0,
          totalFare: isScheduled ? 657 : 587,
          currency: 'INR',
          etaMinutes: 8
        },
        {
          vehicleType: 'PREMIER',
          tierName: 'Executive Black',
          description: 'Luxury vehicles with highest priority driver commitment',
          capacity: 4,
          baseFare: 250,
          distanceFare: 555,
          advanceReservationFee: isScheduled ? 100 : 0,
          totalFare: isScheduled ? 905 : 805,
          currency: 'INR',
          etaMinutes: 10
        }
      ]
    };
  },

  createBooking: async (params: Partial<Booking>): Promise<Booking> => {
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));
    const newBooking: Booking = {
      id: 'booking-' + Date.now(),
      riderId: mockRider.id,
      driverId: 'd3000000-0000-0000-0000-000000000003',
      bookingType: params.bookingType || 'INSTANT',
      status: params.bookingType === 'SCHEDULED' ? 'SCHEDULED_CONFIRMED' : 'ASSIGNED',
      scheduledPickupTime: params.scheduledPickupTime,
      pickupAddress: params.pickupAddress || 'Current Location',
      dropAddress: params.dropAddress || 'Destination',
      pickupLat: 28.5562,
      pickupLng: 77.1000,
      dropLat: 28.4595,
      dropLng: 77.0266,
      vehicleType: params.vehicleType || 'SEDAN',
      fareAmount: params.fareAmount || 450,
      otpCode,
      driverName: 'Rajesh Kumar',
      driverPhone: '+91 98****5678',
      driverRating: 4.88,
      vehicleModel: 'Honda City (White)',
      vehiclePlate: 'DL 01 AB 9988',
      flightNumber: params.flightNumber,
      riderNotes: params.riderNotes,
      createdAt: new Date().toISOString()
    };
    return newBooking;
  },

  shareLiveTrip: async (riderId: string, bookingId: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: 'Live trip tracking link shared with trusted emergency contacts.'
    };
  }
};
