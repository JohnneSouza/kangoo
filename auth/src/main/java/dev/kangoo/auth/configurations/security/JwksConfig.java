package dev.kangoo.auth.configurations.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;


@Configuration
public class JwksConfig {

    @Bean
    RSAKey rsaKey(JwtProperties jwtProperties) {
        return new RSAKey.Builder((RSAPublicKey) jwtProperties.publicKey())
                .privateKey((RSAPrivateKey) jwtProperties.privateKey())
                .keyID(UUID.randomUUID().toString())
                .build();
    }

    @Bean
    JWKSet jwkSet(RSAKey rsaKey) {
        return new JWKSet(rsaKey);
    }

    @Bean
    JwtEncoder jwtEncoder(JWKSet jwkSet) {
        return new NimbusJwtEncoder(
                (selector, _) -> selector.select(jwkSet)
        );
    }
}