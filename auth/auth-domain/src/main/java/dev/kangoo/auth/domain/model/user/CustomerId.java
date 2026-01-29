package dev.kangoo.auth.domain.model.user;

import java.util.UUID;

public record CustomerId(String value) {

    public CustomerId {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("CustomerId cannot be null or blank");
        }
    }

    public static CustomerId generate() {
        return new CustomerId(UUID.randomUUID().toString());
    }
}