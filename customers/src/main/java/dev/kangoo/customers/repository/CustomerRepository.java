package dev.kangoo.customers.repository;

import dev.kangoo.customers.domain.entity.CustomerEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerRepository extends CrudRepository<CustomerEntity, UUID> {

    boolean existsByEmail(String email);

}
