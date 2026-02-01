package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.domain.model.user.ActivationToken;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.repository.UserRepository;

public class ActivateUserService implements ActivateUserUseCase {

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

        this.userRepository.activateUserByCustomerId(activationToken.customerId().value());

    }
}
