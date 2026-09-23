import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';

export const TripHistoryScreen: React.FC = () => {
  const completedTrips = [
    {
      id: 'TRIP-901',
      date: 'Today, 06:45 AM',
      type: 'SCHEDULED',
      pickup: 'Sector 43, Golf Course Road, Gurugram',
      drop: 'IGI Airport Terminal 3, New Delhi',
      distanceKm: 18.5,
      fare: 750,
      tip: 50,
      riderRating: 5
    },
    {
      id: 'TRIP-894',
      date: 'Yesterday, 08:30 PM',
      type: 'INSTANT',
      pickup: 'DLF Cyber Hub, Tower 8',
      drop: 'Connaught Place, Inner Circle',
      distanceKm: 22.0,
      fare: 480,
      tip: 0,
      riderRating: 5
    },
    {
      id: 'TRIP-882',
      date: 'Yesterday, 02:15 PM',
      type: 'INSTANT',
      pickup: 'Ambience Mall, NH 8, Gurugram',
      drop: 'Hauz Khas Village, New Delhi',
      distanceKm: 14.5,
      fare: 340,
      tip: 30,
      riderRating: 4
    }
  ];

  return (
    <View style={styles.container}>
      <DriverHeader title="Trip History" showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Recent Completed Trips</Text>

        <View style={styles.list}>
          {completedTrips.map((trip) => {
            const isScheduled = trip.type === 'SCHEDULED';
            return (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.cardTop}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badge,
                        isScheduled ? styles.badgeScheduled : styles.badgeInstant
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isScheduled ? styles.badgeTextScheduled : styles.badgeTextInstant
                        ]}
                      >
                        {isScheduled ? 'ADVANCE AIRPORT DROP' : 'INSTANT RIDE'}
                      </Text>
                    </View>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                  </View>
                  <Text style={styles.fareText}>₹{trip.fare + trip.tip}</Text>
                </View>

                <View style={styles.routeBox}>
                  <Text style={styles.routePoint} numberOfLines={1}>
                    <Text style={styles.routeLabel}>PICKUP: </Text>
                    {trip.pickup}
                  </Text>
                  <Text style={styles.routePoint} numberOfLines={1}>
                    <Text style={styles.routeLabel}>DROP: </Text>
                    {trip.drop}
                  </Text>
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.distanceText}>{trip.distanceKm} km</Text>
                  {trip.tip > 0 && (
                    <Text style={styles.tipText}>+₹{trip.tip} Tip included</Text>
                  )}
                  <Text style={styles.ratingText}>★ {trip.riderRating}.0 Rating</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  headerTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  list: {
    gap: 12
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  badgeScheduled: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  badgeInstant: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  badgeTextScheduled: {
    color: '#166534'
  },
  badgeTextInstant: {
    color: '#0284C7'
  },
  tripDate: {
    color: '#64748B',
    fontSize: 11
  },
  fareText: {
    color: '#059669',
    fontSize: 18,
    fontWeight: '900'
  },
  routeBox: {
    gap: 4,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  routePoint: {
    color: '#0F172A',
    fontSize: 12
  },
  routeLabel: {
    color: '#64748B',
    fontWeight: '700'
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  distanceText: {
    color: '#64748B',
    fontSize: 11
  },
  tipText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700'
  },
  ratingText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700'
  }
});
