package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.KycDocType;
import com.ridedriveahead.common.model.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentDto {
    private UUID id;
    private KycDocType documentType;
    private String maskedNumber;
    private String vaultDocumentId;
    private KycStatus status;
    private String rejectionReason;
    private Instant uploadedAt;
    private Instant verifiedAt;
}
