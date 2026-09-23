package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleTierEstimate {
    private VehicleType vehicleType;
    private String tierName;
    private String description;
    private int capacity;
    private BigDecimal baseFare;
    private BigDecimal distanceFare;
    private BigDecimal advanceReservationFee;
    private BigDecimal totalFare;
    @Builder.Default
    private String currency = "INR";
    private int etaMinutes;
}
