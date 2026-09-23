package com.ridedriveahead.payment.controller;

import com.ridedriveahead.common.dto.ApiResponse;
import com.ridedriveahead.common.dto.PaymentReceiptDto;
import com.ridedriveahead.common.dto.ProcessPaymentRequest;
import com.ridedriveahead.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints for payment processing and receipt generation")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @Operation(summary = "Process trip payment via UPI, Card, or Wallet")
    public ResponseEntity<ApiResponse<PaymentReceiptDto>> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        PaymentReceiptDto receipt = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", receipt));
    }

    @GetMapping("/receipt/{bookingId}")
    @Operation(summary = "Retrieve itemized trip receipt")
    public ResponseEntity<ApiResponse<PaymentReceiptDto>> getReceipt(@PathVariable("bookingId") UUID bookingId) {
        PaymentReceiptDto receipt = paymentService.getReceipt(bookingId);
        return ResponseEntity.ok(ApiResponse.ok(receipt));
    }
}
