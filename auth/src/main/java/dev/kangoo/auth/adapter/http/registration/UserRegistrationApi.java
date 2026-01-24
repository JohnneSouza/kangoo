package dev.kangoo.auth.adapter.http.registration;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@RequestMapping(
        value = "/v1/auth",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public interface UserRegistrationApi {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    UserRegistrationResponse register(@RequestBody UserRegistrationRequest request);

}
