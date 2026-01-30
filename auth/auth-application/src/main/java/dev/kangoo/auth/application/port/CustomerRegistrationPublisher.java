package dev.kangoo.auth.application.port;

import dev.kangoo.auth.application.event.RegisterCustomerEvent;

public interface CustomerRegistrationPublisher {

    void publish(RegisterCustomerEvent event);

}
