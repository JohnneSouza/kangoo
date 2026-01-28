package dev.kangoo.customers.domain.repositories;

import dev.kangoo.customers.domain.models.Customer;

public interface CustomerRepository {

    boolean existsByCustomerId(String customerId);

    void save(Customer customer);
}