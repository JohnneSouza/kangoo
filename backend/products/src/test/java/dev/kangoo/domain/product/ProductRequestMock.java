package dev.kangoo.domain.product;


import java.math.BigDecimal;

public abstract class ProductRequestMock {

    public static ProductRequest withAllFields(){
        ProductRequest productRequest = new ProductRequest();
        productRequest.setCategory("category");
        productRequest.setDescription("description");
        productRequest.setName("name");
        productRequest.setImageUrl("https://example.com/images/awesome-product.jpg");
        productRequest.setPrice(BigDecimal.valueOf(555));

        return productRequest;
    }
  
}