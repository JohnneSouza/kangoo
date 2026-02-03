package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.port.TokenIssuer;
import dev.kangoo.auth.application.port.UserAuthenticator;
import dev.kangoo.auth.application.usecase.AuthenticateUserCommand;
import dev.kangoo.auth.application.usecase.AuthenticateUserUseCase;
import dev.kangoo.auth.application.view.AuthenticationView;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateUserService implements AuthenticateUserUseCase {

    private final UserAuthenticator userAuthenticator;
    private final TokenIssuer tokenIssuer;

    public AuthenticateUserService(UserAuthenticator userAuthenticator, TokenIssuer tokenIssuer) {
        this.userAuthenticator = userAuthenticator;
        this.tokenIssuer = tokenIssuer;
    }

    @Override
    public AuthenticationView execute(AuthenticateUserCommand command) {
        var user = this.userAuthenticator.authenticate(
                command.email(),
                command.password()
        );

        return this.tokenIssuer.issueToken(user);
    }
}
