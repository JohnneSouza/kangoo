package dev.kangoo.auth.exceptions.handlers;

import dev.kangoo.auth.exceptions.ErrorResponse;
import dev.kangoo.auth.exceptions.InvalidCredentialsException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

import static dev.kangoo.auth.exceptions.handlers.Constants.PROBLEM_BASE_URI;

@ControllerAdvice
public class AuthExceptionHandler {

    private static final MediaType PROBLEM_JSON = MediaType.parseMediaType("application/problem+json");

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException ex,
            HttpServletRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .type(PROBLEM_BASE_URI + "/invalid-credentials")
                .title("Invalid Credentials")
                .errors(List.of(ex.getMessage()))
                .instance(request.getRequestURI())
                .build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .contentType(PROBLEM_JSON)
                .body(error);
    }
}
