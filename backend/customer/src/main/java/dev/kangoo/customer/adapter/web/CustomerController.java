package dev.kangoo.customer.adapter.web;

import dev.kangoo.customer.application.usecase.GetCustomerUseCase;
import dev.kangoo.customer.application.view.CustomerView;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerController implements CustomerAPI{

    private final GetCustomerUseCase getCustomerUseCase;

    public CustomerController(GetCustomerUseCase getCustomerUseCase) {
        this.getCustomerUseCase = getCustomerUseCase;
    }

    public CustomerView getCustomerInfo(Jwt jwt) {
        String customerId = jwt.getSubject();
        return this.getCustomerUseCase.getById(customerId);
    }
}