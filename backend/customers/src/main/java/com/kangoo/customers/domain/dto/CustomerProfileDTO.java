package com.kangoo.customers.domain.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.kangoo.customers.domain.Customer;

@JsonPropertyOrder({"id"})
public class CustomerProfileDTO extends Customer {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}