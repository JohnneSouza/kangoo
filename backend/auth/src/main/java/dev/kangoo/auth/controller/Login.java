package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.AuthRequest;
import dev.kangoo.auth.domain.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

public interface Login {

    @ResponseStatus(HttpStatus.OK)
    AuthResponse login(@RequestBody AuthRequest authRequest);

}
