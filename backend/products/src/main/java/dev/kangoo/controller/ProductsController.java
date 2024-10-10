package dev.kangoo.controller;

import dev.kangoo.domain.product.Product;
import dev.kangoo.domain.product.ProductEntity;
import dev.kangoo.service.ProductsService;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;


@RestController
@RequestMapping(value = "products",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping
    public Flux<ProductEntity> getAllProducts(
            @RequestParam(required = false, name = "filter", defaultValue = "{}") String filter,
            @RequestParam(required = false, name = "range", defaultValue = "[0,9]") String range,
            @RequestParam(required = false, name = "sort", defaultValue = "[\"id\",\"ASC\"]") String sort,
            ServerHttpResponse response) {

        int[] rangeArray = parseRange(range);
        int page = rangeArray[0] / (rangeArray[1] - rangeArray[0] + 1);
        int size = rangeArray[1] - rangeArray[0] + 1;

        String[] sortArray = parseSort(sort);
        String sortBy = sortArray[0];
        Sort.Direction direction = Sort.Direction.fromString(sortArray[1]);

        Pageable pageable = PageRequest.of(page, size, direction, sortBy);

        Mono<Long> totalProductsMono = this.productsService.countTotalProducts();
        Flux<ProductEntity> productsFlux = this.productsService.getAllProducts(pageable);

        return totalProductsMono.doOnNext(totalProducts -> {
            long totalPages = (totalProducts + size - 1) / size;
            long start = (long) page * size;
            long end = Math.min(start + size - 1, totalProducts - 1);

            response.getHeaders().add("Content-Range", "products " + start + "-" + end + "/" + totalProducts);
            response.getHeaders().add("X-Current-Page", String.valueOf(page));
            response.getHeaders().add("X-Page-Size", String.valueOf(size));
            response.getHeaders().add("X-Total-Pages", Long.toString(totalPages));
        }).thenMany(productsFlux);

    }

    @PostMapping
    public Mono<ProductEntity> save(@RequestBody Product product){
        return this.productsService.addProduct(product);
    }


    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Mono<Map<String, String>> delete(@PathVariable String id) {
        return this.productsService.deleteProductById(new ObjectId(id))
                .thenReturn(Collections.singletonMap("id", id));
    }

    private int[] parseRange(String range) {
        range = range.replace("[", "").replace("]", "");
        String[] parts = range.split(",");
        return new int[] { Integer.parseInt(parts[0]), Integer.parseInt(parts[1]) };
    }

    private String[] parseSort(String sort) {
        sort = sort.replace("[", "").replace("]", "").replace("\"", "");
        return sort.split(",");
    }

}
