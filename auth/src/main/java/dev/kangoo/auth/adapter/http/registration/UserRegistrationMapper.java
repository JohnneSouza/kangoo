package dev.kangoo.auth.adapter.http.registration;

import dev.kangoo.auth.application.registration.UserRegistrationInput;
import dev.kangoo.auth.application.registration.UserRegistrationOutput;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserRegistrationMapper {

    UserRegistrationInput mapToUserInput(UserRegistrationRequest request);

    UserRegistrationResponse mapToResponse(UserRegistrationOutput output);

}
