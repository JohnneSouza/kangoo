package dev.kangoo.auth.services.authentication;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;

public interface AuthenticationService {

    AuthResponse generateToken(AuthRequest authRequest);

}
