package dev.kangoo.auth.infrastructure.security;

import dev.kangoo.auth.application.port.TokenIssuer;
import dev.kangoo.auth.application.view.AuthenticationView;
import dev.kangoo.auth.domain.user.User;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider implements TokenIssuer {

    private final JwtProperties jwtProperties;

    public JwtTokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    @Override
    public AuthenticationView issueToken(User user) {
        Instant now = Instant.now();
        Date expiration = Date.from(now.plus(this.jwtProperties.expiration()));

        String token = Jwts.builder()
                .subject(user.getCustomerId().value())
                .issuedAt(Date.from(now))
                .expiration(expiration)
                .claim("email", user.getEmail().value())
                .signWith(this.jwtProperties.privateKey(), Jwts.SIG.RS256)
                .compact();

        long expirationInSeconds = this.jwtProperties.expiration().toSeconds();
        return new AuthenticationView(token, "Bearer", String.valueOf(expirationInSeconds));
    }
}
