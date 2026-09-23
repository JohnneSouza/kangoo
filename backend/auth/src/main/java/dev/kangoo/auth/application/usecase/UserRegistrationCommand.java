package dev.kangoo.auth.application.usecase;

public record UserRegistrationCommand(String firstName, String lastName, String email, String phone, String password) {
}
