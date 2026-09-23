import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDriverStore } from '../store/useDriverStore';
import { DriverProfile, TransmissionSkill } from '../types';

export const DriverLoginScreen: React.FC = () => {
  const { login, signup } = useDriverStore();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Sign in state
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otpCode, setOtpCode] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Partner Onboarding / Sign up state
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR / Gurugram');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<TransmissionSkill[]>(['AUTOMATIC', 'MANUAL']);
  const [chauffeurOrCab, setChauffeurOrCab] = useState<'CHAUFFEUR_ONLY' | 'CAB_DRIVER' | 'ALL_ROUNDER'>('ALL_ROUNDER');

  const toggleSkill = (skill: TransmissionSkill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.replace('+91', '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInfoMessage('Mock OTP dispatched: 123456 (valid for 5 mins)');
      setStep('OTP');
    }, 400);
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== '123456' && otpCode.length < 4) {
      alert('Please enter valid 6-digit OTP code (Demo: 123456)');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const partnerProfile: DriverProfile = {
        id: 'd-101',
        userId: 'u-driver-001',
        fullName: 'Rajesh Kumar',
        phoneNumber: phoneNumber,
        role: 'ALL_ROUNDER',
        transmissionSkills: ['MANUAL', 'AUTOMATIC', 'LUXURY'],
        vehicleModel: 'Honda City / Maruti Dzire Tour',
        vehiclePlate: 'DL 01 AB 9988',
        vehicleType: 'SEDAN',
        isOnline: true,
        rating: 4.96,
        totalTrips: 582,
        kycStatus: 'APPROVED',
        drivingHoursToday: 3.5
      };
      login(partnerProfile);
    }, 400);
  };

  const handleOnboardPartner = async () => {
    if (!fullName.trim()) {
      alert('Please enter your full legal name as per Driving License');
      return;
    }
    if (!signupPhone.trim() || signupPhone.replace('+91', '').length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }
    if (!licenseNumber.trim()) {
      alert('Please enter your Commercial Driving License (LMV) number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const fullPhone = signupPhone.startsWith('+91') ? signupPhone : '+91' + signupPhone.trim();
      const newDriver: DriverProfile = {
        id: 'd-' + Math.floor(1000 + Math.random() * 9000),
        userId: 'u-' + Math.floor(1000 + Math.random() * 9000),
        fullName: fullName.trim(),
        phoneNumber: fullPhone,
        role: chauffeurOrCab,
        transmissionSkills: selectedSkills,
        vehicleModel: chauffeurOrCab === 'CHAUFFEUR_ONLY' ? 'Drive Customer Cars' : 'Commercial Sedan',
        vehiclePlate: chauffeurOrCab === 'CHAUFFEUR_ONLY' ? 'N/A' : 'DL 04 CZ 8890',
        vehicleType: 'SEDAN',
        isOnline: true,
        rating: 5.0,
        totalTrips: 0,
        kycStatus: 'PENDING',
        drivingHoursToday: 0.0
      };
      signup(newDriver);
    }, 400);
  };

  const autofillDemoDriver = () => {
    setPhoneNumber('+919876543210');
    setOtpCode('123456');
    setFullName('Suresh Rawat');
    setSignupPhone('+919871234567');
    setCity('Gurugram / Delhi NCR');
    setLicenseNumber('DL-0420210088992');
    setSelectedSkills(['AUTOMATIC', 'MANUAL', 'LUXURY']);
    setChauffeurOrCab('CHAUFFEUR_ONLY');
  };

  return (
    <ScrollView style={styles.scrollArea} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Branding Box */}
      <View style={styles.brandingBox}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>DRIVER PARTNER</Text>
        </View>
        <Text style={styles.appTitle}>RideDriveAhead Partner</Text>
        <Text style={styles.tagline}>
          Earn by Driving Customer Cars (Chauffeur Gigs) or Operating Scheduled Cabs
        </Text>
      </View>

      {/* Mode Tabs */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'LOGIN' && styles.modeTabActive]}
          onPress={() => {
            setAuthMode('LOGIN');
            setStep('PHONE');
            setInfoMessage('');
          }}
        >
          <Text style={[styles.modeTabText, authMode === 'LOGIN' && styles.modeTabTextActive]}>Partner Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'SIGNUP' && styles.modeTabActive]}
          onPress={() => {
            setAuthMode('SIGNUP');
            setInfoMessage('');
          }}
        >
          <Text style={[styles.modeTabText, authMode === 'SIGNUP' && styles.modeTabTextActive]}>Join as Driver</Text>
        </TouchableOpacity>
      </View>

      {/* SIGN IN VIEW */}
      {authMode === 'LOGIN' ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {step === 'PHONE' ? 'Sign in to Driver Dashboard' : 'Verify One-Time Password'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {step === 'PHONE'
              ? 'Enter your registered mobile number to manage your duties & earnings'
              : `Enter the 6-digit code dispatched to ${phoneNumber}`}
          </Text>

          {step === 'PHONE' ? (
            <>
              <Text style={styles.inputLabel}>Registered Mobile Number</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.textInput}
                  value={phoneNumber.replace('+91', '')}
                  onChangeText={(val) => setPhoneNumber('+91' + val.trim())}
                  placeholder="9876543210"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleRequestOtp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Dispatching OTP...' : 'Continue with OTP ➔'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.demoFillBtn} onPress={autofillDemoDriver}>
                <Text style={styles.demoFillText}>Fill Demo Driver Credentials</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.otpRow}>
                <TextInput
                  style={styles.otpInput}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="123456"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Access Driver Dashboard ➔'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.textButton} onPress={() => setStep('PHONE')}>
                <Text style={styles.textButtonText}>Change Mobile Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        /* PARTNER ONBOARDING (SIGN UP) VIEW */
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register as Driver Partner</Text>
          <Text style={styles.cardSubtitle}>
            No car required for Chauffeur mode. Earn ₹1,200 - ₹3,000 daily driving customer vehicles.
          </Text>

          <Text style={styles.inputLabel}>Full Legal Name (as per DL)</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Suresh Rawat"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.inputLabel}>Mobile Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.textInput}
              value={signupPhone.replace('+91', '')}
              onChangeText={(val) => setSignupPhone('+91' + val.trim())}
              placeholder="9871234567"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.inputLabel}>Commercial DL Number (LMV)</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              placeholder="e.g. DL-0420210088992"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />
          </View>

          <Text style={styles.inputLabel}>City / Base Hub</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Delhi NCR / Gurugram"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Driving Skills Selector */}
          <Text style={styles.inputLabel}>Verified Transmission Skills</Text>
          <View style={styles.skillSelectorRow}>
            {(['MANUAL', 'AUTOMATIC', 'LUXURY'] as TransmissionSkill[]).map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  style={[styles.skillChip, active && styles.skillChipActive]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={[styles.skillChipText, active && styles.skillChipTextActive]}>
                    {active ? '✓ ' : ''}{skill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Service Preference */}
          <Text style={styles.inputLabel}>Primary Gig Preference</Text>
          <View style={styles.prefGrid}>
            <TouchableOpacity
              style={[styles.prefCard, chauffeurOrCab === 'CHAUFFEUR_ONLY' && styles.prefCardActive]}
              onPress={() => setChauffeurOrCab('CHAUFFEUR_ONLY')}
            >
              <Text style={styles.prefTitle}>Drive Customer Cars</Text>
              <Text style={styles.prefSub}>Hourly / Events / Road Trips (Zero vehicle cost)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.prefCard, chauffeurOrCab === 'ALL_ROUNDER' && styles.prefCardActive]}
              onPress={() => setChauffeurOrCab('ALL_ROUNDER')}
            >
              <Text style={styles.prefTitle}>Both (Chauffeur + Cab)</Text>
              <Text style={styles.prefSub}>Maximum earning potential across all duties</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleOnboardPartner} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Complete Partner Onboarding ➔'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoFillBtn} onPress={autofillDemoDriver}>
            <Text style={styles.demoFillText}>Quick Fill Sample Driver Data</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Security & KYC Disclaimer */}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Aadhaar & Police Verification encrypted via AES-256 Vault • Instant Daily IMPS Payouts
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  container: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  brandingBox: {
    alignItems: 'center',
    marginBottom: 20
  },
  logoBadge: {
    backgroundColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5
  },
  appTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  tagline: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B'
  },
  modeTabTextActive: {
    color: '#047857',
    fontWeight: '800'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800'
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14
  },
  simpleInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14
  },
  simpleInput: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 12
  },
  countryCode: {
    color: '#0F172A',
    fontWeight: '800',
    marginRight: 8,
    fontSize: 14
  },
  textInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 12
  },
  otpRow: {
    marginBottom: 16
  },
  otpInput: {
    backgroundColor: '#F8FAFC',
    color: '#047857',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#047857'
  },
  infoText: {
    color: '#059669',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 14
  },
  skillSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  skillChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center'
  },
  skillChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  skillChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  skillChipTextActive: {
    color: '#047857',
    fontWeight: '800'
  },
  prefGrid: {
    gap: 8,
    marginBottom: 16
  },
  prefCard: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10
  },
  prefCardActive: {
    borderColor: '#047857',
    backgroundColor: '#ECFDF5'
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  prefSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  primaryButton: {
    backgroundColor: '#047857',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  demoFillBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC'
  },
  demoFillText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700'
  },
  textButton: {
    marginTop: 14,
    alignItems: 'center'
  },
  textButtonText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700'
  },
  footerNote: {
    marginTop: 24,
    alignItems: 'center'
  },
  footerText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center'
  }
});
