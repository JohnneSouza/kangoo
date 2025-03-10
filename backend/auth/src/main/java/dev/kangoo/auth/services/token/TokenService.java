package dev.kangoo.auth.services.token;

import dev.kangoo.auth.domain.response.AuthResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface TokenService {

    AuthResponse generateToken(UserDetails userDetails);

}
