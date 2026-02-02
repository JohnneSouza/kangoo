package dev.kangoo.auth.adapter.web.auth;


import dev.kangoo.auth.adapter.web.auth.dto.AuthenticationRequest;
import dev.kangoo.auth.application.view.AuthenticationView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "Authorization")
@RequestMapping(
        value = "/v1/auth",
        produces = MediaType.APPLICATION_JSON_VALUE)
public interface AuthAPI {

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Void> authenticate(@RequestBody @Valid AuthenticationRequest request);

    @GetMapping(value = "/activate")
    @ResponseStatus(HttpStatus.FOUND)
    ResponseEntity<Void> activate(@RequestParam(name = "token") String token);

}
