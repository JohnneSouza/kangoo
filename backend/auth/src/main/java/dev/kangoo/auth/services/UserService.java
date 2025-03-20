package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.repositories.AuthUserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final AuthUserRepository userRepository;

    public UserService(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthUserEntity findByUsername(String email) {
        return this.userRepository.findByEmail(email);
    }
}
