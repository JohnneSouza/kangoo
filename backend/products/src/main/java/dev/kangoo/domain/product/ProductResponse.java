package dev.kangoo.domain.product;

import io.swagger.v3.oas.annotations.media.Schema;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public final class ProductResponse extends ProductRequest {

    @Id
    @Schema(description = "The product unique identifier.", example = "6704bda3594e1e0331418105")
    private ObjectId id;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

}
