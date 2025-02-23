package dev.kangoo.auth.repositories;

import dev.kangoo.auth.domain.UserEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserOperations implements UserRepository {

    @Override
    public UserEntity findByUsername(String username) {
        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setPasswordHash(new BCryptPasswordEncoder().encode("bla"));

        return user;
    }
}
