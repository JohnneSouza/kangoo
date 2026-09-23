package dev.kangoo.auth.application.usecase;

import dev.kangoo.auth.application.view.AuthenticationView;

public interface AuthenticateUserUseCase {

    AuthenticationView execute(AuthenticateUserCommand command);

}
