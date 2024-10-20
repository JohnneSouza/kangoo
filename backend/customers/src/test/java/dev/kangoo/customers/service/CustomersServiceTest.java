package dev.kangoo.customers.service;

import dev.kangoo.customers.config.authentication.JwtService;
import dev.kangoo.customers.config.utils.PasswordService;
import dev.kangoo.customers.converters.CustomerConverter;
import dev.kangoo.customers.domain.Customer;
import dev.kangoo.customers.domain.dto.AuthResponseDTO;
import dev.kangoo.customers.domain.dto.CustomerProfileDTO;
import dev.kangoo.customers.domain.dto.CustomerSignupDTO;
import dev.kangoo.customers.domain.dto.CustomerSignupDTOMock;
import dev.kangoo.customers.domain.entity.CustomerEntity;
import dev.kangoo.customers.domain.entity.CustomerEntityMock;
import dev.kangoo.customers.repository.CustomerOperations;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class CustomersServiceTest {

    @Spy
    private CustomerConverter customerConverter;

    @Mock
    private CustomerOperations customerOperations;

    @Mock
    private PasswordService passwordService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private CustomersService customerService;

    @Test
    void signup() {
        // Arrange
        CustomerSignupDTO customer = CustomerSignupDTOMock.withAllFields();

        Mockito.when(this.customerOperations.save(any()))
                .thenReturn(Mono.just(CustomerEntityMock.withAllFields()));

        // Act
        Mono<Customer> actualResponse = this.customerService.signup(customer);

        // Assert
        StepVerifier.create(actualResponse).assertNext(response -> assertNotNull(response.getEmail())).verifyComplete();
    }

    @Test
    void login() {
        // Arrange
        CustomerEntity customerEntity = CustomerEntityMock.withAllFields();

        Mockito.when(this.customerOperations.findByEmail(customerEntity.getEmail()))
                .thenReturn(Mono.just(CustomerEntityMock.withAllFields()));
        Mockito.when(this.passwordService.isPasswordValid(eq(customerEntity.getPassword()), any(), any()))
                .thenReturn(true);
        Mockito.when(this.jwtService.createToken(customerEntity.getEmail()))
                .thenReturn("randomToken");

        // Act
        Mono<AuthResponseDTO> login = this.customerService.login(customerEntity.getEmail(), customerEntity.getPassword());

        // Assert
        StepVerifier.create(login).assertNext(Assertions::assertNotNull).verifyComplete();
    }
}