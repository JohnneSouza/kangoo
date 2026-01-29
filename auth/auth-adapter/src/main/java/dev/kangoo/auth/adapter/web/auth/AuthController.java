package dev.kangoo.auth.adapter.web.auth;

import dev.kangoo.auth.adapter.web.auth.dto.AuthenticationRequest;
import dev.kangoo.auth.application.usecase.AuthenticateUserCommand;
import dev.kangoo.auth.application.usecase.AuthenticateUserUseCase;
import dev.kangoo.auth.application.view.AuthenticationView;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthAPI {

    private final AuthenticateUserUseCase authenticateUserUseCase;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase;
    }

    @Override
    public AuthenticationView authenticate(AuthenticationRequest request) {
        var command = new AuthenticateUserCommand(request.getEmail(), request.getPassword());
        return this.authenticateUserUseCase.execute(command);
    }
}
