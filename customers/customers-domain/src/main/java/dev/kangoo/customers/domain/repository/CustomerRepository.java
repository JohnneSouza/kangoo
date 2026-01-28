package dev.kangoo.customers.domain.repository;

import dev.kangoo.customers.domain.model.Customer;

public interface CustomerRepository {

    boolean existsByCustomerId(String customerId);

    void save(Customer customer);
}