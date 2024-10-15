package dev.kangoo.controller;

import dev.kangoo.domain.dto.ErrorResponse;
import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Tag(name = "Products", description = "Products managing API.")
public interface ProductsAPI {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new product.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Product created with success.",
                    content = @Content(schema = @Schema(implementation = ProductResponseEntity.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ProductResponseEntity save(@RequestBody Product product);


    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Find a product by its ID.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product found.",
                    content = @Content(schema = @Schema(implementation = ProductResponseEntity.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ProductResponseEntity findOne(@PathVariable String id);

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update an existing product.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product updated with success.",
                    content = @Content(schema = @Schema(implementation = ProductResponseEntity.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ProductResponseEntity updateOne(@PathVariable String id, @RequestBody Product product);

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Return all products.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Products found.",
                    content = @Content(schema = @Schema(implementation = ProductResponseEntity.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No Product found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    List<ProductResponseEntity> findAll();

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a product with the given ID.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Product removed."
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found.",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    void delete(@PathVariable String id);

}
