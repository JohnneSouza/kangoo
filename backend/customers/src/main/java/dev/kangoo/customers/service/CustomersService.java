package dev.kangoo.customers.service;

import dev.kangoo.customers.config.authentication.JwtService;
import dev.kangoo.customers.config.utils.PasswordService;
import dev.kangoo.customers.converters.Converter;
import dev.kangoo.customers.domain.Customer;
import dev.kangoo.customers.domain.dto.AuthResponseDTO;
import dev.kangoo.customers.domain.dto.CustomerProfileDTO;
import dev.kangoo.customers.domain.dto.CustomerSignupDTO;
import dev.kangoo.customers.domain.entity.CustomerEntity;
import dev.kangoo.customers.domain.exceptions.InvalidUserCredentialsException;
import dev.kangoo.customers.domain.exceptions.UserNotFoundException;
import dev.kangoo.customers.repository.CustomerOperations;
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
        customerEntity.setSalt(salt);
        customerEntity.setPassword(this.passwordService.hashPassword(customer.getPassword(), salt));

        return this.customerOperations.save(customerEntity).map(this.customerConverter::convertToDto);
    }

    public Mono<AuthResponseDTO> login(String email, String password) {
        return this.customerOperations.findByEmail(email).flatMap(entity -> {
            if (entity == null) return Mono.error(new UserNotFoundException("Could not find a user."));
            if (this.passwordService.isPasswordValid(password, entity.getSalt(), entity.getPassword())){
                String token = this.jwtService.createToken(entity.getId().toString());
                AuthResponseDTO authResponseDTO  = new AuthResponseDTO();
                authResponseDTO.setToken(token);
                authResponseDTO.getCustomer().setId(entity.getId().toString());
                authResponseDTO.getCustomer().setAvatar(entity.getProfilePicture());
                authResponseDTO.getCustomer().setFullName(entity.getFirstName() + " " + entity.getLastName());
                return Mono.just(authResponseDTO);
            }
            return Mono.error(new InvalidUserCredentialsException("The credentials provided are not valid."));
        });
    }

    public HttpStatusCode update(String id, CustomerSignupDTO customerSignupDTO) {
        return null;
    }

}
