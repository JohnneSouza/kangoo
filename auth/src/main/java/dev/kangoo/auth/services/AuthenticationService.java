package dev.kangoo.auth.services;

import dev.kangoo.auth.controllers.dto.AuthenticationRequest;
import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 UserRepository userRepository,
                                 TokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        if (authentication.isAuthenticated()){
            User user = this.userRepository.findByEmail(new Email(request.getEmail()));
            return this.tokenProvider.generateToken(user);
        }
        return null;
    }
}
