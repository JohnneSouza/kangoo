package dev.kangoo.auth.mappers;

import dev.kangoo.auth.domain.model.AuthUser;
import dev.kangoo.auth.domain.model.AuthUserEntity;
import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMappers {

    CustomerResponse toResponse(AuthUserEntity entity);

    @Mapping(target = "userRoles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    AuthUserEntity toEntity(CustomerRequest customerRequest);

    default AuthUser toAuthUser(AuthUserEntity entity){
        AuthUser authUser = new AuthUser();
        authUser.setPassword(entity.getPasswordHash());
        authUser.setEnabled(entity.isEnabled());
        authUser.setRole(entity.getUserRoles());
        authUser.setId(entity.getCustomerId());
        authUser.setEmail(entity.getEmail());

        return authUser;
    }
}
