package dev.kangoo.customers.infrastructure.persistence;

import dev.kangoo.customers.domain.models.Customer;
import dev.kangoo.customers.domain.repositories.CustomerRepository;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerRepositoryImpl implements CustomerRepository {

    @Override
    public boolean existsByCustomerId(String customerId) {
        return false;
    }

    @Override
    public void save(Customer customer) {

    }
}
