package dev.kangoo.auth.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Addresses the activation flow hands back to the browser and the user's inbox. Both used to be
 * hardcoded to localhost, which made every non-local deployment send unusable links.
 *
 * @param baseUrl            public base URL of this service, used to build the activation link
 *                           in the email, e.g. {@code https://auth.kangoo.dev}
 * @param successRedirectUrl where the browser lands after a successful activation
 */
@ConfigurationProperties(prefix = "kangoo.activation")
public record ActivationProperties(String baseUrl, String successRedirectUrl) {

    public String activationUrl(String token) {
        return "%s/v1/auth/activate?token=%s".formatted(trimTrailingSlash(baseUrl), token);
    }

    private static String trimTrailingSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

}
