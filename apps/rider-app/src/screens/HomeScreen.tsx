import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BottomNavBar } from '../components/BottomNavBar';
import { useRiderStore } from '../store/useRiderStore';

export const HomeScreen: React.FC = () => {
  const {
    user,
    bookingType,
    setBookingDraft,
    setServiceMode,
    navigate,
    activeBooking
  } = useRiderStore();

  const [currentCity, setCurrentCity] = useState('Bengaluru, Karnataka');

  // Handle selecting "Book a Cab"
  const handleSelectCab = () => {
    setServiceMode('BOOK_CAB');
    navigate('FARE_ESTIMATE');
  };

  // Handle selecting "Hire a Driver"
  const handleSelectChauffeur = () => {
    setServiceMode('HIRE_DRIVER');
    navigate('FARE_ESTIMATE');
  };

  // Handle Saved Place shortcut
  const handleSelectSavedPlace = (name: string, address: string) => {
    setBookingDraft({
      pickup: 'Koramangala, 6th Block, Bengaluru',
      drop: address
    });
    navigate('FARE_ESTIMATE');
  };

  // Handle Repeat Recent Trip
  const handleRepeatRecentTrip = () => {
    setBookingDraft({
      pickup: 'Kempegowda International Airport (BLR), Devanahalli',
      drop: 'Koramangala, 6th Block, Bengaluru',
      serviceMode: 'BOOK_CAB'
    });
    navigate('FARE_ESTIMATE');
  };

  return (
    <View style={styles.container}>
      {/* Top Greeting Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.userNameText}>{user?.fullName || 'Alex'} 👋</Text>
          <Text style={styles.taglineText}>Your journey, your way</Text>

          {/* Location Selector Dropdown */}
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() =>
              setCurrentCity((prev) =>
                prev.includes('Bengaluru') ? 'Gurugram, Delhi NCR' : 'Bengaluru, Karnataka'
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.locationPinIcon}>📍</Text>
            <Text style={styles.locationCityText}>{currentCity}</Text>
            <Text style={styles.dropdownChevron}>⌵</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Bell Button */}
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => alert('All systems operational. No unread ride notifications.')}
          activeOpacity={0.8}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationBadgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Booking Banner (if exists) */}
        {activeBooking && (
          <TouchableOpacity
            style={styles.activeRideBanner}
            onPress={() => navigate('LIVE_TRACKING')}
            activeOpacity={0.88}
          >
            <View style={styles.activeRideLeft}>
              <View style={styles.activeBadgeRow}>
                <View style={styles.pulseLiveDot} />
                <Text style={styles.activeBadgeText}>
                  {activeBooking.serviceMode === 'HIRE_DRIVER'
                    ? 'ACTIVE CHAUFFEUR DUTY'
                    : 'ACTIVE CAB RIDE'}
                </Text>
              </View>
              <Text style={styles.activeRideTitle}>
                {activeBooking.serviceMode === 'HIRE_DRIVER'
                  ? `Chauffeur Assigned • OTP: ${activeBooking.otpCode}`
                  : `Driver en route • OTP: ${activeBooking.otpCode}`}
              </Text>
              <Text style={styles.activeRideSub} numberOfLines={1}>
                {activeBooking.pickupAddress} ➔ {activeBooking.dropAddress}
              </Text>
            </View>
            <View style={styles.activeRideAction}>
              <Text style={styles.activeRideActionText}>Track →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* OLA / UBER / RAPIDO MULTI-MODAL CATEGORY BAR */}
        <View style={styles.categoryBarWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryBarContent}
          >
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>🛵</Text>
              </View>
              <Text style={styles.categoryTitle}>Bike Taxi</Text>
              <Text style={styles.categorySub}>Rapido ⚡</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>🛺</Text>
              </View>
              <Text style={styles.categoryTitle}>Auto</Text>
              <Text style={styles.categorySub}>Doorstep 🛺</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>🚕</Text>
              </View>
              <Text style={styles.categoryTitle}>Cabs</Text>
              <Text style={styles.categorySub}>Uber / Ola</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('HIRE_DRIVER');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, styles.categoryChauffeurCircle]}>
                <Text style={styles.categoryEmoji}>👨‍✈️</Text>
              </View>
              <Text style={styles.categoryTitle}>Drive My Car</Text>
              <Text style={[styles.categorySub, { color: '#0F172A', fontWeight: '800' }]}>Chauffeur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>⏱️</Text>
              </View>
              <Text style={styles.categoryTitle}>Rentals</Text>
              <Text style={styles.categorySub}>Hourly</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>📦</Text>
              </View>
              <Text style={styles.categoryTitle}>Parcel</Text>
              <Text style={styles.categorySub}>Instant 📦</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => {
                setServiceMode('BOOK_CAB');
                navigate('FARE_ESTIMATE');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>✈️</Text>
              </View>
              <Text style={styles.categoryTitle}>Airport</Text>
              <Text style={styles.categorySub}>Reserve</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* HERO DUAL SERVICES CARDS */}
        <View style={styles.dualServicesContainer}>
          {/* Card 1: Book a Cab (Deep Navy) */}
          <TouchableOpacity
            style={styles.cabHeroCard}
            onPress={handleSelectCab}
            activeOpacity={0.88}
          >
            <View style={styles.serviceIconCircleNavy}>
              <Text style={styles.serviceIconCar}>🚗</Text>
            </View>

            <View style={styles.heroCardContent}>
              <Text style={styles.cabHeroTitle}>Book a Cab</Text>
              <Text style={styles.cabHeroSub}>
                City rides, airport rides, quick & reliable
              </Text>
            </View>

            <View style={styles.limeArrowBtn}>
              <Text style={styles.limeArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Hire a Driver (Clean White) */}
          <TouchableOpacity
            style={styles.driverHeroCard}
            onPress={handleSelectChauffeur}
            activeOpacity={0.88}
          >
            <View style={styles.serviceIconCircleLight}>
              <Text style={styles.serviceIconSteering}>☸</Text>
            </View>

            <View style={styles.heroCardContent}>
              <Text style={styles.driverHeroTitle}>Hire a Driver</Text>
              <Text style={styles.driverHeroSub}>
                Your car. Our professional drivers.
              </Text>
            </View>

            <View style={styles.lightLimeArrowBtn}>
              <Text style={styles.lightLimeArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* INSTANT VS SCHEDULE TOGGLE PILL */}
        <View style={styles.togglePillContainer}>
          <TouchableOpacity
            style={[
              styles.togglePillBtn,
              bookingType === 'INSTANT' && styles.togglePillBtnActive
            ]}
            onPress={() => setBookingDraft({ type: 'INSTANT' })}
            activeOpacity={0.85}
          >
            <Text style={styles.pillIcon}>⚡</Text>
            <Text
              style={[
                styles.togglePillText,
                bookingType === 'INSTANT' && styles.togglePillTextActive
              ]}
            >
              Instant
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.togglePillBtn,
              bookingType === 'SCHEDULED' && styles.togglePillBtnActive
            ]}
            onPress={() => setBookingDraft({ type: 'SCHEDULED' })}
            activeOpacity={0.85}
          >
            <Text style={styles.pillIcon}>📅</Text>
            <Text
              style={[
                styles.togglePillText,
                bookingType === 'SCHEDULED' && styles.togglePillTextActive
              ]}
            >
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {/* SAVED PLACES SHORTCUTS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Saved Places</Text>
          <TouchableOpacity onPress={() => navigate('PROFILE')}>
            <Text style={styles.sectionActionLink}>Manage</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.savedPlacesScroll}
          contentContainerStyle={styles.savedPlacesContent}
        >
          {/* Home */}
          <TouchableOpacity
            style={styles.savedPlaceCard}
            onPress={() =>
              handleSelectSavedPlace('Home', 'Koramangala, 6th Block, Bengaluru')
            }
            activeOpacity={0.85}
          >
            <View style={styles.savedPlaceIconBox}>
              <Text style={styles.savedPlaceIcon}>🏠</Text>
            </View>
            <Text style={styles.savedPlaceName}>Home</Text>
            <Text style={styles.savedPlaceSub} numberOfLines={1}>
              Koramangala
            </Text>
          </TouchableOpacity>

          {/* Work */}
          <TouchableOpacity
            style={styles.savedPlaceCard}
            onPress={() =>
              handleSelectSavedPlace('Work', 'Indiranagar, 100ft Road, Bengaluru')
            }
            activeOpacity={0.85}
          >
            <View style={styles.savedPlaceIconBox}>
              <Text style={styles.savedPlaceIcon}>💼</Text>
            </View>
            <Text style={styles.savedPlaceName}>Work</Text>
            <Text style={styles.savedPlaceSub} numberOfLines={1}>
              Indiranagar
            </Text>
          </TouchableOpacity>

          {/* Airport */}
          <TouchableOpacity
            style={styles.savedPlaceCard}
            onPress={() =>
              handleSelectSavedPlace(
                'Airport',
                'Kempegowda International Airport (BLR), Devanahalli'
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.savedPlaceIconBox}>
              <Text style={styles.savedPlaceIcon}>✈️</Text>
            </View>
            <Text style={styles.savedPlaceName}>Airport</Text>
            <Text style={styles.savedPlaceSub} numberOfLines={1}>
              BLR Airport
            </Text>
          </TouchableOpacity>

          {/* Add Place */}
          <TouchableOpacity
            style={styles.savedPlaceCard}
            onPress={() => navigate('PROFILE')}
            activeOpacity={0.85}
          >
            <View style={[styles.savedPlaceIconBox, styles.addPlaceIconBox]}>
              <Text style={styles.addPlaceIcon}>+</Text>
            </View>
            <Text style={styles.savedPlaceName}>Add</Text>
            <Text style={styles.savedPlaceSub}>Add Place</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* RECENT TRIP CARD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Trip</Text>
          <TouchableOpacity onPress={() => navigate('RIDE_HISTORY')}>
            <Text style={styles.sectionActionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.recentTripCard}
          onPress={handleRepeatRecentTrip}
          activeOpacity={0.88}
        >
          <View style={styles.recentTripIconCircle}>
            <Text style={styles.recentTripIconText}>🚗</Text>
          </View>

          <View style={styles.recentTripDetails}>
            <Text style={styles.recentTripRoute} numberOfLines={1}>
              Bengaluru Airport ➔ Koramangala
            </Text>
            <Text style={styles.recentTripMeta}>2 days ago • Sedan</Text>
          </View>

          <View style={styles.recentTripPriceCol}>
            <Text style={styles.recentTripPrice}>₹ 1,248</Text>
          </View>
        </TouchableOpacity>

        {/* SAFETY FIRST BANNER */}
        <TouchableOpacity
          style={styles.safetyCard}
          onPress={() => navigate('PROFILE')}
          activeOpacity={0.88}
        >
          <View style={styles.safetyIconCircle}>
            <Text style={styles.safetyIconShield}>🛡️</Text>
          </View>

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>Safety First</Text>
            <Text style={styles.safetySub}>
              Your ride is always tracked & secure
            </Text>
          </View>

          <Text style={styles.safetyChevron}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR */}
      <BottomNavBar currentTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 24
  },

  /* Top Greeting Header */
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerLeft: {
    flex: 1,
    marginRight: 10
  },
  greetingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600'
  },
  userNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginTop: 1
  },
  taglineText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4
  },
  locationPinIcon: {
    fontSize: 11
  },
  locationCityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A'
  },
  dropdownChevron: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B'
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  bellIcon: {
    fontSize: 15,
    color: '#FFFFFF'
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#A3E635'
  },

  /* Active Ride Banner */
  activeRideBanner: {
    backgroundColor: '#0F172A',
    borderLeftWidth: 4,
    borderLeftColor: '#A3E635',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  activeRideLeft: {
    flex: 1,
    marginRight: 10
  },
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  pulseLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#A3E635'
  },
  activeBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#A3E635',
    letterSpacing: 0.4
  },
  activeRideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  activeRideSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2
  },
  activeRideAction: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  activeRideActionText: {
    color: '#A3E635',
    fontSize: 11,
    fontWeight: '800'
  },

  /* Multi-modal Category Strip (Ola / Uber / Rapido) */
  categoryBarWrap: {
    marginTop: 14,
    marginBottom: 4
  },
  categoryBarContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  categoryItem: {
    alignItems: 'center',
    width: 72
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 6
  },
  categoryChauffeurCircle: {
    backgroundColor: '#D2FF00',
    borderColor: '#B4E600'
  },
  categoryEmoji: {
    fontSize: 24
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  categorySub: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1
  },

  /* Hero Dual Services Cards */
  dualServicesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 12
  },
  cabHeroCard: {
    flex: 1,
    backgroundColor: '#0A1128',
    borderRadius: 22,
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: '#0A1128',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  driverHeroCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  serviceIconCircleNavy: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  serviceIconCircleLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  serviceIconCar: {
    fontSize: 20
  },
  serviceIconSteering: {
    fontSize: 22,
    color: '#0F172A'
  },
  heroCardContent: {
    marginVertical: 10
  },
  cabHeroTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2
  },
  cabHeroSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 14
  },
  driverHeroTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2
  },
  driverHeroSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 14
  },
  limeArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  limeArrowText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900'
  },
  lightLimeArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFCCB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  lightLimeArrowText: {
    color: '#365314',
    fontSize: 16,
    fontWeight: '900'
  },

  /* Instant vs Schedule Toggle */
  togglePillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 4,
    marginBottom: 16
  },
  togglePillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6
  },
  togglePillBtnActive: {
    backgroundColor: '#A3E635',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  pillIcon: {
    fontSize: 12
  },
  togglePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  togglePillTextActive: {
    color: '#0F172A',
    fontWeight: '900'
  },

  /* Section Headers */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A'
  },
  sectionActionLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB'
  },

  /* Saved Places */
  savedPlacesScroll: {
    marginBottom: 16
  },
  savedPlacesContent: {
    paddingHorizontal: 16,
    gap: 10
  },
  savedPlaceCard: {
    width: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1
  },
  savedPlaceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  addPlaceIconBox: {
    backgroundColor: '#F1F5F9'
  },
  savedPlaceIcon: {
    fontSize: 16
  },
  addPlaceIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  savedPlaceName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A'
  },
  savedPlaceSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
    textAlign: 'center'
  },

  /* Recent Trip */
  recentTripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  recentTripIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  recentTripIconText: {
    fontSize: 16
  },
  recentTripDetails: {
    flex: 1,
    marginRight: 8
  },
  recentTripRoute: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  recentTripMeta: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2
  },
  recentTripPriceCol: {
    alignItems: 'flex-end'
  },
  recentTripPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A'
  },

  /* Safety First Banner */
  safetyCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  safetyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  safetyIconShield: {
    fontSize: 16
  },
  safetyContent: {
    flex: 1
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857'
  },
  safetySub: {
    fontSize: 10.5,
    color: '#065F46',
    marginTop: 1
  },
  safetyChevron: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857'
  }
});
