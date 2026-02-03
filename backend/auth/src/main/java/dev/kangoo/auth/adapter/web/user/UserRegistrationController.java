package dev.kangoo.auth.adapter.web.user;

import dev.kangoo.auth.adapter.web.user.dto.UserRegistrationRequest;
import dev.kangoo.auth.application.usecase.UserRegistrationCommand;
import dev.kangoo.auth.application.usecase.UserRegistrationUseCase;
import dev.kangoo.auth.application.view.UserRegistrationView;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRegistrationController implements UserRegistrationAPI {

    private final UserRegistrationUseCase userRegistrationUseCase;

    public UserRegistrationController(UserRegistrationUseCase userRegistrationUseCase) {
        this.userRegistrationUseCase = userRegistrationUseCase;
    }

    public UserRegistrationView register(UserRegistrationRequest request) {
        var command = new UserRegistrationCommand(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword());

        return this.userRegistrationUseCase.execute(command);
    }

}
