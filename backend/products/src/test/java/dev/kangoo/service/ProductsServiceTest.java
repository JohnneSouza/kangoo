package dev.kangoo.service;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductEntityMock;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductRequestMock;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.exceptions.ProductNotFoundException;
import dev.kangoo.mappers.ProductMapper;
import dev.kangoo.repository.ProductsRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ProductsServiceTest {

    @Mock
    private ProductsRepository productsRepository;

    @Spy
    private ProductMapper productMapper;

    @InjectMocks
    private ProductsService productsService;

    @Test
    void shouldDeleteProductById() {
        // Given
        ObjectId productId = new ObjectId();

        Mockito.when(this.productsRepository.findById(productId))
                .thenReturn(Mono.just(new ProductEntity()));

        Mockito.when(this.productsRepository.deleteById(productId))
                .thenReturn(Mono.empty());

        // When
        Mono<Void> result = this.productsService.deleteProductById(productId);

        // Then
        StepVerifier.create(result)
                .expectComplete()
                .verify();

        Mockito.verify(this.productsRepository).deleteById(productId);
    }

    @Test
    void shouldThrowExceptionWhenProductNotFoundForDeletion() {
        // Given
        ObjectId productId = new ObjectId();
        Mockito.when(this.productsRepository.findById(productId)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = this.productsService.deleteProductById(productId);

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

        Mockito.when(this.productsRepository.findById(productId)).thenReturn(Mono.empty());

        // When
        Mono<ProductResponse> result = this.productsService.updateOne(productId, productRequest);

        // Then
        StepVerifier.create(result)
                .expectError(ProductNotFoundException.class)
                .verify();
    }

    @Test
    void shouldAddProduct() {
        // Given
        ProductRequest productRequest = ProductRequestMock.withAllFields();

        Mockito.when(this.productsRepository.save(any(ProductEntity.class)))
                .thenReturn(Mono.just(ProductEntityMock.withAllFields()));


        // When
        Mono<ProductResponse> actual = this.productsService.addProduct(productRequest);

        // Then
        StepVerifier.create(actual)
                .assertNext(expected -> {
                    assertNotNull(expected.getId());
                })
                .expectComplete()
                .verify();

        Mockito.verify(this.productsRepository).save(any(ProductEntity.class));
    }

    @Test
    void shouldUpdateProduct(){
        // Given
        ObjectId productId = new ObjectId();
        ProductRequest productRequest = ProductRequestMock.withAllFields();

        Mockito.when(this.productsRepository.findById(productId))
                .thenReturn(Mono.just(ProductEntityMock.withAllFields()));

        Mockito.when(this.productsRepository.save(any(ProductEntity.class)))
                .thenReturn(Mono.just(ProductEntityMock.withAllFields()));

        // When
        Mono<ProductResponse> actual = this.productsService.updateOne(productId, productRequest);

        // Then
        StepVerifier.create(actual)
                .assertNext(expected -> {
                    assertNotNull(expected.getId());
                })
                .expectComplete()
                .verify();

        Mockito.verify(this.productsRepository).save(any(ProductEntity.class));
    }

    @Test
    void shouldFindProductById(){
        // Given
        ObjectId productId = new ObjectId();

        Mockito.when(this.productsRepository.findById(productId))
                .thenReturn(Mono.just(ProductEntityMock.withAllFields()));

        // When
        Mono<ProductResponse> actual = this.productsService.findOneById(productId);

        // Then
        StepVerifier.create(actual)
                .assertNext(expected -> {
                    assertNotNull(expected.getId());
                })
                .expectComplete()
                .verify();

        Mockito.verify(this.productsRepository).findById(productId);
    }

    @Test
    void shouldFindAllProducts(){
        // Given
        Mockito.when(this.productsRepository.findAll()).thenReturn(Flux.just(ProductEntityMock.withAllFields()));

        // When
        Flux<ProductResponse> actual = this.productsService.findAll();

        // Then
        StepVerifier.create(actual)
                .assertNext(expected -> {
                    assertNotNull(expected.getId());
                })
                .expectComplete()
                .verify();

        Mockito.verify(this.productsRepository).findAll();
    }
}
