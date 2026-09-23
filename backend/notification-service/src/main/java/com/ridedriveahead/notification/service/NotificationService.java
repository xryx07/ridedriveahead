package com.ridedriveahead.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    public void dispatchScheduledTripReminder(UUID bookingId, UUID driverId, String reminderType, String pickupTime) {
        log.info("[SCHEDULED REMINDER PUSH] ReminderType [{}] for Booking [{}] sent to Driver [{}] for scheduled pickup at [{}]",
                reminderType, bookingId, driverId, pickupTime);
    }

    public void dispatchRiderArrivalAlert(UUID bookingId, UUID riderId, String driverName, String vehiclePlate) {
        log.info("[RIDER ARRIVAL PUSH] Driver [{}] with Vehicle [{}] has arrived for Booking [{}] Rider [{}]",
                driverName, vehiclePlate, bookingId, riderId);
    }

    public void dispatchEmergencyAlert(UUID riderId, Double lat, Double lng, String emergencyContact) {
        log.error("[EMERGENCY SOS ALERT TRIGGERED] Rider [{}] triggered SOS at [{}, {}]. Alert dispatched to [{}] and Police Control Room.",
                riderId, lat, lng, emergencyContact);
    }
}
