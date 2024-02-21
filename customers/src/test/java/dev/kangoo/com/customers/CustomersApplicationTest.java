package dev.kangoo.com.customers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CustomersApplicationTest {

    @Test
    void contextLoads() {
    }

    @Test
    public void mainExecution() {
        CustomersApplication.main(new String[] {});
    }

}