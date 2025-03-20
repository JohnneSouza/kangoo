package dev.kangoo.auth.services.outbox;

import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.repositories.outbox.SignupOutboxRepository;
import org.springframework.stereotype.Service;

@Service
public class SignupOutboxService {

    private final SignupOutboxRepository signupOutboxRepository;

    public SignupOutboxService(SignupOutboxRepository signupOutboxRepository) {
        this.signupOutboxRepository = signupOutboxRepository;
    }

    public void saveMessage(CustomerRequest customerRequest) {

    }
}
