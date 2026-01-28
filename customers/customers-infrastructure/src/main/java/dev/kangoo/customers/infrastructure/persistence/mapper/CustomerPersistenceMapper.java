package dev.kangoo.customers.infrastructure.persistence.mapper;

import dev.kangoo.customers.domain.model.Customer;
import dev.kangoo.customers.infrastructure.persistence.entity.CustomerEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerPersistenceMapper {

    CustomerEntity toEntity(Customer customer);

    Customer toDomain(CustomerEntity customerEntity);

}
