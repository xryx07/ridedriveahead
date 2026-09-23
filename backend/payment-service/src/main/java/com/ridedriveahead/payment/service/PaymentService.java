package com.ridedriveahead.payment.service;

import com.ridedriveahead.common.dto.PaymentReceiptDto;
import com.ridedriveahead.common.dto.ProcessPaymentRequest;
import com.ridedriveahead.common.model.enums.PaymentMethod;
import com.ridedriveahead.common.model.enums.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class PaymentService {

    private final Map<UUID, PaymentReceiptDto> receiptCache = new ConcurrentHashMap<>();

    public PaymentReceiptDto processPayment(ProcessPaymentRequest request) {
        log.info("[PAYMENT PROCESSING] Initiating payment for Booking [{}] Amount [₹{}] via [{}]",
                request.getBookingId(), request.getAmount(), request.getPaymentMethod());

        BigDecimal total = request.getAmount();
        BigDecimal taxes = total.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP); // 5% GST
        BigDecimal advanceFee = BigDecimal.valueOf(50.00);
        BigDecimal distanceFare = total.subtract(taxes).subtract(advanceFee).multiply(BigDecimal.valueOf(0.65)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal baseFare = total.subtract(taxes).subtract(advanceFee).subtract(distanceFare).setScale(2, RoundingMode.HALF_UP);

        String receiptNo = "RCP-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(java.time.LocalDate.now())
                + "-" + String.format("%04d", (int)(Math.random() * 9000) + 1000);

        PaymentReceiptDto receipt = PaymentReceiptDto.builder()
                .receiptNumber(receiptNo)
                .bookingId(request.getBookingId())
                .baseFare(baseFare)
                .distanceFare(distanceFare)
                .advanceReservationFee(advanceFee)
                .taxes(taxes)
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.COMPLETED)
                .paidAt(Instant.now())
                .build();

        receiptCache.put(request.getBookingId(), receipt);
        log.info("[PAYMENT SUCCESS] Receipt [{}] generated successfully for Booking [{}]", receiptNo, request.getBookingId());

        return receipt;
    }

    public PaymentReceiptDto getReceipt(UUID bookingId) {
        return receiptCache.computeIfAbsent(bookingId, id -> PaymentReceiptDto.builder()
                .receiptNumber("RCP-20260911-5821")
                .bookingId(id)
                .baseFare(BigDecimal.valueOf(120.00))
                .distanceFare(BigDecimal.valueOf(540.00))
                .advanceReservationFee(BigDecimal.valueOf(50.00))
                .taxes(BigDecimal.valueOf(40.00))
                .totalAmount(BigDecimal.valueOf(750.00))
                .paymentMethod(PaymentMethod.UPI)
                .paymentStatus(PaymentStatus.COMPLETED)
                .paidAt(Instant.now())
                .build());
    }
}
