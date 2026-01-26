package dev.kangoo.auth.configurations.security;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class BCryptPasswordEncoder implements PasswordEncoder {

    private static final int COST = 12;

    @Override
    public String hash(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Raw password must not be null or blank");
        }

        return BCrypt.hashpw(rawPassword, BCrypt.gensalt(COST));
    }

    @Override
    public boolean matches(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null)
            return false;

        return BCrypt.checkpw(rawPassword, hashedPassword);
    }

}
