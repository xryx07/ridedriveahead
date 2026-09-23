package com.ridedriveahead.driver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "kyc_audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "kyc_document_id", nullable = false)
    private UUID kycDocumentId;

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Column(nullable = false, length = 50)
    private String action; // e.g. "UPLOAD", "VIEW_DECRYPTED", "APPROVE", "REJECT"

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
