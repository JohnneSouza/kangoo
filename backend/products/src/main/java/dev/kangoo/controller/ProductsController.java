package dev.kangoo.controller;

import dev.kangoo.domain.product.ProductRequest;
import dev.kangoo.domain.product.ProductResponse;
import dev.kangoo.service.ProductsService;
import org.bson.types.ObjectId;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
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

    public List<ProductResponse> findAll() {
        return this.productsService.findAll();
    }

    public ProductResponse findOne(String id){
        return this.productsService.findOneById(new ObjectId(id));
    }

    public ProductResponse updateOne(String id, ProductRequest productRequest){
        return this.productsService.updateOne(new ObjectId(id), productRequest);
    }

    public ProductResponse save(ProductRequest productRequest){
        return this.productsService.addProduct(productRequest);
    }


    public void delete(String id) {
         this.productsService.deleteProductById(new ObjectId(id));
    }

}
