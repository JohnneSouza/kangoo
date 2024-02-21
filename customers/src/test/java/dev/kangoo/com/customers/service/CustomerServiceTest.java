package dev.kangoo.com.customers.service;

import dev.kangoo.com.customers.domain.entity.CustomerEntity;
import dev.kangoo.com.customers.domain.entity.CustomerEntityMock;
import dev.kangoo.com.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.request.CustomerRequestMock;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import dev.kangoo.com.customers.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Spy
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void givenValidRequest_whenSaveCustomer_thenReturnNewCustomer(){
        // Arrange
        ArgumentCaptor<CustomerEntity> entityArgumentCaptor = ArgumentCaptor.forClass(CustomerEntity.class);
        CustomerRequest request = CustomerRequestMock.withAllFields();

        Mockito.when(this.customerRepository.save(entityArgumentCaptor.capture()))
                .thenReturn(CustomerEntityMock.withAllFields());

        // Act
        CustomerResponse newCustomer = this.customerService.saveCustomer(request);

        // Assert
        Mockito.verify(this.customerRepository).save(entityArgumentCaptor.capture());
        CustomerEntity customerEntity = entityArgumentCaptor.getValue();

        assertNotNull(customerEntity.getPasswordHash());
        assertNotNull(newCustomer);

        assertNotEquals(customerEntity.getPasswordHash(), request.getPassword());

        Mockito.verify(this.passwordEncoder).encode(eq(request.getPassword()));
    }

    @Test
    void givenExistingUserRequest_whenSaveCustomer_thenReturnException(){
        // Arrange
        CustomerRequest request = CustomerRequestMock.withAllFields();
        String expectedEmail = request.getEmail();

        Mockito.when(this.customerRepository.existsByEmail(eq(request.getEmail())))
                        .thenReturn(true);

        // Act
        CustomerAlreadyExistsException exception = assertThrows(CustomerAlreadyExistsException.class,
                () -> this.customerService.saveCustomer(request));
        String actualEmail = exception.getMessage();

        // Assert
        assertNotNull(exception);
        assertEquals(expectedEmail, actualEmail);

        Mockito.verify(this.passwordEncoder, Mockito.never()).encode(eq(request.getPassword()));
    }

}