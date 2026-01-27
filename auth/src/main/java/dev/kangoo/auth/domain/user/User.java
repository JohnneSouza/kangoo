package dev.kangoo.auth.domain.user;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class User {

    private CustomerId customerId;
    private Email email;
    private Password password;
    private Authority authority;

    public User(CustomerId customerId, Email email, Password password, Authority authority) {
        this.customerId = customerId;
        this.email = email;
        this.password = password;
        this.authority = authority;
    }
}
