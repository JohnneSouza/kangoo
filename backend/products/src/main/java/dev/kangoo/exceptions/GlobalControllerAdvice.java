package dev.kangoo.exceptions;

import dev.kangoo.domain.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ServerWebExchange;

@ControllerAdvice
public class GlobalControllerAdvice {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFoundException(ProductNotFoundException ex, ServerWebExchange exchange) {
        ErrorResponse errorAttributes = new ErrorResponse();
        errorAttributes.setMessage(ex.getMessage());
        errorAttributes.addDetail("path " + exchange.getRequest().getURI().getPath());
        errorAttributes.setTraceId(exchange.getRequest().getId());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorAttributes);
    }
}
