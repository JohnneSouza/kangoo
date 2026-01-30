package dev.kangoo.auth.application.event;

public record RegisterCustomerEvent(String customerId, String email, String firstName, String lastName, String phone) {

}
