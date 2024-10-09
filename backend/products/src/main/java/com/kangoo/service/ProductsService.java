package com.kangoo.service;

import com.kangoo.domain.product.Product;
import com.kangoo.domain.product.ProductEntity;
import com.kangoo.repository.ProductsRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductsService {

    private final ProductsRepository productsRepository;

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    public Mono<ProductEntity> addProduct(Product product) {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setName(product.getName());
        productEntity.setPrice(product.getPrice());
        productEntity.setCategory(product.getCategory());
        productEntity.setDescription(product.getDescription());
        productEntity.setImageUrl(product.getImageUrl());

        return this.productsRepository.save(productEntity);
    }

    public Flux<ProductEntity> getAllProducts() {
        return this.productsRepository.findAll();
    }

}
