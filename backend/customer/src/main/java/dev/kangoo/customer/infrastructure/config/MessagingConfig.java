package dev.kangoo.customer.infrastructure.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfig {

    @Bean
    Queue registerCustomerQueue() {
        return QueueBuilder.durable("customer.register").build();
    }

    @Bean
    TopicExchange customerIdentityExchange() {
        return new TopicExchange("identity.customer.events");
    }

    @Bean
    Binding registerCustomerBinding(Queue registerCustomerQueue, TopicExchange customerIdentityExchange) {
        return BindingBuilder
                .bind(registerCustomerQueue)
                .to(customerIdentityExchange)
                .with("identity.customer.register");
    }
}