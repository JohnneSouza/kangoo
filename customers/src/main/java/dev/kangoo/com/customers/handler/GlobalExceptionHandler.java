package dev.kangoo.com.customers.handler;

import dev.kangoo.com.customers.domain.exceptions.CustomerAlreadyExistsException;
import dev.kangoo.com.customers.domain.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerAlreadyExistsException.class)
    public ResponseEntity<Object> handleCustomerAlreadyExistsException(CustomerAlreadyExistsException ex) {
        ErrorResponse response = new ErrorResponse();
        response.setMessage("Customer already exists.");
        response.setDetails(List.of("A customer with email '"+ ex.getMessage() +"' already exists."));

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

}
