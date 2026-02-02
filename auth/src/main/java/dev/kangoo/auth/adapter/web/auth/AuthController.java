package dev.kangoo.auth.adapter.web.auth;

import dev.kangoo.auth.adapter.web.auth.dto.AuthenticationRequest;
import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.application.usecase.AuthenticateUserCommand;
import dev.kangoo.auth.application.usecase.AuthenticateUserUseCase;
import dev.kangoo.auth.application.view.AuthenticationView;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class AuthController implements AuthAPI {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final ActivateUserUseCase activateUserUseCase;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase, ActivateUserUseCase activateUserUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.activateUserUseCase = activateUserUseCase;
    }

    @Override
    public AuthenticationView authenticate(AuthenticationRequest request) {
        var command = new AuthenticateUserCommand(request.getEmail(), request.getPassword());
        return this.authenticateUserUseCase.execute(command);
    }

    @Override
    public ResponseEntity<Void> activate(String token) {
        var command = new ActivateUserCommand(token);
        this.activateUserUseCase.execute(command);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("http://localhost:5173/activation-success"))
                .build();
    }
}
