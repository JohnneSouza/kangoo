package dev.kangoo.customer.adapter.web;

import dev.kangoo.customer.application.view.CustomerView;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(
        value = "/v1/customer",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public interface CustomerAPI {

    @GetMapping
    CustomerView getCustomerInfo(@AuthenticationPrincipal Jwt jwt);

}
