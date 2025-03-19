package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.mappers.CustomerMappers;
import dev.kangoo.auth.publisher.CustomersPublisher;
import dev.kangoo.auth.repositories.AuthUserRepository;
import dev.kangoo.auth.utils.HashUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomersManagementService implements CustomersService {

    private static final Logger log = LogManager.getLogger(CustomersManagementService.class);

    private final AuthUserRepository authUserRepository;
    private final CustomersPublisher customersPublisher;
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final CustomerMappers customerMappers;

    public CustomersManagementService(AuthUserRepository authUserRepository,
                                      CustomersPublisher customersPublisher,
                                      StringRedisTemplate redisTemplate,
                                      PasswordEncoder passwordEncoder,
                                      CustomerMappers customerMappers) {
        this.authUserRepository = authUserRepository;
        this.customersPublisher = customersPublisher;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
        this.customerMappers = customerMappers;
    }

    @Override
    public CustomerResponse customerSignUp(CustomerRequest customerRequest) {
        String encodedPwd = this.passwordEncoder.encode(customerRequest.getPassword());
        String customerId = HashUtils.generateHash(customerRequest.getEmail());
        customerRequest.setPassword(encodedPwd);
        customerRequest.setCustomerId(customerId);

        AuthUserEntity entity = this.customerMappers.toEntity(customerRequest);

        AuthUserEntity savedEntity = this.authUserRepository.save(entity);

        this.customersPublisher.publishCustomerSignup(customerRequest);

        String activationCode = UUID.randomUUID().toString();

        this.redisTemplate.opsForValue().set(activationCode, customerId);

        log.debug("Activate this account here -> http://localhost:8080/v1/auth/activation/{}", activationCode);

        log.info("Customer signup successful");

        return this.customerMappers.toResponse(savedEntity);
    }

    @Override
    public void activateAccount(String code) {
        // Retrieve the customerId by the code
        String customerId = this.redisTemplate.opsForValue().getAndDelete(code);
        // If not found return error
        if (customerId == null) throw new RuntimeException("Customer not found");

        // If found call repository and set enabled: true
        this.authUserRepository.enableUserByCustomerId(customerId);
        log.info("Activate account successful");
    }


}
