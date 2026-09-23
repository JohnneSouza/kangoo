package dev.kangoo.customer.adapter.messaging.mapper;

import dev.kangoo.customer.adapter.messaging.event.RegisterCustomerEvent;
import dev.kangoo.customer.application.usecase.CreateCustomerCommand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerEventMapper {

    CreateCustomerCommand toCommand(RegisterCustomerEvent event);
}
