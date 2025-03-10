package dev.kangoo.auth.controller;

import dev.kangoo.auth.services.CustomersService;
import dev.kangoo.auth.domain.request.AuthRequest;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.AuthResponse;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.services.authentication.AuthenticationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class LoginController implements Login {

    private final AuthenticationService authenticationService;
    private final CustomersService customersService;

    public LoginController(AuthenticationService authenticationService, CustomersService customersService) {
        this.authenticationService = authenticationService;
        this.customersService = customersService;
    }

    @PostMapping("login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        return this.authenticationService.generateToken(authRequest);
    }

    @PostMapping("signup")
    public CustomerResponse signup(@RequestBody CustomerRequest customerRequest) {
        return this.customersService.customerSignUp(customerRequest);
    }

    @GetMapping("activation/{code}")
    public void activeCustomerAccount(@PathVariable String code) {
        this.customersService.activateAccount(code);
    }

}
