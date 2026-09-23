package dev.kangoo.auth.domain.repository;

import dev.kangoo.auth.domain.user.User;

public interface UserRepository {

    boolean existsByEmail(String email);

    void save(User user);

    int activateUserByCustomerId(String customerId);
}
