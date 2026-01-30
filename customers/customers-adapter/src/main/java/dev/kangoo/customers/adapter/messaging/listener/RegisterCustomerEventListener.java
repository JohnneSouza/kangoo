package dev.kangoo.customers.adapter.messaging.listener;

import dev.kangoo.customers.adapter.messaging.event.RegisterCustomerEvent;
import dev.kangoo.customers.adapter.messaging.mapper.CustomerEventMapper;
import dev.kangoo.customers.application.usecase.CreateCustomerUseCase;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RegisterCustomerEventListener {

    private final CreateCustomerUseCase createCustomerUseCase;
    private final CustomerEventMapper mapper;

    public RegisterCustomerEventListener(CreateCustomerUseCase createCustomerUseCase,
                                         CustomerEventMapper mapper) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.mapper = mapper;
    }

    @RabbitListener(queues = "${messaging.customer.queue}")
    public void onMessage(RegisterCustomerEvent event) {
        var command = this.mapper.toCommand(event);
        this.createCustomerUseCase.execute(command);
    }
}
