package dev.kangoo.auth.adapter.http.registration;

import dev.kangoo.auth.application.registration.UserRegistrationInput;
import dev.kangoo.auth.application.registration.UserRegistrationOutput;
import dev.kangoo.auth.application.registration.UserRegistrationUseCase;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRegistrationController implements UserRegistrationApi{

    private final UserRegistrationMapper mapper;
    private final UserRegistrationUseCase userRegistrationUseCase;

    public UserRegistrationController(UserRegistrationMapper mapper, UserRegistrationUseCase userRegistrationUseCase) {
        this.mapper = mapper;
        this.userRegistrationUseCase = userRegistrationUseCase;
    }

    public UserRegistrationResponse register(UserRegistrationRequest request) {
        UserRegistrationInput input = this.mapper.mapToUserInput(request);
        UserRegistrationOutput userRegistration = this.userRegistrationUseCase.register(input);
        return this.mapper.mapToResponse(userRegistration);
    }

}
