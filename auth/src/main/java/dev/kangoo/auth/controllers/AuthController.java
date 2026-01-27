package dev.kangoo.auth.controllers;

import dev.kangoo.auth.controllers.dto.AuthenticationRequest;
import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import dev.kangoo.auth.services.AuthenticationService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthAPI {

    private final AuthenticationService authService;

    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        return this.authService.authenticate(request);
    }
}
