package dev.kangoo.auth.infrastructure.messaging.publisher;

import dev.kangoo.auth.application.event.RegisterCustomerEvent;
import dev.kangoo.auth.application.port.CustomerRegistrationPublisher;
import dev.kangoo.auth.infrastructure.messaging.config.MessagingConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class CustomerRegistrationRabbitPublisher implements CustomerRegistrationPublisher {

    private static final Logger log = LoggerFactory.getLogger(CustomerRegistrationRabbitPublisher.class);

    private static final String ROUTING_KEY = "identity.customer.register";

    private final RabbitTemplate rabbitTemplate;

    public CustomerRegistrationRabbitPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void publish(RegisterCustomerEvent event) {
        log.info("Publishing Register Customer Event for customerId={}", event.customerId());
        this.rabbitTemplate.convertAndSend(MessagingConfig.IDENTITY_CUSTOMER_EVENTS, ROUTING_KEY, event);
    }
}