package com.kangoo.customers.infrastructure.service;

import com.kangoo.customers.domain.CustomerEntity;
import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.domain.graphql.RegisterCustomerInputDTO;
import com.kangoo.customers.infrastructure.repository.CustomerRepository;
import com.kangoo.customers.infrastructure.utils.PasswordUtils;
import com.kangoo.customers.usecases.CustomersOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CustomersService implements CustomersOperations {

    private final CustomerRepository customerRepository;
    private final PasswordUtils passwordUtils;

    public CustomersService(CustomerRepository customerRepository, PasswordUtils passwordUtils) {
        this.customerRepository = customerRepository;
        this.passwordUtils = passwordUtils;
    }

    @Override
    public Mono<CustomerDTO> createCustomer(RegisterCustomerInputDTO customerDTO) {
        String salt = this.passwordUtils.generateSalt();

        CustomerEntity customerEntity = new CustomerEntity();
        customerEntity.setSalt(salt);
        customerEntity.setEmail(customerDTO.getEmail());
        customerEntity.setPassword(this.passwordUtils.hashPassword(customerDTO.getPassword().concat(salt)));
        customerEntity.setFirstName(customerDTO.getFirstName());
        customerEntity.setLastName(customerDTO.getLastName());

        return this.customerRepository.save(customerEntity).map(entity -> {
            CustomerDTO dto = new CustomerDTO();
            dto.setEmail(entity.getEmail());
            dto.setFirstName(entity.getFirstName());
            dto.setLastName(entity.getLastName());
            dto.setId(entity.getId().toString());

            return dto;
        });
    }
}
