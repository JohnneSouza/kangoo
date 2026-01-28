package dev.kangoo.customers.infrastructure.config;

import dev.kangoo.customers.application.service.CreateCustomerService;
import dev.kangoo.customers.application.usecase.CreateCustomerUseCase;
import dev.kangoo.customers.domain.repositories.CustomerRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomerUseCaseConfig {

    @Bean
    CreateCustomerUseCase createCustomerUseCase(CustomerRepository customerRepository) {
        return new CreateCustomerService(customerRepository);
    }
}
