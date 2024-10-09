package com.kangoo.repository;

import com.kangoo.domain.product.ProductEntity;
import org.bson.types.ObjectId;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ProductsRepository extends ReactiveCrudRepository<ProductEntity, ObjectId> {
}
