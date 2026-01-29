package dev.kangoo.auth.application.usecase;

public record AuthenticateUserCommand(String email, String password) {}