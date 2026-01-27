package dev.kangoo.auth.repositories;

import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.mappers.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class UserRepository {

    private final SpringDataUserRepository springDataUserRepository;
    private final UserMapper mapper;

    public UserRepository(SpringDataUserRepository springDataUserRepository, UserMapper mapper) {
        this.springDataUserRepository = springDataUserRepository;
        this.mapper = mapper;
    }

    public User findByEmail(Email email) {
        return this.mapper.toUser(this.springDataUserRepository.findByEmail(email.value()));
    }

    public boolean existsByEmail(Email email) {
        return this.springDataUserRepository.existsByEmail(email.value());
    }

    public User save(User user) {
        UserEntity newUser = this.springDataUserRepository.save(this.mapper.toEntity(user));
        return this.mapper.toUser(newUser);
    }
}
