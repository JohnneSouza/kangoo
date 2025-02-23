package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;
import dev.kangoo.auth.services.TokenService;
import org.apache.juli.logging.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class LoginController implements Login {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public LoginController(TokenService tokenService, AuthenticationManager authenticationManager) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        boolean authenticated = auth.isAuthenticated();

        if (authenticated) {
            return tokenService.generateToken((authRequest));
        }
        throw new BadCredentialsException("Invalid username or password");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok().build();
    }

}
