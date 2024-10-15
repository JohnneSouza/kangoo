package dev.kangoo.service;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.mappers.ProductMapper;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
public class ProductsService {

    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
        this.productMapper = ProductMapper.INSTANCE;
    }

    public ProductResponse addProduct(ProductRequest productRequest) {
        ProductEntity entity = this.productMapper.mapToEntity(productRequest);
        ProductEntity savedProduct = this.productsRepository.save(entity);

        return this.productMapper.mapToResponse(savedProduct);
    }

    public List<ProductResponse> findAll() {
        return this.productsRepository.findAll()
                .stream().limit(50L).map(this.productMapper::mapToResponse).toList();
    }

    @Cacheable("totalProducts")
    public Long countTotalProducts() {
        return this.productsRepository.count();
    }

    @Caching(evict = {@CacheEvict("totalProducts")})
    public void deleteProductById(ObjectId productId) {
        this.productsRepository.deleteById(productId);
    }

    public ProductResponse findOneById(ObjectId id) {
        return this.productsRepository.findById(id).map(this.productMapper::mapToResponse).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public ProductResponse updateOne(ObjectId id, ProductRequest productRequest) {
        ProductResponse existingProduct = this.findOneById(id);
        ProductEntity entity = this.productMapper.mapToEntity(existingProduct);

        ProductEntity savedProduct = this.productsRepository.save(entity);
        return this.productMapper.mapToResponse(savedProduct);
    }

}
