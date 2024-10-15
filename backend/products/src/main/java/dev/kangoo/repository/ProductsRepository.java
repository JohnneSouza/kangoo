package dev.kangoo.repository;

import dev.kangoo.domain.product.ProductResponseEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductsRepository extends MongoRepository<ProductResponseEntity, ObjectId> {

}
