package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;
import dev.kangoo.auth.domain.User;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthenticationService {

//    private final PasswordEncoder passwordEncoder;
//
//    private final UserService userService;
//
//    public AuthenticationService(PasswordEncoder pwdEncoder, UserService userService) {
//        this.passwordEncoder = pwdEncoder;
//        this.userService = userService;
//    }
//
//    public AuthResponse login(AuthRequest authRequest) {
//        User user = this.userService.findByUsername(authRequest.getUsername());
//
//        if (user == null || !passwordEncoder.matches(authRequest.getPassword(), user.getPassword()))
//
//
//
//    }
}
