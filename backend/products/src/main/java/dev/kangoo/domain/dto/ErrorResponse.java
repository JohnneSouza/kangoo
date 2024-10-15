package dev.kangoo.domain.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

public class ErrorResponse {

    @Schema(description ="A brief description about the error.", example = "Invalid request.")
    private String message;

    @ArraySchema(
            schema = @Schema(
                    description = "A list of detailed messages indicating validation errors. Each message specifies a requirement that must be met by the corresponding fields in the request.",
                    example = "'email' must not be null or empty"
            )
    )
    private final List<String> details = new ArrayList<>();


    @Schema(description ="The ID used to identify a single request as it crosses the applications boundaries", example = "f5d9acc9-7206-4429-bfa4-6898f3479b5c")
    private String traceId;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void addDetail(String detail) {
        this.details.add(detail);
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }
}
