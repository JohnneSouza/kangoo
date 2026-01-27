package dev.kangoo.auth.services;

import dev.kangoo.auth.configurations.security.JwtProperties;
import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import dev.kangoo.auth.domain.user.User;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class JwtTokenService implements TokenProvider {

    private final JwtProperties config;

    public JwtTokenService(JwtProperties config) {
        this.config = config;
    }

    public AuthenticationResponse generateToken(User user) {
        Instant now = Instant.now();
        Date expiration = Date.from(now.plus(this.config.expiration()));

        String token = Jwts.builder()
                .subject(user.getEmail().value())
                .issuedAt(Date.from(now))
                .expiration(expiration)
                .claim("uid", user.getCustomerId().value())
                .signWith(this.config.privateKey(), Jwts.SIG.RS256)
                .compact();

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setExpiresIn(String.valueOf(this.config.expiration().toSeconds()));
        return response;
    }

}
