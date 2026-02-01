package dev.kangoo.auth.infrastructure.config;

import dev.kangoo.auth.application.port.CustomerRegistrationPublisher;
import dev.kangoo.auth.application.port.PasswordEncoder;
import dev.kangoo.auth.application.port.TokenIssuer;
import dev.kangoo.auth.application.port.UserAuthenticator;
import dev.kangoo.auth.application.service.ActivateUserService;
import dev.kangoo.auth.application.service.AuthenticateUserService;
import dev.kangoo.auth.application.service.UserRegistrationService;
import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.application.usecase.AuthenticateUserUseCase;
import dev.kangoo.auth.application.usecase.UserRegistrationUseCase;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.repository.UserRepository;
import dev.kangoo.auth.infrastructure.mail.MailUserActivationSender;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class UserBeanConfig {

    @Bean
    public AuthenticateUserUseCase authenticateUserUseCase(
            UserAuthenticator userAuthenticator, TokenIssuer tokenIssuer){
        return new AuthenticateUserService(userAuthenticator, tokenIssuer);
    }

    @Bean
    @Transactional
    public UserRegistrationUseCase userRegistrationUseCase(UserRepository userRepository,
                                                           PasswordEncoder passwordEncoder,
                                                           CustomerRegistrationPublisher publisher,
                                                           MailUserActivationSender mailUserActivationSender,
                                                           ActivationTokenRepository tokenRepository){
        return new UserRegistrationService(userRepository, passwordEncoder, tokenRepository, publisher, mailUserActivationSender);
    }

    @Bean
    public ActivateUserUseCase activateUserUseCase(ActivationTokenRepository tokenRepository, UserRepository userRepository) {
        ActivateUserService pureService = new ActivateUserService(tokenRepository, userRepository);
        return new TransactionalActivateUserUseCase(pureService);
    }

    static class TransactionalActivateUserUseCase implements ActivateUserUseCase {
        private final ActivateUserUseCase delegate;

        TransactionalActivateUserUseCase(ActivateUserUseCase delegate) {
            this.delegate = delegate;
        }

        @Override
        @Transactional
        public void execute(ActivateUserCommand command) {
            this.delegate.execute(command);
        }
    }
}
