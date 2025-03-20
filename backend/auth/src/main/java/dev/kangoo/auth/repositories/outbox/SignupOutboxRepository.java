package dev.kangoo.auth.repositories.outbox;

import dev.kangoo.auth.domain.model.CustomerOutboxEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignupOutboxRepository extends JpaRepository<CustomerOutboxEntity, String> {
}
