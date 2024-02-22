package dev.kangoo.customers.domain.request;

import dev.kangoo.customers.domain.Customer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class CustomerRequest extends Customer {

    @Schema(description = "Customer's password", example = "My$trongP@ssw0rd987654321")
    @NotBlank(message = "The field 'password' should not be null or empty.")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
