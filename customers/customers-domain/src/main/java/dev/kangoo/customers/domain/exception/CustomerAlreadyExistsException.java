package dev.kangoo.customers.domain.exception;

public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(String customerId) {
        super("Customer already exists: " + customerId);
    }
}