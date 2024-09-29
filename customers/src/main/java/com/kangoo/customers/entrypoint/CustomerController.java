package com.kangoo.customers.entrypoint;

import com.kangoo.customers.domain.graphql.CustomerDTO;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;


@Controller
public class CustomerController {

    @QueryMapping
    public Mono<CustomerDTO> findById(@Argument String id){
        return Mono.just(new CustomerDTO.Builder()
                .setId(id)
                .setEmail("email@provider.com")
                .setFirstName("First Name")
                .setLastName("Last Name")
                .build());
    }

}
