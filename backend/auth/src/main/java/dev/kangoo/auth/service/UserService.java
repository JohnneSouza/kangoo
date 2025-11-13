package dev.kangoo.auth.service;

import dev.kangoo.auth.controller.dto.CreateUserRequest;
import dev.kangoo.auth.controller.dto.UserCreatedResponse;
import dev.kangoo.auth.domain.User;
import dev.kangoo.auth.repository.UserRepository;
import dev.kangoo.auth.security.SecurityUser;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Log4j2
@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserCreatedResponse register(CreateUserRequest createUserRequest) {
        if (this.repository.existsByUsername(createUserRequest.getUsername()))
            throw new IllegalArgumentException("Username already exists");

        String passwordHash = this.encoder.encode(createUserRequest.getPassword());

        User user = new User(createUserRequest.getUsername(), passwordHash, Set.of("USER"));
        User createdUser = this.repository.save(user);

        log.info("User created: {}", createdUser.getUserId());

        UserCreatedResponse userCreatedResponse = new UserCreatedResponse();
        userCreatedResponse.setId(String.valueOf(createdUser.getUserId()));
        userCreatedResponse.setUsername(createdUser.getUsername());
        return userCreatedResponse;
    }

    @Override
    public SecurityUser loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));
        return new SecurityUser(user);
    }
}
