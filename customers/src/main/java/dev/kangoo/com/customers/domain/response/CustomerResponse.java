package dev.kangoo.com.customers.domain.response;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import dev.kangoo.com.customers.domain.Customer;
import io.swagger.v3.oas.annotations.media.Schema;

@JsonPropertyOrder({"id"})
public class CustomerResponse extends Customer {

    @Schema(description = "Customer's unique identifier.", example = "123")
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
