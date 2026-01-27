package dev.kangoo.auth.model.user;

import dev.kangoo.auth.domain.user.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class SecurityUser implements UserDetails {

    private final User user;

    public SecurityUser(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> this.user.getAuthority().value());
    }

    @Override
    public @Nullable String getPassword() {
        return this.user.getPassword().value();
    }

    @Override
    public String getUsername() {
        return this.user.getEmail().value();
    }

}
