package dev.kangoo.auth.controllers;

import dev.kangoo.auth.controllers.dto.UserRegistrationRequest;
import dev.kangoo.auth.controllers.dto.UserRegistrationResponse;
import dev.kangoo.auth.services.UserRegistrationService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRegistrationController implements UserRegistrationAPI {

    private final UserRegistrationService userRegistrationService;

    public UserRegistrationController(UserRegistrationService userRegistrationService) {
        this.userRegistrationService = userRegistrationService;
    }

    public UserRegistrationResponse register(UserRegistrationRequest request) {
        return this.userRegistrationService.register(request);
    }

}
