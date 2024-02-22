package dev.kangoo.customers.controller;

import dev.kangoo.customers.domain.request.CustomerRequest;
import dev.kangoo.customers.domain.response.CustomerResponse;
import dev.kangoo.customers.service.CustomerService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomersController implements CustomerOperations {

    private final CustomerService customerService;

    public CustomersController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        return this.customerService.saveCustomer(customerRequest);
    }
}
