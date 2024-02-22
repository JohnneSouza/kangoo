package dev.kangoo.customers.domain.entity;

import dev.kangoo.customers.domain.request.CustomerRequest;
import dev.kangoo.customers.domain.response.CustomerResponse;

public abstract class CustomerEntityBuilder {

    private CustomerEntityBuilder(){}

    public static CustomerEntity fromCustomerRequest(CustomerRequest customerRequest) {
        CustomerEntity entity = new CustomerEntity();
        entity.setFirstName(customerRequest.getFirstName());
        entity.setLastName(customerRequest.getLastName());
        entity.setEmail(customerRequest.getEmail());

        return entity;
    }

    public static CustomerResponse toCustomerResponse(CustomerEntity saved) {
        CustomerResponse response = new CustomerResponse();
        response.setId(saved.getId());
        response.setFirstName(saved.getFirstName());
        response.setLastName(saved.getLastName());
        response.setEmail(saved.getEmail());

        return response;
    }
}
