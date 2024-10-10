package com.kangoo.customers.domain.entity;

import org.bson.types.ObjectId;

import java.util.Date;

public abstract class CustomerEntityMock {

    private CustomerEntityMock(){}

    public static CustomerEntity withAllFields() {
        CustomerEntity customerEntity = new CustomerEntity();
        customerEntity.setId(ObjectId.getSmallestWithDate(new Date()));
        customerEntity.setPhone("99999999999");
        customerEntity.setPassword("password");
        customerEntity.setFirstName("firstName");
        customerEntity.setLastName("lastName");
        customerEntity.setEmail("email@provider.com");
        customerEntity.setCreatedDate(new Date().getTime());
        customerEntity.setLastModifiedDate(new Date().getTime());

        return customerEntity;
    }

}