package dev.kangoo.customers.listeners;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CustomersListener {

    @RabbitListener(queues = "queue-name")
    public void receiveMessage(String message) {
        System.out.println("Received message: " + message);
    }

}
