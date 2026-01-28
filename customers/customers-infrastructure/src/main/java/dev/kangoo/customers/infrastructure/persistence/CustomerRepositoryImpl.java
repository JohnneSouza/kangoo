package dev.kangoo.customers.infrastructure.persistence;

import dev.kangoo.customers.domain.model.Customer;
import dev.kangoo.customers.domain.repository.CustomerRepository;
import dev.kangoo.customers.infrastructure.persistence.entity.CustomerEntity;
import dev.kangoo.customers.infrastructure.persistence.mapper.CustomerPersistenceMapper;
import dev.kangoo.customers.infrastructure.persistence.repository.JpaCustomerRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class CustomerRepositoryImpl implements CustomerRepository {

    private final JpaCustomerRepository customerRepository;
    private final CustomerPersistenceMapper mapper;

    public CustomerRepositoryImpl(JpaCustomerRepository customerRepository, CustomerPersistenceMapper mapper) {
        this.customerRepository = customerRepository;
        this.mapper = mapper;
    }

    @Override
    public boolean existsByCustomerId(String customerId) {
        return false;
    }

    @Override
    public void save(Customer customer) {
        CustomerEntity entity = this.mapper.toEntity(customer);
        this.customerRepository.save(entity);
    }

    @Override
    public Optional<Customer> findByCustomerId(String customerId) {
        return this.customerRepository.findByCustomerId(customerId).map(this.mapper::toDomain);
    }
}
