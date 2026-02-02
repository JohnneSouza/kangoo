package dev.kangoo.customer.application.service;

import dev.kangoo.customer.application.usecase.CreateCustomerCommand;
import dev.kangoo.customer.application.usecase.CreateCustomerUseCase;
import dev.kangoo.customer.domain.exception.CustomerAlreadyExistsException;
import dev.kangoo.customer.domain.model.Customer;
import dev.kangoo.customer.domain.repository.CustomerRepository;

public class CreateCustomerService implements CreateCustomerUseCase {

    private final CustomerRepository customerRepository;

    public CreateCustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void execute(CreateCustomerCommand command) {
        if (this.customerRepository.existsByCustomerId(command.customerId())) {
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