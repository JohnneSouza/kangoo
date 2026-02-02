package dev.kangoo.auth.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String userId) {
        super("User already exists: " + userId);
    }

}
