package com.ridedriveahead.auth.service;

import com.ridedriveahead.auth.model.User;
import com.ridedriveahead.auth.repository.RefreshTokenRepository;
import com.ridedriveahead.auth.repository.UserRepository;
import com.ridedriveahead.auth.security.JwtTokenProvider;
import com.ridedriveahead.common.dto.ApiResponse;
import com.ridedriveahead.common.dto.AuthResponse;
import com.ridedriveahead.common.dto.OtpRequest;
import com.ridedriveahead.common.dto.OtpVerifyRequest;
import com.ridedriveahead.common.model.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "mockOtpEnabled", true);
        ReflectionTestUtils.setField(authService, "defaultOtp", "123456");
        ReflectionTestUtils.setField(authService, "accessTokenExpirationMs", 86400000L);
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationMs", 2592000000L);
    }

    @Test
    @DisplayName("Should successfully dispatch mock OTP")
    void testRequestOtp() {
        OtpRequest request = OtpRequest.builder()
                .phoneNumber("+919876543210")
                .userRole(UserRole.RIDER)
                .build();

        ApiResponse<Void> response = authService.requestOtp(request);
        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("+919876543210"));
    }

    @Test
    @DisplayName("Should verify valid OTP and return JWT auth tokens")
    void testVerifyOtpSuccess() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .phoneNumber("+919876543210")
                .fullName("Arjun Rider")
                .role(UserRole.RIDER)
                .rating(5.0)
                .isActive(true)
                .build();

        when(userRepository.findByPhoneNumber("+919876543210")).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessToken(any(User.class))).thenReturn("mock-jwt-token-string");
        when(refreshTokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        OtpVerifyRequest verifyRequest = OtpVerifyRequest.builder()
                .phoneNumber("+919876543210")
                .otpCode("123456")
                .userRole(UserRole.RIDER)
                .build();

        AuthResponse authResponse = authService.verifyOtp(verifyRequest);

        assertNotNull(authResponse);
        assertEquals("mock-jwt-token-string", authResponse.getAccessToken());
        assertNotNull(authResponse.getRefreshToken());
        assertEquals("Arjun Rider", authResponse.getUser().getFullName());
    }
}
