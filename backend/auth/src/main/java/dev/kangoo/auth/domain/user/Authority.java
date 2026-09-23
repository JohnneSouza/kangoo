package dev.kangoo.auth.domain.user;

public class Authority {

    private static final String ROLE_USER = "ROLE_USER";

    private String authority;

    private Authority(String authority) {
        this.authority = authority;
    }

    public static Authority roleUser() {
        return new Authority(ROLE_USER);
    }

    public static Authority of(String authority) {
        if (authority == null || authority.isBlank())
            throw new IllegalArgumentException("Authority cannot be null or blank");
        return new Authority(authority);
    }

    public String value() {
        return this.authority;
    }

}
