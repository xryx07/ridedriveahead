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
              <Text style={styles.heroStatusLabel}>DUTY AVAILABILITY</Text>
              <Text style={styles.heroStatusTitle}>
                {driver.isOnline ? 'Online • Receiving Gigs & Rides' : 'You are Currently Offline'}
              </Text>
            </View>
            <TouchableOpacity style={styles.heroToggleBtn} onPress={toggleOnline}>
              <Text style={styles.heroToggleText}>{driver.isOnline ? 'Go Offline' : 'Go Online'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroHint}>
            {driver.isOnline
              ? 'Receiving hourly chauffeur duties (2h-8h), special event duties, 1-2 day outstation gigs & cab runs.'
              : 'Switch online to view and claim open driving gigs.'}
          </Text>
        </View>

        {/* Transmission & Skill Badges */}
        <View style={styles.skillsCard}>
          <Text style={styles.skillsTitle}>YOUR CERTIFIED DRIVER SKILLS</Text>
          <View style={styles.badgeRow}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>LMV Commercial DL</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>Automatic (AT) Pro</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>Manual (MT) Expert</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>Luxury Car Certified</Text>
            </View>
          </View>
        </View>

        {/* Shift Summary Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TODAY'S NET EARNINGS</Text>
            <Text style={styles.statValue}>₹{earnings.todayEarnings}</Text>
            <Text style={styles.statSub}>{earnings.todayCompletedTrips} Duties completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DRIVING HOURS TODAY</Text>
            <Text style={[styles.statValue, { color: '#0284C7' }]}>{driver.drivingHoursToday}h</Text>
            <Text style={styles.statSub}>4.5h left before rest limit</Text>
          </View>
        </View>

        {/* Upcoming Committed Duty Card */}
        {upcomingScheduled && (
          <TouchableOpacity
            style={styles.scheduledAlertCard}
            onPress={() => navigate('SCHEDULED_RIDES')}
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
            <Text style={styles.marketActionText}>Explore</Text>
          </View>
        </TouchableOpacity>

        {/* Instant Dispatch Simulator Trigger */}
        <View style={styles.simCard}>
          <Text style={styles.simTitle}>Simulate Incoming Chauffeur Request</Text>
          <Text style={styles.simSub}>
            Test incoming 30-second dispatch modal with car transmission & hourly duty specs.
          </Text>
          <TouchableOpacity style={styles.simBtn} onPress={() => setShowIncomingModal(true)}>
            <Text style={styles.simBtnText}>Trigger Instant Request</Text>
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
  heroCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1
  },
  heroOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  heroOffline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1'
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  heroStatusLabel: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  heroStatusTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2
  },
  heroToggleBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  heroToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroHint: {
    color: '#334155',
    fontSize: 12,
    lineHeight: 16
  },
  skillsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  skillsTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  skillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  statValue: {
    color: '#047857',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4
  },
  statSub: {
    color: '#64748B',
    fontSize: 10
  },
  scheduledAlertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#059669',
    marginBottom: 14
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
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  badgeScheduledText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '800'
  },
  alertFare: {
    color: '#047857',
    fontSize: 18,
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
    fontWeight: '600'
  },
  alertAction: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '700'
  },
  marketplaceBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  marketLeft: {
    flex: 1,
    marginRight: 10
  },
  marketBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  marketBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  marketTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  marketSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  marketActionBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  marketActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  simCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  simTitle: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800'
  },
  simSub: {
    color: '#78350F',
    fontSize: 11,
    marginVertical: 4
  },
  simBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  }
});
