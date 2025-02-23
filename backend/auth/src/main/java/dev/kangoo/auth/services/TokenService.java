package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;

public interface TokenService {

    AuthResponse generateToken(AuthRequest authRequest);

}
