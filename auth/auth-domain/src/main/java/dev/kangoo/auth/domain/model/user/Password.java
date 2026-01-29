package dev.kangoo.auth.domain.model.user;

public final class Password {

    private final String password;

    private Password(String password) {
        this.password = password;
    }

    public static Password fromHashed(String hashed) {
        if (hashed == null || hashed.isBlank())
            throw new IllegalArgumentException("A hashed password must be provided");
        return new Password(hashed);
    }

    public static Password fromPlain(String plain) {
        if (plain == null || plain.isBlank())
            throw new IllegalArgumentException("Password cannot must be provided");
        return new Password(plain);
    }

    public String value(){
        return this.password;
    }
}