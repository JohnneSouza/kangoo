package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.event.RegisterCustomerEvent;
import dev.kangoo.auth.application.port.CustomerRegistrationPublisher;
import dev.kangoo.auth.application.port.PasswordEncoder;
import dev.kangoo.auth.application.port.UserActivationNotificationSender;
import dev.kangoo.auth.application.usecase.UserRegistrationCommand;
import dev.kangoo.auth.application.usecase.UserRegistrationUseCase;
import dev.kangoo.auth.application.view.UserRegistrationView;
import dev.kangoo.auth.domain.exception.UserAlreadyExistsException;
import dev.kangoo.auth.domain.model.user.ActivationToken;
import dev.kangoo.auth.domain.model.user.Authority;
import dev.kangoo.auth.domain.model.user.CustomerId;
import dev.kangoo.auth.domain.model.user.Email;
import dev.kangoo.auth.domain.model.user.Password;
import dev.kangoo.auth.domain.model.user.User;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.repository.UserRepository;

public class UserRegistrationService implements UserRegistrationUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivationTokenRepository activationTokenRepository;
    private final UserActivationNotificationSender notificationSender;
    private final CustomerRegistrationPublisher customerRegistrationPublisher;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder, ActivationTokenRepository activationTokenRepository,
                                   CustomerRegistrationPublisher customerRegistrationPublisher, UserActivationNotificationSender notificationSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.activationTokenRepository = activationTokenRepository;
        this.customerRegistrationPublisher = customerRegistrationPublisher;
        this.notificationSender = notificationSender;
    }

    @Override
    public UserRegistrationView execute(UserRegistrationCommand command) {
        if (this.userRepository.existsByEmail(command.email()))
            throw new UserAlreadyExistsException(command.email());

        Password password = this.passwordEncoder.encode(command.password());
        CustomerId customerId = CustomerId.generate();
        Email email = new Email(command.email());
        Authority authority = Authority.roleUser();

        ActivationToken activationToken = ActivationToken.generateActivationToken(customerId);

        var user = User.register(customerId, email, password, authority);
        this.userRepository.save(user);
        this.notificationSender.send(email, activationToken.token());
        this.activationTokenRepository.save(activationToken);

        this.customerRegistrationPublisher
                .publish(new RegisterCustomerEvent(
                        user.getCustomerId().value(),
                        user.getEmail().value(),
                        command.firstName(),
                        command.lastName(),
                        command.phone()));

        return new UserRegistrationView(customerId.value(), email.value());
    }
}
