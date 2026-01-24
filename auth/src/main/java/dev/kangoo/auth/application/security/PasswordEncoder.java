package dev.kangoo.auth.application.security;

public interface PasswordEncoder {

    String hash(String rawPassword);

}
