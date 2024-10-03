package com.kangoo.customers.controller;

import com.kangoo.customers.domain.Customer;
import com.kangoo.customers.domain.dto.CustomerLoginDTO;
import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTO;
import com.kangoo.customers.service.CustomersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "customers",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class CustomersController {

    private final CustomersService customersService;

    public CustomersController(CustomersService customersService) {
        this.customersService = customersService;
    }

    @PostMapping
    public ResponseEntity<Mono<Customer>> signup(@RequestBody CustomerSignupDTO customer) {
        return new ResponseEntity<>(this.customersService.signup(customer), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Mono<CustomerProfileDTO>> login(@RequestBody CustomerLoginDTO login, ServerHttpResponse response) {
        return new ResponseEntity<>(this.customersService.login(login.getEmail(), login.getPassword(), response), HttpStatus.OK);
    }


}
