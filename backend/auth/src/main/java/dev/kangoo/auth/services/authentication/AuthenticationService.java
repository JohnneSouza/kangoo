package dev.kangoo.auth.services.authentication;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.response.AuthResponse;

public interface AuthenticationService {

    AuthResponse generateToken(AuthRequest authRequest);

}
