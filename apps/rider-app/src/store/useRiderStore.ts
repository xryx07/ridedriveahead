import { create } from 'zustand';
import {
  Booking,
  BookingType,
  CarCategory,
  ChauffeurPackage,
  ServiceMode,
  TransmissionType,
  UserProfile,
  VehicleTier
} from '../types';
import { mockRider, sampleCompletedBooking, sampleScheduledBooking } from '../api/apiClient';

export type ScreenName =
  | 'LOGIN'
  | 'HOME'
  | 'FARE_ESTIMATE'
  | 'LIVE_TRACKING'
  | 'TRIP_SUMMARY'
  | 'RIDE_HISTORY'
  | 'PROFILE'
  | 'SOS';

interface RiderState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currentScreen: ScreenName;

  // Service Mode
  serviceMode: ServiceMode;

  // Chauffeur / Drive My Car Parameters
  chauffeurPackage: ChauffeurPackage;
  carTransmission: TransmissionType;
  carCategory: CarCategory;
  carModelName: string;

  // Cab Draft ride parameters
  pickupAddress: string;
  dropAddress: string;
  bookingType: BookingType;
  scheduledPickupTime: Date | null;
  selectedTier: VehicleTier | null;
  flightNumber: string;
  riderNotes: string;

  // Active booking & History
  activeBooking: Booking | null;
  rideHistory: Booking[];

  // Actions
  login: (user: UserProfile) => void;
  signup: (user: UserProfile) => void;
  logout: () => void;
  navigate: (screen: ScreenName) => void;
  setServiceMode: (mode: ServiceMode) => void;
  setChauffeurDetails: (params: {
    pkg?: ChauffeurPackage;
    transmission?: TransmissionType;
    category?: CarCategory;
    carModel?: string;
  }) => void;
  setBookingDraft: (params: {
    pickup?: string;
    drop?: string;
    type?: BookingType;
    scheduledTime?: Date | null;
    tier?: VehicleTier | null;
    flight?: string;
    notes?: string;
    serviceMode?: ServiceMode;
    chauffeurPackage?: ChauffeurPackage;
    carTransmission?: TransmissionType;
    carCategory?: CarCategory;
    carModel?: string;
  }) => void;
  setActiveBooking: (booking: Booking | null) => void;
  cancelActiveBooking: (reason: string) => void;
  completeActiveBooking: () => void;
}

export const useRiderStore = create<RiderState>((set) => ({
  user: mockRider,
  isAuthenticated: true,
  currentScreen: 'HOME',

  serviceMode: 'HIRE_DRIVER',
  chauffeurPackage: 'HOURLY_4H',
  carTransmission: 'AUTOMATIC',
  carCategory: 'SEDAN',
  carModelName: 'Honda City',

  pickupAddress: 'Sector 43, Golf Course Road, Gurugram',
  dropAddress: 'Indira Gandhi International Airport, Terminal 3, New Delhi',
  bookingType: 'SCHEDULED',
  scheduledPickupTime: new Date(Date.now() + 24 * 3600 * 1000), // Tomorrow same time
  selectedTier: null,
  flightNumber: 'AI 102',
  riderNotes: 'Pro chauffeur for personal car. Automatic transmission.',

  activeBooking: sampleScheduledBooking,
  rideHistory: [sampleScheduledBooking, sampleCompletedBooking],

  login: (user) => set({ user, isAuthenticated: true, currentScreen: 'HOME' }),
  signup: (user) => set({ user, isAuthenticated: true, currentScreen: 'HOME' }),
  logout: () => set({ user: null, isAuthenticated: false, currentScreen: 'LOGIN' }),
  navigate: (screen) => set({ currentScreen: screen }),
  setServiceMode: (mode) => set({ serviceMode: mode }),

  setChauffeurDetails: (params) =>
    set((state) => ({
      chauffeurPackage: params.pkg !== undefined ? params.pkg : state.chauffeurPackage,
      carTransmission: params.transmission !== undefined ? params.transmission : state.carTransmission,
      carCategory: params.category !== undefined ? params.category : state.carCategory,
      carModelName: params.carModel !== undefined ? params.carModel : state.carModelName
    })),

  setBookingDraft: (params) =>
    set((state) => ({
      pickupAddress: params.pickup !== undefined ? params.pickup : state.pickupAddress,
      dropAddress: params.drop !== undefined ? params.drop : state.dropAddress,
      bookingType: params.type !== undefined ? params.type : state.bookingType,
      scheduledPickupTime: params.scheduledTime !== undefined ? params.scheduledTime : state.scheduledPickupTime,
      selectedTier: params.tier !== undefined ? params.tier : state.selectedTier,
      flightNumber: params.flight !== undefined ? params.flight : state.flightNumber,
      riderNotes: params.notes !== undefined ? params.notes : state.riderNotes,
      serviceMode: params.serviceMode !== undefined ? params.serviceMode : state.serviceMode,
      chauffeurPackage: params.chauffeurPackage !== undefined ? params.chauffeurPackage : state.chauffeurPackage,
      carTransmission: params.carTransmission !== undefined ? params.carTransmission : state.carTransmission,
      carCategory: params.carCategory !== undefined ? params.carCategory : state.carCategory,
      carModelName: params.carModel !== undefined ? params.carModel : state.carModelName
    })),

  setActiveBooking: (booking) =>
    set((state) => ({
      activeBooking: booking,
      rideHistory: booking ? [booking, ...state.rideHistory.filter((b) => b.id !== booking.id)] : state.rideHistory
    })),

  cancelActiveBooking: (reason) =>
    set((state) => {
      if (!state.activeBooking) return state;
      const updated: Booking = {
        ...state.activeBooking,
        status: 'CANCELLED',
        cancellationReason: reason
      };
      return {
        activeBooking: null,
        rideHistory: state.rideHistory.map((b) => (b.id === updated.id ? updated : b)),
        currentScreen: 'HOME'
      };
    }),

  completeActiveBooking: () =>
    set((state) => {
      if (!state.activeBooking) return state;
      const updated: Booking = {
        ...state.activeBooking,
        status: 'COMPLETED'
      };
      return {
        activeBooking: updated,
        rideHistory: state.rideHistory.map((b) => (b.id === updated.id ? updated : b)),
        currentScreen: 'TRIP_SUMMARY'
      };
    })
}));
