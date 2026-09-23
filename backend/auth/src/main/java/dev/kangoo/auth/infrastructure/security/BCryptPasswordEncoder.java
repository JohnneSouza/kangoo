package dev.kangoo.auth.infrastructure.security;

import dev.kangoo.auth.application.port.PasswordEncoder;
import dev.kangoo.auth.domain.user.Password;
import org.springframework.stereotype.Component;

@Component
public class BCryptPasswordEncoder implements PasswordEncoder {

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public BCryptPasswordEncoder(org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Password encode(String password) {
        return Password.fromHashed(this.passwordEncoder.encode(password));
    }
}
