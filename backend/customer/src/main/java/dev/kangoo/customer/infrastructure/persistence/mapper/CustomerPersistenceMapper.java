package dev.kangoo.customer.infrastructure.persistence.mapper;

import dev.kangoo.customer.domain.model.Customer;
import dev.kangoo.customer.infrastructure.persistence.entity.CustomerEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerPersistenceMapper {

    CustomerEntity toEntity(Customer customer);

    Customer toDomain(CustomerEntity customerEntity);

}
