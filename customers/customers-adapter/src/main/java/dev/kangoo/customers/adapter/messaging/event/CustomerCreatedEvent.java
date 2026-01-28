package dev.kangoo.customers.adapter.messaging.event;

public record CustomerCreatedEvent(String customerId, String firstName, String lastName, String phone) {

}
