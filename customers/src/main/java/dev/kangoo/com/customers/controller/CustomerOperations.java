package dev.kangoo.com.customers.controller;

import dev.kangoo.com.customers.domain.request.CustomerRequest;
import dev.kangoo.com.customers.domain.response.CustomerResponse;
import dev.kangoo.com.customers.domain.response.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "Customers")
@RequestMapping(value = "customers",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public interface CustomerOperations {

    @PostMapping
    @Operation(summary = "Creates a new Customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Customer created",
                    content = { @Content(schema = @Schema(implementation = CustomerResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid data was supplied",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))})
    @ResponseStatus(HttpStatus.CREATED)
    CustomerResponse createCustomer(@RequestBody @Valid CustomerRequest customerRequest);

}
