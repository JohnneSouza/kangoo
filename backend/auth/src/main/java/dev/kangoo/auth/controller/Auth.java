package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

public interface Auth {

    @PostMapping("login")
    @ResponseStatus(HttpStatus.OK)
    AuthResponse login(@RequestBody AuthRequest authRequest);

    @PostMapping("signup")
    @ResponseStatus(HttpStatus.CREATED)
    CustomerResponse signup(@RequestBody CustomerRequest customerRequest);

    @GetMapping("activation/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void activeCustomerAccount(@PathVariable String code);

}
