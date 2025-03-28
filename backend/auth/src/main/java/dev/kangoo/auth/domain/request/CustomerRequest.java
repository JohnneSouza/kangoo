package dev.kangoo.auth.domain.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class CustomerRequest {

    @NotBlank(message = "The field 'email' must not be empty.")
    @Schema(description = "Customer's email.", example = "email@provider.io")
    private String email;

    @NotBlank(message = "The field 'password' must not be empty.")
    @Schema(description = "Customer's password.", example = "Password123!")
    private String password;

    @Schema(description = "Customer's phone.", example = "12345678")
    private String phone;

    @Schema(description = "Customer's first name.", example = "John")
    private String firstName;

    @Schema(description = "Customer's first name.", example = "Doe")
    private String lastName;

    public String getEmail() {
        return email;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
