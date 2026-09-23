package com.ridedriveahead.common.security;

/**
 * PII Field-level Masking Utilities for sensitive compliance data.
 */
public final class PiiMaskingUtils {

    private PiiMaskingUtils() {}

    /**
     * Masks Aadhaar number (e.g. "1234 5678 9012" -> "XXXX-XXXX-9012")
     */
    public static String maskAadhaar(String aadhaar) {
        if (aadhaar == null) return null;
        String cleaned = aadhaar.replaceAll("\\s+", "");
        if (cleaned.length() < 4) return "XXXX-XXXX-XXXX";
        String lastFour = cleaned.substring(cleaned.length() - 4);
        return "XXXX-XXXX-" + lastFour;
    }

    /**
     * Masks PAN card number (e.g. "ABCDE1234F" -> "ABCDE****F")
     */
    public static String maskPan(String pan) {
        if (pan == null) return null;
        String cleaned = pan.trim().toUpperCase();
        if (cleaned.length() != 10) return "**********";
        return cleaned.substring(0, 5) + "****" + cleaned.charAt(9);
    }

    /**
     * Masks Phone number (e.g. "+919876543210" -> "+91 98****3210")
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 8) return "**********";
        int len = phone.length();
        return phone.substring(0, len - 8) + "****" + phone.substring(len - 4);
    }

    /**
     * Masks Driving License number
     */
    public static String maskLicense(String dl) {
        if (dl == null || dl.length() < 6) return "DL-*************";
        int len = dl.length();
        return dl.substring(0, 4) + "********" + dl.substring(len - 3);
    }
}
