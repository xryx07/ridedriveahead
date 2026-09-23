package com.ridedriveahead.common.dto;

import com.ridedriveahead.common.model.enums.PaymentMethod;
import com.ridedriveahead.common.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReceiptDto {
    private String receiptNumber;
    private UUID bookingId;
    private BigDecimal baseFare;
    private BigDecimal distanceFare;
    private BigDecimal advanceReservationFee;
    private BigDecimal taxes;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Instant paidAt;
}
