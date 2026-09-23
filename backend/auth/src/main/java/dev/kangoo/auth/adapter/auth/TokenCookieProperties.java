package dev.kangoo.auth.adapter.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Shape of the {@code token} cookie set on login.
 *
 * @param secure   marks the cookie Secure. Must be {@code true} anywhere the service is served
 *                 over HTTPS; it stays configurable because local development runs over plain
 *                 HTTP, where a Secure cookie would never be sent back.
 * @param sameSite SameSite policy for the cookie
 */
@ConfigurationProperties(prefix = "kangoo.auth.cookie")
public record TokenCookieProperties(boolean secure, String sameSite) {
}
