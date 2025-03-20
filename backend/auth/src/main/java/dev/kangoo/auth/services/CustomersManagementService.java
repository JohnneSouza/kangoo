package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.model.UserRoles;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.mappers.CustomerMappers;
import dev.kangoo.auth.publisher.CustomersPublisher;
import dev.kangoo.auth.repositories.auth.AuthUserRepository;
import dev.kangoo.auth.services.outbox.SignupOutboxService;
import dev.kangoo.auth.utils.HashUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.AmqpException;
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
    private final SignupOutboxService signupOutboxService;

    public CustomersManagementService(AuthUserRepository authUserRepository,
                                      CustomersPublisher customersPublisher,
                                      StringRedisTemplate redisTemplate,
                                      PasswordEncoder passwordEncoder,
                                      CustomerMappers customerMappers, SignupOutboxService signupOutboxService) {
        this.authUserRepository = authUserRepository;
        this.customersPublisher = customersPublisher;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
        this.customerMappers = customerMappers;
        this.signupOutboxService = signupOutboxService;
    }

    @Override
    public CustomerResponse customerSignUp(CustomerRequest customerRequest) {
        String encodedPwd = this.passwordEncoder.encode(customerRequest.getPassword());
        String customerId = HashUtils.generateHash(customerRequest.getEmail());
        customerRequest.setPassword(encodedPwd);
        customerRequest.setCustomerId(customerId);

        AuthUserEntity entity = this.customerMappers.toEntity(customerRequest);
        entity.setUserRoles(UserRoles.USER);

        AuthUserEntity savedEntity = this.authUserRepository.save(entity);

        try {
            this.customersPublisher.publishCustomerSignup(customerRequest);
        } catch (AmqpException ex) {
            log.error(ex);
            this.signupOutboxService.saveMessage(customerRequest);
        }

        // TODO: Replace with a custom algorithm based on the customer id.
        String activationCode = UUID.randomUUID().toString();

        this.redisTemplate.opsForValue().set(activationCode, customerId);

        log.debug("Activate this account here -> http://localhost:8080/v1/auth/activation/{}", activationCode);

        log.info("Customer signup successful");

        return this.customerMappers.toResponse(savedEntity);
    }

    @Override
    public void activateAccount(String code) {
        String customerId = this.redisTemplate.opsForValue().getAndDelete(code);
        if (customerId == null) throw new RuntimeException("Customer not found");

        this.authUserRepository.enableUserByCustomerId(customerId);
        log.info("CustomerID {} activated with success.", customerId);
    }


}
