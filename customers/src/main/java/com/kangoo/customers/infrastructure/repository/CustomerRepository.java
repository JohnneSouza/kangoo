package com.kangoo.customers.infrastructure.repository;

import com.kangoo.customers.domain.CustomerEntity;
import org.bson.types.ObjectId;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface CustomerRepository extends ReactiveCrudRepository<CustomerEntity, ObjectId> {

}
