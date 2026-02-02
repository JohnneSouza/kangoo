package dev.kangoo.auth.application.port;

import dev.kangoo.auth.domain.user.User;

public interface UserAuthenticator {
    User authenticate(String email, String password);
}
