package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.PaymentMethod;
import com.ridedriveahead.common.model.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Drop address is required")
    private String dropAddress;

    private Double pickupLat;
    private Double pickupLng;
    private Double dropLat;
    private Double dropLng;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Booking type is required")
    private BookingType bookingType;

    private Instant scheduledPickupTime;

    private String flightNumber;
    private String riderNotes;

    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.UPI;

    @NotNull(message = "Estimated fare is required")
    private BigDecimal estimatedFare;

    // Chauffeur fields
    private String serviceMode;
    private String chauffeurPackage;
    private String carTransmission;
    private String customerCarModel;
    private Integer dutyHoursIncluded;
    private BigDecimal overtimeRatePerHour;
}
