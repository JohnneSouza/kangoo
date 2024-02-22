package dev.kangoo.customers.handler;

import dev.kangoo.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.customers.domain.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleCustomerAlreadyExistsException(CustomerAlreadyExistsException ex) {
        ErrorResponse response = new ErrorResponse();
        response.setMessage("Customer already exists.");
        response.setDetails(List.of("A customer with email '"+ ex.getMessage() +"' already exists."));

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        ErrorResponse response = new ErrorResponse();
        response.setMessage("Required argument is null or missing.");

        List<String> errorDetails = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> errorDetails.add(error.getDefaultMessage()));

        response.setDetails(errorDetails);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON).body(response);
    }

}
