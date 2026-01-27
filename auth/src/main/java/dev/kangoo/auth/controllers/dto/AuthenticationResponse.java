package dev.kangoo.auth.controllers.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class AuthenticationResponse {

    private String token;
    private String tokenType;
    private String expiresIn;

}
