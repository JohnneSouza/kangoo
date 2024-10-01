package com.kangoo.customers.entrypoint;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.domain.graphql.RegisterCustomerInputDTO;
import com.kangoo.customers.usecases.CustomersUseCase;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;


@Controller
public class CustomerController {

    private final CustomersUseCase customersUseCase;

    public CustomerController(CustomersUseCase customersUseCase) {
        this.customersUseCase = customersUseCase;
    }

    @MutationMapping
    public Mono<CustomerDTO> registerCustomer(@Argument("input") RegisterCustomerInputDTO input) {
        return this.customersUseCase.registerCustomer(input);
    }

}
