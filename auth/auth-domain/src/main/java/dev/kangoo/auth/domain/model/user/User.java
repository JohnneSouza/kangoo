package dev.kangoo.auth.domain.model.user;

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

    public Status getStatus() { return status; }
}
