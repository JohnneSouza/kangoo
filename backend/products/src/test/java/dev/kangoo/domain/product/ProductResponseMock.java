package dev.kangoo.domain.product;

import org.bson.types.ObjectId;

import java.math.BigDecimal;

public abstract class ProductResponseMock {

    public static ProductResponse withAllFields(){
        ProductResponse productResponse = new ProductResponse();
        productResponse.setCategory("Category");
        productResponse.setDescription("Description");
        productResponse.setId(new ObjectId("67132778768126096669c5c3"));
        productResponse.setName("Name");
        productResponse.setPrice(BigDecimal.valueOf(555));
        productResponse.setImageUrl("https://example.com/images/awesome-product.jpg");

        return productResponse;
    }

}