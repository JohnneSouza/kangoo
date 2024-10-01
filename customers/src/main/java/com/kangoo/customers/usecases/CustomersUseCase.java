package com.kangoo.customers.usecases;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.domain.graphql.RegisterCustomerInputDTO;
import reactor.core.publisher.Mono;

public class CustomersUseCase {

    private final CustomersOperations customersOperations;

    public CustomersUseCase(CustomersOperations customersOperations) {
        this.customersOperations = customersOperations;
    }

    public Mono<CustomerDTO> registerCustomer(RegisterCustomerInputDTO registerCustomerInputDTO) {
        return this.customersOperations.createCustomer(registerCustomerInputDTO);
    }

}