package dev.kangoo.repository;

import dev.kangoo.domain.product.ProductEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface ProductsRepository extends MongoRepository<ProductEntity, ObjectId> {

}
