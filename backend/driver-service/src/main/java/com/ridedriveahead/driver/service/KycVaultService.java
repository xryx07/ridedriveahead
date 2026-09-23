package com.ridedriveahead.driver.service;

import com.ridedriveahead.common.dto.KycDocumentDto;
import com.ridedriveahead.common.dto.KycUploadRequest;
import com.ridedriveahead.common.exception.ResourceNotFoundException;
import com.ridedriveahead.common.model.enums.KycDocType;
import com.ridedriveahead.common.model.enums.KycStatus;
import com.ridedriveahead.common.security.AesVaultEncryptionService;
import com.ridedriveahead.common.security.PiiMaskingUtils;
import com.ridedriveahead.driver.model.Driver;
import com.ridedriveahead.driver.model.KycAuditLog;
import com.ridedriveahead.driver.model.KycDocument;
import com.ridedriveahead.driver.repository.DriverRepository;
import com.ridedriveahead.driver.repository.KycAuditLogRepository;
import com.ridedriveahead.driver.repository.KycDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycVaultService {

    private final KycDocumentRepository kycDocumentRepository;
    private final KycAuditLogRepository kycAuditLogRepository;
    private final DriverRepository driverRepository;
    private final AesVaultEncryptionService encryptionService;

    @Transactional
    public KycDocumentDto uploadAndVaultDocument(UUID driverId, KycUploadRequest request, String ipAddress) {
        String masked = maskNumber(request.getDocumentType(), request.getDocumentNumber());
        String encryptedPayload = encryptionService.encrypt(request.getFileBase64());
        String vaultDocumentId = "VAULT-" + request.getDocumentType() + "-" + UUID.randomUUID();

        // Check if an existing doc for this type exists, overwrite or create new
        KycDocument doc = kycDocumentRepository.findByDriverIdAndDocumentType(driverId, request.getDocumentType())
                .orElse(KycDocument.builder()
                        .driverId(driverId)
                        .documentType(request.getDocumentType())
                        .build());

        doc.setMaskedNumber(masked);
        doc.setVaultDocumentId(vaultDocumentId);
        doc.setEncryptedPayload(encryptedPayload);
        doc.setStatus(KycStatus.PENDING);
        doc.setRejectionReason(null);

        KycDocument saved = kycDocumentRepository.save(doc);

        // Record audit entry
        KycAuditLog audit = KycAuditLog.builder()
                .kycDocumentId(saved.getId())
                .actorId(driverId)
                .action("UPLOAD_ENCRYPTED")
                .ipAddress(ipAddress)
                .build();
        kycAuditLogRepository.save(audit);

        // Update driver's overall KYC status
        driverRepository.findById(driverId).ifPresent(driver -> {
            driver.setKycStatus(KycStatus.PENDING);
            driverRepository.save(driver);
        });

        log.info("[KYC VAULT] Driver [{}] securely vaulted [{}] with masked number [{}] into vault doc [{}]",
                driverId, request.getDocumentType(), masked, vaultDocumentId);

        return mapToDto(saved);
    }

    /**
     * Decrypts KYC document for authorized compliance officers with tamper-evident audit logging.
     */
    @Transactional
    public String retrieveDecryptedDocument(UUID documentId, UUID complianceOfficerId, String ipAddress) {
        KycDocument doc = kycDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));

        // Audit view
        KycAuditLog audit = KycAuditLog.builder()
                .kycDocumentId(documentId)
                .actorId(complianceOfficerId)
                .action("VIEW_DECRYPTED")
                .ipAddress(ipAddress)
                .build();
        kycAuditLogRepository.save(audit);

        log.warn("[COMPLIANCE AUDIT] Compliance Officer [{}] accessed decrypted KYC doc [{}] from IP [{}]",
                complianceOfficerId, documentId, ipAddress);

        return encryptionService.decrypt(doc.getEncryptedPayload());
    }

    public List<KycDocumentDto> getDriverDocuments(UUID driverId) {
        return kycDocumentRepository.findByDriverId(driverId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String maskNumber(KycDocType type, String rawNumber) {
        return switch (type) {
            case AADHAAR -> PiiMaskingUtils.maskAadhaar(rawNumber);
            case PAN -> PiiMaskingUtils.maskPan(rawNumber);
            case DRIVING_LICENSE -> PiiMaskingUtils.maskLicense(rawNumber);
            case VEHICLE_REGISTRATION -> rawNumber.length() > 4
                    ? rawNumber.substring(0, 2) + " ** ** " + rawNumber.substring(rawNumber.length() - 4)
                    : "RC-******";
        };
    }

    public KycDocumentDto mapToDto(KycDocument doc) {
        return KycDocumentDto.builder()
                .id(doc.getId())
                .documentType(doc.getDocumentType())
                .maskedNumber(doc.getMaskedNumber())
                .vaultDocumentId(doc.getVaultDocumentId())
                .status(doc.getStatus())
                .rejectionReason(doc.getRejectionReason())
                .uploadedAt(doc.getUploadedAt())
                .verifiedAt(doc.getVerifiedAt())
                .build();
    }
}
