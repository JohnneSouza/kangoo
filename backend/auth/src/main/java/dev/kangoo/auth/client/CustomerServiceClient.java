package dev.kangoo.auth.client;

import dev.kangoo.auth.domain.request.CustomerRequest;
import dev.kangoo.auth.domain.response.CustomerResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CustomerServiceClient implements CustomerService {

    private final WebClient webClient;

    public CustomerServiceClient(WebClient.Builder webClientBuilder,
                                 @Value("{$client.customer.baseUrl}") String customerServiceUrl) {
        this.webClient = WebClient
                .builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .baseUrl(customerServiceUrl)
                .build();;
    }

    @Override
    public CustomerResponse customerSignUp(CustomerRequest customerRequest) {
        return this.webClient
                .post()
                .uri("/customer-management/signup")
                .retrieve()
                .bodyToMono(CustomerResponse.class)
                .block();
    }
}
