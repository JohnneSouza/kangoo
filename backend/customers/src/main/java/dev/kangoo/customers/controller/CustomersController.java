package dev.kangoo.customers.controller;

import dev.kangoo.customers.domain.Customer;
import dev.kangoo.customers.domain.dto.AuthResponseDTO;
import dev.kangoo.customers.domain.dto.CustomerLoginDTO;
import dev.kangoo.customers.domain.dto.CustomerProfileDTO;
import dev.kangoo.customers.domain.dto.CustomerSignupDTO;
import dev.kangoo.customers.service.CustomersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@Tag(name = "Customer Management")
@RestController
@RequestMapping(value = "customers",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class CustomersController {

    private final CustomersService customersService;

    public CustomersController(CustomersService customersService) {
        this.customersService = customersService;
    }

    @PostMapping
    public ResponseEntity<Mono<Customer>> signup(@RequestBody CustomerSignupDTO customer) {
        return new ResponseEntity<>(this.customersService.signup(customer), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<CustomerProfileDTO>> updateCustomer(@RequestBody CustomerSignupDTO customerSignupDTO,
                                                                   @PathVariable String id) {
        return new ResponseEntity<>(this.customersService.update(id, customerSignupDTO));
    }

    @PostMapping("/authenticate")
    public Mono<AuthResponseDTO> login(@RequestBody CustomerLoginDTO login) {
        return this.customersService.login(login.getUsername(), login.getPassword());
    }


}
