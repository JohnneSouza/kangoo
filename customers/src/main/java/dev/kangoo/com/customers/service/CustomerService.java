package dev.kangoo.com.customers.service;

import dev.kangoo.com.customers.domain.entity.CustomerEntity;
import dev.kangoo.com.customers.domain.entity.CustomerEntityBuilder;
import dev.kangoo.com.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import dev.kangoo.com.customers.repository.CustomerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(10, new SecureRandom());
    }

    public CustomerResponse saveCustomer(CustomerRequest customerRequest) {


        boolean customerAlreadyExists = this.customerRepository.existsByEmail(customerRequest.getEmail());

        //TODO: Verify if the user already exists (Conflict - 409)
        if (customerAlreadyExists) throw new CustomerAlreadyExistsException(customerRequest.getEmail());

        CustomerEntity entity = CustomerEntityBuilder.fromCustomerRequest(customerRequest);
        entity.setPasswordHash(this.passwordEncoder.encode(customerRequest.getPassword()));
        CustomerEntity saved = this.customerRepository.save(entity);

        return CustomerEntityBuilder.toCustomerResponse(saved);
    }
}
