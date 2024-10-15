package dev.kangoo.repository;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductResponse;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductsRepository extends MongoRepository<ProductEntity, ObjectId> {

}
