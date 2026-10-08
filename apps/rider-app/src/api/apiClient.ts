import { Booking, FareEstimate, UserProfile, VehicleTier } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1';
export const USE_MOCK_API = true; // Toggle for live API integration

export const mockRider: UserProfile = {
  id: 'u-rider-guest',
  phoneNumber: '+919800000000',
  fullName: 'Verified Rider',
  email: 'rider@ridedriveahead.com',
  role: 'RIDER',
  rating: 5.0
};

export const sampleScheduledBooking: Booking | null = null;
export const sampleCompletedBooking: Booking | null = null;

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
          vehicleType: 'BIKE',
          tierName: 'Bike Taxi (Rapido Moto)',
          description: 'Fastest commute through traffic • Sanitized helmet provided',
          capacity: 1,
          baseFare: 25,
          distanceFare: 24,
          advanceReservationFee: 0,
          totalFare: 49,
          currency: 'INR',
          etaMinutes: 2
        },
        {
          vehicleType: 'AUTO',
          tierName: 'Auto Rickshaw (Ola / Rapido)',
          description: 'Doorstep pickup, meter guaranteed, no bargaining',
          capacity: 3,
          baseFare: 40,
          distanceFare: 49,
          advanceReservationFee: isScheduled ? 15 : 0,
          totalFare: isScheduled ? 104 : 89,
          currency: 'INR',
          etaMinutes: 3
        },
        {
          vehicleType: 'HATCHBACK',
          tierName: 'Go Economy / Mini',
          description: 'Affordable AC compact rides (WagonR, Swift)',
          capacity: 4,
          baseFare: 80,
          distanceFare: 109,
          advanceReservationFee: isScheduled ? 30 : 0,
          totalFare: isScheduled ? 219 : 189,
          currency: 'INR',
          etaMinutes: 4
        },
        {
          vehicleType: 'SEDAN',
          tierName: 'Premier Sedan (Prime)',
          description: 'Comfortable sedans (Dzire, Honda City) with top drivers',
          capacity: 4,
          baseFare: 120,
          distanceFare: 149,
          advanceReservationFee: isScheduled ? 50 : 0,
          totalFare: isScheduled ? 319 : 269,
          currency: 'INR',
          etaMinutes: 5
        },
        {
          vehicleType: 'SUV',
          tierName: 'Executive SUV XL',
          description: 'Spacious 6-seater (Innova, Ertiga) for airport luggage & family',
          capacity: 6,
          baseFare: 180,
          distanceFare: 219,
          advanceReservationFee: isScheduled ? 70 : 0,
          totalFare: isScheduled ? 469 : 399,
          currency: 'INR',
          etaMinutes: 6
        },
        {
          vehicleType: 'RENTAL',
          tierName: 'Hourly Rental (Ola Style)',
          description: 'Keep car & driver: 2h/20km package with multiple stops',
          capacity: 4,
          baseFare: 300,
          distanceFare: 149,
          advanceReservationFee: 0,
          totalFare: 449,
          currency: 'INR',
          etaMinutes: 5
        },
        {
          vehicleType: 'PARCEL',
          tierName: 'Express Parcel Delivery',
          description: 'Fast doorstep package delivery across the city (up to 5kg)',
          capacity: 1,
          baseFare: 30,
          distanceFare: 29,
          advanceReservationFee: 0,
          totalFare: 59,
          currency: 'INR',
          etaMinutes: 2
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
      driverName: 'Verified Captain',
      driverPhone: '+91 98000 00000',
      driverRating: 5.0,
      vehicleModel: 'Executive Sedan',
      vehiclePlate: 'DL 01 AB 0001',
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
