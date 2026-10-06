import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { IncomingRideModal } from '../components/IncomingRideModal';
import { useDriverStore } from '../store/useDriverStore';

export const DriverHomeScreen: React.FC = () => {
  const {
    driver,
    toggleOnline,
    earnings,
    scheduledRides,
    startActiveTrip,
    navigate
  } = useDriverStore();

  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [activeModes, setActiveModes] = useState({
    cab: true,
    auto: false,
    bike: false,
    chauffeur: true,
    delivery: true
  });

  const toggleMode = (modeKey: 'cab' | 'auto' | 'bike' | 'chauffeur' | 'delivery') => {
    setActiveModes((prev) => ({ ...prev, [modeKey]: !prev[modeKey] }));
  };

  // Find claimed scheduled ride or chauffeur gig
  const upcomingScheduled = scheduledRides.find((r) => r.isClaimed);

  const handleAcceptInstant = () => {
    setShowIncomingModal(false);
    startActiveTrip({
      id: 'instant-duty-' + Date.now(),
      riderName: 'Vikram Malhotra',
      riderPhone: '+91 99****8822',
      pickupAddress: 'Koramangala 6th Block, Bengaluru',
      dropAddress: 'BLR Airport, Terminal 2',
      scheduledPickupTime: new Date().toISOString(),
      fareAmount: 1248,
      durationHours: 2,
      carModel: 'Toyota Innova Crysta (Automatic AT)',
      distanceKm: 34.0,
      isClaimed: true
    });
  };

  return (
    <View style={styles.container}>
      <DriverHeader />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Availability Hero Banner */}
        <View style={[styles.heroCard, driver.isOnline ? styles.heroOnline : styles.heroOffline]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.statusIndicatorRow}>
                <View style={[styles.statusBeacon, driver.isOnline ? styles.beaconOnline : styles.beaconOffline]} />
                <Text style={[styles.heroStatusLabel, driver.isOnline ? styles.labelOnline : styles.labelOffline]}>
                  {driver.isOnline ? 'DUTY SYSTEM ACTIVE' : 'DUTY SYSTEM OFFLINE'}
                </Text>
              </View>
              <Text style={styles.heroStatusTitle}>
                {driver.isOnline ? 'Ready for Dispatches & Gigs' : 'Shift Currently Paused'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.heroToggleBtn, driver.isOnline ? styles.heroToggleBtnActive : styles.heroToggleBtnInactive]}
              onPress={toggleOnline}
              activeOpacity={0.85}
            >
              <Text style={[styles.heroToggleText, driver.isOnline ? styles.heroToggleTextActive : styles.heroToggleTextInactive]}>
                {driver.isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroHint}>
            {driver.isOnline
              ? 'Matched with verified personal car duties (2h-8h), party returns, 1-2 day outstation road trips & city cab requests.'
              : 'Switch online to view open customer gigs and start receiving direct dispatches.'}
          </Text>
        </View>
        
        {/* GO ONLINE AS (DRIVER MODES SELECTOR) */}
        <View style={styles.driverModesCard}>
          <Text style={styles.driverModesTitle}>GO ONLINE AS (QUALIFIED MODES)</Text>
          <View style={styles.driverModesRow}>
            <TouchableOpacity
              style={[styles.modeTogglePill, activeModes.cab && styles.modeTogglePillActive]}
              onPress={() => toggleMode('cab')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeEmoji}>🚗</Text>
              <Text style={[styles.modeText, activeModes.cab && styles.modeTextActive]}>Cab</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTogglePill, activeModes.auto && styles.modeTogglePillActive]}
              onPress={() => toggleMode('auto')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeEmoji}>🛺</Text>
              <Text style={[styles.modeText, activeModes.auto && styles.modeTextActive]}>Auto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTogglePill, activeModes.bike && styles.modeTogglePillActive]}
              onPress={() => toggleMode('bike')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeEmoji}>🏍</Text>
              <Text style={[styles.modeText, activeModes.bike && styles.modeTextActive]}>Bike</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTogglePill, activeModes.chauffeur && styles.modeTogglePillActive]}
              onPress={() => toggleMode('chauffeur')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeEmoji}>👨‍✈️</Text>
              <Text style={[styles.modeText, activeModes.chauffeur && styles.modeTextActive]}>Chauffeur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTogglePill, activeModes.delivery && styles.modeTogglePillActive]}
              onPress={() => toggleMode('delivery')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeEmoji}>📦</Text>
              <Text style={[styles.modeText, activeModes.delivery && styles.modeTextActive]}>Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fatigue Protection Cockpit */}
        <View style={styles.fatigueCard}>
          <View style={styles.fatigueHeaderRow}>
            <View style={styles.fatigueTitleRow}>
              <Text style={styles.fatigueIcon}>🛡️</Text>
              <Text style={styles.fatigueTitle}>DRIVER OS FATIGUE ENGINE</Text>
            </View>
            <View style={styles.fatigueSafeBadge}>
              <Text style={styles.fatigueSafeBadgeText}>SAFE ZONE</Text>
            </View>
          </View>

          {/* Fatigue Metric Cards */}
          <View style={styles.fatigueMetricsRow}>
            <View style={styles.fatigueMetricCol}>
              <Text style={styles.fatigueMetricLabel}>DRIVING TODAY</Text>
              <Text style={styles.fatigueMetricValue}>5h 42m</Text>
              <Text style={styles.fatigueMetricSub}>71% of daily cap</Text>
            </View>
            <View style={styles.fatigueDivider} />
            <View style={styles.fatigueMetricCol}>
              <Text style={styles.fatigueMetricLabel}>RECOMMENDED BREAK</Text>
              <Text style={[styles.fatigueMetricValue, { color: '#FBBF24' }]}>in 18 min</Text>
              <Text style={styles.fatigueMetricSub}>15-min tea pause</Text>
            </View>
            <View style={styles.fatigueDivider} />
            <View style={styles.fatigueMetricCol}>
              <Text style={styles.fatigueMetricLabel}>AVAILABLE DUTY</Text>
              <Text style={[styles.fatigueMetricValue, { color: '#D2FF00' }]}>2h 18m</Text>
              <Text style={styles.fatigueMetricSub}>Remaining today</Text>
            </View>
          </View>

          {/* Visual Fatigue Meter */}
          <View style={styles.fatigueMeterTrack}>
            <View style={[styles.fatigueMeterFill, { width: '71%' }]} />
          </View>
          <View style={styles.fatigueLabelsRow}>
            <Text style={styles.fatigueMeterSub}>0h Start</Text>
            <Text style={styles.fatigueMeterSub}>Break at 6h</Text>
            <Text style={styles.fatigueMeterSub}>8h Max Safe Limit</Text>
          </View>
        </View>

        {/* Shift Net Earnings Cockpit */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeaderRow}>
            <Text style={styles.earningsLabel}>TODAY'S NET EARNINGS</Text>
            <View style={styles.settlePill}>
              <Text style={styles.settlePillText}>⚡ UPI INSTANT READY</Text>
            </View>
          </View>
          <View style={styles.earningsValueRow}>
            <Text style={styles.earningsValue}>₹ {earnings.todayEarnings || 3420}</Text>
            <TouchableOpacity
              style={styles.payoutBtn}
              onPress={() => navigate('EARNINGS')}
              activeOpacity={0.85}
            >
              <Text style={styles.payoutBtnText}>Withdraw →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.earningsFooterRow}>
            <Text style={styles.earningsSub}>
              {earnings.todayCompletedTrips || 5} Duties Completed • ₹0 Platform Deductions
            </Text>
          </View>
        </View>

        {/* Transmission & Skill Badges */}
        <View style={styles.skillsCard}>
          <View style={styles.skillsHeaderRow}>
            <Text style={styles.skillsTitle}>YOUR CERTIFIED CREDENTIALS</Text>
            <View style={styles.badgeVerified}>
              <Text style={styles.badgeVerifiedText}>POLICE VERIFIED ✓</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBullet}>◆</Text>
              <Text style={styles.skillBadgeText}>LMV Commercial DL</Text>
            </View>
            <View style={[styles.skillBadge, styles.skillBadgeActive]}>
              <Text style={styles.skillBadgeBulletGold}>◆</Text>
              <Text style={styles.skillBadgeTextActive}>Automatic (AT) Pro</Text>
            </View>
            <View style={[styles.skillBadge, styles.skillBadgeActive]}>
              <Text style={styles.skillBadgeBulletGold}>◆</Text>
              <Text style={styles.skillBadgeTextActive}>Manual (MT) Expert</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBullet}>◆</Text>
              <Text style={styles.skillBadgeText}>Luxury Car Certified</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Committed Duty Card */}
        {upcomingScheduled && (
          <TouchableOpacity
            style={styles.scheduledAlertCard}
            onPress={() => navigate('SCHEDULED_RIDES')}
            activeOpacity={0.88}
          >
            <View style={styles.scheduledAlertTop}>
              <View style={styles.badgeScheduled}>
                <Text style={styles.badgeScheduledText}>
                  {upcomingScheduled.gigType === 'HOURLY_CHAUFFEUR'
                    ? 'COMMITTED CHAUFFEUR GIG'
                    : 'COMMITTED AIRPORT RUN'}
                </Text>
              </View>
              <Text style={styles.alertFare}>₹{upcomingScheduled.fareAmount}</Text>
            </View>

            <Text style={styles.alertHeading}>
              {upcomingScheduled.gigType === 'HOURLY_CHAUFFEUR'
                ? `4-Hour Duty • ${upcomingScheduled.carModel}`
                : `Airport Drop • ${new Date(upcomingScheduled.scheduledPickupTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
            </Text>

            <Text style={styles.alertRoute} numberOfLines={1}>
              {upcomingScheduled.pickupAddress} ➔ {upcomingScheduled.dropAddress}
            </Text>

            <View style={styles.alertFooter}>
              <Text style={styles.alertRider}>Customer: {upcomingScheduled.riderName}</Text>
              <Text style={styles.alertAction}>Open Gig Details →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Gig Marketplace Cards */}
        <View style={styles.marketplaceSection}>
          <View style={styles.marketHeaderRow}>
            <View>
              <Text style={styles.marketHeading}>GIG MARKETPLACE</Text>
              <Text style={styles.marketSub}>High-earning personal car chauffeur duties</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigate('SCHEDULED_RIDES')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All (14) →</Text>
            </TouchableOpacity>
          </View>

          {/* Sample Gig Card 1 */}
          <TouchableOpacity
            style={styles.gigCard}
            onPress={() => navigate('SCHEDULED_RIDES')}
            activeOpacity={0.85}
          >
            <View style={styles.gigCardTop}>
              <View style={styles.gigBadge}>
                <Text style={styles.gigBadgeText}>2-HOUR CHAUFFEUR</Text>
              </View>
              <Text style={styles.gigPayout}>₹ 750</Text>
            </View>
            <Text style={styles.gigTitle}>Customer Car: Honda City (Automatic AT)</Text>
            <Text style={styles.gigRoute}>📍 Koramangala ➔ Indiranagar Roundtrip</Text>
            <View style={styles.gigFooter}>
              <Text style={styles.gigTime}>Today at 4:30 PM</Text>
              <Text style={styles.gigClaimBtn}>Claim Gig →</Text>
            </View>
          </TouchableOpacity>

          {/* Sample Gig Card 2 */}
          <TouchableOpacity
            style={styles.gigCard}
            onPress={() => navigate('SCHEDULED_RIDES')}
            activeOpacity={0.85}
          >
            <View style={styles.gigCardTop}>
              <View style={[styles.gigBadge, { backgroundColor: 'rgba(210, 255, 0, 0.15)', borderColor: 'rgba(210, 255, 0, 0.3)' }]}>
                <Text style={[styles.gigBadgeText, { color: '#D2FF00' }]}>WEDDING WHITE GLOVE</Text>
              </View>
              <Text style={[styles.gigPayout, { color: '#D2FF00' }]}>₹ 3,500</Text>
            </View>
            <Text style={styles.gigTitle}>Customer Car: Mercedes E-Class (Automatic AT)</Text>
            <Text style={styles.gigRoute}>📍 Palace Grounds ➔ Whitefield</Text>
            <View style={styles.gigFooter}>
              <Text style={styles.gigTime}>Tomorrow • 6 Hours Duty</Text>
              <Text style={styles.gigClaimBtn}>Claim Gig →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Instant Dispatch Simulator Trigger */}
        <View style={styles.simCard}>
          <View style={styles.simHeaderRow}>
            <Text style={styles.simTitle}>SIMULATE INCOMING REQUEST</Text>
            <View style={styles.simPill}>
              <Text style={styles.simPillText}>DISPATCH TEST</Text>
            </View>
          </View>
          <Text style={styles.simSub}>
            Test incoming 30-second dispatch popup modal with car transmission & hourly duty specs.
          </Text>
          <TouchableOpacity
            style={styles.simBtn}
            onPress={() => setShowIncomingModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.simBtnText}>Trigger Instant Chauffeur Request →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Incoming Request Modal */}
      <IncomingRideModal
        visible={showIncomingModal}
        onAccept={handleAcceptInstant}
        onReject={() => setShowIncomingModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },

  /* Hero Status Banner */
  heroCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  heroOnline: {
    backgroundColor: '#131C38',
    borderColor: '#D2FF00'
  },
  heroOffline: {
    backgroundColor: '#131C38',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  statusBeacon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  beaconOnline: {
    backgroundColor: '#D2FF00'
  },
  beaconOffline: {
    backgroundColor: '#94A3B8'
  },
  heroStatusLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  labelOnline: {
    color: '#D2FF00'
  },
  labelOffline: {
    color: '#94A3B8'
  },
  heroStatusTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  heroToggleBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5
  },
  heroToggleBtnActive: {
    backgroundColor: 'rgba(210, 255, 0, 0.15)',
    borderColor: '#D2FF00'
  },
  heroToggleBtnInactive: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  heroToggleText: {
    fontSize: 12,
    fontWeight: '800'
  },
  heroToggleTextActive: {
    color: '#D2FF00'
  },
  heroToggleTextInactive: {
    color: '#FFFFFF'
  },
  heroHint: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16
  },

  /* Fatigue Protection Cockpit */
  fatigueCard: {
    backgroundColor: '#131C38',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  fatigueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  fatigueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  fatigueIcon: {
    fontSize: 14
  },
  fatigueTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  fatigueSafeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  fatigueSafeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399'
  },
  fatigueMetricsRow: {
    flexDirection: 'row',
    paddingVertical: 4
  },
  fatigueMetricCol: {
    flex: 1,
    alignItems: 'center'
  },
  fatigueDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  fatigueMetricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
  },
  fatigueMetricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  fatigueMetricSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1
  },
  fatigueMeterTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 6,
    overflow: 'hidden'
  },
  fatigueMeterFill: {
    height: '100%',
    backgroundColor: '#D2FF00',
    borderRadius: 3
  },
  fatigueLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fatigueMeterSub: {
    fontSize: 9,
    color: '#64748B'
  },

  /* Earnings Cockpit */
  earningsCard: {
    backgroundColor: '#131C38',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  earningsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  earningsLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  settlePill: {
    backgroundColor: 'rgba(210, 255, 0, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  settlePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D2FF00'
  },
  earningsValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4
  },
  earningsValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#D2FF00'
  },
  payoutBtn: {
    backgroundColor: '#D2FF00',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  payoutBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0A1128'
  },
  earningsFooterRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
    marginTop: 4
  },
  earningsSub: {
    fontSize: 11,
    color: '#94A3B8'
  },

  /* Skills & Credentials */
  skillsCard: {
    backgroundColor: '#131C38',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  skillsTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
  },
  badgeVerified: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  badgeVerifiedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 6
  },
  skillBadgeActive: {
    backgroundColor: 'rgba(210, 255, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(210, 255, 0, 0.3)'
  },
  skillBadgeBullet: {
    fontSize: 8,
    color: '#94A3B8'
  },
  skillBadgeBulletGold: {
    fontSize: 8,
    color: '#D2FF00'
  },
  skillBadgeText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600'
  },
  skillBadgeTextActive: {
    fontSize: 11,
    color: '#D2FF00',
    fontWeight: '800'
  },

  /* Upcoming Scheduled Alert */
  scheduledAlertCard: {
    backgroundColor: '#19264D',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#D2FF00'
  },
  scheduledAlertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  badgeScheduled: {
    backgroundColor: 'rgba(210, 255, 0, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  badgeScheduledText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D2FF00'
  },
  alertFare: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D2FF00'
  },
  alertHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2
  },
  alertRoute: {
    fontSize: 11.5,
    color: '#CBD5E1',
    marginBottom: 8
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8
  },
  alertRider: {
    fontSize: 11,
    color: '#94A3B8'
  },
  alertAction: {
    fontSize: 11,
    color: '#D2FF00',
    fontWeight: '800'
  },

  /* Gig Marketplace */
  marketplaceSection: {
    marginBottom: 14
  },
  marketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  marketHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  marketSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1
  },
  viewAllText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#D2FF00'
  },
  gigCard: {
    backgroundColor: '#131C38',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  gigCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  gigBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  gigBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399'
  },
  gigPayout: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  gigTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  gigRoute: {
    fontSize: 11,
    color: '#94A3B8',
    marginVertical: 4
  },
  gigFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
    marginTop: 2
  },
  gigTime: {
    fontSize: 10.5,
    color: '#64748B'
  },
  gigClaimBtn: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D2FF00'
  },

  /* Simulator Card */
  simCard: {
    backgroundColor: '#131C38',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  simHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  simTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  simPill: {
    backgroundColor: '#1E293B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  simPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94A3B8'
  },
  simSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10
  },
  simBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D2FF00'
  },

  /* Driver Modes Card */
  driverModesCard: {
    backgroundColor: '#121619',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 14
  },
  driverModesTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#929A96',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  driverModesRow: {
    flexDirection: 'row',
    gap: 6
  },
  modeTogglePill: {
    flex: 1,
    backgroundColor: '#181D20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modeTogglePillActive: {
    borderColor: '#C7FF3D',
    backgroundColor: 'rgba(199, 255, 61, 0.1)'
  },
  modeEmoji: {
    fontSize: 14,
    marginBottom: 2
  },
  modeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#929A96'
  },
  modeTextActive: {
    color: '#F4F6F3',
    fontWeight: '800'
  }
});
