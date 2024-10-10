package com.kangoo.customers.converters;

import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import com.kangoo.customers.domain.dto.CustomerSignupDTO;
import com.kangoo.customers.domain.entity.CustomerEntity;
import org.springframework.stereotype.Component;

@Component
public class CustomerConverter implements Converter{

    @Override
    public CustomerProfileDTO convertToDto(CustomerEntity source) {
        CustomerProfileDTO target = new CustomerProfileDTO();
        target.setId(source.getId().toString());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhone(source.getPhone());

        return target;
    }

    @Override
    public CustomerEntity convertToEntity(CustomerSignupDTO source) {
        CustomerEntity target = new CustomerEntity();
        target.setPassword(source.getPassword());
        target.setPhone(source.getPhone());
        target.setEmail(source.getEmail());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());

        return target;
    }
}
