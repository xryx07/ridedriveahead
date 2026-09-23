package com.ridedriveahead.booking.service;

import com.ridedriveahead.booking.model.Booking;
import com.ridedriveahead.booking.repository.BookingEventRepository;
import com.ridedriveahead.booking.repository.BookingRepository;
import com.ridedriveahead.common.dto.BookingDto;
import com.ridedriveahead.common.dto.CreateBookingRequest;
import com.ridedriveahead.common.exception.BadRequestException;
import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingEventRepository bookingEventRepository;

    @Mock
    private FareCalculatorService fareCalculatorService;

    @InjectMocks
    private BookingService bookingService;

    private UUID riderId;

    @BeforeEach
    void setUp() {
        riderId = UUID.randomUUID();
        ReflectionTestUtils.setField(bookingService, "minAdvanceScheduleMinutes", 60L);
        ReflectionTestUtils.setField(bookingService, "maxAdvanceScheduleDays", 30L);
        ReflectionTestUtils.setField(bookingService, "freeCancellationMinutes", 120L);
        ReflectionTestUtils.setField(bookingService, "cancellationFee", 100.0);
    }

    @Test
    @DisplayName("Should reject advance booking scheduled less than 60 minutes ahead")
    void testAdvanceBookingTooSoon() {
        CreateBookingRequest request = CreateBookingRequest.builder()
                .pickupAddress("Cyber City, Gurugram")
                .dropAddress("Airport Terminal 3")
                .vehicleType(VehicleType.SEDAN)
                .bookingType(BookingType.SCHEDULED)
                .scheduledPickupTime(Instant.now().plus(20, ChronoUnit.MINUTES)) // Only 20 mins ahead
                .estimatedFare(BigDecimal.valueOf(500))
                .build();

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(riderId, request));
    }

    @Test
    @DisplayName("Should successfully create valid advance-scheduled booking with OTP")
    void testCreateAdvanceBookingSuccess() {
        Instant tomorrow = Instant.now().plus(1, ChronoUnit.DAYS);

        CreateBookingRequest request = CreateBookingRequest.builder()
                .pickupAddress("Cyber City, Gurugram")
                .dropAddress("Airport Terminal 3")
                .vehicleType(VehicleType.SEDAN)
                .bookingType(BookingType.SCHEDULED)
                .scheduledPickupTime(tomorrow)
                .estimatedFare(BigDecimal.valueOf(550.00))
                .flightNumber("6E 204")
                .build();

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(UUID.randomUUID());
            return b;
        });

        BookingDto result = bookingService.createBooking(riderId, request);

        assertNotNull(result);
        assertEquals(BookingType.SCHEDULED, result.getBookingType());
        assertEquals(BookingStatus.SCHEDULED_CONFIRMED, result.getStatus());
        assertNotNull(result.getOtpCode());
        assertEquals(4, result.getOtpCode().length());
        assertEquals("6E 204", result.getFlightNumber());
    }

    @Test
    @DisplayName("Should verify 4-digit OTP and transition trip to IN_PROGRESS")
    void testVerifyOtpAndStartTrip() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .riderId(riderId)
                .status(BookingStatus.ARRIVED)
                .otpCode("8412")
                .fareAmount(BigDecimal.valueOf(600))
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingDto result = bookingService.verifyOtpAndStartTrip(bookingId, "8412");

        assertEquals(BookingStatus.IN_PROGRESS, result.getStatus());
    }
}
