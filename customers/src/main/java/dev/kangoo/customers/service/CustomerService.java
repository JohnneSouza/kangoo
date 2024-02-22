package dev.kangoo.customers.service;

import dev.kangoo.customers.domain.entity.CustomerEntity;
import dev.kangoo.customers.domain.entity.CustomerEntityBuilder;
import dev.kangoo.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.customers.domain.request.CustomerRequest;
import dev.kangoo.customers.domain.response.CustomerResponse;
import dev.kangoo.customers.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CustomerResponse saveCustomer(CustomerRequest customerRequest) {
        boolean customerAlreadyExists = this.customerRepository.existsByEmail(customerRequest.getEmail());

        if (customerAlreadyExists) throw new CustomerAlreadyExistsException(customerRequest.getEmail());

        CustomerEntity entity = CustomerEntityBuilder.fromCustomerRequest(customerRequest);
        entity.setPasswordHash(this.passwordEncoder.encode(customerRequest.getPassword()));
        CustomerEntity saved = this.customerRepository.save(entity);

        return CustomerEntityBuilder.toCustomerResponse(saved);
    }
}
