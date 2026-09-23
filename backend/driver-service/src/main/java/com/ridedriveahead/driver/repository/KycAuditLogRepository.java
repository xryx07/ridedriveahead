package com.ridedriveahead.driver.repository;

import com.ridedriveahead.driver.model.KycAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KycAuditLogRepository extends JpaRepository<KycAuditLog, UUID> {
    List<KycAuditLog> findByKycDocumentIdOrderByCreatedAtDesc(UUID kycDocumentId);
}
