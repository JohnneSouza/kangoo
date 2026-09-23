package dev.kangoo.auth.infrastructure.persistence.mapper;

import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.infrastructure.persistence.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerId", expression = "java(user.getCustomerId().value())")
    @Mapping(target = "email", expression = "java(user.getEmail().value())")
    @Mapping(target = "password", expression = "java(user.getPassword().value())")
    @Mapping(target = "authority", expression = "java(user.getAuthority().value())")
    @Mapping(target = "enabled", expression = "java(user.getStatus().isEnabled())")
    UserEntity toEntity(User user);

    @Mapping(target = "customerId", expression = "java(new CustomerId(entity.getCustomerId()))")
    @Mapping(target = "email", expression = "java(new Email(entity.getEmail()))")
    @Mapping(target = "password", expression = "java(Password.fromHashed(entity.getPassword()))")
    @Mapping(target = "authority", expression = "java(Authority.roleUser())")
    @Mapping(target = "status", expression = "java(new Status(entity.isEnabled()))")
    User toUser(UserEntity entity);
}
