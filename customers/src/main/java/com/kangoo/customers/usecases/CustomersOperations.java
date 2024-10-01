package com.kangoo.customers.usecases;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.domain.graphql.RegisterCustomerInputDTO;
import reactor.core.publisher.Mono;

public interface CustomersOperations {

    Mono<CustomerDTO> createCustomer(RegisterCustomerInputDTO customerDTO);

}
