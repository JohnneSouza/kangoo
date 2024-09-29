package com.kangoo.customers.usecases;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import reactor.core.publisher.Mono;

public interface CustomersOperations {

    Mono<CustomerDTO> findById(String id);

}
