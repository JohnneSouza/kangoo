package dev.kangoo.auth.services;

import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import dev.kangoo.auth.domain.user.User;

public interface TokenProvider {

    AuthenticationResponse generateToken(User user);

}
