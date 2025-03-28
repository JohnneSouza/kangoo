package dev.kangoo.auth.domain.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {

    @Email
    @NotBlank(message = "The field 'email' must not be empty.")
    @Schema(description = "Customer's email.", example = "email@provider.io")
    private String email;

    @NotBlank(message = "The field 'password' must not be empty.")
    @Schema(description = "Customer's password.", example = "Password123!")
    private String password;

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
