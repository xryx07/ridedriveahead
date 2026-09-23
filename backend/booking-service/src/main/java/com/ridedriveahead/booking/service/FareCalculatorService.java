package com.ridedriveahead.booking.service;

import com.ridedriveahead.common.dto.FareEstimateRequest;
import com.ridedriveahead.common.dto.FareEstimateResponse;
import com.ridedriveahead.common.dto.VehicleTierEstimate;
import com.ridedriveahead.common.model.enums.BookingType;
import com.ridedriveahead.common.model.enums.VehicleType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FareCalculatorService {

    public FareEstimateResponse calculateUpfrontFare(FareEstimateRequest request) {
        double distanceKm = calculateDistanceKm(
                request.getPickupLat(), request.getPickupLng(),
                request.getDropLat(), request.getDropLng()
        );

        // Approximate 2.0 mins per km in city/airport traffic
        int durationMin = Math.max(15, (int) Math.round(distanceKm * 2.2));

        List<VehicleTierEstimate> tiers = new ArrayList<>();
        boolean isScheduled = request.getBookingType() == BookingType.SCHEDULED;

        // 1. Hatchback
        tiers.add(buildTier(
                VehicleType.HATCHBACK,
                "Go Compact",
                "Affordable, compact rides for everyday travel",
                4,
                BigDecimal.valueOf(80.00),
                BigDecimal.valueOf(12.50),
                isScheduled ? BigDecimal.valueOf(30.00) : BigDecimal.ZERO,
                distanceKm,
                durationMin
        ));

        // 2. Sedan
        tiers.add(buildTier(
                VehicleType.SEDAN,
                "Premier Sedan",
                "Comfortable sedans with top-rated drivers & ample boot space",
                4,
                BigDecimal.valueOf(120.00),
                BigDecimal.valueOf(15.00),
                isScheduled ? BigDecimal.valueOf(50.00) : BigDecimal.ZERO,
                distanceKm,
                durationMin
        ));

        // 3. SUV
        tiers.add(buildTier(
                VehicleType.SUV,
                "XL 6-Seater",
                "Spacious SUVs for extra luggage & group airport runs",
                6,
                BigDecimal.valueOf(180.00),
                BigDecimal.valueOf(22.00),
                isScheduled ? BigDecimal.valueOf(70.00) : BigDecimal.ZERO,
                distanceKm,
                durationMin
        ));

        // 4. Premier
        tiers.add(buildTier(
                VehicleType.PREMIER,
                "Executive Black",
                "High-end luxury vehicles with top priority driver dispatch",
                4,
                BigDecimal.valueOf(250.00),
                BigDecimal.valueOf(30.00),
                isScheduled ? BigDecimal.valueOf(100.00) : BigDecimal.ZERO,
                distanceKm,
                durationMin
        ));

        return FareEstimateResponse.builder()
                .distanceKm(BigDecimal.valueOf(distanceKm).setScale(1, RoundingMode.HALF_UP).doubleValue())
                .estimatedDurationMin(durationMin)
                .bookingType(request.getBookingType())
                .scheduledPickupTime(request.getScheduledPickupTime())
                .tiers(tiers)
                .build();
    }

    private VehicleTierEstimate buildTier(VehicleType type,
                                          String name,
                                          String desc,
                                          int capacity,
                                          BigDecimal baseFare,
                                          BigDecimal perKmRate,
                                          BigDecimal advanceFee,
                                          double distanceKm,
                                          int durationMin) {
        BigDecimal distanceFare = perKmRate.multiply(BigDecimal.valueOf(distanceKm)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalFare = baseFare.add(distanceFare).add(advanceFee).setScale(2, RoundingMode.HALF_UP);

        return VehicleTierEstimate.builder()
                .vehicleType(type)
                .tierName(name)
                .description(desc)
                .capacity(capacity)
                .baseFare(baseFare)
                .distanceFare(distanceFare)
                .advanceReservationFee(advanceFee)
                .totalFare(totalFare)
                .currency("INR")
                .etaMinutes(Math.max(4, (int)(Math.random() * 8) + 3))
                .build();
    }

    private double calculateDistanceKm(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            // Default realistic airport distance for demo
            return 18.5;
        }

        final int EARTH_RADIUS_KM = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
