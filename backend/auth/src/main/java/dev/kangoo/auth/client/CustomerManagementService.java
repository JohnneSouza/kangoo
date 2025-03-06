package dev.kangoo.auth.client;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import dev.kangoo.auth.repositories.AuthUserRepository;
import dev.kangoo.auth.utils.HashUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerManagementService implements CustomerService{

    private final CustomerServiceClient customerServiceClient;
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerManagementService(CustomerServiceClient customerServiceClient,
                                     AuthUserRepository authUserRepository,
                                     PasswordEncoder passwordEncoder) {
        this.customerServiceClient = customerServiceClient;
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public CustomerResponse customerSignUp(CustomerRequest customerRequest) {
        String encodedPwd = this.passwordEncoder.encode(customerRequest.getPassword());
        String customerId = HashUtils.generateHash(customerRequest.getEmail());
        customerRequest.setPassword(encodedPwd);
        customerRequest.setCustomerId(customerId);


        AuthUserEntity entity = new AuthUserEntity();
        entity.setEmail(customerRequest.getEmail());
        entity.setCustomerId(customerId);
        entity.setPasswordHash(encodedPwd);

        this.authUserRepository.save(entity);

        return this.customerServiceClient.customerSignUp(customerRequest);
    }
}
