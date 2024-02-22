package dev.kangoo.customers.domain.request;

import dev.kangoo.customers.domain.request.CustomerRequest;

public abstract class CustomerRequestMock {

    public static CustomerRequest withAllFields(){
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setPassword("somePassWord");
        customerRequest.setEmail("email@provider.com");
        customerRequest.setFirstName("Firstname");
        customerRequest.setLastName("Lastname");

        return customerRequest;
    }

}