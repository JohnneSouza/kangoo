package dev.kangoo.auth.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "dev.kangoo.auth")
public class AuthApplication {

    static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }

}
