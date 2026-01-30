package dev.kangoo.auth.infrastructure.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfig {

    @Bean
    TopicExchange authExchange() {
        return new TopicExchange("identity.customer.events");
    }
}

