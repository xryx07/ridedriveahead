import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { riderApi } from '../api/apiClient';
import { FareEstimate, PaymentMethod, VehicleTier } from '../types';
import { useRiderStore } from '../store/useRiderStore';
import { CHAUFFEUR_PACKAGES } from './HomeScreen';

export const FareEstimateScreen: React.FC = () => {
  const {
    serviceMode,
    chauffeurPackage,
    carTransmission,
    carCategory,
    carModelName,
    pickupAddress,
    dropAddress,
    bookingType,
    scheduledPickupTime,
    setBookingDraft,
    setActiveBooking,
    navigate
  } = useRiderStore();

  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState<FareEstimate | null>(null);
  const [chosenTier, setChosenTier] = useState<VehicleTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [flightNo, setFlightNo] = useState('AI 102');
  const [notes, setNotes] = useState('Personal vehicle chauffeur');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedChauffeurPkg =
    CHAUFFEUR_PACKAGES.find((p) => p.id === chauffeurPackage) || CHAUFFEUR_PACKAGES[1];

  useEffect(() => {
    fetchEstimate();
  }, []);

  const fetchEstimate = async () => {
    setLoading(true);
    try {
      const data = await riderApi.getFareEstimate(
        pickupAddress,
        dropAddress,
        bookingType,
        scheduledPickupTime ? scheduledPickupTime.toISOString() : undefined
      );
      setEstimate(data);
      if (data.tiers.length > 1) {
        setChosenTier(data.tiers[1]); // Default to Sedan
      }
    } catch (e: any) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      if (serviceMode === 'HIRE_DRIVER') {
        const newBooking = {
          id: 'CHAUFFEUR-' + Math.floor(1000 + Math.random() * 9000),
          riderId: 'rider-01',
          driverId: 'driver-01',
          driverName: 'Rajesh Kumar',
          driverPhone: '+91 98111 56789',
          driverRating: 4.92,
          serviceMode: 'HIRE_DRIVER' as const,
          chauffeurPackage: selectedChauffeurPkg.id,
          carTransmission,
          carCategory,
          carModel: carModelName,
          dutyHoursIncluded: selectedChauffeurPkg.hoursIncluded,
          overtimeRatePerHour: selectedChauffeurPkg.overtimeRatePerHour,
          bookingType: 'SCHEDULED' as const,
          status: 'SCHEDULED_CONFIRMED' as const,
          scheduledPickupTime: scheduledPickupTime ? scheduledPickupTime.toISOString() : new Date().toISOString(),
          pickupAddress,
          dropAddress: dropAddress || 'Local City Travel / Round-trip',
          pickupLat: 28.4595,
          pickupLng: 77.0266,
          dropLat: 28.5562,
          dropLng: 77.1000,
          vehicleType: 'SEDAN' as const,
          fareAmount: selectedChauffeurPkg.baseFare,
          otpCode: '4821',
          createdAt: new Date().toISOString()
        };
        setActiveBooking(newBooking as any);
        navigate('LIVE_TRACKING');
      } else {
        if (!chosenTier) return;
        const newBooking = await riderApi.createBooking({
          pickupAddress,
          dropAddress,
          bookingType,
          scheduledPickupTime: scheduledPickupTime ? scheduledPickupTime.toISOString() : undefined,
          vehicleType: chosenTier.vehicleType,
          fareAmount: chosenTier.totalFare,
          flightNumber: flightNo,
          riderNotes: notes
        });
        setActiveBooking(newBooking);
        setBookingDraft({ tier: chosenTier, flight: flightNo, notes });
        navigate('LIVE_TRACKING');
      }
    } catch (e: any) {
      alert(e.message || 'Booking confirmation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={serviceMode === 'HIRE_DRIVER' ? 'Chauffeur Booking Review' : 'Fare & Vehicle Selection'}
        showBack
        backTo="HOME"
      />

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loaderText}>Verifying pro driver availability & rates...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {serviceMode === 'HIRE_DRIVER' ? (
            /* ================================================= */
            /* HIRE A DRIVER SUMMARY                             */
            /* ================================================= */
            <View>
              {/* Package Summary Card */}
              <View style={styles.proCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeGreenText}>CHAUFFEUR SERVICE</Text>
                  </View>
                  <Text style={styles.cardHeaderPrice}>₹{selectedChauffeurPkg.baseFare}</Text>
                </View>

                <Text style={styles.cardTitle}>{selectedChauffeurPkg.name}</Text>
                <Text style={styles.cardSub}>
                  {selectedChauffeurPkg.hoursIncluded} hours duty for your personal car
                </Text>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Reporting Location:</Text>
                  <Text style={styles.detailVal} numberOfLines={2}>
                    {pickupAddress}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Vehicle & Transmission:</Text>
                  <Text style={styles.detailVal}>
                    {carModelName} ({carTransmission === 'AUTOMATIC' ? 'Automatic AT' : 'Manual MT'})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Duty Window:</Text>
                  <Text style={styles.detailVal}>
                    {selectedChauffeurPkg.hoursIncluded} Hours included
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Extra Duty Rate:</Text>
                  <Text style={[styles.detailVal, { color: '#047857' }]}>
                    ₹{selectedChauffeurPkg.overtimeRatePerHour} / hour
                  </Text>
                </View>
              </View>

              {/* Verified Driver Match Guarantee */}
              <View style={styles.trustBox}>
                <Text style={styles.trustBoxTitle}>Matched Pro Driver Qualification</Text>
                <Text style={styles.trustBoxDesc}>
                  Your assigned driver holds an LMV commercial certification, verified police background
                  check, and minimum 5+ years experience driving {carTransmission.toLowerCase()} vehicles.
                </Text>
              </View>

              {/* Handover Instructions */}
              <View style={styles.cardBox}>
                <Text style={styles.sectionTitle}>Trip Handover Checklist</Text>
                <Text style={styles.bulletItem}>✓ Check fuel gauge & odometer reading together</Text>
                <Text style={styles.bulletItem}>✓ Note any existing dents or exterior scratches</Text>
                <Text style={styles.bulletItem}>✓ Share 4-digit PIN to start official duty clock</Text>
              </View>
            </View>
          ) : (
            /* ================================================= */
            /* BOOK A CAB SUMMARY                                */
            /* ================================================= */
            <View>
              <View style={styles.proCard}>
                <Text style={styles.sectionTitle}>Select Cab Tier</Text>
                {estimate?.tiers.map((tier) => {
                  const isSelected = chosenTier?.vehicleType === tier.vehicleType;
                  return (
                    <TouchableOpacity
                      key={tier.vehicleType}
                      style={[styles.tierRow, isSelected && styles.tierRowSelected]}
                      onPress={() => setChosenTier(tier)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.tierName, isSelected && styles.tierNameSelected]}>
                          {tier.tierName}
                        </Text>
                        <Text style={styles.tierDesc}>{tier.description}</Text>
                        <Text style={styles.tierEta}>ETA: {tier.etaMinutes} mins</Text>
                      </View>
                      <Text style={styles.tierFare}>₹{tier.totalFare}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Payment Method Selector */}
          <View style={styles.proCard}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentRow}>
              {(['UPI', 'CARD', 'CASH'] as PaymentMethod[]).map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[styles.paymentPill, paymentMethod === method && styles.paymentPillActive]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.paymentPillText,
                      paymentMethod === method && styles.paymentPillTextActive
                    ]}
                  >
                    {method === 'UPI' ? 'UPI AutoPay' : method === 'CARD' ? 'Credit/Debit Card' : 'Cash'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.paymentSub}>
              Amount is locked upfront and settled automatically upon duty completion.
            </Text>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleConfirmBooking}
            disabled={isSubmitting}
          >
            <Text style={styles.confirmBtnText}>
              {isSubmitting
                ? 'Securing Pro Driver...'
                : serviceMode === 'HIRE_DRIVER'
                ? `Confirm Chauffeur • ₹${selectedChauffeurPkg.baseFare}`
                : `Confirm Booking • ₹${chosenTier?.totalFare}`}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  loaderText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600'
  },
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  badgeGreenText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857'
  },
  cardHeaderPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  detailKey: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  detailVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10
  },
  trustBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12
  },
  trustBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  trustBoxDesc: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    marginTop: 4
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  bulletItem: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  tierRowSelected: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  tierName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155'
  },
  tierNameSelected: {
    color: '#0F172A',
    fontWeight: '800'
  },
  tierDesc: {
    fontSize: 11,
    color: '#64748B'
  },
  tierEta: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2
  },
  tierFare: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  paymentPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  paymentPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  paymentPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  paymentPillTextActive: {
    color: '#FFFFFF'
  },
  paymentSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4
  },
  confirmBtn: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
