package dev.kangoo.auth.domain.user;

import lombok.Getter;

@Getter
public class User {

    private CustomerId customerId;
    private Email email;
    private Password password;
    private Authority authority;
    private Status status;

    private User() {}

    public static User register(CustomerId id, Email email, Password pw, Authority auth) {
        return new User(id, email, pw, auth, new Status(false));
    }

    public User(CustomerId customerId, Email email, Password password, Authority authority, Status status) {
        this.customerId = customerId;
        this.email = email;
        this.password = password;
        this.authority = authority;
        this.status = status;
    }

}
