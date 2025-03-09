package dev.kangoo.auth.repositories;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import org.springframework.data.repository.CrudRepository;

public interface AuthUserRepository extends CrudRepository<AuthUserEntity, Long> {

    AuthUserEntity findByEmail(String email);

}
