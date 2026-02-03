package dev.kangoo.customer.adapter.messaging.event;

public record RegisterCustomerEvent(String customerId, String firstName, String lastName, String phone) {

}
