package com.ridedriveahead.booking.model;

import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "rider_id", nullable = false)
    private UUID riderId;

    @Column(name = "driver_id")
    private UUID driverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type", nullable = false, length = 20)
    @Builder.Default
    private BookingType bookingType = BookingType.INSTANT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private BookingStatus status = BookingStatus.DRAFT;

    @Column(name = "scheduled_pickup_time")
    private Instant scheduledPickupTime;

    @Column(name = "pickup_address", nullable = false, columnDefinition = "TEXT")
    private String pickupAddress;

    @Column(name = "drop_address", nullable = false, columnDefinition = "TEXT")
    private String dropAddress;

    @Column(name = "pickup_lat")
    private Double pickupLat;

    @Column(name = "pickup_lng")
    private Double pickupLng;

    @Column(name = "drop_lat")
    private Double dropLat;

    @Column(name = "drop_lng")
    private Double dropLng;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleType vehicleType;

    @Column(name = "fare_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAmount;

    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    // Snapshot of driver info for quick lookup
    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_phone")
    private String driverPhone;

    @Column(name = "driver_rating")
    private Double driverRating;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Column(name = "vehicle_plate")
    private String vehiclePlate;

    @Column(name = "flight_number", length = 30)
    private String flightNumber;

    @Column(name = "rider_notes", columnDefinition = "TEXT")
    private String riderNotes;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "service_mode", length = 30)
    private String serviceMode;

    @Column(name = "chauffeur_package", length = 50)
    private String chauffeurPackage;

    @Column(name = "car_transmission", length = 30)
    private String carTransmission;

    @Column(name = "customer_car_model", length = 100)
    private String customerCarModel;

    @Column(name = "duty_hours_included")
    private Integer dutyHoursIncluded;

    @Column(name = "overtime_rate_per_hour", precision = 10, scale = 2)
    private BigDecimal overtimeRatePerHour;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
