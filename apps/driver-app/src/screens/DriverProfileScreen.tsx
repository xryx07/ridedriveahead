import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { useDriverStore } from '../store/useDriverStore';

export const DriverProfileScreen: React.FC = () => {
  const { driver, navigate, logout } = useDriverStore();

  const maxHours = 8.0;
  const drivenHours = driver.drivingHoursToday;
  const remainingHours = Math.max(0, maxHours - drivenHours);
  const progressPercent = Math.min(100, Math.round((drivenHours / maxHours) * 100));

  return (
    <View style={styles.container}>
      <DriverHeader title="Driver Profile & Skills" showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{driver.fullName ? driver.fullName.charAt(0) : 'R'}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.driverName}>{driver.fullName}</Text>
            <Text style={styles.driverPhone}>{driver.phoneNumber}</Text>
            <View style={styles.tagRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {driver.rating} Rating</Text>
              </View>
              <View style={styles.tripsBadge}>
                <Text style={styles.tripsText}>{driver.totalTrips} Total Duties</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Certified Driving Skills & Qualifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Verified Driving Qualifications</Text>
          <Text style={styles.sectionSub}>These qualifications allow you to accept high-paying chauffeur gigs</Text>

          <View style={styles.skillItem}>
            <Text style={styles.checkGreen}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.skillTitle}>Commercial Driving License (LMV)</Text>
              <Text style={styles.skillSub}>DL-04********921 • Valid till 2031</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.checkGreen}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.skillTitle}>Automatic (AT / DCT / CVT) Certified</Text>
              <Text style={styles.skillSub}>Qualified for luxury and modern automatics</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>CERTIFIED</Text>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.checkGreen}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.skillTitle}>Manual (MT) Stick Shift Expert</Text>
              <Text style={styles.skillSub}>Smooth clutch and hill-hold qualified</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>EXPERT</Text>
            </View>
          </View>

          <View style={styles.skillItem}>
            <Text style={styles.checkGreen}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.skillTitle}>Police Background Verification</Text>
              <Text style={styles.skillSub}>Clear Record • Delhi Police Cert #8921</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>CLEARED</Text>
            </View>
          </View>
        </View>

        {/* Fatigue & Driving Hours Tracker */}
        <View style={styles.fatigueCard}>
          <View style={styles.fatigueHeader}>
            <Text style={styles.fatigueTitle}>Fatigue & Safety Monitor</Text>
            <Text style={styles.fatigueLimit}>Max: 8.0 hrs/day</Text>
          </View>

          <Text style={styles.fatigueSub}>
            Driving hours are monitored to prevent fatigue during multi-hour and 1-2 day gigs.
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.progressStats}>
            <Text style={styles.drivenStat}>{drivenHours}h Driven Today</Text>
            <Text style={styles.remainingStat}>{remainingHours.toFixed(1)}h Allowed Remaining</Text>
          </View>
        </View>

        {/* KYC Document Vault Shortcut */}
        <TouchableOpacity
          style={styles.kycShortcut}
          onPress={() => navigate('KYC_UPLOAD')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.kycTitle}>AES-256 KYC Document Vault</Text>
            <Text style={styles.kycSub}>Aadhaar, PAN, DL & Police Certificate encrypted at rest</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>

        {/* Account Management & Sign Out */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Partner Account & Session</Text>
          <Text style={styles.sectionSub}>Sign out of this device or switch driver account</Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Sign Out / Switch Account</Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  driverName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800'
  },
  driverPhone: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 1
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6
  },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  ratingText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700'
  },
  tripsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  tripsText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  sectionHeader: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  sectionSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  checkGreen: {
    color: '#047857',
    fontSize: 14,
    fontWeight: '900'
  },
  skillTitle: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  skillSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  verifiedBadgeText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '800'
  },
  fatigueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  fatigueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fatigueTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  fatigueLimit: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800'
  },
  fatigueSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 4
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  drivenStat: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '700'
  },
  remainingStat: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700'
  },
  kycShortcut: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  kycTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  kycSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2
  },
  chevron: {
    color: '#94A3B8',
    fontSize: 16
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800'
  }
});
