package com.kangoo.customers.domain.dto;

public abstract class CustomerSignupDTOMock {

    private CustomerSignupDTOMock(){}

    public static CustomerSignupDTO withAllFields() {
        CustomerSignupDTO customerSignupDTO = new CustomerSignupDTO();
        customerSignupDTO.setFirstName("firstName");
        customerSignupDTO.setLastName("lastName");
        customerSignupDTO.setEmail("email@provider.com");
        customerSignupDTO.setPassword("password");
        return customerSignupDTO;
    }

}