package dev.kangoo.auth.domain.user;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class User {

    private CustomerId customerId;
    private Email email;
    private Password password;

    public User(CustomerId customerId, Email email, Password password) {
        this.customerId = customerId;
        this.email = email;
        this.password = password;
    }
}
