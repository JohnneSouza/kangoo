package dev.kangoo.auth.adapter.web.auth;


import dev.kangoo.auth.adapter.web.auth.dto.AuthenticationRequest;
import dev.kangoo.auth.application.view.AuthenticationView;
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
    AuthenticationView authenticate(@RequestBody @Valid AuthenticationRequest request);

}
