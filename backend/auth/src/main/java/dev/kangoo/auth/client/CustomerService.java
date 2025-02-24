package dev.kangoo.auth.client;

import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;

public interface CustomerService {

    CustomerResponse customerSignUp(CustomerRequest customerRequest);

}
