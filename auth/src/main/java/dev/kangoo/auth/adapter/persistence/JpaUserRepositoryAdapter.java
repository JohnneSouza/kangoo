package dev.kangoo.auth.adapter.persistence;

import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.domain.user.UserRepository;

public class JpaUserRepositoryAdapter implements UserRepository {

    private final SpringDataUserRepository userRepository;
    private final UserEntityMapper mapper;

    public JpaUserRepositoryAdapter(SpringDataUserRepository userRepository, UserEntityMapper mapper) {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public boolean existsByEmail(Email email) {
        return this.userRepository.existsByEmail(email.value());
    }

    @Override
    public User save(User user) {
        UserEntity savedUser = this.userRepository.save(this.mapper.toEntity(user));

        return this.mapper.toDomain(savedUser);
    }
}
