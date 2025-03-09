package dev.kangoo.auth.publisher;

import dev.kangoo.auth.domain.request.CustomerRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dev.kangoo.auth.configuration.RabbitConfiguration.ROUTING_KEY;

@Component
public class CustomersPublisher {

    private final RabbitTemplate rabbitTemplate;

    public CustomersPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishCustomerSignup(CustomerRequest customerRequest) {
        this.rabbitTemplate.convertAndSend(ROUTING_KEY, customerRequest);
    }
}
