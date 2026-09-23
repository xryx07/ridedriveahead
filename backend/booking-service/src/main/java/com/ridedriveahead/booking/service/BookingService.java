package com.ridedriveahead.booking.service;

import com.ridedriveahead.booking.model.Booking;
import com.ridedriveahead.booking.model.BookingEvent;
import com.ridedriveahead.booking.repository.BookingEventRepository;
import com.ridedriveahead.booking.repository.BookingRepository;
import com.ridedriveahead.common.dto.*;
import com.ridedriveahead.common.exception.BadRequestException;
import com.ridedriveahead.common.exception.ResourceNotFoundException;
import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingEventRepository bookingEventRepository;
    private final FareCalculatorService fareCalculatorService;

    @Value("${ridedriveahead.booking.min-advance-schedule-minutes:60}")
    private long minAdvanceScheduleMinutes;

    @Value("${ridedriveahead.booking.max-advance-schedule-days:30}")
    private long maxAdvanceScheduleDays;

    @Value("${ridedriveahead.booking.free-cancellation-minutes:120}")
    private long freeCancellationMinutes;

    @Value("${ridedriveahead.booking.cancellation-fee:100.00}")
    private double cancellationFee;

    public FareEstimateResponse estimateFare(FareEstimateRequest request) {
        return fareCalculatorService.calculateUpfrontFare(request);
    }

    @Transactional
    public BookingDto createBooking(UUID riderId, CreateBookingRequest request) {
        Instant now = Instant.now();

        // 1. Advance-scheduling window validation
        if (request.getBookingType() == BookingType.SCHEDULED) {
            if (request.getScheduledPickupTime() == null) {
                throw new BadRequestException("Scheduled pickup time is required for advance-scheduled bookings.");
            }
            Duration diff = Duration.between(now, request.getScheduledPickupTime());
            if (diff.toMinutes() < minAdvanceScheduleMinutes) {
                throw new BadRequestException("Advance bookings must be scheduled at least " + minAdvanceScheduleMinutes + " minutes ahead.");
            }
            if (diff.toDays() > maxAdvanceScheduleDays) {
                throw new BadRequestException("Advance bookings cannot be scheduled more than " + maxAdvanceScheduleDays + " days in advance.");
            }
        }

        // 2. Generate secure 4-digit start OTP
        String otpCode = String.format("%04d", (int)(Math.random() * 9000) + 1000);

        BookingStatus initialStatus = request.getBookingType() == BookingType.SCHEDULED
                ? BookingStatus.SCHEDULED_CONFIRMED
                : BookingStatus.ASSIGNED;

        // Simulate instant driver match for instant booking demo
        String driverName = null;
        String driverPhone = null;
        Double driverRating = null;
        String vehicleModel = null;
        String vehiclePlate = null;
        UUID driverId = null;

        if (request.getBookingType() == BookingType.INSTANT) {
            driverId = UUID.fromString("d3000000-0000-0000-0000-000000000003");
            driverName = "Rajesh Kumar";
            driverPhone = "+91 98****5678";
            driverRating = 4.88;
            vehicleModel = "Honda City (White)";
            vehiclePlate = "DL 01 AB 9988";
        }

        Booking booking = Booking.builder()
                .riderId(riderId)
                .driverId(driverId)
                .bookingType(request.getBookingType())
                .status(initialStatus)
                .scheduledPickupTime(request.getScheduledPickupTime())
                .pickupAddress(request.getPickupAddress())
                .dropAddress(request.getDropAddress())
                .pickupLat(request.getPickupLat() != null ? request.getPickupLat() : 28.5562)
                .pickupLng(request.getPickupLng() != null ? request.getPickupLng() : 77.1000)
                .dropLat(request.getDropLat() != null ? request.getDropLat() : 28.4595)
                .dropLng(request.getDropLng() != null ? request.getDropLng() : 77.0266)
                .vehicleType(request.getVehicleType())
                .fareAmount(request.getEstimatedFare())
                .otpCode(otpCode)
                .driverName(driverName)
                .driverPhone(driverPhone)
                .driverRating(driverRating)
                .vehicleModel(vehicleModel)
                .vehiclePlate(vehiclePlate)
                .flightNumber(request.getFlightNumber())
                .riderNotes(request.getRiderNotes())
                .serviceMode(request.getServiceMode() != null ? request.getServiceMode() : "BOOK_CAB")
                .chauffeurPackage(request.getChauffeurPackage())
                .carTransmission(request.getCarTransmission())
                .customerCarModel(request.getCustomerCarModel())
                .dutyHoursIncluded(request.getDutyHoursIncluded())
                .overtimeRatePerHour(request.getOvertimeRatePerHour())
                .build();

        Booking saved = bookingRepository.save(booking);

        recordEvent(saved.getId(), BookingStatus.DRAFT, initialStatus,
                "Booking created as " + request.getBookingType() + " with upfront locked fare ₹" + request.getEstimatedFare());

        log.info("[BOOKING CREATED] ID [{}] Type [{}] Status [{}] OTP [{}] Fare [₹{}]",
                saved.getId(), saved.getBookingType(), saved.getStatus(), saved.getOtpCode(), saved.getFareAmount());

        return mapToDto(saved);
    }

    public BookingDto getBookingById(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return mapToDto(booking);
    }

    public List<BookingDto> getRiderBookings(UUID riderId, String statusGroup) {
        if (statusGroup == null || statusGroup.isBlank()) {
            return bookingRepository.findByRiderIdOrderByCreatedAtDesc(riderId)
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }

        List<BookingStatus> filterStatuses = switch (statusGroup.toUpperCase()) {
            case "UPCOMING_SCHEDULED" -> List.of(BookingStatus.SCHEDULED_CONFIRMED, BookingStatus.ASSIGNED);
            case "ACTIVE" -> List.of(BookingStatus.EN_ROUTE, BookingStatus.ARRIVED, BookingStatus.IN_PROGRESS);
            case "COMPLETED" -> List.of(BookingStatus.COMPLETED);
            case "CANCELLED" -> List.of(BookingStatus.CANCELLED);
            default -> List.of(BookingStatus.values());
        };

        return bookingRepository.findByRiderIdAndStatusInOrderByCreatedAtDesc(riderId, filterStatuses)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public BookingDto cancelBooking(UUID bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Trip cannot be cancelled in status: " + booking.getStatus());
        }

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        // Check cancellation fee policy for advance scheduled rides
        if (booking.getBookingType() == BookingType.SCHEDULED && booking.getScheduledPickupTime() != null) {
            Duration diff = Duration.between(Instant.now(), booking.getScheduledPickupTime());
            if (diff.toMinutes() < freeCancellationMinutes) {
                log.warn("[CANCELLATION FEE] Booking [{}] cancelled within {} mins of pickup. Late fee applies.",
                        bookingId, freeCancellationMinutes);
            }
        }

        Booking saved = bookingRepository.save(booking);
        recordEvent(bookingId, oldStatus, BookingStatus.CANCELLED, "Cancelled by user. Reason: " + reason);

        return mapToDto(saved);
    }

    @Transactional
    public BookingDto verifyOtpAndStartTrip(UUID bookingId, String enteredOtp) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!booking.getOtpCode().equals(enteredOtp.trim())) {
            throw new BadRequestException("Invalid 4-digit ride OTP. Please ask the rider to confirm.");
        }

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.IN_PROGRESS);
        Booking saved = bookingRepository.save(booking);

        recordEvent(bookingId, oldStatus, BookingStatus.IN_PROGRESS, "Driver verified OTP and commenced trip");
        return mapToDto(saved);
    }

    @Transactional
    public BookingDto completeTrip(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.COMPLETED);
        Booking saved = bookingRepository.save(booking);

        recordEvent(bookingId, oldStatus, BookingStatus.COMPLETED, "Trip completed at destination");
        return mapToDto(saved);
    }

    @Transactional
    public void recordEvent(UUID bookingId, BookingStatus oldStatus, BookingStatus newStatus, String description) {
        BookingEvent event = BookingEvent.builder()
                .bookingId(bookingId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .description(description)
                .build();
        bookingEventRepository.save(event);
    }

    public BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .riderId(booking.getRiderId())
                .driverId(booking.getDriverId())
                .bookingType(booking.getBookingType())
                .status(booking.getStatus())
                .scheduledPickupTime(booking.getScheduledPickupTime())
                .pickupAddress(booking.getPickupAddress())
                .dropAddress(booking.getDropAddress())
                .pickupLat(booking.getPickupLat())
                .pickupLng(booking.getPickupLng())
                .dropLat(booking.getDropLat())
                .dropLng(booking.getDropLng())
                .vehicleType(booking.getVehicleType())
                .fareAmount(booking.getFareAmount())
                .otpCode(booking.getOtpCode())
                .driverName(booking.getDriverName())
                .driverPhone(booking.getDriverPhone())
                .driverRating(booking.getDriverRating())
                .vehicleModel(booking.getVehicleModel())
                .vehiclePlate(booking.getVehiclePlate())
                .flightNumber(booking.getFlightNumber())
                .riderNotes(booking.getRiderNotes())
                .cancellationReason(booking.getCancellationReason())
                .serviceMode(booking.getServiceMode())
                .chauffeurPackage(booking.getChauffeurPackage())
                .carTransmission(booking.getCarTransmission())
                .customerCarModel(booking.getCustomerCarModel())
                .dutyHoursIncluded(booking.getDutyHoursIncluded())
                .overtimeRatePerHour(booking.getOvertimeRatePerHour())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
