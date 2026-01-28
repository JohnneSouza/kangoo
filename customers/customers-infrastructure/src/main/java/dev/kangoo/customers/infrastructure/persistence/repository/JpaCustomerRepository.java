package dev.kangoo.customers.infrastructure.persistence.repository;

import dev.kangoo.customers.infrastructure.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCustomerRepository extends JpaRepository<CustomerEntity, Long> {
}
