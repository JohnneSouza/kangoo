package dev.kangoo.auth.adapter.error;

import dev.kangoo.auth.application.exception.ExpiredActivationTokenException;
import dev.kangoo.auth.application.exception.InvalidActivationTokenException;
import dev.kangoo.auth.application.exception.InvalidCredentialsException;
import dev.kangoo.auth.domain.exception.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    ProblemDetail handleUserAlreadyExists(UserAlreadyExistsException exception) {
        return problem(HttpStatus.CONFLICT, "Registration rejected", exception.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    ProblemDetail handleInvalidCredentials(InvalidCredentialsException exception) {
        return problem(HttpStatus.UNAUTHORIZED, "Authentication failed", exception.getMessage());
    }

    @ExceptionHandler(InvalidActivationTokenException.class)
    ProblemDetail handleInvalidActivationToken(InvalidActivationTokenException exception) {
        return problem(HttpStatus.BAD_REQUEST, "Activation failed", exception.getMessage());
    }

    @ExceptionHandler(ExpiredActivationTokenException.class)
    ProblemDetail handleExpiredActivationToken(ExpiredActivationTokenException exception) {
        return problem(HttpStatus.GONE, "Activation failed", exception.getMessage());
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        return problem;
    }

}
