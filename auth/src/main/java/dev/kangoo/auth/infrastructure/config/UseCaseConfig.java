package dev.kangoo.auth.infrastructure.config;

import dev.kangoo.auth.adapter.persistence.JpaUserRepositoryAdapter;
import dev.kangoo.auth.adapter.persistence.SpringDataUserRepository;
import dev.kangoo.auth.adapter.persistence.UserEntityMapper;
import dev.kangoo.auth.application.registration.UserRegistrationService;
import dev.kangoo.auth.application.registration.UserRegistrationUseCase;
import dev.kangoo.auth.application.security.BCryptPasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public JpaUserRepositoryAdapter jpaUserRepositoryAdapter(
            SpringDataUserRepository springDataUserRepository, UserEntityMapper entityMapper){
        return new JpaUserRepositoryAdapter(springDataUserRepository, entityMapper);
    }

    @Bean
    public UserRegistrationUseCase userRegistrationUseCase(JpaUserRepositoryAdapter jpaUserRepositoryAdapter){
        return new UserRegistrationService(jpaUserRepositoryAdapter, new BCryptPasswordEncoder());
    }

}
