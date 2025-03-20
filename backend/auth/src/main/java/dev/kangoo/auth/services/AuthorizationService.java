package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.mappers.CustomerMappers;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    private final CustomerMappers customerMappers;
    private final UserService userService;

    public AuthorizationService(CustomerMappers customerMappers, UserService userService) {
        this.customerMappers = customerMappers;
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AuthUserEntity entity = this.userService.findByUsername(username);

        return this.customerMappers.toAuthUser(entity);
    }
}
