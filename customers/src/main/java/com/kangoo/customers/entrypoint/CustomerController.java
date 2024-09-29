package com.kangoo.customers.entrypoint;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import com.kangoo.customers.usecases.CustomersUseCase;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;


@Controller
public class CustomerController {

    private final CustomersUseCase customersUseCase;

    public CustomerController(CustomersUseCase customersUseCase) {
        this.customersUseCase = customersUseCase;
    }

    @QueryMapping
    public Mono<CustomerDTO> findById(@Argument String id){
        return this.customersUseCase.findBydId(id);
    }

}
