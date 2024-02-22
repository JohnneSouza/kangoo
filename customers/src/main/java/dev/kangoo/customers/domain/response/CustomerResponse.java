package dev.kangoo.customers.domain.response;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import dev.kangoo.customers.domain.Customer;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@JsonPropertyOrder({"id"})
public class CustomerResponse extends Customer {

    @Schema(description = "Customer's unique identifier.", example = "eb228892-a3ad-44ee-85e7-4a82f4ba80a6")
    private UUID id;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}
