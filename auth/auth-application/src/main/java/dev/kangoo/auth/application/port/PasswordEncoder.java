package dev.kangoo.auth.application.port;

public interface PasswordEncoder {

    String encode(String password);

}
