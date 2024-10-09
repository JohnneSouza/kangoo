package com.kangoo.controller;

import com.kangoo.domain.product.Product;
import com.kangoo.domain.product.ProductEntity;
import com.kangoo.service.ProductsService;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping(value = "products",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping
    public Flux<ProductEntity> findAll(ServerHttpResponse response){
        response.getHeaders().add("Content-Range", "10");
        return this.productsService.getAllProducts();
    }

    @PostMapping
    public Mono<ProductEntity> save(@RequestBody Product product, ServerHttpResponse response){
        return this.productsService.addProduct(product);
    }

}
