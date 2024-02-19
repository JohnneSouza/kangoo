package dev.kangoo.com.customers.service;

import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    public CustomerResponse saveCustomer(CustomerRequest customerRequest) {
        return new CustomerResponse();
    }
}
