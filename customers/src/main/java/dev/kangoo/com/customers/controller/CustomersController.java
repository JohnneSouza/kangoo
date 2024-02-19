package dev.kangoo.com.customers.controller;

import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import dev.kangoo.com.customers.service.CustomerService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomersController implements Customer {

    private final CustomerService customerService;

    public CustomersController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        return this.customerService.saveCustomer(customerRequest);
    }
}
