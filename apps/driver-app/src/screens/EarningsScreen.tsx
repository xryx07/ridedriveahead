import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { useDriverStore } from '../store/useDriverStore';

export const EarningsScreen: React.FC = () => {
  const { earnings } = useDriverStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [payoutRequested, setPayoutRequested] = useState(false);

  const displayAmount =
    selectedPeriod === 'TODAY'
      ? earnings.todayEarnings
      : selectedPeriod === 'WEEK'
      ? earnings.weeklyEarnings
      : earnings.monthlyEarnings;

  const handleInstantPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert(
        'Instant payout of ₹' +
          earnings.pendingPayoutAmount +
          ' transferred to your registered HDFC bank account via IMPS.'
      );
    }, 500);
  };

  return (
    <View style={styles.container}>
      <DriverHeader title="Earnings & Payouts" showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector Tabs */}
        <View style={styles.periodRow}>
          {[
            { key: 'TODAY', label: 'Today' },
            { key: 'WEEK', label: 'This Week' },
            { key: 'MONTH', label: 'This Month' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.periodPill, selectedPeriod === tab.key && styles.periodPillActive]}
              onPress={() => setSelectedPeriod(tab.key as any)}
            >
              <Text style={[styles.periodText, selectedPeriod === tab.key && styles.periodTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hero Earnings Card */}
        <View style={styles.earningsHero}>
          <Text style={styles.earningsLabel}>TOTAL NET EARNINGS</Text>
          <Text style={styles.earningsValue}>₹{displayAmount.toLocaleString('en-IN')}</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              ✓ {earnings.todayCompletedTrips} Duties Completed (Hourly Chauffeur + Airport Cabs)
            </Text>
          </View>
        </View>

        {/* Instant Payout Card */}
        <View style={styles.payoutCard}>
          <View style={styles.payoutTop}>
            <View>
              <Text style={styles.payoutLabel}>AVAILABLE FOR INSTANT CASHOUT</Text>
              <Text style={styles.payoutAmount}>₹{earnings.pendingPayoutAmount}</Text>
            </View>
            <TouchableOpacity
              style={[styles.payoutBtn, payoutRequested && { opacity: 0.6 }]}
              onPress={handleInstantPayout}
              disabled={payoutRequested}
            >
              <Text style={styles.payoutBtnText}>
                {payoutRequested ? 'Processing...' : 'Transfer to Bank →'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bankNote}>Linked Bank Account (IMPS 24x7 Zero Fee)</Text>
        </View>

        {/* Gig Breakdown details */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownHeader}>Duties & Gigs Completed Today</Text>

          {earnings.todayCompletedTrips === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>No Settled Duties Today</Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Earnings from completed trips will be itemized here in real-time.
              </Text>
            </View>
          ) : (
            <View style={styles.breakdownRow}>
              <View>
                <Text style={styles.breakdownLabel}>Completed Duty Settlement</Text>
                <Text style={styles.breakdownSub}>Verified Payment</Text>
              </View>
              <Text style={styles.breakdownVal}>₹{earnings.todayEarnings}</Text>
            </View>
          )}
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
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  periodPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  periodPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  periodText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  periodTextActive: {
    color: '#FFFFFF'
  },
  earningsHero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    marginBottom: 14
  },
  earningsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5
  },
  earningsValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'monospace',
    marginVertical: 4
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4
  },
  completedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857'
  },
  payoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  payoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  payoutLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#047857',
    marginTop: 2
  },
  payoutBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8
  },
  payoutBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  bankNote: {
    fontSize: 10,
    color: '#64748B'
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  breakdownHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  breakdownSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  }
});
