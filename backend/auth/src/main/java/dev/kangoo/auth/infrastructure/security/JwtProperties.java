package dev.kangoo.auth.infrastructure.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Duration;
import java.util.Base64;

/**
 * Signing key material, supplied from the environment — never from the classpath, so no key
 * ships inside the jar. The keys are parsed once at startup: a missing or malformed key is a
 * configuration error and stops the application from booting.
 */
@Configuration
public class JwtProperties {

    private static final String PRIVATE_KEY_HEADER = "-----BEGIN PRIVATE KEY-----";
    private static final String PRIVATE_KEY_FOOTER = "-----END PRIVATE KEY-----";
    private static final String PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
    private static final String PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";

    @Value("${security.jwt.private-key-pem:}")
    private String privateKeyPem;

    @Value("${security.jwt.public-key-pem:}")
    private String publicKeyPem;

    @Value("${security.jwt.key-id:}")
    private String configuredKeyId;

    @Value("${security.jwt.expiration-minutes:60}")
    private long expirationMinutes;

    private PrivateKey privateKey;
    private PublicKey publicKey;
    private String keyId;

    @PostConstruct
    void loadKeys() {
        this.privateKey = parsePrivateKey(require(privateKeyPem, "security.jwt.private-key-pem", "JWT_PRIVATE_KEY_PEM"));
        this.publicKey = parsePublicKey(require(publicKeyPem, "security.jwt.public-key-pem", "JWT_PUBLIC_KEY_PEM"));
        this.keyId = require(configuredKeyId, "security.jwt.key-id", "JWT_KEY_ID");
    }

    public PrivateKey privateKey() {
        return this.privateKey;
    }

    public PublicKey publicKey() {
        return this.publicKey;
    }

    /**
     * Stable identifier for the active signing key. Issued tokens carry it as the {@code kid}
     * header and the JWKS document publishes it, so verifiers pick the right key during a
     * rotation instead of falling back to whatever single key they happen to hold.
     */
    public String keyId() {
        return this.keyId;
    }

    public Duration expiration() {
        return Duration.ofMinutes(expirationMinutes);
    }

    private static String require(String value, String property, String environmentVariable) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(
                    property + " is not set. Provide it through the " + environmentVariable
                            + " environment variable.");
        }
        return value.trim();
    }

    private static PrivateKey parsePrivateKey(String pem) {
        byte[] encoded = decode(pem, PRIVATE_KEY_HEADER, PRIVATE_KEY_FOOTER, "security.jwt.private-key-pem");
        try {
            return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(encoded));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException(
                    "security.jwt.private-key-pem is not a valid PKCS#8 RSA private key.", e);
        }
    }

    private static PublicKey parsePublicKey(String pem) {
        byte[] encoded = decode(pem, PUBLIC_KEY_HEADER, PUBLIC_KEY_FOOTER, "security.jwt.public-key-pem");
        try {
            return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(encoded));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException(
                    "security.jwt.public-key-pem is not a valid X.509 RSA public key.", e);
        }
    }

    /**
     * Strips the PEM armour and decodes the payload. All whitespace is removed rather than just
     * the platform line separator, so keys survive being passed through environment variables
     * with either LF or CRLF endings.
     */
    private static byte[] decode(String pem, String header, String footer, String property) {
        if (!pem.contains(header) || !pem.contains(footer)) {
            throw new IllegalStateException(
                    property + " is not a PEM block delimited by \"" + header + "\" and \"" + footer + "\".");
        }

        String base64 = pem
                .replace(header, "")
                .replace(footer, "")
                .replaceAll("\\s", "");

        if (base64.isEmpty()) {
            throw new IllegalStateException(property + " is empty.");
        }

        try {
            return Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(property + " is not valid PEM-encoded base64.", e);
        }
    }
}
