package dev.kangoo.mappers;

import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import org.junit.jupiter.api.Test;

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

}