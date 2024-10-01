package com.kangoo.customers.infrastructure.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtils {

    private static final int BCRYPT_STRENGTH = 10;
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    private final String pepper;

    public PasswordUtils(String pepper) {
        this.pepper = pepper;
    }

    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword.concat(pepper));
    }

    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword.concat(pepper), hashedPassword);
    }

    public String generateSalt() {
        byte[] salt = new byte[16];
        getSecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private static SecureRandom getSecureRandom() {
        try {
            return SecureRandom.getInstanceStrong();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
