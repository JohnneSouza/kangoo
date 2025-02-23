package dev.kangoo.auth.domain;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;


public class User implements UserDetails {

    private String id;
    private String login;
    private String password;
    private UserRoles role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.role.getRoleAuthorities();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    public String getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public UserRoles getRole() {
        return role;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUsername(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(UserRoles role) {
        this.role = role;
    }
}
