package com.ridedriveahead.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FatigueStatusResponse {
    private Double drivingHoursToday;
    @Builder.Default
    private Double maxDailyDrivingHours = 8.0;
    private Double remainingHoursAllowed;
    private Boolean isRestBreakRecommended;
    private String fatigueStatusMessage;
    private Instant lastRestTime;
}
