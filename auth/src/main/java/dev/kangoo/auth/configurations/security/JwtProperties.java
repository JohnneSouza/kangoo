package dev.kangoo.auth.configurations.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Duration;
import java.util.Base64;

@Configuration
public class JwtProperties {

    @Value("classpath:certs/jwt_private.pem")
    private Resource privateKeyResource;

    @Value("classpath:certs/jwt_public.pem")
    private Resource publicKeyResource;

    @Value("${security.jwt.expiration-minutes:60}")
    private long expirationMinutes;

    public PrivateKey privateKey() {
        try {
            String key = new String(privateKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String privateKeyPEM = key
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replaceAll(System.lineSeparator(), "")
                    .replace("-----END PRIVATE KEY-----", "");

            byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
            return keyFactory.generatePrivate(keySpec);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Could not load private key", e);
        }
    }

    public PublicKey publicKey() {
        try {
            String key = new String(publicKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String publicKeyPEM = key
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replaceAll(System.lineSeparator(), "")
                    .replace("-----END PUBLIC KEY-----", "");

            byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
            return keyFactory.generatePublic(keySpec);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Could not load public key", e);
        }
    }

    public Duration expiration() {
        return Duration.ofMinutes(expirationMinutes);
    }
}