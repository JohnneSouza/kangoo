package dev.kangoo.customers.listeners;

import dev.kangoo.customers.domain.requests.CustomerSignupRequest;
import dev.kangoo.customers.services.CustomerService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static dev.kangoo.customers.configuration.RabbitConfiguration.QUEUE_NAME;

@Component
public class CustomersListener {

    private final CustomerService customerService;

    public CustomersListener(CustomerService customerService) {
        this.customerService = customerService;
    }

    @RabbitListener(queues = QUEUE_NAME)
    public void customerSignup(CustomerSignupRequest customerSignupRequest) {
        this.customerService.registerCustomer(customerSignupRequest);
    }

}
