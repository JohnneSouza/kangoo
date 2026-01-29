package dev.kangoo.auth.infrastructure.security;

import dev.kangoo.auth.application.exception.InvalidCredentialsException;
import dev.kangoo.auth.application.port.UserAuthenticator;
import dev.kangoo.auth.domain.model.user.User;
import dev.kangoo.auth.infrastructure.security.userdetails.SecurityUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class SpringAuthenticationService implements UserAuthenticator {

    private static final Logger log = LoggerFactory.getLogger(SpringAuthenticationService.class);

    private final AuthenticationManager authenticationManager;

    public SpringAuthenticationService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public User authenticate(String email, String password) {
        try {
            var authentication = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            var principal = (SecurityUser) authentication.getPrincipal();
            log.info("User authenticated successfully: {}", principal.getUsername());

            return principal.user();

        } catch (AuthenticationException ex) {
            log.warn("Authentication failed for user: {}", email);
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
}