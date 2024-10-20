package dev.kangoo.domain.product;

import org.bson.types.ObjectId;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public abstract class ProductEntityMock {

    public static ProductEntity withAllFields(){
        ProductEntity productEntity = new ProductEntity();
        productEntity.setImageUrl("https://example.com/images/awesome-product.jpg");
        productEntity.setName("Name");
        productEntity.setDescription("Description");
        productEntity.setActive(true);
        productEntity.setId(new ObjectId());
        productEntity.setCreatedDate(LocalDateTime.now());
        productEntity.setLastModifiedDate(LocalDateTime.now());
        productEntity.setCategory("Category");
        productEntity.setPrice(BigDecimal.valueOf(555));

        return productEntity;
    }

}