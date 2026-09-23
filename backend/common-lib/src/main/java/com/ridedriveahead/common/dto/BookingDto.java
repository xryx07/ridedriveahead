package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private UUID id;
    private UUID riderId;
    private UUID driverId;
    private BookingType bookingType;
    private BookingStatus status;
    private Instant scheduledPickupTime;
    private String pickupAddress;
    private String dropAddress;
    private Double pickupLat;
    private Double pickupLng;
    private Double dropLat;
    private Double dropLng;
    private VehicleType vehicleType;
    private BigDecimal fareAmount;
    private String otpCode;

    // Driver details when assigned
    private String driverName;
    private String driverPhone;
    private Double driverRating;
    private String vehicleModel;
    private String vehiclePlate;

    private String flightNumber;
    private String riderNotes;
    private String cancellationReason;

    // Chauffeur / Drive My Car fields
    private String serviceMode;
    private String chauffeurPackage;
    private String carTransmission;
    private String customerCarModel;
    private Integer dutyHoursIncluded;
    private BigDecimal overtimeRatePerHour;

    private Instant createdAt;
    private Instant updatedAt;
}
