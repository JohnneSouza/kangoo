package dev.kangoo.com.customers.domain.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public class ErrorResponse {

    @Schema(description = "Error message.", example = "Required argument is null or missing.")
    private String message;

    @Schema(description = "Details related to the error.",
            example = "[\"The field 'email' should not be null or empty.\"]")
    private List<String> details;


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
