package dev.kangoo.customers.domain.dto;

import dev.kangoo.customers.domain.Customer;

public final class CustomerSignupDTO extends Customer {

    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
