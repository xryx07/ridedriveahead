package com.ridedriveahead.auth.controller;

import com.ridedriveahead.auth.service.AuthService;
import com.ridedriveahead.common.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for Phone OTP, Login, JWT tokens, and token rotation")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/otp/request")
    @Operation(summary = "Request phone OTP for login or signup")
    public ResponseEntity<ApiResponse<Void>> requestOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.requestOtp(request));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify OTP and obtain JWT access + refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse authResponse = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", authResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and get a new access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        AuthResponse response = authService.rotateRefreshToken(token);
        return ResponseEntity.ok(ApiResponse.ok("Token rotated successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke active refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) Map<String, String> body) {
        String token = body != null ? body.get("refreshToken") : null;
        return ResponseEntity.ok(authService.logout(token));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(@AuthenticationPrincipal UUID userId) {
        UserProfileDto profile = authService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
