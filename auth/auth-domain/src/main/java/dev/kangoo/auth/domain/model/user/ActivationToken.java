package dev.kangoo.auth.domain.model.user;

import java.time.LocalDateTime;

public class ActivationToken {
    private final CustomerId customerId;
    private final TokenValue token = TokenValue.generate();
    private final LocalDateTime expiresAt =  LocalDateTime.now();

    private ActivationToken(CustomerId customerId) {
        this.customerId = customerId;
    }

    public static ActivationToken generateActivationToken(CustomerId customerId) {
        return new ActivationToken(customerId);
    }

    public CustomerId getCustomerId() {
        return this.customerId;
    }

    public TokenValue getToken() {
        return this.token;
    }

    public LocalDateTime getExpiresAt() {
        return this.expiresAt;
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
