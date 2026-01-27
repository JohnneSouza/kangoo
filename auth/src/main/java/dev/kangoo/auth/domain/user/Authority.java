package dev.kangoo.auth.domain.user;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Authority {

    private String authority;

    private Authority(String authority) {
        this.authority = authority;
    }

    public static Authority roleUser() {
        return new Authority("ROLE_USER");
    }

    public String value() {
        return this.authority;
    }

}
