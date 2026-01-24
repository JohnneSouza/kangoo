package dev.kangoo.auth.domain.user;

import lombok.Getter;

@Getter
public class User {

    private final CustomerId customerId;
    private final Email email;
    private final Name name;
    private final Password password;
    private final Phone phone;

    public User(CustomerId customerId, Email email, Name name, Password password, Phone phone) {
        this.customerId = customerId;
        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;
    }
}
