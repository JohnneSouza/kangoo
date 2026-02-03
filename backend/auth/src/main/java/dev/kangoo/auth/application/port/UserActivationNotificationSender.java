package dev.kangoo.auth.application.port;

import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.TokenValue;

public interface UserActivationNotificationSender {

    void send(Email email, TokenValue token);

}
