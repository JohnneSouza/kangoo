package dev.kangoo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ServerWebExchange;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalControllerAdvice {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFoundException(ProductNotFoundException ex, ServerWebExchange exchange) {
        Map<String, Object> errorAttributes = new HashMap<>();
        errorAttributes.put("error", ex.getMessage());
        errorAttributes.put("path", exchange.getRequest().getPath().value());
        errorAttributes.put("requestId", exchange.getRequest().getId());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorAttributes);
    }
}
