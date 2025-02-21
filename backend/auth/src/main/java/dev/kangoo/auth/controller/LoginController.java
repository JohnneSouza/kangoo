package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.User;
import dev.kangoo.auth.domain.UserRoles;
import dev.kangoo.auth.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
public class LoginController {

    private final Map<String, User> users = new HashMap<>();
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public LoginController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody AuthRequest authRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword());
        Authentication authentication = this.authenticationManager.authenticate(usernamePassword);
        String token = this.tokenService.generateToken((User) authentication.getPrincipal());

        return Map.of("token", token);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest authRequest) {
        String encodedPass = new BCryptPasswordEncoder().encode(authRequest.getPassword());

        User user = new User();
        user.setPassword(encodedPass);
        user.setRole(UserRoles.ADMIN);
        user.setLogin(authRequest.getUsername());

        this.users.put(user.getLogin(), user);

        return ResponseEntity.ok().build();
    }

}
