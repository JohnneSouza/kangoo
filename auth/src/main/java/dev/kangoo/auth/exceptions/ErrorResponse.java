package dev.kangoo.auth.exceptions;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ErrorResponse {

    private String type;
    private String instance;
    private String title;
    private List<String> errors;

}
