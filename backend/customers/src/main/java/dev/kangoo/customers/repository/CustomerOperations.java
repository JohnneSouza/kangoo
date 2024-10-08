package dev.kangoo.customers.repository;

import dev.kangoo.customers.domain.entity.CustomerEntity;
import org.bson.types.ObjectId;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface CustomerOperations extends ReactiveCrudRepository<CustomerEntity, ObjectId> {

    Mono<CustomerEntity> findByEmail(String email);
}
