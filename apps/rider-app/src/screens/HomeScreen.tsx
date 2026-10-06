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
  const [selectedIntent, setSelectedIntent] = useState<'CAB' | 'CHAUFFEUR'>('CAB');

  // Handle selecting "Book a Cab"
  const handleSelectCab = () => {
    setSelectedIntent('CAB');
    setServiceMode('BOOK_CAB');
    navigate('FARE_ESTIMATE');
  };

  // Handle selecting "Hire a Driver"
  const handleSelectChauffeur = () => {
    setSelectedIntent('CHAUFFEUR');
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
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>RideDriveAhead</Text>
          <Text style={styles.userNameText}>Good Morning, {user?.fullName || 'Alex'} 👋</Text>
          <Text style={styles.taglineText}>Your ride. Your car. Your driver.</Text>

          {/* Location Selector */}
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

        {/* Telemetry Status Bell */}
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => alert('All systems operational. Telemetry: 184 active trips.')}
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

        {/* CENTRAL INTENT DECISION: BOOK A CAB VS HIRE A DRIVER */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>What do you need today?</Text>
          <Text style={styles.sectionHint}>Dual Mobility Platform</Text>
        </View>

        <View style={styles.intentGrid}>
          {/* Choice 1: BOOK A CAB */}
          <TouchableOpacity
            style={[
              styles.intentCard,
              selectedIntent === 'CAB' && styles.intentCardActive
            ]}
            onPress={handleSelectCab}
            activeOpacity={0.88}
          >
            <View style={styles.intentBadge}>
              <Text style={styles.intentBadgeText}>INSTANT / SCHEDULE</Text>
            </View>
            <View style={styles.intentIconBox}>
              <Text style={styles.intentEmoji}>🚕</Text>
            </View>
            <Text style={styles.intentTitle}>BOOK A CAB</Text>
            <Text style={styles.intentDesc}>
              I need a ride. Upfront locked fares, verified captains, airport trips.
            </Text>
            <View style={styles.intentCtaRow}>
              <Text style={styles.intentCtaText}>Choose Vehicle →</Text>
            </View>
          </TouchableOpacity>

          {/* Choice 2: HIRE A DRIVER */}
          <TouchableOpacity
            style={[
              styles.intentCard,
              selectedIntent === 'CHAUFFEUR' && styles.intentCardActive
            ]}
            onPress={handleSelectChauffeur}
            activeOpacity={0.88}
          >
            <View style={styles.intentBadge}>
              <Text style={styles.intentBadgeText}>MY CAR CHAUFFEUR</Text>
            </View>
            <View style={styles.intentIconBox}>
              <Text style={styles.intentEmoji}>🚗</Text>
            </View>
            <Text style={styles.intentTitle}>HIRE A DRIVER</Text>
            <Text style={styles.intentDesc}>
              I have my own car. Verified AT/MT chauffeurs, 2h–8h & outstation.
            </Text>
            <View style={styles.intentCtaRow}>
              <Text style={styles.intentCtaText}>Select Package →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* "MY CAR" ELEVATED PROFILE CARD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Car</Text>
          <Text style={styles.sectionActionLink}>Vehicle Verified ✓</Text>
        </View>

        <View style={styles.myCarCard}>
          <View style={styles.myCarTopRow}>
            <View>
              <Text style={styles.myCarModel}>Toyota Innova Crysta (2.8Z)</Text>
              <Text style={styles.myCarReg}>KA 01 AB 1234</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>✓ RC & Insurance</Text>
            </View>
          </View>

          <View style={styles.myCarSpecsGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>TRANSMISSION</Text>
              <Text style={styles.specVal}>Automatic (AT)</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>ODOMETER</Text>
              <Text style={styles.specVal}>48,291 km</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>FUEL LEVEL</Text>
              <Text style={styles.specVal}>72% Full</Text>
            </View>
          </View>

          <View style={styles.driverReqBanner}>
            <Text style={styles.driverReqTitle}>DRIVER HANDOVER REQUIREMENTS</Text>
            <View style={styles.reqChecksRow}>
              <Text style={styles.reqCheckItem}>✓ AT Certified</Text>
              <Text style={styles.reqCheckItem}>✓ 4.8+ Rating</Text>
              <Text style={styles.reqCheckItem}>✓ DL & Police Verified</Text>
              <Text style={styles.reqCheckItem}>✓ 500+ Trips</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.hireDriverBtn}
            onPress={handleSelectChauffeur}
            activeOpacity={0.85}
          >
            <Text style={styles.hireDriverBtnText}>Hire a Chauffeur for This Car →</Text>
          </TouchableOpacity>
        </View>

        {/* VEHICLE HANDOVER PROTOCOL PREVIEW */}
        <View style={styles.handoverPreviewCard}>
          <View style={styles.handoverHeader}>
            <Text style={styles.handoverTitle}>🛡️ VEHICLE HANDOVER PROTOCOL</Text>
            <Text style={styles.handoverStatus}>Step 1 Ready</Text>
          </View>
          <Text style={styles.handoverDesc}>
            Pre-trip fuel logging (72%), odometer cluster sync (48,291 km), 360° photo checklist (8 photos), and dual customer & driver digital sign-off before trip start.
          </Text>
        </View>

        {/* COMPACT TRUST PROFILE (CHAUFFEUR VERIFICATION) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Preferred Chauffeur</Text>
          <Text style={styles.sectionActionLink}>Trust Layer</Text>
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <View style={styles.trustAvatar}>
              <Text style={styles.trustAvatarText}>RK</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.trustDriverName}>Ramesh Kumar</Text>
              <Text style={styles.trustDriverRating}>★ 4.9 • 1,284 completed duties</Text>
            </View>
            <TouchableOpacity
              style={styles.rebookBtn}
              onPress={() => alert('Direct dispatch request sent to Ramesh Kumar!')}
            >
              <Text style={styles.rebookBtnText}>Book Again</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.trustBadgesRow}>
            <Text style={styles.trustBadge}>✓ Commercial DL</Text>
            <Text style={styles.trustBadge}>✓ Automatic Certified</Text>
            <Text style={styles.trustBadge}>✓ 92% Innova Familiarity</Text>
            <Text style={styles.trustBadge}>✓ 38% Repeat Clients</Text>
          </View>
        </View>

        {/* AIRPORT TRIP ASSURANCE */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Airport Trip Assurance</Text>
          <Text style={styles.sectionHint}>Flight AI 504 Sync</Text>
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
            <Text style={styles.assuranceStageDone}>✓ Confirmed</Text>
            <Text style={styles.assuranceStageDone}>✓ Fare Locked</Text>
            <Text style={styles.assuranceStageDone}>✓ Driver Assigned</Text>
            <Text style={styles.assuranceStageActive}>● T-2h Sync</Text>
          </View>
        </View>

        {/* TRIP GUARDIAN & SAFETY FIRST (STRICT ZERO SOS) */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyIconCircle}>
            <Text style={styles.safetyIconShield}>🛡️</Text>
          </View>
          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>Trip Guardian Status: Protected</Text>
            <Text style={styles.safetySub}>
              Live sharing with family • 4-digit PIN [ 4 7 9 2 ] • 24/7 Roadside Assistance
            </Text>
          </View>
        </View>

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
    backgroundColor: '#0B0D0F'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 24
  },

  /* Top Greeting Header */
  topHeader: {
    backgroundColor: '#121619',
    paddingHorizontal: 18,
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
  greetingText: {
    fontSize: 11,
    color: '#929A96',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F4F6F3',
    letterSpacing: -0.3,
    marginTop: 2
  },
  taglineText: {
    fontSize: 11,
    color: '#929A96',
    fontWeight: '500',
    marginTop: 2
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181D20',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4
  },
  locationPinIcon: {
    fontSize: 11
  },
  locationCityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F4F6F3'
  },
  dropdownChevron: {
    fontSize: 10,
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

  /* Active Booking Banner */
  activeRideBanner: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#181D20',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C7FF3D',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  activeRideLeft: {
    flex: 1,
    marginRight: 10
  },
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  pulseLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7FF3D',
    marginRight: 6
  },
  activeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#C7FF3D',
    letterSpacing: 0.5
  },
  activeRideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  activeRideSub: {
    fontSize: 11,
    color: '#929A96',
    marginTop: 2
  },
  activeRideAction: {
    backgroundColor: '#C7FF3D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  activeRideActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B0D0F'
  },

  /* Section Header Row */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  sectionHint: {
    fontSize: 11,
    color: '#929A96',
    fontWeight: '600'
  },
  sectionActionLink: {
    fontSize: 11,
    color: '#71D88A',
    fontWeight: '700'
  },

  /* Dual Intent Grid */
  intentGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 18
  },
  intentCard: {
    flex: 1,
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14
  },
  intentCardActive: {
    borderColor: '#C7FF3D'
  },
  intentBadge: {
    backgroundColor: '#181D20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8
  },
  intentBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#929A96'
  },
  intentIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#181D20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  intentEmoji: {
    fontSize: 18
  },
  intentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  intentDesc: {
    fontSize: 10.5,
    color: '#929A96',
    lineHeight: 14,
    marginTop: 4
  },
  intentCtaRow: {
    marginTop: 10
  },
  intentCtaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C7FF3D'
  },

  /* My Car Card */
  myCarCard: {
    marginHorizontal: 18,
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14
  },
  myCarTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  myCarModel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  myCarReg: {
    fontSize: 11,
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
    fontSize: 9.5,
    fontWeight: '700',
    color: '#71D88A'
  },
  myCarSpecsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  specBox: {
    flex: 1,
    backgroundColor: '#181D20',
    borderRadius: 8,
    padding: 8
  },
  specLabel: {
    fontSize: 8.5,
    color: '#929A96',
    fontWeight: '700'
  },
  specVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F4F6F3',
    marginTop: 2
  },
  driverReqBanner: {
    backgroundColor: '#181D20',
    borderRadius: 8,
    padding: 10,
    marginTop: 10
  },
  driverReqTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#929A96',
    letterSpacing: 0.4
  },
  reqChecksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6
  },
  reqCheckItem: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F4F6F3'
  },
  hireDriverBtn: {
    backgroundColor: '#C7FF3D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12
  },
  hireDriverBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B0D0F'
  },

  /* Handover Preview Card */
  handoverPreviewCard: {
    marginHorizontal: 18,
    marginTop: 12,
    backgroundColor: '#181D20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12
  },
  handoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  handoverTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  handoverStatus: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#71D88A'
  },
  handoverDesc: {
    fontSize: 10.5,
    color: '#929A96',
    lineHeight: 14
  },

  /* Trust Card */
  trustCard: {
    marginHorizontal: 18,
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trustAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#181D20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  trustAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  trustDriverName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  trustDriverRating: {
    fontSize: 11,
    color: '#929A96',
    marginTop: 1
  },
  rebookBtn: {
    backgroundColor: '#181D20',
    borderWidth: 1,
    borderColor: '#C7FF3D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  rebookBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#C7FF3D'
  },
  trustBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10
  },
  trustBadge: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#929A96',
    backgroundColor: '#181D20',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4
  },

  /* Assurance Card */
  assuranceCard: {
    marginHorizontal: 18,
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14
  },
  assuranceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  assuranceTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  assuranceSub: {
    fontSize: 10.5,
    color: '#929A96',
    marginTop: 2
  },
  assuranceFare: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C7FF3D',
    fontFamily: 'monospace'
  },
  assuranceStages: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  assuranceStageDone: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#71D88A'
  },
  assuranceStageActive: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#C7FF3D'
  },

  /* Safety Card */
  safetyCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 138, 0.2)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  safetyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(113, 216, 138, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  safetyIconShield: {
    fontSize: 18
  },
  safetyContent: {
    flex: 1
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F6F3'
  },
  safetySub: {
    fontSize: 10.5,
    color: '#929A96',
    marginTop: 2,
    lineHeight: 14
  }
});
