package dev.kangoo.auth.client;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.mappers.CustomerMappers;
import dev.kangoo.auth.publisher.CustomersPublisher;
import dev.kangoo.auth.repositories.AuthUserRepository;
import dev.kangoo.auth.utils.HashUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerManagementService implements CustomerService {

    private static final Logger log = LogManager.getLogger(CustomerManagementService.class);

    private final CustomersPublisher customersPublisher;
    private final PasswordEncoder passwordEncoder;
    private final AuthUserRepository authUserRepository;
    private final CustomerMappers customerMappers;

    public CustomerManagementService(AuthUserRepository authUserRepository,
                                     CustomersPublisher customersPublisher,
                                     PasswordEncoder passwordEncoder,
                                     CustomerMappers customerMappers) {
        this.customersPublisher = customersPublisher;
        this.passwordEncoder = passwordEncoder;
        this.authUserRepository = authUserRepository;
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

        log.info("Customer signup successful");

        return this.customerMappers.toResponse(savedEntity);
    }
}
