package dev.kangoo.customers.config.authentication;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final static String SECRET = UUID.randomUUID().toString()
            .concat(UUID.randomUUID().toString()).replace("-", "");
    private final static long EXPIRATION_TIME = 1000 * 60 * 60;

    public String createToken(String customerId) {
        return Jwts.builder()
                .subject(customerId)
                .issuer("Kangoo")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(this.getSignKey())
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
