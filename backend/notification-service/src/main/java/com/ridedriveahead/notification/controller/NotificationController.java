package com.ridedriveahead.notification.controller;

import com.ridedriveahead.common.dto.ApiResponse;
import com.ridedriveahead.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Push Notification & SOS Alert Dispatch Endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/sos")
    @Operation(summary = "Trigger emergency SOS alert broadcast")
    public ResponseEntity<ApiResponse<Void>> triggerSos(@RequestBody Map<String, Object> body) {
        UUID riderId = UUID.fromString(String.valueOf(body.get("riderId")));
        Double lat = Double.parseDouble(String.valueOf(body.get("lat")));
        Double lng = Double.parseDouble(String.valueOf(body.get("lng")));
        String contact = String.valueOf(body.get("emergencyContact"));

        notificationService.dispatchEmergencyAlert(riderId, lat, lng, contact);
        return ResponseEntity.ok(ApiResponse.okMessage("Emergency SOS dispatched to emergency contact and emergency response network."));
    }
}
