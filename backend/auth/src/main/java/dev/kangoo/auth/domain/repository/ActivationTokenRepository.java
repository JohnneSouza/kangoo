package dev.kangoo.auth.domain.repository;

import dev.kangoo.auth.domain.user.ActivationToken;

public interface ActivationTokenRepository {

    void save(ActivationToken activationToken);

    ActivationToken findByToken(String token);

}
