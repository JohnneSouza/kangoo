package dev.kangoo.com.customers.controller;

import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@RequestMapping("customers")
public interface Customer {

    @GetMapping
    @ResponseStatus(HttpStatus.CREATED)
    CustomerResponse createCustomer(CustomerRequest customerRequest);

}
