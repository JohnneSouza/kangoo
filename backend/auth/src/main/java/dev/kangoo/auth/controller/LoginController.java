package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.services.authentication.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class LoginController implements Login {

    private final AuthenticationService authenticationService;

    public LoginController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }


    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        return this.authenticationService.generateToken(authRequest);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok().build();
    }

}
