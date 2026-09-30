import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { useRiderStore } from '../store/useRiderStore';

export const ProfileScreen: React.FC = () => {
  const { user, logout, setBookingDraft, navigate } = useRiderStore();

  const [savedAddresses] = useState([
    { label: 'HOME', address: 'Apartment 402, DLF Phase 5, Golf Course Road, Gurugram' },
    { label: 'OFFICE', address: 'Building 10B, Cyber City, DLF Phase 2, Gurugram' },
    { label: 'AIRPORT', address: 'Indira Gandhi International Airport, Terminal 3, New Delhi' }
  ]);

  const [registeredCars] = useState([
    { model: 'Honda City (2022)', transmission: 'Automatic (AT)', plate: 'DL 01 AB 9988', isDefault: true },
    { model: 'Hyundai Creta (2021)', transmission: 'Manual (MT)', plate: 'HR 26 CZ 4410', isDefault: false }
  ]);

  const [emergencyContact, setEmergencyContact] = useState('+91 98111 22233 (Brother)');

  const handleSelectAddress = (address: string) => {
    setBookingDraft({ drop: address });
    navigate('HOME');
  };

  return (
    <View style={styles.container}>
      <Header title="Profile & Settings" showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.fullName ? user.fullName.charAt(0) : 'A'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Arjun Verma'}</Text>
            <Text style={styles.userPhone}>{user?.phoneNumber || '+91 9876543210'}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {user?.rating || '4.95'} Rider Rating</Text>
            </View>
          </View>
        </View>

        {/* My Registered Personal Cars */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Cars for Chauffeur Services</Text>
            <Text style={styles.addCarLink}>+ Add Car</Text>
          </View>
          <Text style={styles.sectionSub}>Select personal vehicles to quickly assign certified chauffeurs</Text>

          {registeredCars.map((car, idx) => (
            <View key={idx} style={styles.carRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.carTitleRow}>
                  <Text style={styles.carModel}>{car.model}</Text>
                  {car.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.carTransmission}>{car.transmission} • {car.plate}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Saved Places */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          <Text style={styles.sectionSub}>Tap to quickly set destination on Home screen</Text>

          {savedAddresses.map((place, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.addressRow}
              onPress={() => handleSelectAddress(place.address)}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.addressLabel}>{place.label}</Text>
                <Text style={styles.addressText} numberOfLines={1}>{place.address}</Text>
              </View>
              <Text style={styles.chevron}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Trusted Emergency Contact</Text>
          <Text style={styles.sectionSub}>This contact is shared with live GPS and trip status updates</Text>

          <TextInput
            style={styles.inputField}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Emergency contact phone number"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Security & Compliance Info */}
        <View style={styles.complianceCard}>
          <Text style={styles.complianceTitle}>Data Security & DPDP Compliance</Text>
          <Text style={styles.complianceText}>
            All sensitive credentials and documents are safeguarded with bank-grade AES-256-GCM encryption.
            Phone numbers are masked during driver communications.
          </Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
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
  userCard: {
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
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800'
  },
  userPhone: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4
  },
  ratingText: {
    color: '#D97706',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  addCarLink: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800'
  },
  sectionSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10
  },
  carRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  carTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  carModel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  defaultBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  defaultBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#047857'
  },
  carTransmission: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  addressLabel: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800'
  },
  addressText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2
  },
  chevron: {
    color: '#94A3B8',
    fontSize: 14,
    marginLeft: 10
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    marginTop: 6
  },
  complianceCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14
  },
  complianceTitle: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4
  },
  complianceText: {
    color: '#334155',
    fontSize: 11,
    lineHeight: 16
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800'
  }
});
