package dev.kangoo.com.customers;

import dev.kangoo.com.customers.testsconfig.TestContainersAbstractConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class CustomersApplicationTest extends TestContainersAbstractConfig {

    @Test
    void contextLoads(){}

    @Test
    public void mainExecution() {
        assertThrows(BeanCreationException.class, () -> CustomersApplication.main(new String[] {}));
    }

}