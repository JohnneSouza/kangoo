package dev.kangoo.auth.domain.model.user;

import java.util.UUID;

public record TokenValue(String value) {
    public TokenValue {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Token cannot be empty");
        }
    }

    public static TokenValue generate() {
        return new TokenValue(UUID.randomUUID().toString());
    }
}
