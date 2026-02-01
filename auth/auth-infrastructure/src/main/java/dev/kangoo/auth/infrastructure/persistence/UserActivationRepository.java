package dev.kangoo.auth.infrastructure.persistence;

import dev.kangoo.auth.domain.model.user.ActivationToken;
import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.infrastructure.persistence.entity.ActivationTokenEntity;
import dev.kangoo.auth.infrastructure.persistence.mapper.ActivationTokenPersistenceMapper;
import dev.kangoo.auth.infrastructure.repository.SpringDataActivationRepository;
import org.springframework.stereotype.Repository;

@Repository
public class UserActivationRepository implements ActivationTokenRepository {

    private final SpringDataActivationRepository activationRepository;
    private final ActivationTokenPersistenceMapper mapper;

    public UserActivationRepository(SpringDataActivationRepository activationRepository, ActivationTokenPersistenceMapper mapper) {
        this.activationRepository = activationRepository;
        this.mapper = mapper;
    }

    @Override
    public void save(ActivationToken activationToken) {
        ActivationTokenEntity entity = this.mapper.toEntity(activationToken);
        this.activationRepository.save(entity);
    }

    @Override
    public ActivationToken findByToken(String token) {
        var activationToken = this.activationRepository.findByToken(token);
        return this.mapper.toDomain(activationToken);
    }
}
