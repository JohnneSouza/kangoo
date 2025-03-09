package dev.kangoo.customers.services;

import dev.kangoo.customers.domain.entities.CustomerEntity;
import dev.kangoo.customers.domain.requests.CustomerSignupRequest;
import dev.kangoo.customers.mappers.CustomerMapper;
import dev.kangoo.customers.respositories.CustomerRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private static final Logger log = LogManager.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public void registerCustomer(CustomerSignupRequest customerSignupRequest) {
        CustomerEntity entity = this.customerMapper.toEntity(customerSignupRequest);
        this.customerRepository.save(entity);
        log.info("Customer registered successfully");
    }
}
