package com.kangoo.customers.infrastructure.providers;

import com.kangoo.customers.infrastructure.repository.CustomersRepository;
import com.kangoo.customers.usecases.CustomersUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanProviders {

    @Bean
    public CustomersUseCase customersUseCaseProvider(CustomersRepository customersRepository) {
        return new CustomersUseCase(customersRepository);
    }

}
