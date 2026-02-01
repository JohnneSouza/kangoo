package dev.kangoo.auth.application.port;

import dev.kangoo.auth.domain.model.user.Email;
import dev.kangoo.auth.domain.model.user.TokenValue;

public interface UserActivationNotificationSender {

    void send(Email email, TokenValue token);

}
