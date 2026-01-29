package dev.kangoo.auth.domain.model.user;

public class User {

    private CustomerId customerId;
    private Email email;
    private Password password;
    private Authority authority;

    private User() {}

    public User(CustomerId customerId, Email email, Password password, Authority authority) {
        this.customerId = customerId;
        this.email = email;
        this.password = password;
        this.authority = authority;
    }

    public CustomerId getCustomerId() {
        return customerId;
    }

    public Email getEmail() { return email; }

    public Password getPassword() {
        return password;
    }

    public Authority getAuthority() {
        return authority;
    }
}
