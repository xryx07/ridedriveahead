package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareEstimateResponse {
    private Double distanceKm;
    private Integer estimatedDurationMin;
    private BookingType bookingType;
    private Instant scheduledPickupTime;
    private List<VehicleTierEstimate> tiers;
}
