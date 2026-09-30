import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [selectedPreference, setSelectedPreference] = useState<'ALL' | 'CHAUFFEUR' | 'OUTSTATION'>('ALL');

  // Find claimed scheduled ride or chauffeur gig
  const upcomingScheduled = scheduledRides.find((r) => r.isClaimed);

  const handleAcceptInstant = () => {
    setShowIncomingModal(false);
    startActiveTrip({
      id: 'instant-duty-' + Date.now(),
      riderName: 'Vikram Malhotra',
      riderPhone: '+91 99****8822',
      pickupAddress: 'Cyber Hub, Building 8B, DLF Phase 2, Gurugram',
      dropAddress: 'City Round-Trip (Customer\'s Creta AT)',
      scheduledPickupTime: new Date().toISOString(),
      fareAmount: 549,
      durationHours: 4,
      carModel: 'Hyundai Creta (Automatic AT)',
      distanceKm: 22.0,
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
            <View>
              <View style={styles.statusIndicatorRow}>
                <View style={[styles.statusBeacon, driver.isOnline ? styles.beaconOnline : styles.beaconOffline]} />
                <Text style={[styles.heroStatusLabel, driver.isOnline ? styles.labelOnline : styles.labelOffline]}>
                  {driver.isOnline ? 'DUTY SYSTEM ACTIVE' : 'DUTY SYSTEM OFFLINE'}
                </Text>
              </View>
              <Text style={styles.heroStatusTitle}>
                {driver.isOnline ? 'Receiving Gigs & Airport Runs' : 'Shift Currently Paused'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.heroToggleBtn, driver.isOnline ? styles.heroToggleBtnActive : styles.heroToggleBtnInactive]}
              onPress={toggleOnline}
              activeOpacity={0.85}
            >
              <Text style={styles.heroToggleText}>{driver.isOnline ? 'Go Offline' : 'Go Online'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroHint}>
            {driver.isOnline
              ? 'Matched with verified personal car duties (2h-8h), party returns, 1-2 day outstation road trips & city cab requests.'
              : 'Switch online to view open customer gigs and start receiving direct dispatches.'}
          </Text>
        </View>

        {/* Transmission & Skill Badges */}
        <View style={styles.skillsCard}>
          <View style={styles.skillsHeaderRow}>
            <Text style={styles.skillsTitle}>YOUR CERTIFIED DRIVER CREDENTIALS</Text>
            <View style={styles.badgeVerified}>
              <Text style={styles.badgeVerifiedText}>POLICE VERIFIED</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBullet}>◆</Text>
              <Text style={styles.skillBadgeText}>LMV Commercial DL</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBulletGold}>◆</Text>
              <Text style={styles.skillBadgeText}>Automatic (AT) Pro</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBulletGold}>◆</Text>
              <Text style={styles.skillBadgeText}>Manual (MT) Expert</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeBullet}>◆</Text>
              <Text style={styles.skillBadgeText}>Luxury Car Certified</Text>
            </View>
          </View>
        </View>

        {/* Shift Summary Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TODAY'S NET EARNINGS</Text>
            <Text style={styles.statValue}>₹{earnings.todayEarnings}</Text>
            <Text style={styles.statSub}>{earnings.todayCompletedTrips} Duties Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DRIVING HOURS TODAY</Text>
            <Text style={[styles.statValue, { color: '#0F172A' }]}>{driver.drivingHoursToday}h</Text>
            <Text style={styles.statSub}>4.5h left before fatigue limit</Text>
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

        {/* Gig Marketplace Banner */}
        <TouchableOpacity
          style={styles.marketplaceBanner}
          onPress={() => navigate('SCHEDULED_RIDES')}
          activeOpacity={0.88}
        >
          <View style={styles.marketLeft}>
            <View style={styles.marketBadge}>
              <Text style={styles.marketBadgeText}>GIG MARKETPLACE</Text>
            </View>
            <Text style={styles.marketTitle}>Browse Hourly & 1-2 Day Driving Gigs</Text>
            <Text style={styles.marketSub}>
              Earn ₹299–₹2,799 driving customer vehicles. Flexible hours, zero taxi overhead.
            </Text>
          </View>
          <View style={styles.marketActionBtn}>
            <Text style={styles.marketActionText}>Explore →</Text>
          </View>
        </TouchableOpacity>

        {/* Instant Dispatch Simulator Trigger */}
        <View style={styles.simCard}>
          <View style={styles.simHeaderRow}>
            <Text style={styles.simTitle}>SIMULATE INCOMING REQUEST</Text>
            <View style={styles.simPill}>
              <Text style={styles.simPillText}>TEST DISPATCH</Text>
            </View>
          </View>
          <Text style={styles.simSub}>
            Test incoming 30-second dispatch modal with car transmission & hourly duty specs.
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
    backgroundColor: '#F8FAFC'
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  heroOnline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A7F3D0'
  },
  heroOffline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3
  },
  statusBeacon: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  beaconOnline: {
    backgroundColor: '#10B981'
  },
  beaconOffline: {
    backgroundColor: '#94A3B8'
  },
  heroStatusLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6
  },
  labelOnline: {
    color: '#059669'
  },
  labelOffline: {
    color: '#64748B'
  },
  heroStatusTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  heroToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  heroToggleBtnActive: {
    backgroundColor: '#0F172A'
  },
  heroToggleBtnInactive: {
    backgroundColor: '#059669'
  },
  heroToggleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  heroHint: {
    color: '#64748B',
    fontSize: 11.5,
    lineHeight: 16
  },

  /* Skills & Credentials */
  skillsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  skillsTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5
  },
  badgeVerified: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeVerifiedText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#047857'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  skillBadgeBullet: {
    fontSize: 7,
    color: '#059669'
  },
  skillBadgeBulletGold: {
    fontSize: 7,
    color: '#D97706'
  },
  skillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155'
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  statLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4
  },
  statValue: {
    color: '#047857',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4
  },
  statSub: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '500'
  },

  /* Scheduled Alert Card */
  scheduledAlertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#059669',
    marginBottom: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  scheduledAlertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  badgeScheduled: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#A7F3D0'
  },
  badgeScheduledText: {
    color: '#047857',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  alertFare: {
    color: '#047857',
    fontSize: 20,
    fontWeight: '900'
  },
  alertHeading: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800'
  },
  alertRoute: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  alertRider: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700'
  },
  alertAction: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800'
  },

  /* Gig Marketplace Banner */
  marketplaceBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  marketLeft: {
    flex: 1,
    marginRight: 10
  },
  marketBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#334155'
  },
  marketBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 0.4
  },
  marketTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  marketSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 14
  },
  marketActionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  marketActionText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '900'
  },

  /* Simulator Card */
  simCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A'
  },
  simHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  simTitle: {
    color: '#92400E',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4
  },
  simPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  simPillText: {
    color: '#B45309',
    fontSize: 7.5,
    fontWeight: '900'
  },
  simSub: {
    color: '#78350F',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15
  },
  simBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
