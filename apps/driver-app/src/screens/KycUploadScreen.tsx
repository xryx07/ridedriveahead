import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { KycDocType } from '../types';
import { useDriverStore } from '../store/useDriverStore';

export const KycUploadScreen: React.FC = () => {
  const { kycDocs, addKycDoc, navigate } = useDriverStore();
  const [uploadingType, setUploadingType] = useState<KycDocType | null>(null);

  const docDefinitions: Array<{ type: KycDocType; title: string; hint: string }> = [
    { type: 'AADHAAR', title: 'Aadhaar Card (Front & Back)', hint: 'UIDAI 12-digit identity proof' },
    { type: 'PAN', title: 'PAN Card', hint: 'Permanent Account Number for TDS compliance' },
    { type: 'DRIVING_LICENSE', title: 'Commercial Driving License', hint: 'Valid LMV-Commercial / Transport badge' },
    { type: 'VEHICLE_REGISTRATION', title: 'Vehicle RC & Fitness Certificate', hint: 'Original registration document' }
  ];

  const handleSimulateUpload = (type: KycDocType, title: string) => {
    setUploadingType(type);
    setTimeout(() => {
      addKycDoc({
        type,
        title,
        maskedNumber: type === 'AADHAAR' ? 'XXXX-XXXX-3019' : type === 'PAN' ? 'ABCDE****F' : 'DL-04********921',
        status: 'APPROVED',
        uploadedAt: new Date().toISOString().split('T')[0]
      });
      setUploadingType(null);
    }, 1200);
  };

  const allApproved = docDefinitions.every((def) => {
    const existing = kycDocs.find((d) => d.type === def.type);
    return existing && existing.status === 'APPROVED';
  });

  return (
    <View style={styles.container}>
      <DriverHeader title="KYC Verification Vault" showBack backTo="HOME" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Assurance Banner */}
        <View style={styles.securityNotice}>
          <View style={styles.securityIconBadge}>
            <Text style={styles.securityIconText}>VAULT</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.securityTitle}>Bank-Grade AES-256 Document Vault</Text>
            <Text style={styles.securitySub}>
              All uploaded identity credentials are encrypted at rest with AES-256-GCM and stored in a decoupled
              vault. Raw government IDs are never stored in plain text.
            </Text>
          </View>
        </View>

        {/* Overall Status Banner */}
        <View style={[styles.overallStatusCard, allApproved ? styles.statusApproved : styles.statusPending]}>
          <View>
            <Text style={styles.overallLabel}>OVERALL VERIFICATION STATUS</Text>
            <Text style={[styles.overallValue, allApproved ? styles.overallValueApproved : styles.overallValuePending]}>
              {allApproved ? 'VERIFIED & ELIGIBLE TO DRIVE' : 'PENDING DOCUMENT REVIEW'}
            </Text>
          </View>
        </View>

        {/* Document Cards */}
        <Text style={styles.sectionHeader}>Required Government Credentials</Text>
        <View style={styles.docsList}>
          {docDefinitions.map((item) => {
            const currentDoc = kycDocs.find((d) => d.type === item.type);
            const isApproved = currentDoc?.status === 'APPROVED';
            const isPending = currentDoc?.status === 'PENDING';
            const isUploading = uploadingType === item.type;

            return (
              <View key={item.type} style={styles.docCard}>
                <View style={styles.docTopRow}>
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text style={styles.docTitle}>{item.title}</Text>
                    <Text style={styles.docHint}>{item.hint}</Text>
                    {currentDoc?.maskedNumber && (
                      <Text style={styles.maskedNumber}>Masked ID: {currentDoc.maskedNumber}</Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isApproved ? styles.pillApproved : isPending ? styles.pillPending : styles.pillMissing
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isApproved ? { color: '#059669' } : isPending ? { color: '#B45309' } : { color: '#64748B' }
                      ]}
                    >
                      {isApproved ? 'VERIFIED' : isPending ? 'IN REVIEW' : 'REQUIRED'}
                    </Text>
                  </View>
                </View>

                {/* Upload or Update Action */}
                <TouchableOpacity
                  style={[styles.uploadButton, isApproved && styles.uploadButtonDone]}
                  onPress={() => handleSimulateUpload(item.type, item.title)}
                  disabled={isUploading}
                >
                  <Text style={[styles.uploadButtonText, isApproved && styles.uploadButtonDoneText]}>
                    {isUploading
                      ? 'Encrypting into AES-256 Vault...'
                      : isApproved
                      ? 'Document Verified (Tap to Re-upload)'
                      : 'Upload & Encrypt Document'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {allApproved && (
          <TouchableOpacity style={styles.startDrivingBtn} onPress={() => navigate('HOME')}>
            <Text style={styles.startDrivingBtnText}>Go to Driver Home & Accept Rides →</Text>
          </TouchableOpacity>
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
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  securityNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16
  },
  securityIconBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6
  },
  securityIconText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '800'
  },
  securityTitle: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '800'
  },
  securitySub: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15
  },
  overallStatusCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20
  },
  statusApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  overallLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  overallValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2
  },
  overallValueApproved: {
    color: '#059669'
  },
  overallValuePending: {
    color: '#B45309'
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  docsList: {
    gap: 12,
    marginBottom: 20
  },
  docCard: {
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
  docTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  docTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700'
  },
  docHint: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2
  },
  maskedNumber: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9'
  },
  pillApproved: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  pillPending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  pillMissing: {
    backgroundColor: '#F1F5F9'
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800'
  },
  uploadButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  uploadButtonDone: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  uploadButtonDoneText: {
    color: '#059669'
  },
  startDrivingBtn: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center'
  },
  startDrivingBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
