package com.ridedriveahead.driver.controller;

import com.ridedriveahead.common.dto.*;
import com.ridedriveahead.driver.model.Driver;
import com.ridedriveahead.driver.service.DriverService;
import com.ridedriveahead.driver.service.KycVaultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@Tag(name = "Driver", description = "Driver Management, AES-256 KYC Vault, Scheduled Pool & Fatigue Tracker")
public class DriverController {

    private final DriverService driverService;
    private final KycVaultService kycVaultService;

    private static final UUID DEMO_DRIVER_ID = UUID.fromString("d3000000-0000-0000-0000-000000000003");

    @PostMapping("/kyc/upload")
    @Operation(summary = "Upload sensitive KYC document (Aadhaar, PAN, DL, RC) into AES-256 Vault")
    public ResponseEntity<ApiResponse<KycDocumentDto>> uploadKyc(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader,
            @Valid @RequestBody KycUploadRequest request,
            HttpServletRequest servletRequest) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        String clientIp = servletRequest.getRemoteAddr();

        KycDocumentDto vaultedDoc = kycVaultService.uploadAndVaultDocument(driverId, request, clientIp);
        return new ResponseEntity<>(ApiResponse.created("Document securely encrypted into vault", vaultedDoc), HttpStatus.CREATED);
    }

    @GetMapping("/kyc/status")
    @Operation(summary = "Get driver KYC verification status and list of vaulted documents")
    public ResponseEntity<ApiResponse<KycStatusResponse>> getKycStatus(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        KycStatusResponse status = driverService.getKycStatus(driverId);
        return ResponseEntity.ok(ApiResponse.ok(status));
    }

    @PostMapping("/availability")
    @Operation(summary = "Toggle driver online/offline availability")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader,
            @RequestBody Map<String, Object> body) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        boolean isOnline = Boolean.parseBoolean(String.valueOf(body.get("isOnline")));
        Double lat = body.get("currentLat") != null ? Double.parseDouble(String.valueOf(body.get("currentLat"))) : null;
        Double lng = body.get("currentLng") != null ? Double.parseDouble(String.valueOf(body.get("currentLng"))) : null;

        driverService.setAvailability(driverId, isOnline, lat, lng);
        return ResponseEntity.ok(ApiResponse.okMessage("Availability set to " + (isOnline ? "ONLINE" : "OFFLINE")));
    }

    @GetMapping("/scheduled-pool")
    @Operation(summary = "View available advance-scheduled bookings (e.g. tomorrow's airport drops)")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getScheduledPool(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        List<BookingDto> pool = driverService.getScheduledRidesPool(driverId);
        return ResponseEntity.ok(ApiResponse.ok(pool));
    }

    @PostMapping("/scheduled-pool/{bookingId}/accept")
    @Operation(summary = "Claim an advance-scheduled booking")
    public ResponseEntity<ApiResponse<BookingDto>> acceptScheduledBooking(
            @PathVariable("bookingId") UUID bookingId,
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        BookingDto claimed = driverService.claimScheduledRide(driverId, bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Advance trip claimed successfully. Driver commitment locked.", claimed));
    }

    @GetMapping("/fatigue-status")
    @Operation(summary = "Check driving-hours fatigue monitor and rest recommendations")
    public ResponseEntity<ApiResponse<FatigueStatusResponse>> getFatigueStatus(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        FatigueStatusResponse fatigue = driverService.getFatigueStatus(driverId);
        return ResponseEntity.ok(ApiResponse.ok(fatigue));
    }

    @GetMapping("/earnings")
    @Operation(summary = "Get daily, weekly, and monthly earnings breakdown")
    public ResponseEntity<ApiResponse<DriverEarningsResponse>> getEarnings(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {

        UUID driverId = driverIdHeader != null ? UUID.fromString(driverIdHeader) : DEMO_DRIVER_ID;
        DriverEarningsResponse earnings = driverService.getEarnings(driverId);
        return ResponseEntity.ok(ApiResponse.ok(earnings));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get driver vehicle and operational profile")
    public ResponseEntity<ApiResponse<Driver>> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {

        UUID userId = userIdHeader != null ? UUID.fromString(userIdHeader) : UUID.fromString("b2000000-0000-0000-0000-000000000002");
        Driver driver = driverService.getOrCreateDriver(userId);
        return ResponseEntity.ok(ApiResponse.ok(driver));
    }

    @GetMapping("/gigs")
    @Operation(summary = "Marketplace of open driving gigs (hourly chauffeur, events, outstation, cabs)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getGigMarketplace(
            @RequestHeader(value = "X-Driver-Id", required = false) String driverIdHeader) {
        List<Map<String, Object>> gigs = List.of(
            Map.of("id", "GIG-101", "type", "HOURLY", "title", "4-Hour Local Chauffeur", "car", "Customer's Honda City (Automatic AT)", "fare", 549.0, "hours", 4, "isClaimed", true),
            Map.of("id", "GIG-102", "type", "EVENT", "title", "Wedding Evening Chauffeur", "car", "Customer's Hyundai Creta (Manual MT)", "fare", 799.0, "hours", 6, "isClaimed", false),
            Map.of("id", "GIG-103", "type", "OUTSTATION", "title", "2-Day Weekend Road Trip to Jaipur", "car", "Customer's Toyota Fortuner 4x4 (AT)", "fare", 2799.0, "hours", 24, "isClaimed", false),
            Map.of("id", "GIG-104", "type", "CAB", "title", "Advance Airport Run (Commercial Sedan)", "car", "Commercial Taxi • DL 01 AB 9988", "fare", 750.0, "hours", 1.5, "isClaimed", false)
        );
        return ResponseEntity.ok(ApiResponse.ok(gigs));
    }
}
