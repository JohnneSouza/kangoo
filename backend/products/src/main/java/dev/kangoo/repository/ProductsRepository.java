package dev.kangoo.repository;

import dev.kangoo.domain.product.ProductEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsRepository extends ReactiveMongoRepository<ProductEntity, ObjectId> {

}
