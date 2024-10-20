package dev.kangoo.service;

import dev.kangoo.exceptions.ProductNotFoundException;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.mappers.ProductMapper;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class ProductsService {

    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
        this.productMapper = ProductMapper.INSTANCE;
    }

    public Mono<ProductResponse> addProduct(ProductRequest productRequest) {
        ProductEntity entity = this.productMapper.mapToEntity(productRequest);
        Mono<ProductEntity> savedProduct = this.productsRepository.save(entity);

        return savedProduct.map(this.productMapper::mapToResponse);
    }

    public Flux<ProductResponse> findAll() {
        return this.productsRepository.findAll().limitRate(50).map(this.productMapper::mapToResponse);
    }

    @Caching(evict = {@CacheEvict("totalProducts")})
    public Mono<Void> deleteProductById(ObjectId productId) {
        return this.productsRepository.findById(productId)
                .switchIfEmpty(Mono.error(new ProductNotFoundException("Product not found with id: " + productId)))
                .flatMap(existingProduct -> this.productsRepository.deleteById(productId));
    }

    public Mono<ProductResponse> findOneById(ObjectId id) {
        return this.productsRepository.findById(id)
                .switchIfEmpty(Mono.error(new ProductNotFoundException("Product not found with id: " + id)))
                .map(productMapper::mapToResponse);
    }

    public Mono<ProductResponse> updateOne(ObjectId id, ProductRequest productRequest) {
        return this.productsRepository.findById(id)
                .switchIfEmpty(Mono.error(new ProductNotFoundException("Product not found with id: " + id)))
                .flatMap(existingProduct -> {
                    ProductEntity updatedEntity = productMapper.mapToEntity(productRequest);
                    updatedEntity.setId(existingProduct.getId());
                    return productsRepository.save(updatedEntity);
                })
                .map(productMapper::mapToResponse);
    }
}
