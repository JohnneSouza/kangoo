package dev.kangoo.domain.product;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Products")
@JsonPropertyOrder(value = {"id"})
public class ProductEntity extends Product{

    @Id
    @Schema(description = "The product unique identifier.", example = "6704bda3594e1e0331418105")
    private ObjectId id;

    public String getId() {
        return id.toString();
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
}
