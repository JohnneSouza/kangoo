package dev.kangoo.auth.application.service;

import dev.kangoo.auth.application.event.UserRegisteredEvent;
import dev.kangoo.auth.application.port.UserActivationNotificationSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Sends the activation mail once the registration transaction has committed.
 *
 * <p>Sending inside the transaction would let the mail escape for a registration that later
 * rolls back, leaving the user with an activation link that resolves to nothing.
 */
@Component
public class UserActivationNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(UserActivationNotificationListener.class);

    private final UserActivationNotificationSender notificationSender;

    public UserActivationNotificationListener(UserActivationNotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(UserRegisteredEvent event) {
        try {
            this.notificationSender.send(event.email(), event.token());
        } catch (RuntimeException exception) {
            // The registration is already committed, so failing the request here would tell the
            // caller their registration was rejected when it was not. Log it and let the
            // activation link be re-requested instead.
            log.error("Registration committed but the activation email could not be sent to {}",
                    event.email().value(), exception);
        }
    }
}
