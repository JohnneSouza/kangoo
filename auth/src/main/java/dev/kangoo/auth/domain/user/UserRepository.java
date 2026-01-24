package dev.kangoo.auth.domain.user;

public interface UserRepository {

    boolean existsByEmail(Email email);

    User save(User user);

}
