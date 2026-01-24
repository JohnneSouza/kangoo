package dev.kangoo.auth.adapter.http.registration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class UserRegistrationRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;

}
