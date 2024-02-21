package dev.kangoo.com.customers.domain.request;

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