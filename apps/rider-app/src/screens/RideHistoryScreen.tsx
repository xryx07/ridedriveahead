import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { Booking } from '../types';
import { useRiderStore } from '../store/useRiderStore';

export const RideHistoryScreen: React.FC = () => {
  const { rideHistory, setActiveBooking, navigate } = useRiderStore();
  const [activeTab, setActiveTab] = useState<'SCHEDULED' | 'PAST'>('SCHEDULED');

  const scheduledRides = rideHistory.filter(
    (b) => b.bookingType === 'SCHEDULED' && b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  );

  const pastRides = rideHistory.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.bookingType === 'INSTANT'
  );

  const currentList = activeTab === 'SCHEDULED' ? scheduledRides : pastRides;

  return (
    <View style={styles.container}>
      <Header title="My Bookings" showBack backTo="HOME" />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'SCHEDULED' && styles.activeTab]}
          onPress={() => setActiveTab('SCHEDULED')}
        >
          <Text style={[styles.tabText, activeTab === 'SCHEDULED' && styles.activeTabText]}>
            Upcoming ({scheduledRides.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'PAST' && styles.activeTab]}
          onPress={() => setActiveTab('PAST')}
        >
          <Text style={[styles.tabText, activeTab === 'PAST' && styles.activeTabText]}>
            Past Trips ({pastRides.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentList.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBadge}>
              <Text style={styles.emptyIconText}>BOOKING</Text>
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'SCHEDULED' ? 'No Upcoming Scheduled Rides' : 'No Past Trips Found'}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'SCHEDULED'
                ? 'Plan ahead! Book an early morning airport drop with guaranteed fares.'
                : 'Your completed journeys and invoices will appear here.'}
            </Text>
            <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigate('HOME')}>
              <Text style={styles.bookNowBtnText}>Schedule a Ride Now →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentList.map((booking) => {
            const isScheduled = booking.bookingType === 'SCHEDULED';
            return (
              <View key={booking.id} style={styles.rideCard}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.tagRow}>
                    <View
                      style={[
                        styles.typeBadge,
                        isScheduled ? styles.typeBadgeScheduled : styles.typeBadgeInstant
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          isScheduled ? styles.typeBadgeTextScheduled : styles.typeBadgeTextInstant
                        ]}
                      >
                        {isScheduled ? 'ADVANCE SCHEDULED' : 'INSTANT RIDE'}
                      </Text>
                    </View>
                    {booking.flightNumber && (
                      <View style={styles.flightBadge}>
                        <Text style={styles.flightBadgeText}>FLIGHT {booking.flightNumber}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.fareAmount}>₹{booking.fareAmount}</Text>
                </View>

                {/* Scheduled Time Banner */}
                {isScheduled && booking.scheduledPickupTime && (
                  <View style={styles.timeBanner}>
                    <Text style={styles.timeBannerLabel}>Scheduled Pickup:</Text>
                    <Text style={styles.timeBannerValue}>
                      {new Date(booking.scheduledPickupTime).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                )}

                {/* Route points */}
                <View style={styles.routeBox}>
                  <Text style={styles.routeItem} numberOfLines={1}>
                    <Text style={styles.routeLabel}>PICKUP: </Text>
                    {booking.pickupAddress}
                  </Text>
                  <Text style={styles.routeItem} numberOfLines={1}>
                    <Text style={styles.routeLabel}>DROP: </Text>
                    {booking.dropAddress}
                  </Text>
                </View>

                {/* Driver / OTP row */}
                <View style={styles.cardFooter}>
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text style={styles.driverName}>Driver: {booking.driverName || 'Assigned Driver'}</Text>
                    <Text style={styles.vehiclePlate}>
                      {booking.vehicleModel} ({booking.vehiclePlate || 'Assigned'})
                    </Text>
                  </View>

                  {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' ? (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() => {
                        setActiveBooking(booking);
                        navigate('LIVE_TRACKING');
                      }}
                    >
                      <Text style={styles.trackBtnText}>Live Track & OTP ({booking.otpCode}) →</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.statusPill}>
                      <Text
                        style={[
                          styles.statusPillText,
                          booking.status === 'COMPLETED' ? { color: '#059669' } : { color: '#EF4444' }
                        ]}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  tabText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600'
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  emptyIconBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 12
  },
  emptyIconText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '800'
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700'
  },
  emptySub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 16
  },
  bookNowBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  typeBadgeScheduled: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  typeBadgeInstant: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  typeBadgeTextScheduled: {
    color: '#166534'
  },
  typeBadgeTextInstant: {
    color: '#0284C7'
  },
  flightBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  flightBadgeText: {
    color: '#6D28D9',
    fontSize: 10,
    fontWeight: '700'
  },
  fareAmount: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800'
  },
  timeBanner: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  timeBannerLabel: {
    color: '#64748B',
    fontSize: 11
  },
  timeBannerValue: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700'
  },
  routeBox: {
    gap: 6,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  routeItem: {
    color: '#0F172A',
    fontSize: 12
  },
  routeLabel: {
    color: '#64748B',
    fontWeight: '700'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  driverName: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  vehiclePlate: {
    color: '#64748B',
    fontSize: 10
  },
  trackBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  statusPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  }
});
