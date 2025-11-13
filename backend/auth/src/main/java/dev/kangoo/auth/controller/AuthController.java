package dev.kangoo.auth.controller;

import dev.kangoo.auth.controller.dto.CreateUserRequest;
import dev.kangoo.auth.controller.dto.UserCreatedResponse;
import dev.kangoo.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AuthController implements Auth {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    public UserCreatedResponse register(CreateUserRequest newUserRequest) {
        return this.userService.register(newUserRequest);
    }
}
