package dev.kangoo.auth.application.exception;

public class ExpiredActivationTokenException extends RuntimeException {

    public ExpiredActivationTokenException() {
        super("The activation token has expired");
    }

}
