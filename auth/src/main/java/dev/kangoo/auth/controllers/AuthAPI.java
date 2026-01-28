package dev.kangoo.auth.controllers;

import dev.kangoo.auth.controllers.dto.AuthenticationRequest;
import dev.kangoo.auth.controllers.dto.AuthenticationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Authorization")
@RequestMapping(
        value = "/v1/auth",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public interface AuthAPI {

    @PostMapping("/login")
    AuthenticationResponse authenticate(@RequestBody @Valid AuthenticationRequest request);

}
