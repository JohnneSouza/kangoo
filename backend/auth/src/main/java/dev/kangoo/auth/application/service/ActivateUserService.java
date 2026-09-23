package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.exception.ExpiredActivationTokenException;
import dev.kangoo.auth.application.exception.InvalidActivationTokenException;
import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.repository.UserRepository;
import dev.kangoo.auth.domain.user.ActivationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ActivateUserService implements ActivateUserUseCase {

    private static final Logger log = LoggerFactory.getLogger(ActivateUserService.class);

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
            throw new InvalidActivationTokenException();

        if (activationToken.isExpired())
            throw new ExpiredActivationTokenException();

        String customerId = activationToken.customerId().value();
        int result = this.userRepository.activateUserByCustomerId(customerId);

        if (result != 1) {
            log.warn("Activation matched no pending user for customerId={}", customerId);
            throw new InvalidActivationTokenException();
        }

        this.tokenRepository.deleteByToken(command.token());
        log.info("Activated user for customerId={}", customerId);
    }
}
