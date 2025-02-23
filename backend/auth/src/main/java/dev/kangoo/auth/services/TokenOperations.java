package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenOperations implements TokenService {

    private static final String KANGOO_AUTH_SERVICE = "dev.kangoo";

    private final JwtEncoder jwtEncoder;

    public TokenOperations(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @Override
    public AuthResponse generateToken(AuthRequest authRequest) {
        Instant now = Instant.now();
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuer(KANGOO_AUTH_SERVICE)
                .subject(authRequest.getUsername())
                .issuedAt(now)
                .expiresAt(now.plus(2L, ChronoUnit.HOURS))
                .build();

        Jwt jwt = this.jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet));
        return new AuthResponse(jwt.getTokenValue(), jwt.getExpiresAt().toString());
    }
}
