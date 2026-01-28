package dev.kangoo.customers.domain.repository;

import dev.kangoo.customers.domain.model.Customer;

import java.util.Optional;

public interface CustomerRepository {

    boolean existsByCustomerId(String customerId);

    void save(Customer customer);

    Optional<Customer> findByCustomerId(String customerId);
}