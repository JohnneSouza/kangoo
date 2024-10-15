package dev.kangoo.service;

import dev.kangoo.domain.product.ProductResponseEntity;
import dev.kangoo.repository.ProductsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class ProductsServiceTest {

    @Mock
    private ProductsRepository productsRepository;

    @InjectMocks
    private ProductsService productsService;

    @Test
    void shouldReturnAllProducts() {
        // Given
        Mockito.when(this.productsRepository.findAll()).thenReturn(new ArrayList<>());

        // When
        List<ProductResponseEntity> productsList = this.productsService.findAll();

        // Then
        assertNotNull(productsList);
    }

}