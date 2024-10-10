package dev.kangoo.customers.converters;

import dev.kangoo.customers.domain.dto.CustomerProfileDTO;
import dev.kangoo.customers.domain.dto.CustomerSignupDTO;
import dev.kangoo.customers.domain.entity.CustomerEntity;

public interface Converter {

    CustomerProfileDTO convertToDto(CustomerEntity source);

    CustomerEntity convertToEntity(CustomerSignupDTO source);

}
