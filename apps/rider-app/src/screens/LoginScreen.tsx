import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { riderApi } from '../api/apiClient';
import { useRiderStore } from '../store/useRiderStore';

export const LoginScreen: React.FC = () => {
  const { login, signup } = useRiderStore();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otpCode, setOtpCode] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCity, setSignupCity] = useState('Gurugram / Delhi NCR');
  const [referralCode, setReferralCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.replace('+91', '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await riderApi.requestOtp(phoneNumber);
      setInfoMessage(res.message);
      setStep('OTP');
    } catch (e: any) {
      alert(e.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await riderApi.verifyOtp(phoneNumber, otpCode);
      login(res.user);
    } catch (e: any) {
      alert(e.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!signupName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!signupPhone.trim() || signupPhone.replace('+91', '').length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = signupPhone.startsWith('+91') ? signupPhone : '+91' + signupPhone.trim();
      const newUser = {
        id: 'u-' + Math.floor(1000 + Math.random() * 9000),
        phoneNumber: fullPhone,
        fullName: signupName.trim(),
        email: signupEmail.trim() || undefined,
        rating: 5.0,
        role: 'RIDER' as const
      };
      signup(newUser);
    } catch (e: any) {
      alert(e.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setPhoneNumber('+919876543210');
    setOtpCode('123456');
    setSignupName('Priya Sharma');
    setSignupPhone('+919811122233');
    setSignupEmail('priya.sharma@example.com');
    setSignupCity('Gurugram / Delhi NCR');
  };

  return (
    <ScrollView style={styles.scrollArea} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.brandingBox}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>RDA</Text>
        </View>
        <Text style={styles.appTitle}>RideDriveAhead</Text>
        <Text style={styles.tagline}>Chauffeur On-Demand for Your Car & Guaranteed Cabs</Text>
      </View>

      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'LOGIN' && styles.modeTabActive]}
          onPress={() => {
            setAuthMode('LOGIN');
            setStep('PHONE');
            setInfoMessage('');
          }}
        >
          <Text style={[styles.modeTabText, authMode === 'LOGIN' && styles.modeTabTextActive]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'SIGNUP' && styles.modeTabActive]}
          onPress={() => {
            setAuthMode('SIGNUP');
            setInfoMessage('');
          }}
        >
          <Text style={[styles.modeTabText, authMode === 'SIGNUP' && styles.modeTabTextActive]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {authMode === 'LOGIN' ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {step === 'PHONE' ? 'Sign in with Mobile' : 'Verify One-Time Password'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {step === 'PHONE'
              ? 'Enter your 10-digit mobile number to access your account'
              : `Enter the 6-digit code dispatched to ${phoneNumber}`}
          </Text>

          {step === 'PHONE' ? (
            <>
              <Text style={styles.inputLabel}>Mobile Phone Number</Text>
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
                <Text style={styles.buttonText}>{loading ? 'Sending OTP...' : 'Continue with OTP ➔'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.demoFillBtn} onPress={autofillDemo}>
                <Text style={styles.demoFillText}>Fill Demo Rider Credentials</Text>
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
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify & Enter Platform ➔'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.textButton} onPress={() => setStep('PHONE')}>
                <Text style={styles.textButtonText}>Change Mobile Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Rider & Car Owner Account</Text>
          <Text style={styles.cardSubtitle}>Register in 30 seconds to book verified chauffeurs & city cabs</Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={signupName}
              onChangeText={setSignupName}
              placeholder="e.g. Priya Sharma"
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
              placeholder="9811122233"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.inputLabel}>Email Address (For Tax Invoices)</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={signupEmail}
              onChangeText={setSignupEmail}
              placeholder="e.g. priya@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>City / Primary Location</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={signupCity}
              onChangeText={setSignupCity}
              placeholder="e.g. Delhi NCR / Gurugram"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.inputLabel}>Referral / Promo Code (Optional)</Text>
          <View style={styles.simpleInputBox}>
            <TextInput
              style={styles.simpleInput}
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="e.g. WELCOME100"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAccount} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Complete Registration & Sign In ➔'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoFillBtn} onPress={autofillDemo}>
            <Text style={styles.demoFillText}>Quick Fill Sample Data</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>AES-256 Vault Encryption • DPDP Compliant • Masked Calls</Text>
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
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10
  },
  logoBadgeText: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2
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
    paddingHorizontal: 10
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
    color: '#0F172A',
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
    color: '#0284C7',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0284C7'
  },
  infoText: {
    color: '#059669',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 14
  },
  primaryButton: {
    backgroundColor: '#0F172A',
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
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '700'
  },
  textButton: {
    marginTop: 14,
    alignItems: 'center'
  },
  textButtonText: {
    color: '#0284C7',
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
