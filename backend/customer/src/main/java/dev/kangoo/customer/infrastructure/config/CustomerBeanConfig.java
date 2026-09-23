package dev.kangoo.customer.infrastructure.config;

import dev.kangoo.customer.application.service.CreateCustomerService;
import dev.kangoo.customer.application.service.GetCustomerService;
import dev.kangoo.customer.application.usecase.CreateCustomerUseCase;
import dev.kangoo.customer.application.usecase.GetCustomerUseCase;
import dev.kangoo.customer.domain.repository.CustomerRepository;
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

    @Bean
    GetCustomerUseCase getCustomerUseCase(CustomerRepository customerRepository) {
        return new GetCustomerService(customerRepository);
    }
}
