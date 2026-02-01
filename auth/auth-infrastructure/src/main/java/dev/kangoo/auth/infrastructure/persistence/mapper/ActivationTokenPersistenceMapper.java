package dev.kangoo.auth.infrastructure.persistence.mapper;

import dev.kangoo.auth.domain.model.user.ActivationToken;
import dev.kangoo.auth.infrastructure.persistence.entity.ActivationTokenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivationTokenPersistenceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerId", expression = "java(activationToken.getCustomerId().value())")
    @Mapping(target = "token", expression = "java(activationToken.getToken().value())")
    ActivationTokenEntity toEntity(ActivationToken activationToken);
}
