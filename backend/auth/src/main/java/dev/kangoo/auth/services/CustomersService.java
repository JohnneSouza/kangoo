package dev.kangoo.auth.services;

import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;

public interface CustomersService {

    CustomerResponse customerSignUp(CustomerRequest customerRequest);

    void activateAccount(String code);
}
