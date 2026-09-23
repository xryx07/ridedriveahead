import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { useDriverStore } from '../store/useDriverStore';

export const ScheduledRidesScreen: React.FC = () => {
  const { scheduledRides, claimRide, startActiveTrip, navigate } = useDriverStore();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filterTabs = [
    { id: 'ALL', label: 'All Gigs' },
    { id: 'HOURLY', label: 'Hourly (2h-8h)' },
    { id: 'EVENT', label: 'Events & Weddings' },
    { id: 'OUTSTATION', label: '1-2 Day Road Trips' },
    { id: 'CAB', label: 'Cab Runs' }
  ];

  const filteredGigs = scheduledRides.filter((gig) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HOURLY') return gig.gigType === 'HOURLY_CHAUFFEUR';
    if (activeFilter === 'EVENT') return gig.gigType === 'EVENT_CHAUFFEUR';
    if (activeFilter === 'OUTSTATION') return gig.gigType === 'OUTSTATION_1DAY' || gig.gigType === 'OUTSTATION_2DAY';
    if (activeFilter === 'CAB') return gig.gigType === 'AIRPORT_CAB' || !gig.gigType;
    return true;
  });

  const handleClaim = (rideId: string) => {
    claimRide(rideId);
  };

  const handleStartDuty = (ride: any) => {
    startActiveTrip(ride);
    navigate('ACTIVE_TRIP');
  };

  return (
    <View style={styles.container}>
      <DriverHeader title="Gig & Duty Marketplace" showBack backTo="HOME" />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, activeFilter === tab.id && styles.tabBtnActive]}
              onPress={() => setActiveFilter(tab.id)}
            >
              <Text style={[styles.tabBtnText, activeFilter === tab.id && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle}>Flexible Gigs • Instant Payouts</Text>
          <Text style={styles.bannerSub}>
            Drive for a few hours, evening events, or take 1-2 day road trips. Direct bank IMPS payout.
          </Text>
        </View>

        {filteredGigs.map((ride) => (
          <View key={ride.id} style={[styles.gigCard, ride.isClaimed && styles.gigCardClaimed]}>
            <View style={styles.gigTop}>
              <View style={styles.tagWrap}>
                <View
                  style={[
                    styles.typeBadge,
                    ride.gigType === 'OUTSTATION_2DAY'
                      ? styles.badgePurple
                      : ride.gigType === 'EVENT_CHAUFFEUR'
                      ? styles.badgeAmber
                      : styles.badgeGreen
                  ]}
                >
                  <Text style={styles.typeBadgeText}>
                    {ride.gigType === 'OUTSTATION_2DAY'
                      ? '1-2 DAY OUTSTATION'
                      : ride.gigType === 'EVENT_CHAUFFEUR'
                      ? 'EVENT CHAUFFEUR'
                      : ride.gigType === 'HOURLY_CHAUFFEUR'
                      ? 'HOURLY CHAUFFEUR'
                      : 'AIRPORT CAB'}
                  </Text>
                </View>
                {ride.isClaimed && (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedBadgeText}>YOUR COMMITTED GIG</Text>
                  </View>
                )}
              </View>
              <Text style={styles.fareAmount}>₹{ride.fareAmount}</Text>
            </View>

            {/* Vehicle & Transmission Spec */}
            {ride.carModel && (
              <View style={styles.carSpecRow}>
                <Text style={styles.carSpecLabel}>VEHICLE: </Text>
                <Text style={styles.carSpecVal}>{ride.carModel}</Text>
              </View>
            )}

            {/* Duty Duration / Route */}
            <Text style={styles.dutyTitle}>
              {new Date(ride.scheduledPickupTime).toLocaleTimeString('en-IN', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}{' '}
              • {ride.durationHours ? `${ride.durationHours} Hours Duty` : 'Airport Drop'}
            </Text>

            <View style={styles.routeBox}>
              <Text style={styles.pickupText} numberOfLines={1}>
                Pickup: {ride.pickupAddress}
              </Text>
              <Text style={styles.dropText} numberOfLines={1}>
                Drop / Coverage: {ride.dropAddress}
              </Text>
            </View>

            {ride.riderNotes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>Note: {ride.riderNotes}</Text>
              </View>
            )}

            {ride.isClaimed ? (
              <TouchableOpacity style={styles.startBtn} onPress={() => handleStartDuty(ride)}>
                <Text style={styles.startBtnText}>Open Duty Navigation & Checklist →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(ride.id)}>
                <Text style={styles.claimBtnText}>Claim Gig & Lock ₹{ride.fareAmount} Payout</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6
  },
  tabBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  tabBtnTextActive: {
    color: '#FFFFFF'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40
  },
  bannerInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  bannerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  gigCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  gigCardClaimed: {
    borderColor: '#059669',
    borderWidth: 1.5
  },
  gigTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  badgeAmber: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  badgePurple: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0F172A'
  },
  claimedBadge: {
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4
  },
  claimedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857'
  },
  carSpecRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  carSpecLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B'
  },
  carSpecVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A'
  },
  dutyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8
  },
  pickupText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4
  },
  dropText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  notesBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10
  },
  notesText: {
    fontSize: 10,
    color: '#475569',
    fontStyle: 'italic'
  },
  claimBtn: {
    backgroundColor: '#047857',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  startBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
