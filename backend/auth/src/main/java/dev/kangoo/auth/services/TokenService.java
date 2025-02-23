package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.AuthResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface TokenService {

    AuthResponse generateToken(UserDetails userDetails);

}
