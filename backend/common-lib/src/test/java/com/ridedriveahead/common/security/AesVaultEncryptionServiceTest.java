package com.ridedriveahead.common.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AesVaultEncryptionServiceTest {

    private AesVaultEncryptionService vaultService;

    @BeforeEach
    void setUp() {
        vaultService = new AesVaultEncryptionService("TestMasterKeyForUnitTestingSecurityVault32Chars!");
    }

    @Test
    @DisplayName("Should encrypt and decrypt sensitive KYC document payload accurately")
    void testKycDocumentEncryptionAndDecryption() {
        String rawAadhaarPayload = "{\"aadhaarNumber\": \"548291823019\", \"holder\": \"Rajesh Kumar\", \"dob\": \"1988-04-12\"}";

        String encrypted = vaultService.encrypt(rawAadhaarPayload);
        assertNotNull(encrypted);
        assertNotEquals(rawAadhaarPayload, encrypted);

        String decrypted = vaultService.decrypt(encrypted);
        assertEquals(rawAadhaarPayload, decrypted);
    }

    @Test
    @DisplayName("Should mask Aadhaar, PAN, and Phone numbers correctly for safe display")
    void testPiiMasking() {
        assertEquals("XXXX-XXXX-3019", PiiMaskingUtils.maskAadhaar("5482 9182 3019"));
        assertEquals("XXXX-XXXX-3019", PiiMaskingUtils.maskAadhaar("548291823019"));
        assertEquals("ABCDE****F", PiiMaskingUtils.maskPan("ABCDE1234F"));
        assertEquals("+91 98****3210", PiiMaskingUtils.maskPhone("+91 9876543210"));
    }
}
