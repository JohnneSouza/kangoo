package com.kangoo.customers.infrastructure.repository;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.usecases.CustomersOperations;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public class CustomersRepository implements CustomersOperations {

    @Override
    public Mono<CustomerDTO> findById(String id) {
        return Mono.just(new CustomerDTO.Builder()
                .setId(id)
                .setEmail("email@provider.com")
                .setFirstName("First Name")
                .setLastName("Last Name")
                .build());
    }
}
