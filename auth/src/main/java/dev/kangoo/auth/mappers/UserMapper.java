package dev.kangoo.auth.mappers;

import dev.kangoo.auth.controllers.dto.UserRegistrationResponse;
import dev.kangoo.auth.domain.user.User;
import dev.kangoo.auth.repositories.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "customerId", source = "customerId.value")
    @Mapping(target = "email", source = "email.value")
    UserRegistrationResponse toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerId", expression = "java(user.getCustomerId().value())")
    @Mapping(target = "email", expression = "java(user.getEmail().value())")
    @Mapping(target = "password", expression = "java(user.getPassword().getValue())")
    UserEntity toEntity(User user);

    @Mapping(target = "customerId", expression = "java(new CustomerId(entity.getCustomerId()))")
    @Mapping(target = "email", expression = "java(new Email(entity.getEmail()))")
    @Mapping(target = "password", expression = "java(Password.fromHashed(entity.getPassword()))")
    User toUser(UserEntity entity);

}
