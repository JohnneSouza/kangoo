package com.kangoo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
@EnableWebFlux
public class CorsGlobalConfiguration implements WebFluxConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")  // Adjust this for production as needed
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Specify methods you want to allow
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(false);  // Set to true if you need to pass credentials
    }
}
