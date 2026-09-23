package com.ridedriveahead.booking.controller;

import com.ridedriveahead.booking.service.BookingService;
import com.ridedriveahead.common.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Instant & Advance-Scheduled Booking Endpoints")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/estimate")
    @Operation(summary = "Calculate upfront locked fare estimate across vehicle tiers")
    public ResponseEntity<ApiResponse<FareEstimateResponse>> getFareEstimate(
            @Valid @RequestBody FareEstimateRequest request) {
        FareEstimateResponse estimate = bookingService.estimateFare(request);
        return ResponseEntity.ok(ApiResponse.ok(estimate));
    }

    @PostMapping
    @Operation(summary = "Create an instant or advance-scheduled booking")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @Valid @RequestBody CreateBookingRequest request) {

        // Use header userId or default demo rider UUID
        UUID riderId = userIdHeader != null && !userIdHeader.isBlank()
                ? UUID.fromString(userIdHeader)
                : UUID.fromString("a1000000-0000-0000-0000-000000000001");

        BookingDto booking = bookingService.createBooking(riderId, request);
        return new ResponseEntity<>(ApiResponse.created("Booking confirmed successfully", booking), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(@PathVariable("id") UUID id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @GetMapping("/my-rides")
    @Operation(summary = "Get authenticated rider's booking history")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyRides(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestParam(value = "statusGroup", required = false) String statusGroup) {

        UUID riderId = userIdHeader != null && !userIdHeader.isBlank()
                ? UUID.fromString(userIdHeader)
                : UUID.fromString("a1000000-0000-0000-0000-000000000001");

        List<BookingDto> rides = bookingService.getRiderBookings(riderId, statusGroup);
        return ResponseEntity.ok(ApiResponse.ok(rides));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking with cancellation policy verification")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CancelBookingRequest request) {
        BookingDto cancelled = bookingService.cancelBooking(id, request.getReason());
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled", cancelled));
    }

    @PostMapping("/{id}/verify-otp")
    @Operation(summary = "Driver verifies rider's 4-digit OTP to commence trip")
    public ResponseEntity<ApiResponse<BookingDto>> verifyOtp(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, String> body) {
        String otp = body.get("otpCode");
        BookingDto booking = bookingService.verifyOtpAndStartTrip(id, otp);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified. Trip is now in progress.", booking));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Driver completes the trip")
    public ResponseEntity<ApiResponse<BookingDto>> completeTrip(@PathVariable("id") UUID id) {
        BookingDto booking = bookingService.completeTrip(id);
        return ResponseEntity.ok(ApiResponse.ok("Trip completed successfully", booking));
    }

    @GetMapping("/chauffeur/packages")
    @Operation(summary = "List available chauffeur packages (hourly, events, 1-2 day outstation)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getChauffeurPackages() {
        List<Map<String, Object>> packages = List.of(
            Map.of("id", "HOURLY_2H", "name", "2 Hours Express", "hours", 2, "fare", 299.0, "overtimeRate", 99.0, "desc", "Quick local visits, clinic, errands"),
            Map.of("id", "HOURLY_4H", "name", "4 Hours Half-Day", "hours", 4, "fare", 549.0, "overtimeRate", 99.0, "desc", "Shopping, dining, city meetings"),
            Map.of("id", "HOURLY_8H", "name", "8 Hours Full-Day", "hours", 8, "fare", 999.0, "overtimeRate", 99.0, "desc", "All-day office, multi-stop commute"),
            Map.of("id", "SPECIAL_EVENT", "name", "Party & Wedding Chauffeur", "hours", 6, "fare", 799.0, "overtimeRate", 99.0, "desc", "6h evening duty, zero DUI risk"),
            Map.of("id", "OUTSTATION_1DAY", "name", "1-Day Outstation Trip", "hours", 12, "fare", 1499.0, "overtimeRate", 120.0, "desc", "Round-trip highway day trip"),
            Map.of("id", "OUTSTATION_2DAY", "name", "2-Day Weekend Road Trip", "hours", 24, "fare", 2799.0, "overtimeRate", 120.0, "desc", "Weekend getaway round-trip")
        );
        return ResponseEntity.ok(ApiResponse.ok(packages));
    }
}
