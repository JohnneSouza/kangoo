package dev.kangoo.auth.infrastructure.security.userdetails;

import dev.kangoo.auth.domain.user.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record SecurityUser(User user) implements UserDetails {

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

    @Override
    public boolean isEnabled() { return this.user.getStatus().isEnabled(); }

}