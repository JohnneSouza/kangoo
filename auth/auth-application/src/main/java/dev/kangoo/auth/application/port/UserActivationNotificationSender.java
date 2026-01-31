package dev.kangoo.auth.application.port;

import dev.kangoo.auth.domain.model.user.Email;

public interface UserActivationNotificationSender {
    void send(Email email);
}
