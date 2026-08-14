package com.ceylonbatik.util;

import java.util.regex.Pattern;

/**
 * Helper for the registration form's single "Email or phone number" field.
 */
public final class ContactUtils {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");

    // Accepts digits with optional +, spaces, dashes, min 7 digits
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^[+]?[0-9\\s-]{7,15}$");

    private ContactUtils() {
    }

    public static boolean isEmail(String contact) {
        return contact != null && EMAIL_PATTERN.matcher(contact.trim()).matches();
    }

    public static boolean isPhone(String contact) {
        return contact != null && PHONE_PATTERN.matcher(contact.trim()).matches();
    }
}
