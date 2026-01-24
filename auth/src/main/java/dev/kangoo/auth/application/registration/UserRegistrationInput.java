package dev.kangoo.auth.application.registration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationInput {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;

}
