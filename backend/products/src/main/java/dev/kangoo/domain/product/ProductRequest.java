package dev.kangoo.domain.product;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class ProductRequest {

    @Schema(description = "The product name.", example = "Awesome Refrigerator")
    private String name;

    @Schema(description = "A brief description of the product, highlighting its features and benefits.",
            example = "This refrigerator features a spacious interior, energy efficiency, and a sleek design.")
    private String description;

    @Schema(description = "The price of the product in USD.",
            example = "599.99")
    private BigDecimal price;

    @Schema(description = "A URL pointing to an image of the product.",
            example = "https://example.com/images/awesome-refrigerator.jpg")
    private String imageUrl;

    @Schema(description = "The category to which the product belongs, e.g., 'Appliances', 'Electronics'.",
            example = "Appliances")
    private String category;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
