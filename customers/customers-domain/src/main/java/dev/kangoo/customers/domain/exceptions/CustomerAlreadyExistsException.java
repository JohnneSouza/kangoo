package dev.kangoo.customers.domain.exceptions;

public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(String customerId) {
        super("Customer already exists: " + customerId);
    }
}