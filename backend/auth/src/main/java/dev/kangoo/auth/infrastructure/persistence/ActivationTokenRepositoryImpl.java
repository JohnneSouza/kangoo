package dev.kangoo.auth.infrastructure.persistence;

import dev.kangoo.auth.domain.repository.ActivationTokenRepository;
import dev.kangoo.auth.domain.user.ActivationToken;
import dev.kangoo.auth.infrastructure.persistence.entity.ActivationTokenEntity;
import dev.kangoo.auth.infrastructure.persistence.mapper.ActivationTokenPersistenceMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ActivationTokenRepositoryImpl implements ActivationTokenRepository {

    private final SpringDataActivationRepository activationRepository;
    private final ActivationTokenPersistenceMapper mapper;

    public ActivationTokenRepositoryImpl(SpringDataActivationRepository activationRepository, ActivationTokenPersistenceMapper mapper) {
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
        ActivationTokenEntity entity = this.activationRepository.findByToken(token);
        return entity == null ? null : this.mapper.toDomain(entity);
    }

    @Override
    public void deleteByToken(String token) {
        this.activationRepository.deleteByToken(token);
    }
}
