package dev.kangoo.auth.controllers;

import dev.kangoo.auth.controllers.dto.UserRegistrationRequest;
import dev.kangoo.auth.controllers.dto.UserRegistrationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "User Registration")
@RequestMapping(
        value = "/v1/auth",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public interface UserRegistrationAPI {

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User successfully registered", useReturnTypeSchema = true)
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    UserRegistrationResponse register(@RequestBody @Valid UserRegistrationRequest request);

}
