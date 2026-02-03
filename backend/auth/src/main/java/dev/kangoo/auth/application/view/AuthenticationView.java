package dev.kangoo.auth.application.view;

public record AuthenticationView(String token, String tokenType, String expiresIn) {
}
