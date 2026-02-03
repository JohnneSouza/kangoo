package dev.kangoo.auth.infrastructure.repository;

import dev.kangoo.auth.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataUserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    UserEntity findByEmail(String email);

    @Modifying
    @Query("UPDATE UserEntity u SET u.enabled = true WHERE u.customerId = :customerId AND u.enabled = false")
    int activateUser(@Param("customerId") String customerId);

}
