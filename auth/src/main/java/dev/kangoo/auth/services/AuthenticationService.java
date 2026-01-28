package dev.kangoo.auth.services;

import dev.kangoo.auth.controllers.dto.AuthenticationRequest;
import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import dev.kangoo.auth.exceptions.InvalidCredentialsException;
import dev.kangoo.auth.model.user.SecurityUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 TokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            Authentication authentication = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
            log.info("User authenticated successfully: {}", securityUser.getUsername());

            return this.tokenProvider.generateToken(securityUser.user());

        } catch (AuthenticationException ex) {
            // TODO: Mask email on a logger level.
            log.warn("Authentication failed for user: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
}
