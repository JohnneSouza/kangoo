package dev.kangoo.controller;

import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.service.ProductsService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "products",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductsController implements ProductsAPI {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    public List<ProductEntity> findAll() {
        return this.productsService.findAll();
    }

    public ProductEntity findOne(String id){
        return this.productsService.findOneById(new ObjectId(id));
    }

    @PutMapping("{id}")
    public ProductEntity updateOne(@PathVariable String id, @RequestBody Product product){
        return this.productsService.updateOne(new ObjectId(id), product);
    }

    @PostMapping
    public ProductEntity save(@RequestBody Product product){
        return this.productsService.addProduct(product);
    }


    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
         this.productsService.deleteProductById(new ObjectId(id));
    }

}
