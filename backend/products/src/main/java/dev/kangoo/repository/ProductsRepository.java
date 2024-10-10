package dev.kangoo.repository;

import dev.kangoo.domain.product.ProductEntity;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProductsRepository extends ReactiveSortingRepository<ProductEntity, ObjectId> {

    Flux<ProductEntity> findAllBy(Pageable pageable);

    Mono<Long> count();

    Mono<ProductEntity> save(ProductEntity productEntity);

    Mono<Void> deleteById(ObjectId productId);
}
