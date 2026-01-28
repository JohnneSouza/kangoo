package dev.kangoo.customers.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(scanBasePackages = "dev.kangoo.customers")
public class CustomersInfrastructure {

    static void main(String[] args) {
        SpringApplication.run(CustomersInfrastructure.class, args);
    }

}
