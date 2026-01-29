package dev.kangoo.auth.domain.model.user;

public class Authority {

    private Authority() {}

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
