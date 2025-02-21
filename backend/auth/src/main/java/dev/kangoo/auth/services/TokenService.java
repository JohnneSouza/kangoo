package dev.kangoo.auth.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import dev.kangoo.auth.domain.User;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

    private static final String SECRET = "MY_DUMMY_SECRET";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);

    public String generateToken(User user) {
        return JWT.create()
                .withIssuer("kangoo-auth-service")
                .withSubject(user.getLogin())
                .withExpiresAt(this.generateExpiration())
                .sign(ALGORITHM);
    }

    public String validateToken(String token) {
        return JWT.require(ALGORITHM)
                .withIssuer("kangoo-auth-service")
                .build()
                .verify(token)
                .getSubject();
    }

    private Instant generateExpiration(){
        return Instant.now().plusSeconds(60*60*2);
    }

}
