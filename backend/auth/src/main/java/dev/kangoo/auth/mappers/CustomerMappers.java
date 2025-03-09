package dev.kangoo.auth.mappers;

import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMappers {

    CustomerResponse toResponse(AuthUserEntity entity);


    @Mapping(target = "passwordHash", source = "password")
    AuthUserEntity toEntity(CustomerRequest customerRequest);

}
