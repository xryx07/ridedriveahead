package com.ridedriveahead.driver.repository;

import com.ridedriveahead.common.model.enums.KycDocType;
import com.ridedriveahead.driver.model.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocument, UUID> {
    List<KycDocument> findByDriverId(UUID driverId);
    Optional<KycDocument> findByDriverIdAndDocumentType(UUID driverId, KycDocType documentType);
}
