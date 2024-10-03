package com.kangoo.customers.converters;

import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTO;
import com.kangoo.customers.domain.entity.CustomerEntity;

public interface Converter {

    CustomerProfileDTO convertToDto(CustomerEntity source);

    CustomerEntity convertToEntity(CustomerSignupDTO source);

}
