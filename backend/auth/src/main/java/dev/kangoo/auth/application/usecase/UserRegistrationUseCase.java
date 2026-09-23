package dev.kangoo.auth.application.usecase;

import dev.kangoo.auth.application.view.UserRegistrationView;

public interface UserRegistrationUseCase {

    UserRegistrationView execute(UserRegistrationCommand command);

}
