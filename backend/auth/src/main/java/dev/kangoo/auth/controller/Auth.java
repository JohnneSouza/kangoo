package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "Customers")
public interface Auth {

    @PostMapping("login")
    @ResponseStatus(HttpStatus.OK)
    @SecurityRequirement(name = "bearerAuth")
    AuthResponse login(
            @Valid
            @NotNull
            @RequestBody
            AuthRequest authRequest);

    @PostMapping("signup")
    @ResponseStatus(HttpStatus.CREATED)
    CustomerResponse signup(
            @Valid
            @RequestBody
            CustomerRequest customerRequest);

    @GetMapping("activation/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void activeCustomerAccount(
            @PathVariable
            @Parameter(description = "Customer's activation code.", required = true)
            String code
    );

}
