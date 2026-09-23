package dev.kangoo.auth.application.exception;

public class InvalidActivationTokenException extends RuntimeException {

    public InvalidActivationTokenException() {
        super("The activation token is not valid");
    }

}
