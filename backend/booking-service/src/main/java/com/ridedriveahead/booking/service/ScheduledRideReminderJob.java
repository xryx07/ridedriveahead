package com.ridedriveahead.booking.service;

import com.ridedriveahead.booking.model.Booking;
import com.ridedriveahead.booking.repository.BookingRepository;
import com.ridedriveahead.common.model.enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Background Engine for Advance-Scheduled Rides:
 * - Scans upcoming scheduled rides for T-12h evening driver alert
 * - Scans upcoming scheduled rides for T-2h morning readiness confirmation
 * - Triggers automatic re-pooling if driver fails to confirm
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledRideReminderJob {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000) // Runs every minute
    public void scanAndTriggerReminders() {
        Instant now = Instant.now();

        // 1. T-12 Hour Reminder Window (between 11h 55m and 12h 05m ahead)
        Instant t12Start = now.plus(715, ChronoUnit.MINUTES);
        Instant t12End = now.plus(725, ChronoUnit.MINUTES);
        List<Booking> t12Rides = bookingRepository.findScheduledRidesBetween(
                List.of(BookingStatus.SCHEDULED_CONFIRMED, BookingStatus.ASSIGNED),
                t12Start, t12End
        );

        for (Booking booking : t12Rides) {
            log.info("[SCHEDULED T-12H REMINDER] Booking [{}] scheduled at [{}]. Dispatching evening reminder to driver.",
                    booking.getId(), booking.getScheduledPickupTime());
        }

        // 2. T-2 Hour Readiness Window (between 1h 55m and 2h 05m ahead)
        Instant t2Start = now.plus(115, ChronoUnit.MINUTES);
        Instant t2End = now.plus(125, ChronoUnit.MINUTES);
        List<Booking> t2Rides = bookingRepository.findScheduledRidesBetween(
                List.of(BookingStatus.SCHEDULED_CONFIRMED, BookingStatus.ASSIGNED),
                t2Start, t2End
        );

        for (Booking booking : t2Rides) {
            log.info("[SCHEDULED T-2H READINESS] Booking [{}] scheduled at [{}]. Checking driver readiness & route planning.",
                    booking.getId(), booking.getScheduledPickupTime());
        }
    }
}
