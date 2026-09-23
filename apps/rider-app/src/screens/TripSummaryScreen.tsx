import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { useRiderStore } from '../store/useRiderStore';

export const TripSummaryScreen: React.FC = () => {
  const { activeBooking, setActiveBooking, navigate } = useRiderStore();
  const [rating, setRating] = useState<number>(5);
  const [tip, setTip] = useState<number>(50);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isChauffeur = activeBooking?.serviceMode === 'HIRE_DRIVER';
  const fare = activeBooking?.fareAmount || (isChauffeur ? 549 : 750);

  const handleSubmitRating = () => {
    setSubmitted(true);
    setTimeout(() => {
      setActiveBooking(null);
      navigate('HOME');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Header title={isChauffeur ? 'Duty Completed' : 'Trip Completed'} showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successBox}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>✓ SETTLED</Text>
          </View>
          <Text style={styles.successTitle}>
            {isChauffeur ? 'Chauffeur Duty Completed!' : 'You Have Arrived!'}
          </Text>
          <Text style={styles.successSub}>
            {isChauffeur
              ? 'Your personal vehicle keys and fuel receipt have been returned.'
              : 'Hope you enjoyed your journey with RideDriveAhead'}
          </Text>
        </View>

        {/* Fare Summary Card */}
        <View style={styles.fareCard}>
          <Text style={styles.cardHeader}>
            {isChauffeur ? 'Itemized Duty Receipt' : 'Itemized Fare Receipt'}
          </Text>

          {isChauffeur ? (
            <View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Base Package ({activeBooking?.dutyHoursIncluded || 4} Hours)
                </Text>
                <Text style={styles.receiptVal}>₹{fare}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Overtime Hours (₹99/hr)</Text>
                <Text style={styles.receiptVal}>₹0</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Personal Vehicle Handover</Text>
                <Text style={[styles.receiptVal, { color: '#047857' }]}>Verified OK</Text>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Base & Distance Fare</Text>
                <Text style={styles.receiptVal}>₹{Math.round(fare * 0.88)}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Taxes & Tolls</Text>
                <Text style={styles.receiptVal}>₹{Math.round(fare * 0.12)}</Text>
              </View>
            </View>
          )}

          {tip > 0 && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Chauffeur Tip</Text>
              <Text style={[styles.receiptVal, { color: '#059669' }]}>₹{tip}</Text>
            </View>
          )}

          <View style={styles.receiptDivider} />

          <View style={styles.receiptTotalRow}>
            <Text style={styles.receiptTotalLabel}>Total Paid</Text>
            <Text style={styles.receiptTotalVal}>₹{fare + tip}</Text>
          </View>
          <Text style={styles.paidViaBadge}>Paid via UPI AutoPay • Receipt #RCP-20260911</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate your Chauffeur, {activeBooking?.driverName || 'Rajesh'}</Text>
          <Text style={styles.ratingSub}>Your feedback maintains our premium chauffeur standards.</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.starIcon, rating >= star ? styles.starActive : styles.starInactive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tip Chips */}
          <Text style={styles.tipHeader}>Add a Tip for Professional Service:</Text>
          <View style={styles.tipRow}>
            {[0, 30, 50, 100, 200].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.tipChip, tip === amt && styles.tipChipActive]}
                onPress={() => setTip(amt)}
              >
                <Text style={[styles.tipChipText, tip === amt && styles.tipChipTextActive]}>
                  {amt === 0 ? 'No Tip' : `₹${amt}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.feedbackInput}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share comments (e.g. smooth driving, polite chauffeur)..."
            placeholderTextColor="#64748B"
          />

          <TouchableOpacity
            style={[styles.submitRatingBtn, submitted && { backgroundColor: '#059669' }]}
            onPress={handleSubmitRating}
            disabled={submitted}
          >
            <Text style={styles.submitRatingText}>
              {submitted ? '✓ Rating Submitted! Redirecting...' : 'Submit Feedback'}
            </Text>
          </TouchableOpacity>
        </View>

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
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  successBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 12
  },
  successBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  successBadgeText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '800'
  },
  successTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4
  },
  successSub: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center'
  },
  fareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  cardHeader: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  receiptLabel: {
    color: '#64748B',
    fontSize: 12
  },
  receiptVal: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  receiptTotalLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800'
  },
  receiptTotalVal: {
    color: '#047857',
    fontSize: 20,
    fontWeight: '900'
  },
  paidViaBadge: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '700'
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  ratingTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800'
  },
  ratingSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16
  },
  starIcon: {
    fontSize: 32
  },
  starActive: {
    color: '#D97706'
  },
  starInactive: {
    color: '#CBD5E1'
  },
  tipHeader: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8
  },
  tipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center'
  },
  tipChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  tipChipText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700'
  },
  tipChipTextActive: {
    color: '#FFFFFF'
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 12
  },
  submitRatingBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  submitRatingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
