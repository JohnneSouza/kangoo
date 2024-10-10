package com.kangoo.customers.controller;

import com.kangoo.customers.domain.dto.CustomerLoginDTO;
import com.kangoo.customers.domain.dto.CustomerProfileDTO;
import io.swagger.v3.oas.annotations.media.SchemaProperty;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

@Tag(name = "Authentication")
public interface Auth {

    @SchemaProperty(name = "Customer Login")
    @PostMapping
    ResponseEntity<Mono<CustomerProfileDTO>>login(@RequestBody CustomerLoginDTO login, ServerHttpResponse response);
}
