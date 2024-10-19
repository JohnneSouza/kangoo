package dev.kangoo.controller;

import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.service.ProductsService;
import org.bson.types.ObjectId;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "products",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductsController implements ProductsAPI {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    public Flux<ProductResponse> findAll() {
        return this.productsService.findAll();
    }

    public Mono<ProductResponse> findOne(String id){
        return this.productsService.findOneById(new ObjectId(id));
    }

    public Mono<ProductResponse> updateOne(String id, ProductRequest productRequest){
        return this.productsService.updateOne(new ObjectId(id), productRequest);
    }

    public Mono<ProductResponse> save(ProductRequest productRequest){
        return this.productsService.addProduct(productRequest);
    }


    public Mono<Void> delete(String id) {
         return this.productsService.deleteProductById(new ObjectId(id));
    }

}
