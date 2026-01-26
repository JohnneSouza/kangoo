package dev.kangoo.auth.domain.user;

public final class Password {

    private final String hashedPassword;

    private Password(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public static Password fromHashed(String hashed) {
        if (hashed == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        return new Password(hashed);
    }

    public String getValue(){
        return this.hashedPassword;
    }
}