package dev.kangoo.auth.services.authentication;

import dev.kangoo.auth.domain.model.AuthUser;
import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.services.token.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class LocalAuthenticationService implements AuthenticationService {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public LocalAuthenticationService(TokenService tokenService, AuthenticationManager authenticationManager) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse generateToken(AuthRequest authRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword());
        AuthUser userDetails = (AuthUser) this.authenticationManager.authenticate(usernamePassword).getPrincipal();

        return this.tokenService.generateToken(userDetails);
    }
}
