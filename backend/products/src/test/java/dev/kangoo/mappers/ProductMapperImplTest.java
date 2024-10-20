package dev.kangoo.mappers;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductEntityMock;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductRequestMock;
import dev.kangoo.domain.product.ProductResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class ProductMapperImplTest {

    private final ProductMapper mapper = new ProductMapperImpl();

    @Test
    public void shouldReturnNullWhenMapToResponseForNullInput() {
        // Given
        ProductEntity entity = null;

        // When
        ProductResponse productResponse = this.mapper.mapToResponse(entity);

        // Then
        assertNull(productResponse);
    }

    @Test
    public void shouldReturnNullWhenMapToResponseForEmptyInput() {
        // Given
        ProductRequest request = null;

        // When
        ProductEntity entity = this.mapper.mapToEntity(request);

        // Then
        assertNull(entity);

    }

    @Test
    public void shouldMapToEntityCorrectlyWhenGivenProductRequestMock() {
        // Given
        ProductRequest request = ProductRequestMock.withAllFields();

        // When
        ProductEntity entity = this.mapper.mapToEntity(request);

        // Then
        assertNotNull(entity);
        assertEquals(request.getName(), entity.getName());
        assertEquals(request.getDescription(), entity.getDescription());
        assertEquals(request.getPrice(), entity.getPrice());
        assertEquals(request.getImageUrl(), entity.getImageUrl());
        assertEquals(request.getCategory(), entity.getCategory());
    }

    @Test
    public void shouldMapToResponseCorrectlyWhenGivenProductEntityMock() {
        // Given
        ProductEntity entity = ProductEntityMock.withAllFields();

        // When
        ProductResponse response = this.mapper.mapToResponse(entity);

        // Then
        assertNotNull(response);
        assertEquals(entity.getId().toString(), response.getId());
        assertEquals(entity.getName(), response.getName());
        assertEquals(entity.getDescription(), response.getDescription());
        assertEquals(entity.getPrice(), response.getPrice());
        assertEquals(entity.getImageUrl(), response.getImageUrl());
        assertEquals(entity.getCategory(), response.getCategory());
    }


}