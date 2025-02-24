package dev.kangoo.auth.domain.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public enum UserRoles {
    ADMIN {
        @Override
        public List<SimpleGrantedAuthority> getRoleAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        }
    },
    USER {
        @Override
        public List<SimpleGrantedAuthority> getRoleAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
    };

    public abstract List<SimpleGrantedAuthority> getRoleAuthorities();
}
