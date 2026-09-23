package dev.kangoo.auth.adapter.auth;

import dev.kangoo.auth.adapter.auth.dto.AuthenticationRequest;
import dev.kangoo.auth.application.usecase.ActivateUserCommand;
import dev.kangoo.auth.application.usecase.ActivateUserUseCase;
import dev.kangoo.auth.application.usecase.AuthenticateUserCommand;
import dev.kangoo.auth.application.usecase.AuthenticateUserUseCase;
import dev.kangoo.auth.application.view.AuthenticationView;
import dev.kangoo.auth.infrastructure.config.ActivationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class AuthController implements AuthAPI {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final ActivateUserUseCase activateUserUseCase;
    private final TokenCookieProperties cookieProperties;
    private final ActivationProperties activationProperties;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase, ActivateUserUseCase activateUserUseCase,
                          TokenCookieProperties cookieProperties, ActivationProperties activationProperties) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.activateUserUseCase = activateUserUseCase;
        this.cookieProperties = cookieProperties;
        this.activationProperties = activationProperties;
    }

    @Override
    public ResponseEntity<Void> authenticate(AuthenticationRequest request) {
        var command = new AuthenticateUserCommand(request.getEmail(), request.getPassword());
        AuthenticationView response = this.authenticateUserUseCase.execute(command);

        ResponseCookie cookie = ResponseCookie.from("token", response.token())
                .httpOnly(true)
                .secure(this.cookieProperties.secure())
                .path("/")
                .sameSite(this.cookieProperties.sameSite())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(null);
    }

    @Override
    public ResponseEntity<Void> activate(String token) {
        var command = new ActivateUserCommand(token);
        this.activateUserUseCase.execute(command);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(this.activationProperties.successRedirectUrl()))
                .build();
    }
}
