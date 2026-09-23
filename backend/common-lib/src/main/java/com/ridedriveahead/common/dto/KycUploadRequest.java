package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.KycDocType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycUploadRequest {
    @NotNull(message = "Document type is required")
    private KycDocType documentType;

    @NotBlank(message = "Document number is required")
    private String documentNumber;

    @NotBlank(message = "Base64 file payload is required")
    private String fileBase64;
}
