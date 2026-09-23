package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycStatusResponse {
    private KycStatus overallStatus;
    private boolean eligibleToDrive;
    private List<KycDocumentDto> documents;
}
