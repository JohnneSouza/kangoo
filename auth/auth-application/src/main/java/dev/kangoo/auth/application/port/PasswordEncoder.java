package dev.kangoo.auth.application.port;

import dev.kangoo.auth.domain.model.user.Password;

public interface PasswordEncoder {

    Password encode(String password);

}
