package dev.kangoo.auth.infrastructure.persistence.mapper;

import dev.kangoo.auth.domain.user.ActivationToken;
import dev.kangoo.auth.infrastructure.persistence.entity.ActivationTokenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivationTokenPersistenceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerId", expression = "java(activationToken.customerId().value())")
    @Mapping(target = "token", expression = "java(activationToken.token().value())")
    ActivationTokenEntity toEntity(ActivationToken activationToken);


    @Mapping(target = "customerId", expression = "java(new CustomerId(activationToken.getCustomerId()))")
    @Mapping(target = "token", expression = "java(new TokenValue(activationToken.getToken()))")
    ActivationToken toDomain(ActivationTokenEntity activationToken);
}
