package com.kangoo.customers.infrastructure.providers;

import com.kangoo.customers.infrastructure.service.CustomersService;
import com.kangoo.customers.infrastructure.utils.PasswordUtils;
import com.kangoo.customers.usecases.CustomersUseCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanProviders {

    @Bean
    public CustomersUseCase customersUseCaseProvider(CustomersService customersService) {
        return new CustomersUseCase(customersService);
    }

    @Bean
    public PasswordUtils passwordUtils(@Value("${security.pepper}") String pepper) {
        return new PasswordUtils(pepper);
    }

}
