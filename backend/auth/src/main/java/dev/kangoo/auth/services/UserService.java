package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUser;
import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.model.UserRoles;
import dev.kangoo.auth.repositories.AuthUserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final AuthUserRepository userRepository;

    public UserService(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthUser findByUsername(String email) {
        AuthUserEntity authUserEntity = this.userRepository.findByEmail(email);
        AuthUser authUser = new AuthUser();
        authUser.setId(authUserEntity.getCustomerId());
        authUser.setPassword(authUserEntity.getPasswordHash());
        authUser.setRole(UserRoles.ADMIN);
        authUser.setEnabled(authUserEntity.isEnabled());
        return authUser;
    }
}
