package dev.kangoo.service;

import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
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

    public Flux<ProductEntity> getAllProducts(Pageable pageable) {
        return this.productsRepository.findAllBy(pageable);
    }

    public Mono<Long> countTotalProducts() {
        return this.productsRepository.count();
    }

    public Mono<Void> deleteProductById(ObjectId productId) {
        return this.productsRepository.deleteById(productId);
    }
}
