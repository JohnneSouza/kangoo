package dev.kangoo.auth.controller;

import dev.kangoo.auth.client.CustomerService;
import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.services.authentication.AuthenticationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class LoginController implements Login {

    private final AuthenticationService authenticationService;
    private final CustomerService customerService;

    public LoginController(AuthenticationService authenticationService, CustomerService customerService) {
        this.authenticationService = authenticationService;
        this.customerService = customerService;
    }


    @PostMapping("login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        return this.authenticationService.generateToken(authRequest);
    }

    @PostMapping("signup")
    public CustomerResponse signup(@RequestBody CustomerRequest customerRequest) {
        return this.customerService.customerSignUp(customerRequest);
    }

}
