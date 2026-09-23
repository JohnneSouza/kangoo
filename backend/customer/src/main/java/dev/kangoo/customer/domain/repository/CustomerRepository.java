package dev.kangoo.customer.domain.repository;

import dev.kangoo.customer.domain.model.Customer;

import java.util.Optional;

public interface CustomerRepository {

    boolean existsByCustomerId(String customerId);

    void save(Customer customer);

    Optional<Customer> findByCustomerId(String customerId);
}