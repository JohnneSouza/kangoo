package dev.kangoo.customers.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;

@Configuration
public class PasswordEncoderProvider {

    @Bean
    public PasswordEncoder passwordEncoderProducer(){
        return new BCryptPasswordEncoder(10, new SecureRandom());
    }

}
