package com.ridedriveahead.booking.repository;

import com.ridedriveahead.booking.model.Booking;
import com.ridedriveahead.common.model.enums.BookingStatus;
import com.ridedriveahead.common.model.enums.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByRiderIdOrderByCreatedAtDesc(UUID riderId);

    List<Booking> findByRiderIdAndStatusInOrderByCreatedAtDesc(UUID riderId, List<BookingStatus> statuses);

    List<Booking> findByDriverIdOrderByCreatedAtDesc(UUID driverId);

    // Find unassigned advance-scheduled rides for drivers to view and claim in the pool
    List<Booking> findByBookingTypeAndStatusAndDriverIdIsNullOrderByScheduledPickupTimeAsc(
            BookingType bookingType, BookingStatus status);

    // Find scheduled rides within a reminder window
    @Query("SELECT b FROM Booking b WHERE b.bookingType = 'SCHEDULED' AND b.status IN :statuses AND b.scheduledPickupTime BETWEEN :startTime AND :endTime")
    List<Booking> findScheduledRidesBetween(
            @Param("statuses") List<BookingStatus> statuses,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime);
}
