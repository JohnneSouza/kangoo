package dev.kangoo.customers.application.service;

import dev.kangoo.customers.application.usecase.CreateCustomerCommand;
import dev.kangoo.customers.application.usecase.CreateCustomerUseCase;
import dev.kangoo.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.customers.domain.models.Customer;
import dev.kangoo.customers.domain.repositories.CustomerRepository;

public class CreateCustomerService implements CreateCustomerUseCase {

    private final CustomerRepository customerRepository;

    public CreateCustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void execute(CreateCustomerCommand command) {
        if (customerRepository.existsByCustomerId(command.customerId())) {
            throw new CustomerAlreadyExistsException(command.customerId());
        }

        var customer = new Customer(
                command.customerId(),
                command.firstName(),
                command.lastName(),
                command.phone()
        );

        this.customerRepository.save(customer);
    }
}