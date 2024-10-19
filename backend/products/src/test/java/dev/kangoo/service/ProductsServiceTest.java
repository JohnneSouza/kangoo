package dev.kangoo.service;

import dev.kangoo.exceptions.ProductNotFoundException;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.mappers.ProductMapper;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class ProductsServiceTest {

    @Mock
    private ProductsRepository productsRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductsService productsService;

    @Test
    void shouldDeleteProductById() {
        // Given
        ObjectId productId = new ObjectId();
        Mockito.when(productsRepository.findById(productId)).thenReturn(Mono.just(new ProductEntity()));
        Mockito.when(productsRepository.deleteById(productId)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = productsService.deleteProductById(productId);

        // Then
        StepVerifier.create(result)
                .expectComplete()
                .verify();

        Mockito.verify(productsRepository).deleteById(productId);
    }

    @Test
    void shouldThrowExceptionWhenProductNotFoundForDeletion() {
        // Given
        ObjectId productId = new ObjectId();
        Mockito.when(productsRepository.findById(productId)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = productsService.deleteProductById(productId);

        // Then
        StepVerifier.create(result)
                .expectError(ProductNotFoundException.class)
                .verify();
    }

    @Test
    void shouldThrowExceptionWhenProductNotFoundForUpdate() {
        // Given
        ObjectId productId = new ObjectId();
        ProductRequest productRequest = new ProductRequest();

        Mockito.when(productsRepository.findById(productId)).thenReturn(Mono.empty());

        // When
        Mono<ProductResponse> result = productsService.updateOne(productId, productRequest);

        // Then
        StepVerifier.create(result)
                .expectError(ProductNotFoundException.class)
                .verify();
    }
}
