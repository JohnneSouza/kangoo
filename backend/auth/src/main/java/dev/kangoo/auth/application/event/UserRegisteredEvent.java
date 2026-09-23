package dev.kangoo.auth.application.event;

import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.TokenValue;

/**
 * Raised once a registration has been committed, so the activation mail is only ever sent for
 * a user and token that are durably stored.
 */
public record UserRegisteredEvent(Email email, TokenValue token) {
}
