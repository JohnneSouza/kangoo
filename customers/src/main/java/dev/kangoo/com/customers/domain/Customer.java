package dev.kangoo.com.customers.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public abstract class Customer {

    @Schema(description = "Customer's first name", example = "John")
    @NotBlank(message = "The field 'firstName' should not be null or empty.")
    private String firstName;

    @Schema(description = "Customer's last name", example = "Doe")
    @NotBlank(message = "The field 'firstName' should not be null or empty.")
    private String lastName;

    @Schema(description = "Customer's email", example = "john.doe@provider.com")
    @NotBlank(message = "The field 'email' should not be null or empty.")
    private String email;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
