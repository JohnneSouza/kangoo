package dev.kangoo.service;

import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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

    @Cacheable("totalProducts")
    public Mono<Long> countTotalProducts() {
        return this.productsRepository.count();
    }

    @Caching(evict = {@CacheEvict("totalProducts")})
    public Mono<Void> deleteProductById(ObjectId productId) {
        return this.productsRepository.deleteById(productId);
    }

    public Mono<ProductEntity> findOneById(ObjectId id) {
        return this.productsRepository.findById(id).flatMap(productEntity ->
                productEntity != null ?
                        Mono.just(productEntity) : Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    public Mono<ProductEntity> updateOne(ObjectId id, Product product) {
        return this.findOneById(id).flatMap(existingProduct -> {
            existingProduct.setName(product.getName().isBlank() ? existingProduct.getName() : product.getName());
            existingProduct.setPrice(product.getPrice() != null ? existingProduct.getPrice() : product.getPrice());
            existingProduct.setCategory(product.getCategory().isBlank() ? existingProduct.getCategory() : product.getCategory());
            existingProduct.setDescription(product.getDescription().isBlank() ? existingProduct.getDescription() : product.getDescription());
            existingProduct.setImageUrl(product.getImageUrl().isBlank() ? existingProduct.getImageUrl() : product.getImageUrl());

            return this.productsRepository.save(existingProduct);
        });
    }
}
