package com.kangoo.customers.service;

import com.kangoo.customers.config.authentication.JwtService;
import com.kangoo.customers.config.utils.PasswordService;
import com.kangoo.customers.converters.Converter;
import com.kangoo.customers.domain.Customer;
import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTO;
import com.kangoo.customers.domain.entity.CustomerEntity;
import com.kangoo.customers.domain.exceptions.InvalidUserCredentialsException;
import com.kangoo.customers.domain.exceptions.UserNotFoundException;
import com.kangoo.customers.repository.CustomerOperations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class CustomersService {

    private final Converter customerConverter;
    private final CustomerOperations customerOperations;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public CustomersService(CustomerOperations customerOperations, PasswordService passwordService,
                            JwtService jwtService, Converter customerConverter) {
        this.customerConverter = customerConverter;
        this.customerOperations = customerOperations;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    public Mono<Customer> signup(CustomerSignupDTO customer) {
        String salt = this.passwordService.generateSalt();

        CustomerEntity customerEntity = this.customerConverter.convertToEntity(customer);
        customerEntity.setPassword(this.passwordService.hashPassword(customer.getPassword(), salt));

        return this.customerOperations.save(customerEntity).map(this.customerConverter::convertToDto);
    }

    public Mono<CustomerProfileDTO> login(String email, String password, ServerHttpResponse response) {
        return this.customerOperations.findByEmail(email).flatMap(entity -> {
            if (entity == null) return Mono.error(new UserNotFoundException("Could not find a user."));
            if (this.passwordService.isPasswordValid(password, entity.getSalt(), entity.getPassword())){
                String token = this.jwtService.generateToken(entity.getEmail());
                setAuthorizationCookie(response, token);
                return Mono.just(this.customerConverter.convertToDto(entity));
            }
            return Mono.error(new InvalidUserCredentialsException("The credentials provided are not valid."));
        });
    }

    public HttpStatusCode update(String id, CustomerSignupDTO customerSignupDTO) {
        return null;
    }

    private static void setAuthorizationCookie(ServerHttpResponse response, String token) {
        response.addCookie(ResponseCookie.from(HttpHeaders.AUTHORIZATION, token)
                .maxAge(Duration.ofHours(1))
                .secure(true)
                .build());
    }
}
