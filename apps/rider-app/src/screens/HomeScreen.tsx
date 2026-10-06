import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [destinationInput, setDestinationInput] = useState('');

  // Service selectors
  const handleSelectService = (mode: any) => {
    setServiceMode(mode);
    navigate('FARE_ESTIMATE');
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>RideDriveAhead</Text>
          <Text style={styles.taglineText}>One app. Every way to move.</Text>

          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() =>
              setCurrentCity((prev) =>
                prev.includes('Bengaluru') ? 'Gurugram, Delhi NCR' : 'Bengaluru, Karnataka'
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.locationPinIcon}>◉</Text>
            <Text style={styles.locationCityText}>{currentCity}</Text>
            <Text style={styles.dropdownChevron}>⌵</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => alert('All systems operational. Telemetry active.')}
          activeOpacity={0.8}
        >
          <Text style={styles.bellIcon}>◎</Text>
          <View style={styles.notificationBadgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Booking Banner */}
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
                    : 'ACTIVE TRIP'}
                </Text>
              </View>
              <Text style={styles.activeRideTitle}>
                OTP PIN: {activeBooking.otpCode} • Driver Assigned
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

        {/* WHERE ARE YOU GOING? DESTINATION SEARCH BOX */}
        <View style={styles.searchSection}>
          <Text style={styles.searchPromptLabel}>Where are you going?</Text>
          <TouchableOpacity
            style={styles.searchBarBox}
            onPress={() => navigate('FARE_ESTIMATE')}
            activeOpacity={0.88}
          >
            <Text style={styles.searchGlassIcon}>⌕</Text>
            <Text style={styles.searchPlaceholderText}>Search destination, airport, or tech park...</Text>
          </TouchableOpacity>
        </View>

        {/* 8-TILE CORE MOBILITY PLATFORM GRID */}
        <View style={styles.mobilityGridSection}>
          <Text style={styles.sectionTitle}>Mobility Options</Text>
          <View style={styles.mobilityTilesGrid}>
            {/* 1. Cab */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('BOOK_CAB')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>CAB</Text>
              </View>
              <Text style={styles.tileName}>Cab</Text>
              <Text style={styles.tileSub}>Mini • Sedan • SUV</Text>
            </TouchableOpacity>

            {/* 2. Auto */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('AUTO')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>AUTO</Text>
              </View>
              <Text style={styles.tileName}>Auto</Text>
              <Text style={styles.tileSub}>Meter Guarantee</Text>
            </TouchableOpacity>

            {/* 3. Bike */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('BIKE_TAXI')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>BIKE</Text>
              </View>
              <Text style={styles.tileName}>Bike</Text>
              <Text style={styles.tileSub}>Fast • ₹79</Text>
            </TouchableOpacity>

            {/* 4. Driver (My Car Chauffeur) */}
            <TouchableOpacity
              style={[styles.mobilityTile, styles.mobilityTileDifferentiator]}
              onPress={() => handleSelectService('HIRE_DRIVER')}
              activeOpacity={0.85}
            >
              <View style={[styles.tileIconCircle, styles.tileIconChauffeur]}>
                <Text style={[styles.tileCode, { color: '#C7FF3D', fontWeight: '900' }]}>DRIVER</Text>
              </View>
              <Text style={[styles.tileName, { color: '#C7FF3D' }]}>Driver</Text>
              <Text style={styles.tileSub}>Have Your Own Car</Text>
            </TouchableOpacity>

            {/* 5. Rental */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('RENTALS')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>RENT</Text>
              </View>
              <Text style={styles.tileName}>Rental</Text>
              <Text style={styles.tileSub}>Cars & Bikes</Text>
            </TouchableOpacity>

            {/* 6. Outstation */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('OUTSTATION')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>CITY+</Text>
              </View>
              <Text style={styles.tileName}>Outstation</Text>
              <Text style={styles.tileSub}>One Way / Round</Text>
            </TouchableOpacity>

            {/* 7. Airport */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('AIRPORT')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>AIR</Text>
              </View>
              <Text style={styles.tileName}>Airport</Text>
              <Text style={styles.tileSub}>Flight Sync Reserve</Text>
            </TouchableOpacity>

            {/* 8. Delivery */}
            <TouchableOpacity
              style={styles.mobilityTile}
              onPress={() => handleSelectService('PARCEL')}
              activeOpacity={0.85}
            >
              <View style={styles.tileIconCircle}>
                <Text style={styles.tileCode}>SEND</Text>
              </View>
              <Text style={styles.tileName}>Delivery</Text>
              <Text style={styles.tileSub}>Instant Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* "MY CAR" ELEVATED PROFILE & HANDOVER PROTOCOL */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Car</Text>
          <Text style={styles.sectionLink}>Vehicle Verified ✓</Text>
        </View>

        <View style={styles.myCarCard}>
          <View style={styles.myCarHeader}>
            <View>
              <Text style={styles.myCarTitle}>Toyota Innova Crysta (2.8Z)</Text>
              <Text style={styles.myCarPlate}>KA 01 AB 1234 • Automatic (AT)</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>RC Verified</Text>
            </View>
          </View>
          <View style={styles.handoverMiniInfo}>
            <Text style={styles.handoverMiniText}>
              ✓ Handover Protocol: Fuel 72% • Odometer 48,291 km • 360° Photo Inspection
            </Text>
          </View>
          <TouchableOpacity
            style={styles.hireChauffeurBtn}
            onPress={() => handleSelectService('HIRE_DRIVER')}
            activeOpacity={0.85}
          >
            <Text style={styles.hireChauffeurBtnText}>Hire a Professional Chauffeur (2h–8h) →</Text>
          </TouchableOpacity>
        </View>

        {/* UPCOMING AIRPORT RESERVE CARD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming Trip Assurance</Text>
          <Text style={styles.sectionLink}>Flight Sync</Text>
        </View>

        <View style={styles.assuranceCard}>
          <View style={styles.assuranceTop}>
            <View>
              <Text style={styles.assuranceTitle}>Airport Transfer • Tomorrow 06:30 AM</Text>
              <Text style={styles.assuranceSub}>Koramangala ➔ Kempegowda Airport (BLR)</Text>
            </View>
            <Text style={styles.assuranceFare}>₹ 1,248</Text>
          </View>
          <View style={styles.assuranceStages}>
            <Text style={styles.stageDone}>✓ Confirmed</Text>
            <Text style={styles.stageDone}>✓ Fare Locked</Text>
            <Text style={styles.stageDone}>✓ Driver Assigned</Text>
            <Text style={styles.stageActive}>● Flight 6E 752 Synced</Text>
          </View>
        </View>

        {/* SAFETY & TRIP GUARDIAN */}
        <View style={styles.safetyCard}>
          <View style={styles.shieldIconCircle}>
            <Text style={styles.shieldCode}>SEC</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyHeading}>Trip Guardian Status: Protected</Text>
            <Text style={styles.safetyDetails}>
              Live sharing with family • 4-digit PIN [ 4 7 9 2 ] • 24/7 Roadside Assistance
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 5-TAB BOTTOM NAVIGATION */}
      <BottomNavBar currentTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D0F'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },

  /* Header */
  topHeader: {
    backgroundColor: '#121619',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerLeft: {
    flex: 1,
    marginRight: 10
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F4F6F3',
    letterSpacing: -0.4
  },
  taglineText: {
    fontSize: 11,
    color: '#929A96',
    marginTop: 1
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181D20',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4
  },
  locationPinIcon: {
    fontSize: 10
  },
  locationCityText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#F4F6F3'
  },
  dropdownChevron: {
    fontSize: 9,
    fontWeight: '900',
    color: '#929A96'
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#181D20',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  bellIcon: {
    fontSize: 15
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7FF3D'
  },

  /* Active Ride Banner */
  activeRideBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#181D20',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C7FF3D',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  activeRideLeft: {
    flex: 1,
    marginRight: 8
  },
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  pulseLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7FF3D',
    marginRight: 6
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C7FF3D',
    letterSpacing: 0.5
  },
  activeRideTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  activeRideSub: {
    fontSize: 10.5,
    color: '#929A96',
    marginTop: 1
  },
  activeRideAction: {
    backgroundColor: '#C7FF3D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  activeRideActionText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0B0D0F'
  },

  /* Search Section */
  searchSection: {
    marginHorizontal: 16,
    marginTop: 14
  },
  searchPromptLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#929A96',
    marginBottom: 6
  },
  searchBarBox: {
    backgroundColor: '#121619',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  searchGlassIcon: {
    fontSize: 14
  },
  searchPlaceholderText: {
    fontSize: 12.5,
    color: '#929A96',
    fontWeight: '500'
  },

  /* Mobility Grid */
  mobilityGridSection: {
    marginHorizontal: 16,
    marginTop: 18
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F4F6F3',
    marginBottom: 10
  },
  mobilityTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  mobilityTile: {
    width: '22.8%',
    backgroundColor: '#121619',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobilityTileDifferentiator: {
    borderColor: 'rgba(199, 255, 61, 0.4)',
    backgroundColor: 'rgba(199, 255, 61, 0.06)'
  },
  tileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#181D20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  tileIconChauffeur: {
    backgroundColor: 'rgba(199, 255, 61, 0.12)'
  },
  tileCode: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#F4F6F3',
    letterSpacing: 0.5
  },
  tileName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F4F6F3',
    textAlign: 'center'
  },
  tileSub: {
    fontSize: 8,
    color: '#929A96',
    textAlign: 'center',
    marginTop: 2
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8
  },
  sectionLink: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#71D88A'
  },

  /* My Car Card */
  myCarCard: {
    marginHorizontal: 16,
    backgroundColor: '#121619',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12
  },
  myCarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  myCarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  myCarPlate: {
    fontSize: 10.5,
    color: '#929A96',
    fontFamily: 'monospace',
    marginTop: 2
  },
  verifiedTag: {
    backgroundColor: 'rgba(113, 216, 138, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71D88A'
  },
  handoverMiniInfo: {
    backgroundColor: '#181D20',
    borderRadius: 8,
    padding: 8,
    marginTop: 8
  },
  handoverMiniText: {
    fontSize: 10,
    color: '#929A96',
    lineHeight: 13
  },
  hireChauffeurBtn: {
    backgroundColor: '#C7FF3D',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10
  },
  hireChauffeurBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B0D0F'
  },

  /* Assurance Card */
  assuranceCard: {
    marginHorizontal: 16,
    backgroundColor: '#121619',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12
  },
  assuranceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  assuranceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  assuranceSub: {
    fontSize: 10,
    color: '#929A96',
    marginTop: 1
  },
  assuranceFare: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C7FF3D',
    fontFamily: 'monospace'
  },
  assuranceStages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  stageDone: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71D88A'
  },
  stageActive: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C7FF3D'
  },

  /* Safety Card */
  safetyCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#121619',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 138, 0.2)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  shieldIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(113, 216, 138, 0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shieldCode: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71D88A',
    letterSpacing: 0.5
  },
  safetyHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  safetyDetails: {
    fontSize: 10,
    color: '#929A96',
    marginTop: 2,
    lineHeight: 13
  }
});
