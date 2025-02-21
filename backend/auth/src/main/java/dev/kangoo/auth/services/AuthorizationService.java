package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.User;
import dev.kangoo.auth.domain.UserRoles;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = new User();
        user.setPassword(new BCryptPasswordEncoder().encode("bla"));
        user.setRole(UserRoles.ADMIN);
        user.setLogin("bla");
        return user;
    }
}
