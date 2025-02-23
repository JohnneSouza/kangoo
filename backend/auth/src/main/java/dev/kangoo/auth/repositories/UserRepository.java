package dev.kangoo.auth.repositories;

import dev.kangoo.auth.domain.UserEntity;

public interface UserRepository {

    UserEntity findByUsername(String username);

}
