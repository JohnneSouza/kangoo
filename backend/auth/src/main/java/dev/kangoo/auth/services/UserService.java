package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUser;
import dev.kangoo.auth.domain.model.UserEntity;
import dev.kangoo.auth.domain.model.UserRoles;
import dev.kangoo.auth.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthUser findByUsername(String username) {
        UserEntity userEntity = this.userRepository.findByUsername(username);
        AuthUser authUser = new AuthUser();
        authUser.setId(userEntity.getCustomerId());
        authUser.setUsername(userEntity.getUsername());
        authUser.setPassword(userEntity.getPasswordHash());
        authUser.setRole(UserRoles.ADMIN);
        authUser.setEnabled(userEntity.isEnabled());
        return authUser;
    }
}
