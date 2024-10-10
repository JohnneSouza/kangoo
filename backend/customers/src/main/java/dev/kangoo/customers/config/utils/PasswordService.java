package dev.kangoo.customers.config.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordService {

    private static final int BCRYPT_STRENGTH = 10;
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    private final String pepper;

    public PasswordService(@Value("${security.pepper}") String pepper) {
        this.pepper = pepper;
    }

    public String hashPassword(String plainPassword, String salt) {
        return passwordEncoder.encode(salt.concat(plainPassword).concat(pepper));
    }

    public boolean isPasswordValid(String plainPassword, String salt, String hashedPassword) {
        return passwordEncoder.matches(salt.concat(plainPassword).concat(pepper), hashedPassword);
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

