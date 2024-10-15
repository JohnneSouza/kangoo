package dev.kangoo.service;

import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductEntity;
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

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    public ProductEntity addProduct(Product product) {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setName(product.getName());
        productEntity.setPrice(product.getPrice());
        productEntity.setCategory(product.getCategory());
        productEntity.setDescription(product.getDescription());
        productEntity.setImageUrl(product.getImageUrl());

        return this.productsRepository.save(productEntity);
    }

    public List<ProductEntity> findAll() {
        return this.productsRepository.findAll().stream().limit(50L).toList();
    }

    @Cacheable("totalProducts")
    public Long countTotalProducts() {
        return this.productsRepository.count();
    }

    @Caching(evict = {@CacheEvict("totalProducts")})
    public void deleteProductById(ObjectId productId) {
        this.productsRepository.deleteById(productId);
    }

    public ProductEntity findOneById(ObjectId id) {
        return this.productsRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public ProductEntity updateOne(ObjectId id, Product product) {
        ProductEntity existingProduct = this.findOneById(id);
            existingProduct.setName(product.getName().isBlank() ? existingProduct.getName() : product.getName());
            existingProduct.setPrice(product.getPrice() != null ? existingProduct.getPrice() : product.getPrice());
            existingProduct.setCategory(product.getCategory().isBlank() ? existingProduct.getCategory() : product.getCategory());
            existingProduct.setDescription(product.getDescription().isBlank() ? existingProduct.getDescription() : product.getDescription());
            existingProduct.setImageUrl(product.getImageUrl().isBlank() ? existingProduct.getImageUrl() : product.getImageUrl());

            return this.productsRepository.save(existingProduct);
    }

}
