package dev.kangoo.auth.application.port;

import dev.kangoo.auth.application.view.AuthenticationView;
import dev.kangoo.auth.domain.user.User;

public interface TokenIssuer {

    AuthenticationView issueToken(User user);

}