package dev.kangoo.customers.adapter.messaging.mapper;

import dev.kangoo.customers.adapter.messaging.event.CustomerCreatedEvent;
import dev.kangoo.customers.application.usecase.CreateCustomerCommand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerEventMapper {

    CreateCustomerCommand toCommand(CustomerCreatedEvent event);
}
