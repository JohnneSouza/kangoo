package dev.kangoo.auth.services;

import dev.kangoo.auth.controllers.dto.UserRegistrationRequest;
import dev.kangoo.auth.controllers.dto.UserRegistrationResponse;
import dev.kangoo.auth.domain.user.Authority;
import dev.kangoo.auth.domain.user.CustomerId;
import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.Password;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.mappers.UserMapper;
import dev.kangoo.auth.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper mapper;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper mapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional
    public UserRegistrationResponse register(UserRegistrationRequest request) {
        Email email = new Email(request.getEmail());

        if (this.userRepository.existsByEmail(email))
            throw new IllegalStateException("User already exists");

        CustomerId customerId = CustomerId.generate();
        Password password = Password.fromHashed(this.passwordEncoder.encode(request.getPassword()));
        Authority authority = Authority.roleUser();

        User user = new User(customerId, email, password, authority);

        //TODO: In the future, create a method here to send to the Customer-Service Message Broker

        User newUser = this.userRepository.save(user);

        return this.mapper.toResponse(newUser);
    }
}
