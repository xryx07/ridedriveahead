package com.ridedriveahead.driver.service;

import com.ridedriveahead.common.dto.BookingDto;
import com.ridedriveahead.common.dto.FatigueStatusResponse;
import com.ridedriveahead.common.exception.BadRequestException;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.driver.model.Driver;
import com.ridedriveahead.driver.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private KycVaultService kycVaultService;

    @InjectMocks
    private DriverService driverService;

    private UUID driverId;

    @BeforeEach
    void setUp() {
        driverId = UUID.randomUUID();
        ReflectionTestUtils.setField(driverService, "maxDailyDrivingHours", 8.0);
    }

    @Test
    @DisplayName("Should block driver from going online if driving hours exceed 8 hours")
    void testFatigueBlockOnline() {
        Driver fatiguedDriver = Driver.builder()
                .id(driverId)
                .drivingHoursToday(8.5)
                .isOnline(false)
                .build();

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(fatiguedDriver));

        assertThrows(BadRequestException.class, () -> driverService.setAvailability(driverId, true, 28.5, 77.1));
    }

    @Test
    @DisplayName("Should allow driver to toggle online when within safety limit")
    void testAllowOnlineWithinLimits() {
        Driver restedDriver = Driver.builder()
                .id(driverId)
                .drivingHoursToday(3.2)
                .isOnline(false)
                .build();

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(restedDriver));
        when(driverRepository.save(any(Driver.class))).thenAnswer(inv -> inv.getArgument(0));

        driverService.setAvailability(driverId, true, 28.5, 77.1);

        assertTrue(restedDriver.getIsOnline());
    }

    @Test
    @DisplayName("Should return advance-scheduled rides in pool for driver to claim")
    void testGetScheduledRidesPool() {
        List<BookingDto> pool = driverService.getScheduledRidesPool(driverId);

        assertNotNull(pool);
        assertFalse(pool.isEmpty());
        assertEquals(BookingType.SCHEDULED, pool.get(0).getBookingType());
        assertTrue(pool.get(0).getDropAddress().contains("Airport"));
    }

    @Test
    @DisplayName("Should report correct remaining driving hours in fatigue status")
    void testFatigueStatus() {
        Driver driver = Driver.builder()
                .id(driverId)
                .drivingHoursToday(5.0)
                .build();

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(driver));

        FatigueStatusResponse response = driverService.getFatigueStatus(driverId);

        assertNotNull(response);
        assertEquals(5.0, response.getDrivingHoursToday());
        assertEquals(3.0, response.getRemainingHoursAllowed());
        assertTrue(response.getIsRestBreakRecommended());
    }
}
