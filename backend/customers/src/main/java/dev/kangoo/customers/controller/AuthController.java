package dev.kangoo.customers.controller;

import dev.kangoo.customers.domain.dto.CustomerLoginDTO;
import dev.kangoo.customers.domain.dto.CustomerProfileDTO;
import dev.kangoo.customers.service.CustomersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "auth",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController implements Auth {

    private final CustomersService customersService;

    public AuthController(CustomersService customersService) {
        this.customersService = customersService;
    }

    @Override
    public ResponseEntity<Mono<CustomerProfileDTO>> login(CustomerLoginDTO login, ServerHttpResponse response) {
        return new ResponseEntity<>(this.customersService.login(login.getEmail(), login.getPassword(), response), HttpStatus.OK);
    }

}
