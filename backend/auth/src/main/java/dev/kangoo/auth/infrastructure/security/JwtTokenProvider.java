package dev.kangoo.auth.infrastructure.security;

import dev.kangoo.auth.application.port.TokenIssuer;
import dev.kangoo.auth.application.view.AuthenticationView;
import dev.kangoo.auth.domain.user.User;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Signs access tokens with the key material from {@link JwtProperties}. Signing goes through the
 * {@link JwtEncoder} that also backs the JWKS document, so the key published at
 * {@code /.well-known/jwks.json} is by construction the key that signs.
 */
@Component
public class JwtTokenProvider implements TokenIssuer {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwtProperties;

    public JwtTokenProvider(JwtEncoder jwtEncoder, JwtProperties jwtProperties) {
        this.jwtEncoder = jwtEncoder;
        this.jwtProperties = jwtProperties;
    }

    @Override
    public AuthenticationView issueToken(User user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(this.jwtProperties.expiration());

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(user.getCustomerId().value())
                .issuedAt(now)
                .expiresAt(expiresAt)
                .claim("email", user.getEmail().value())
                .build();

        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256)
                .keyId(this.jwtProperties.keyId())
                .build();

        String token = this.jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        return new AuthenticationView(token, "Bearer", String.valueOf(this.jwtProperties.expiration().toSeconds()));
    }
}
