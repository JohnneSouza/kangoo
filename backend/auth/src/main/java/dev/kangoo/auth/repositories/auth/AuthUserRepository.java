package dev.kangoo.auth.repositories.auth;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface AuthUserRepository extends CrudRepository<AuthUserEntity, Long> {

    AuthUserEntity findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE auth_user u SET u.enabled = true WHERE u.customerId = :customerId")
    void enableUserByCustomerId(String customerId);

}
