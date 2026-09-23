package dev.kangoo.customer.application.usecase;

public record CreateCustomerCommand(String customerId, String firstName, String lastName, String phone) {

}
