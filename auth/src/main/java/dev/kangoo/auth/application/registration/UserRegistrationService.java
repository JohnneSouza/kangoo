package dev.kangoo.auth.application.registration;

import dev.kangoo.auth.application.security.PasswordEncoder;
import dev.kangoo.auth.domain.user.CustomerId;
import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.Name;
import dev.kangoo.auth.domain.user.Password;
import dev.kangoo.auth.domain.user.Phone;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.domain.user.UserRepository;

import java.util.UUID;

public class UserRegistrationService implements UserRegistrationUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserRegistrationOutput register(UserRegistrationInput input) {

        Email email = new Email(input.getEmail());
        Name name = new Name(input.getFirstName(), input.getLastName());
        Phone phone = new Phone(input.getPhone());
        CustomerId customerId = new CustomerId(UUID.randomUUID().toString());

        if (this.userRepository.existsByEmail(email))
            throw new IllegalStateException("User already exists");

        String hashedPassword = this.passwordEncoder.hash(input.getPassword());

        Password password = new Password(hashedPassword);

        User user = new User(customerId, email, name, password, phone);

        var newUser = this.userRepository.save(user);

        UserRegistrationOutput userRegistrationOutput = new UserRegistrationOutput();
        userRegistrationOutput.setEmail(newUser.getEmail().value());
        userRegistrationOutput.setFirstName(newUser.getName().firstName());
        userRegistrationOutput.setLastName(newUser.getName().lastName());
        userRegistrationOutput.setCustomerId(newUser.getCustomerId().value());
        userRegistrationOutput.setPhone(newUser.getPhone().value());

        return userRegistrationOutput;
    }
}
