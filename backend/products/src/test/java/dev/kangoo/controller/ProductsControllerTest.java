package dev.kangoo.controller;

import dev.kangoo.domain.dto.ErrorResponse;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductRequestMock;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.domain.product.ProductResponseMock;
import dev.kangoo.exceptions.ProductNotFoundException;
import dev.kangoo.service.ProductsService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;


@ExtendWith({SpringExtension.class, MockitoExtension.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductsControllerTest {

    @MockBean
    private ProductsService productsService;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void shouldSaveProduct(){
        // Given
        ProductResponse expected = ProductResponseMock.withAllFields();
        ProductRequest productRequest = ProductRequestMock.withAllFields();

        Mockito.when(this.productsService.addProduct(any(ProductRequest.class))).thenReturn(Mono.just(expected));

        // When
        EntityExchangeResult<ProductResponse> result = this.webTestClient
                .post().uri("/products")
                .bodyValue(productRequest)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(ProductResponse.class).returnResult();

        // Then
        ProductResponse actual = result.getResponseBody();
        assert actual != null;

        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getPrice(), actual.getPrice());
        assertEquals(expected.getCategory(), actual.getCategory());
        assertEquals(expected.getDescription(), actual.getDescription());
        assertEquals(expected.getImageUrl(), actual.getImageUrl());

        Mockito.verify(this.productsService).addProduct(any(ProductRequest.class));
    }

    @Test
    public void shouldUpdateProduct(){
        // Given
        ProductResponse expected = ProductResponseMock.withAllFields();
        ProductRequest productRequest = ProductRequestMock.withAllFields();

        Mockito.when(this.productsService.updateOne(any(), any(ProductRequest.class)))
                .thenReturn(Mono.just(expected));

        // When
        EntityExchangeResult<ProductResponse> result = this.webTestClient
                .put().uri("/products/{id}", expected.getId())
                .bodyValue(productRequest)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponse.class).returnResult();

        // Then
        ProductResponse actual = result.getResponseBody();
        assert actual != null;

        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getPrice(), actual.getPrice());
        assertEquals(expected.getCategory(), actual.getCategory());
        assertEquals(expected.getDescription(), actual.getDescription());
        assertEquals(expected.getImageUrl(), actual.getImageUrl());

        Mockito.verify(this.productsService).updateOne(any(), any(ProductRequest.class));
    }

    @Test
    public void shouldReturnAllProducts() {
        // Given
        ProductResponse expected = ProductResponseMock.withAllFields();
        Mockito.when(this.productsService.findAll()).thenReturn(
                Flux.fromIterable(List.of(expected)));

        // When
        EntityExchangeResult<List<ProductResponse>> result = this.webTestClient
                .get().uri("/products")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<List<ProductResponse>>() {
                }).returnResult();

        // Then
        List<ProductResponse> actual = result.getResponseBody();
        assert actual != null;

        assertEquals(expected.getId(), actual.getFirst().getId());
        assertEquals(expected.getName(), actual.getFirst().getName());
        assertEquals(expected.getPrice(), actual.getFirst().getPrice());
        assertEquals(expected.getCategory(), actual.getFirst().getCategory());
        assertEquals(expected.getDescription(), actual.getFirst().getDescription());
        assertEquals(expected.getImageUrl(), actual.getFirst().getImageUrl());

        Mockito.verify(this.productsService).findAll();
    }

    @Test
    public void shouldReturnProductById() {
        // Given
        ProductResponse expected = ProductResponseMock.withAllFields();
        Mockito.when(this.productsService.findOneById(new ObjectId(expected.getId())))
                .thenReturn(Mono.just(expected));

        // When
        EntityExchangeResult<ProductResponse> result = this.webTestClient.get().uri("/products/{id}", expected.getId())
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponse.class)
                .returnResult();

        // Then
        ProductResponse actual = result.getResponseBody();
        assert actual != null;

        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getPrice(), actual.getPrice());
        assertEquals(expected.getCategory(), actual.getCategory());
        assertEquals(expected.getDescription(), actual.getDescription());
        assertEquals(expected.getImageUrl(), actual.getImageUrl());

        Mockito.verify(this.productsService).findOneById(new ObjectId(expected.getId()));
    }

    @Test
    public void shouldDeleteProduct(){
        // Given
        ObjectId id = ObjectId.get();

        // When
        EntityExchangeResult<byte[]> result = this.webTestClient.delete().uri("/products/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().is2xxSuccessful()
                .expectBody()
                .returnResult();

        // Then
        assertEquals(HttpStatus.NO_CONTENT, result.getStatus());
    }

    @Test
    public void shouldReturnErrorWhenProductNotFound(){
        // Given
        ObjectId id = new ObjectId();
        Mockito.when(this.productsService.findOneById(id))
                .thenThrow(ProductNotFoundException.class);

        // When
        EntityExchangeResult<ErrorResponse> result = this.webTestClient.get().uri("/products/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isNotFound()
                .expectBody(ErrorResponse.class)
                .returnResult();

        // Then
        ErrorResponse actual = result.getResponseBody();

        assert actual != null;
        assertNotNull(actual.getTraceId());
        assertNotNull(actual.getDetails());


        Mockito.verify(this.productsService).findOneById(any());
    }

}