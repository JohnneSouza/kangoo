package dev.kangoo.auth.controller;

import dev.kangoo.auth.controller.dto.CreateUserRequest;
import dev.kangoo.auth.controller.dto.UserCreatedResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@RequestMapping("/v1")
public interface Auth {

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    UserCreatedResponse register(@RequestBody CreateUserRequest request);

}
