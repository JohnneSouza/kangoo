package dev.kangoo.auth.services;

import dev.kangoo.auth.mappers.UserMapper;
import dev.kangoo.auth.model.user.SecurityUser;
import dev.kangoo.auth.repositories.SpringDataUserRepository;
import dev.kangoo.auth.repositories.UserEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService implements UserDetailsService {

    private final SpringDataUserRepository userRepository;
    private final UserMapper mapper;

    public UserAuthenticationService(SpringDataUserRepository userRepository, UserMapper mapper) {
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
