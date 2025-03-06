package dev.kangoo.auth.client;

import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CustomerServiceClient {

    private final WebClient webClient;

    public CustomerServiceClient(WebClient.Builder webClientBuilder,
                                 @Value("{$client.customer.baseUrl}") String customerServiceUrl) {
        this.webClient = WebClient
                .builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .baseUrl(customerServiceUrl)
                .build();;
    }

    public CustomerResponse customerSignUp(CustomerRequest customerRequest) {
        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setCustomerId(customerRequest.getCustomerId());

        return customerResponse;
//        return this.webClient
//                .post()
//                .uri("/customer-management/signup")
//                .retrieve()
//                .bodyToMono(CustomerResponse.class)
//                .block();
    }
}
