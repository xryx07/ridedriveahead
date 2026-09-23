package com.ridedriveahead.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverEarningsResponse {
    private BigDecimal todayEarnings;
    private BigDecimal weeklyEarnings;
    private BigDecimal monthlyEarnings;
    private Integer todayCompletedTrips;
    private Integer scheduledTripsCompleted;
    private BigDecimal incentivesEarned;
    private BigDecimal pendingPayoutAmount;
}
