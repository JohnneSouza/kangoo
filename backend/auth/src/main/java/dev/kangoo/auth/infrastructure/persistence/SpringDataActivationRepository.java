package dev.kangoo.auth.infrastructure.persistence;

import dev.kangoo.auth.infrastructure.persistence.entity.ActivationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataActivationRepository extends JpaRepository<ActivationTokenEntity, Long> {

    ActivationTokenEntity findByToken(String token);

    void deleteByToken(String token);

}
