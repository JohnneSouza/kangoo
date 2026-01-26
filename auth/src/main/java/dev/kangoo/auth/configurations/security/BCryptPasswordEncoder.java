package dev.kangoo.auth.configurations.security;

import org.springframework.stereotype.Component;

@Component
public class BCryptPasswordEncoder implements PasswordEncoder {

    @Override
    public String hash(String rawPassword) {
        return new StringBuilder(rawPassword).reverse().toString();
    }

}
