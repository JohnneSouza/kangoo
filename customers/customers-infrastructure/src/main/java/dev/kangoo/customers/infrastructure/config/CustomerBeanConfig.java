package dev.kangoo.customers.infrastructure.config;

import dev.kangoo.customers.application.service.CreateCustomerService;
import dev.kangoo.customers.application.usecase.CreateCustomerUseCase;
import dev.kangoo.customers.domain.repository.CustomerRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class CustomerBeanConfig {

    @Bean
    @Transactional
    CreateCustomerUseCase createCustomerUseCase(CustomerRepository customerRepository) {
        return new CreateCustomerService(customerRepository);
    }
}
