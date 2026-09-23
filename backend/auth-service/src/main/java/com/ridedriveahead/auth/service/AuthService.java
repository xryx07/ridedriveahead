package com.ridedriveahead.auth.service;

import com.ridedriveahead.auth.model.RefreshToken;
import com.ridedriveahead.auth.model.User;
import com.ridedriveahead.auth.repository.RefreshTokenRepository;
import com.ridedriveahead.auth.repository.UserRepository;
import com.ridedriveahead.auth.security.JwtTokenProvider;
import com.ridedriveahead.common.dto.*;
import com.ridedriveahead.common.exception.BadRequestException;
import com.ridedriveahead.common.exception.ResourceNotFoundException;
import com.ridedriveahead.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider tokenProvider;

    @Value("${ridedriveahead.auth.mock-otp-enabled:true}")
    private boolean mockOtpEnabled;

    @Value("${ridedriveahead.auth.default-otp:123456}")
    private String defaultOtp;

    @Value("${ridedriveahead.jwt.access-token-expiration-ms:86400000}")
    private long accessTokenExpirationMs;

    @Value("${ridedriveahead.jwt.refresh-token-expiration-ms:2592000000}")
    private long refreshTokenExpirationMs;

    // Fast in-memory cache for OTPs in dev/demo (in prod, backed by Redis)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public ApiResponse<Void> requestOtp(OtpRequest request) {
        String phone = request.getPhoneNumber().trim();
        String generatedOtp = mockOtpEnabled ? defaultOtp : String.format("%06d", (int)(Math.random() * 900000) + 100000);
        otpStore.put(phone, generatedOtp);

        log.info("[OTP DISPATCH] Dispatched OTP [{}] to phone [{}] for role [{}]",
                generatedOtp, phone, request.getUserRole());

        return ApiResponse.okMessage("OTP sent successfully to " + phone);
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String phone = request.getPhoneNumber().trim();
        String expectedOtp = otpStore.getOrDefault(phone, defaultOtp);

        if (!expectedOtp.equals(request.getOtpCode().trim()) && !defaultOtp.equals(request.getOtpCode().trim())) {
            throw new BadRequestException("Invalid verification code. Please check and try again.");
        }

        // Clean up OTP once verified
        otpStore.remove(phone);

        // Find existing user or register new user
        User user = userRepository.findByPhoneNumber(phone)
                .orElseGet(() -> {
                    String defaultName = request.getFullName() != null && !request.getFullName().isBlank()
                            ? request.getFullName().trim()
                            : (request.getUserRole().name().equals("DRIVER") ? "Driver Partner" : "Rider");

                    User newUser = User.builder()
                            .phoneNumber(phone)
                            .fullName(defaultName)
                            .role(request.getUserRole())
                            .rating(5.00)
                            .isActive(true)
                            .build();
                    return userRepository.save(newUser);
                });

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("User account is deactivated. Please contact support.");
        }

        String accessToken = tokenProvider.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(mapToUserProfileDto(user))
                .build();
    }

    @Transactional
    public AuthResponse rotateRefreshToken(String rawRefreshToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(rawRefreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid or revoked refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        // Revoke old token for rotation security
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateAccessToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(mapToUserProfileDto(user))
                .build();
    }

    @Transactional
    public ApiResponse<Void> logout(String rawRefreshToken) {
        if (rawRefreshToken != null) {
            refreshTokenRepository.findByTokenAndRevokedFalse(rawRefreshToken)
                    .ifPresent(token -> {
                        token.setRevoked(true);
                        refreshTokenRepository.save(token);
                    });
        }
        return ApiResponse.okMessage("Logged out successfully");
    }

    public UserProfileDto getCurrentUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToUserProfileDto(user);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private UserProfileDto mapToUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .rating(user.getRating())
                .kycStatus(user.getKycStatus())
                .isActive(user.getIsActive())
                .build();
    }
}
