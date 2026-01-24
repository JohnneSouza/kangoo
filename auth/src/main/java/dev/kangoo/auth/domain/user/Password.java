package dev.kangoo.auth.domain.user;

public record Password(String value) {

    public Password {
        if (value == null || value.isBlank()) {
            throw new NullPointerException("Password cannot be null");
        }
    }

}
