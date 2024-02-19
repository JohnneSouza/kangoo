package dev.kangoo.com.customers.service;

import dev.kangoo.com.customers.domain.entity.CustomerEntity;
import dev.kangoo.com.customers.domain.entity.CustomerEntityBuilder;
import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import dev.kangoo.com.customers.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.net.PasswordAuthentication;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomerResponse saveCustomer(CustomerRequest customerRequest) {
        //TODO: Verify if the user already exists (Conflict - 409)

        CustomerEntity entity = CustomerEntityBuilder.fromCustomerRequest(customerRequest);
        //TODO: HASH the Password before persisting
        entity.setPasswordHash(customerRequest.getPassword());
        CustomerEntity saved = this.customerRepository.save(entity);

        return CustomerEntityBuilder.toCustomerResponse(saved);
    }
}
