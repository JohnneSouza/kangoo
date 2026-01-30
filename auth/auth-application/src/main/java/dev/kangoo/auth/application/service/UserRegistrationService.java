package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.event.RegisterCustomerEvent;
import dev.kangoo.auth.application.port.PasswordEncoder;
import dev.kangoo.auth.application.port.CustomerRegistrationPublisher;
import dev.kangoo.auth.application.usecase.UserRegistrationCommand;
import dev.kangoo.auth.application.usecase.UserRegistrationUseCase;
import dev.kangoo.auth.application.view.UserRegistrationView;
import dev.kangoo.auth.domain.exception.UserAlreadyExistsException;
import dev.kangoo.auth.domain.model.user.Authority;
import dev.kangoo.auth.domain.model.user.CustomerId;
import dev.kangoo.auth.domain.model.user.Email;
import dev.kangoo.auth.domain.model.user.Password;
import dev.kangoo.auth.domain.model.user.User;
import dev.kangoo.auth.domain.repository.UserRepository;

public class UserRegistrationService implements UserRegistrationUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRegistrationPublisher customerRegistrationPublisher;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                   CustomerRegistrationPublisher customerRegistrationPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerRegistrationPublisher = customerRegistrationPublisher;
    }

    @Override
    public UserRegistrationView execute(UserRegistrationCommand command) {
        if (this.userRepository.existsByEmail(command.email()))
            throw new UserAlreadyExistsException(command.email());

        String hashedPassword = this.passwordEncoder.encode(command.password());

        CustomerId customerId = CustomerId.generate();
        Email email = new Email(command.email());
        Password password = Password.fromHashed(hashedPassword);
        Authority authority = Authority.roleUser();

        var user = new User(customerId, email, password, authority);
        this.userRepository.save(user);

        this.customerRegistrationPublisher
                .publish(new RegisterCustomerEvent(
                        customerId.value(),
                        email.value(),
                        command.firstName(),
                        command.lastName(),
                        command.phone()));

        return new UserRegistrationView(customerId.value(), email.value());
    }
}
