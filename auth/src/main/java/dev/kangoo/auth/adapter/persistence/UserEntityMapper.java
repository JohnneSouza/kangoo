package dev.kangoo.auth.adapter.persistence;

import dev.kangoo.auth.domain.user.CustomerId;
import dev.kangoo.auth.domain.user.Email;
import dev.kangoo.auth.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    @Mapping(target = "name", expression = "java(new Name(entity.getFirstName(), entity.getLastName()))")
    @Mapping(target = "password", expression = "java(new Password(entity.getPasswordHash()))")
    @Mapping(target = "phone", expression = "java(new Phone(entity.getPhone()))")
    User toDomain(UserEntity entity);

    @Mapping(target = "customerId", expression = "java(user.getCustomerId().value())")
    @Mapping(target = "email", expression = "java(user.getEmail().value())")
    @Mapping(target = "firstName", expression = "java(user.getName().firstName())")
    @Mapping(target = "lastName", expression = "java(user.getName().lastName())")
    @Mapping(target = "passwordHash", expression = "java(user.getPassword().value())")
    @Mapping(target = "phone", expression = "java(user.getPhone().value())")
    UserEntity toEntity(User user);

    default CustomerId map(String value) {
        return value == null ? null : new CustomerId(value);
    }

    default String map(CustomerId value) {
        return value == null ? null : value.value();
    }

    default Email mapEmail(String value) {
        return value == null ? null : new Email(value);
    }

    default String mapEmail(Email value) {
        return value == null ? null : value.value();
    }
}
