package dev.kangoo.customers.domain.dto;

public class AuthResponseDTO {

    private String token;
    private final AuthResponseCustomerDTO customer = new AuthResponseCustomerDTO();

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public AuthResponseCustomerDTO getCustomer() {
        return customer;
    }
}
