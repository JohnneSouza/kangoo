package com.kangoo.customers.domain.dto;

import org.bson.types.ObjectId;

import java.util.Date;

public abstract class CustomerProfileDTOMock {

    private CustomerProfileDTOMock(){}

    public static CustomerProfileDTO withAllFields() {
        CustomerProfileDTO customerProfileDTO = new CustomerProfileDTO();
        customerProfileDTO.setId(ObjectId.getSmallestWithDate(new Date()).toString());
        customerProfileDTO.setFirstName("firstName");
        customerProfileDTO.setLastName("lastName");
        customerProfileDTO.setEmail("email@provider.com");
        customerProfileDTO.setPhone("99999999999");

        return customerProfileDTO;
    }

}