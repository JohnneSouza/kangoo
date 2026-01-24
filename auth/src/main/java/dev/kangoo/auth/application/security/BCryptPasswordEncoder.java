package dev.kangoo.auth.application.security;

public class BCryptPasswordEncoder implements PasswordEncoder {

//    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public String hash(String rawPassword) {
        return new StringBuilder(rawPassword).reverse().toString();
    }

}
