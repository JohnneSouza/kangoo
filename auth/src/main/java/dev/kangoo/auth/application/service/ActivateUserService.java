package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.repository.UserRepository;
import dev.kangoo.auth.domain.user.ActivationToken;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ActivateUserService implements ActivateUserUseCase {

    private static final Logger log = LogManager.getLogger(ActivateUserService.class);

    private final ActivationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    public ActivateUserService(ActivationTokenRepository tokenRepository, UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void execute(ActivateUserCommand command) {
        ActivationToken activationToken = this.tokenRepository.findByToken(command.token());

        if (activationToken == null)
            throw new RuntimeException(String.format("Invalid activation token: %s",  command.token()));

        if (activationToken.isExpired())
            throw new RuntimeException(String.format("Expired activation token: %s",  command.token()));

        int result = this.userRepository.activateUserByCustomerId(activationToken.customerId().value());

        boolean success = result == 1;

        if (success) {
            log.info("Activated user: {}", command.token());
        } else  {
            log.warn("Failed to activate user: {}", command.token());
        }

    }
}
