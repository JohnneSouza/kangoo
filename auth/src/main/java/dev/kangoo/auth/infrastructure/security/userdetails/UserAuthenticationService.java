package dev.kangoo.auth.infrastructure.security.userdetails;

import dev.kangoo.auth.infrastructure.persistence.entity.UserEntity;
import dev.kangoo.auth.infrastructure.persistence.mapper.UserPersistenceMapper;
import dev.kangoo.auth.infrastructure.repository.SpringDataUserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService implements UserDetailsService {

    private final SpringDataUserRepository userRepository;
    private final UserPersistenceMapper mapper;

    public UserAuthenticationService(SpringDataUserRepository userRepository, UserPersistenceMapper mapper) {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        UserEntity userEntity = this.userRepository.findByEmail(email);

        if (userEntity == null) throw new UsernameNotFoundException("User not found: " + email);

        return new SecurityUser(this.mapper.toUser(userEntity));
    }
}
