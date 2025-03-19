package dev.kangoo.auth.controller;

import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.services.CustomersService;
import dev.kangoo.auth.services.authentication.AuthenticationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class AuthController implements Auth {

    private final AuthenticationService authenticationService;
    private final CustomersService customersService;

    public AuthController(AuthenticationService authenticationService, CustomersService customersService) {
        this.authenticationService = authenticationService;
        this.customersService = customersService;
    }

    public AuthResponse login(AuthRequest authRequest) {
        return this.authenticationService.generateToken(authRequest);
    }

    public CustomerResponse signup(CustomerRequest customerRequest) {
        return this.customersService.customerSignUp(customerRequest);
    }

    public void activeCustomerAccount(String code) {
        this.customersService.activateAccount(code);
    }

}
