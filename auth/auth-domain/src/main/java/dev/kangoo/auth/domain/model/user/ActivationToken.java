package dev.kangoo.auth.domain.model.user;

import java.time.LocalDateTime;

public record ActivationToken(CustomerId customerId, TokenValue token, LocalDateTime expiresAt) {
    private ActivationToken(CustomerId customerId) {
        this(customerId, TokenValue.generate(), LocalDateTime.now().plusHours(1));
    }

    public static ActivationToken generateActivationToken(CustomerId customerId) {
        return new ActivationToken(customerId);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
