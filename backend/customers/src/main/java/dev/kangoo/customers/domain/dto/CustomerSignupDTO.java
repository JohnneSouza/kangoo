package com.kangoo.customers.domain.dto;

import com.kangoo.customers.domain.Customer;

public final class CustomerSignupDTO extends Customer {

    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
