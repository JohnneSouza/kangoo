package dev.kangoo.controller;

import dev.kangoo.domain.dto.ErrorResponse;
import dev.kangoo.domain.product.ProductEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Tag(name = "Products", description = "Products managing API.")
public interface ProductsAPI {

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find a product by its ID.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product found.",
                    content = @Content(schema = @Schema(implementation = ProductEntity.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ProductEntity findOne(@PathVariable String id);

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Return all products.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Products found.",
                    content = @Content(schema = @Schema(implementation = ProductEntity.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No Product found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    List<ProductEntity> findAll();

}
