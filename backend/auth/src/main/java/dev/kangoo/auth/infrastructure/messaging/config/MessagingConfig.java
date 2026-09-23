package dev.kangoo.auth.infrastructure.messaging.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfig {

    public static final String IDENTITY_CUSTOMER_EVENTS = "identity.customer.events";

    @Bean
    TopicExchange authExchange() {
        return new TopicExchange(IDENTITY_CUSTOMER_EVENTS);
    }
}

