package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.User;
import dev.kangoo.auth.domain.UserEntity;
import dev.kangoo.auth.domain.UserRoles;
import dev.kangoo.auth.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByUsername(String username) {
        UserEntity userEntity = this.userRepository.findByUsername(username);
        User user = new User();
        user.setUsername(userEntity.getUsername());
        user.setPassword(userEntity.getPasswordHash());
        user.setRole(UserRoles.ADMIN);
        return user;
    }
}
