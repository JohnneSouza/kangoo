package dev.kangoo.auth.configurations.security;

public interface PasswordEncoder {

    String hash(String rawPassword);

    boolean matches(String rawPassword, String hashedPassword);

}
