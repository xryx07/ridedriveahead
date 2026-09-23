package com.ridedriveahead.booking.repository;

import com.ridedriveahead.booking.model.BookingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingEventRepository extends JpaRepository<BookingEvent, UUID> {
    List<BookingEvent> findByBookingIdOrderByCreatedAtAsc(UUID bookingId);
}
