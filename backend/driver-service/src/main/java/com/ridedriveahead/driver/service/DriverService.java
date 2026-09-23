package com.ridedriveahead.driver.service;

import com.ridedriveahead.common.dto.*;
import com.ridedriveahead.common.exception.BadRequestException;
import com.ridedriveahead.common.exception.ResourceNotFoundException;
import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.KycStatus;
import com.ridedriveahead.common.model.enums.VehicleType;
import com.ridedriveahead.driver.model.Driver;
import com.ridedriveahead.driver.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DriverService {

    private final DriverRepository driverRepository;
    private final KycVaultService kycVaultService;

    @Value("${ridedriveahead.safety.max-daily-driving-hours:8.0}")
    private double maxDailyDrivingHours;

    public Driver getOrCreateDriver(UUID userId) {
        return driverRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Driver driver = Driver.builder()
                            .userId(userId)
                            .vehicleModel("Honda City (White)")
                            .vehiclePlate("DL 01 AB 9988")
                            .vehicleType(VehicleType.SEDAN)
                            .isOnline(false)
                            .currentLat(28.5562)
                            .currentLng(77.1000)
                            .kycStatus(KycStatus.APPROVED) // Auto approved for demo
                            .drivingHoursToday(3.5)
                            .lastRestTime(Instant.now().minus(2, ChronoUnit.HOURS))
                            .totalTrips(412)
                            .todayEarnings(BigDecimal.valueOf(2850.00))
                            .build();
                    return driverRepository.save(driver);
                });
    }

    @Transactional
    public void setAvailability(UUID driverId, boolean isOnline, Double lat, Double lng) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));

        if (isOnline && driver.getDrivingHoursToday() >= maxDailyDrivingHours) {
            throw new BadRequestException("Safety Limit Reached: You have driven " + driver.getDrivingHoursToday() +
                    " hours today. Please rest to avoid fatigue.");
        }

        driver.setIsOnline(isOnline);
        if (lat != null) driver.setCurrentLat(lat);
        if (lng != null) driver.setCurrentLng(lng);
        driverRepository.save(driver);

        log.info("[DRIVER AVAILABILITY] Driver [{}] is now [{}] at [{}, {}]",
                driverId, isOnline ? "ONLINE" : "OFFLINE", driver.getCurrentLat(), driver.getCurrentLng());
    }

    public KycStatusResponse getKycStatus(UUID driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));

        List<KycDocumentDto> docs = kycVaultService.getDriverDocuments(driverId);
        boolean eligible = driver.getKycStatus() == KycStatus.APPROVED;

        return KycStatusResponse.builder()
                .overallStatus(driver.getKycStatus())
                .eligibleToDrive(eligible)
                .documents(docs)
                .build();
    }

    public FatigueStatusResponse getFatigueStatus(UUID driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));

        double drivingHours = driver.getDrivingHoursToday() != null ? driver.getDrivingHoursToday() : 0.0;
        double remaining = Math.max(0.0, maxDailyDrivingHours - drivingHours);
        boolean restRecommended = drivingHours >= 4.0;

        String message = restRecommended
                ? "You have driven " + drivingHours + " hours. We recommend a 45-minute rest break before your next scheduled trip."
                : "You are fit and rested to drive. " + remaining + " driving hours remaining today.";

        return FatigueStatusResponse.builder()
                .drivingHoursToday(drivingHours)
                .maxDailyDrivingHours(maxDailyDrivingHours)
                .remainingHoursAllowed(remaining)
                .isRestBreakRecommended(restRecommended)
                .fatigueStatusMessage(message)
                .lastRestTime(driver.getLastRestTime())
                .build();
    }

    public DriverEarningsResponse getEarnings(UUID driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));

        BigDecimal today = driver.getTodayEarnings() != null ? driver.getTodayEarnings() : BigDecimal.valueOf(2850.00);

        return DriverEarningsResponse.builder()
                .todayEarnings(today)
                .weeklyEarnings(today.multiply(BigDecimal.valueOf(5.8)))
                .monthlyEarnings(today.multiply(BigDecimal.valueOf(24.0)))
                .todayCompletedTrips(6)
                .scheduledTripsCompleted(2)
                .incentivesEarned(BigDecimal.valueOf(450.00))
                .pendingPayoutAmount(today.add(BigDecimal.valueOf(450.00)))
                .build();
    }

    /**
     * Advance-Scheduled rides pool for drivers to view and claim in advance.
     * Shows upcoming airport trips with transparent fares and scheduled times.
     */
    public List<BookingDto> getScheduledRidesPool(UUID driverId) {
        List<BookingDto> pool = new ArrayList<>();

        // 1. Tomorrow Early Morning Airport Pickup
        pool.add(BookingDto.builder()
                .id(UUID.fromString("c4000000-0000-0000-0000-000000000004"))
                .bookingType(BookingType.SCHEDULED)
                .status(BookingStatus.SCHEDULED_CONFIRMED)
                .scheduledPickupTime(Instant.now().plus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .pickupAddress("Sector 43, Golf Course Road, Gurugram")
                .dropAddress("IGI Airport, Terminal 3, New Delhi")
                .vehicleType(VehicleType.SEDAN)
                .fareAmount(BigDecimal.valueOf(750.00))
                .flightNumber("AI 102")
                .riderNotes("Early morning flight drop. 2 medium suitcases.")
                .createdAt(Instant.now().minus(3, ChronoUnit.HOURS))
                .build());

        // 2. Evening Airport Arrival Pickup
        pool.add(BookingDto.builder()
                .id(UUID.fromString("c5000000-0000-0000-0000-000000000005"))
                .bookingType(BookingType.SCHEDULED)
                .status(BookingStatus.SCHEDULED_CONFIRMED)
                .scheduledPickupTime(Instant.now().plus(30, ChronoUnit.HOURS))
                .pickupAddress("IGI Airport, Terminal 2, New Delhi")
                .dropAddress("Noida Sector 62, Electronic City")
                .vehicleType(VehicleType.SUV)
                .fareAmount(BigDecimal.valueOf(1150.00))
                .flightNumber("6E 501")
                .riderNotes("Airport pickup for family of 4.")
                .createdAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .build());

        return pool;
    }

    @Transactional
    public BookingDto claimScheduledRide(UUID driverId, UUID bookingId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));

        log.info("[SCHEDULED RIDE CLAIMED] Driver [{}] claimed scheduled booking [{}]", driverId, bookingId);

        return BookingDto.builder()
                .id(bookingId)
                .driverId(driverId)
                .driverName("Rajesh Kumar")
                .driverPhone("+91 98****5678")
                .driverRating(4.88)
                .vehicleModel(driver.getVehicleModel())
                .vehiclePlate(driver.getVehiclePlate())
                .status(BookingStatus.ASSIGNED)
                .scheduledPickupTime(Instant.now().plus(1, ChronoUnit.DAYS))
                .pickupAddress("Sector 43, Golf Course Road, Gurugram")
                .dropAddress("IGI Airport, Terminal 3, New Delhi")
                .fareAmount(BigDecimal.valueOf(750.00))
                .otpCode("4821")
                .build();
    }
}
