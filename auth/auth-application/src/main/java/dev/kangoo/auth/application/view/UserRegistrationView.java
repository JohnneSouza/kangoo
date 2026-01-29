package dev.kangoo.auth.application.view;

public class UserRegistrationView {

    private String customerId;
    private String email;

    public UserRegistrationView(String customerId, String email) {
        this.customerId = customerId;
        this.email = email;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
