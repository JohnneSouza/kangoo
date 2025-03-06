package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

public interface Login {

    @ResponseStatus(HttpStatus.OK)
    AuthResponse login(@RequestBody AuthRequest authRequest);

    @ResponseStatus(HttpStatus.CREATED)
    CustomerResponse signup(@RequestBody CustomerRequest customerRequest);

}
