package dev.kangoo.customers.mappers;

import dev.kangoo.customers.domain.entities.CustomerEntity;
import dev.kangoo.customers.domain.requests.CustomerSignupRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerEntity toEntity(CustomerSignupRequest customerSignupRequest);

}
