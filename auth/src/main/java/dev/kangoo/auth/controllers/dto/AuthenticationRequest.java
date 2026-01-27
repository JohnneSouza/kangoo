package dev.kangoo.auth.controllers.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class AuthenticationRequest {

    private String email;
    private String password;

}
