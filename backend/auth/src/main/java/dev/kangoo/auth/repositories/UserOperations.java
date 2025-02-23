package dev.kangoo.auth.repositories;

import dev.kangoo.auth.domain.UserEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserOperations implements UserRepository {

    @Override
    public UserEntity findByUsername(String username) {
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setPasswordHash(new BCryptPasswordEncoder().encode("bla"));
        user.setEnabled(true);

        return user;
    }
}
