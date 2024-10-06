package com.kangoo.customers.converters;

import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTOMock;
import com.kangoo.customers.domain.entity.CustomerEntity;
import com.kangoo.customers.domain.entity.CustomerEntityMock;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class CustomerConverterTest {

    private final Converter customerConverter = new CustomerConverter();

    @Test
    void convertToDto() {
        // Arrange
        CustomerEntity entity = CustomerEntityMock.withAllFields();

        // Act
        CustomerProfileDTO dto = this.customerConverter.convertToDto(entity);

        // Assert
        assertEquals(entity.getId().toString(), dto.getId());
        assertEquals(entity.getFirstName(), dto.getFirstName());
        assertEquals(entity.getLastName(), dto.getLastName());
        assertEquals(entity.getEmail(), dto.getEmail());
        assertEquals(entity.getPhone(), dto.getPhone());
    }

    @Test
    void convertToEntity() {
        // Arrange
        CustomerSignupDTO dto = CustomerSignupDTOMock.withAllFields();

        // Act
        CustomerEntity entity = this.customerConverter.convertToEntity(dto);

        // Assert
        assertNull(entity.getId());
        assertEquals(dto.getFirstName(), entity.getFirstName());
        assertEquals(dto.getLastName(), entity.getLastName());
        assertEquals(dto.getEmail(), entity.getEmail());
        assertEquals(dto.getPhone(), entity.getPhone());
        assertEquals(dto.getPassword(), entity.getPassword());
    }
}