package dev.kangoo.customers.domain.entity;

import dev.kangoo.customers.domain.entity.CustomerEntity;

import java.util.UUID;

public abstract class CustomerEntityMock {

    public static CustomerEntity withAllFields(){
        CustomerEntity customerEntity = new CustomerEntity();
        customerEntity.setPasswordHash("$2b$10$t7oxiwchWGHa/B9w0AzrYO2WH2rQbA86YSuQjSTmwIrpC/0ZXN7V2");
        customerEntity.setEmail("email@provider.com");
        customerEntity.setFirstName("Firstname");
        customerEntity.setLastName("Lastname");
        customerEntity.setId(UUID.randomUUID());

        return customerEntity;
    }

}
