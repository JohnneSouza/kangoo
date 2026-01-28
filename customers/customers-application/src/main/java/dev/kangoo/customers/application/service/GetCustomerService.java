package dev.kangoo.customers.application.service;

import dev.kangoo.customers.application.exception.CustomerNotFoundException;
import dev.kangoo.customers.application.usecase.GetCustomerUseCase;
import dev.kangoo.customers.application.view.CustomerView;
import dev.kangoo.customers.domain.repository.CustomerRepository;

public class GetCustomerService implements GetCustomerUseCase {

    private final CustomerRepository repository;

    public GetCustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public CustomerView getById(String customerId) {
        var customer = this.repository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new CustomerNotFoundException(String.format("Customer with id %s not found", customerId)));

        return new CustomerView(
                customer.getCustomerId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPhone()
        );
    }
}