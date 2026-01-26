package dev.kangoo.auth.controllers.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "User registration response")
public final class UserRegistrationResponse {

    @Schema(description = "Unique customer identifier", example = "cust123")
    private String customerId;

    @Schema(description = "User's email address", example = "john.doe@example.com")
    private String email;

}
