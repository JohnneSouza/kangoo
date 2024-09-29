package com.kangoo.customers.usecases;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Mono;

@AllArgsConstructor
public class CustomersUseCase {

    private CustomersOperations customersOperations;

    public Mono<CustomerDTO> findBydId(String id) {
        return this.customersOperations.findById(id);
    }
}
