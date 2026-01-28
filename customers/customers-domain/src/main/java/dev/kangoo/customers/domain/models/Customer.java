package dev.kangoo.customers.domain.models;

public class Customer {

    private final String customerId;
    private final String firstName;
    private final String lastName;
    private final String phone;

    public Customer(String customerId, String firstName, String lastName, String phone) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }
}
