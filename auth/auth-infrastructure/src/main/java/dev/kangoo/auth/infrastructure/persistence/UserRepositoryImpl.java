package dev.kangoo.auth.infrastructure.persistence;

import dev.kangoo.auth.domain.model.user.User;
import dev.kangoo.auth.domain.repository.UserRepository;
import dev.kangoo.auth.infrastructure.persistence.entity.UserEntity;
import dev.kangoo.auth.infrastructure.persistence.mapper.UserPersistenceMapper;
import dev.kangoo.auth.infrastructure.repository.SpringDataUserRepository;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final SpringDataUserRepository repository;
    private final UserPersistenceMapper mapper;

    public UserRepositoryImpl(SpringDataUserRepository repository, UserPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public boolean existsByEmail(String email) {
        return this.repository.existsByEmail(email);
    }

    @Override
    public void save(User user) {
        UserEntity entity = this.mapper.toEntity(user);
        this.repository.save(entity);
    }

    @Override
    public int activateUserByCustomerId(String customerId) {
        return this.repository.activateUser(customerId);
    }
}
