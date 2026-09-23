package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.KycStatus;
import com.ridedriveahead.common.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private UUID id;
    private String phoneNumber;
    private String fullName;
    private String email;
    private UserRole role;
    private Double rating;
    private KycStatus kycStatus;
    private Boolean isActive;
}
