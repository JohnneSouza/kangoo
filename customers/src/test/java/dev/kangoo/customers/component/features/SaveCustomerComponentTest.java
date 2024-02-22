package dev.kangoo.customers.component.features;

import dev.kangoo.customers.domain.request.CustomerRequest;
import dev.kangoo.customers.domain.request.CustomerRequestMock;
import dev.kangoo.customers.domain.response.CustomerResponse;
import dev.kangoo.customers.domain.response.ErrorResponse;
import dev.kangoo.customers.testsconfig.TestContainersAbstractConfig;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SaveCustomerComponentTest extends TestContainersAbstractConfig {

    @LocalServerPort
    private int port;

    @BeforeEach
    public void setup() {
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";
        RestAssured.basePath = "/customers";
    }

    @Test
    void givenValidRequest_whenSaveCustomer_thenReturnCustomerData(){
        CustomerRequest requestBody = CustomerRequestMock.withAllFields();
        Response response =
                given()
                        .body(requestBody)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                        .post()
                .thenReturn();

        CustomerResponse responseBody = response.as(CustomerResponse.class);

        assertEquals(201, response.getStatusCode());

        assertEquals(requestBody.getEmail(), responseBody.getEmail());
        assertEquals(requestBody.getFirstName(), responseBody.getFirstName());
        assertEquals(requestBody.getLastName(), responseBody.getLastName());

        assertNotNull(responseBody.getId());
    }

    @Test
    void givenDuplicatedRequest_whenSaveCustomer_thenReturnConflict(){
        CustomerRequest requestBody = CustomerRequestMock.withAllFields();

        given()
                .body(requestBody)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
        .when()
                .post()
        .thenReturn();


        Response response =
                given()
                        .body(requestBody)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                        .post()
                .thenReturn();


        ErrorResponse responseBody = response.as(ErrorResponse.class);

        String detailsMessage = String.format("A customer with email '%s' already exists.", requestBody.getEmail());

        assertEquals(409, response.getStatusCode());

        assertNotNull(responseBody);
        assertEquals("Customer already exists.", responseBody.getMessage());
        assertEquals(detailsMessage, responseBody.getDetails().get(0));
    }

    @Test
    void givenInvalidRequest_whenSaveCustomer_thenReturnBadRequest(){
        CustomerRequest requestBody = CustomerRequestMock.withAllFields();
        requestBody.setPassword(null);

        Response response =
                given()
                        .body(requestBody)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                        .post()
                .thenReturn();

        ErrorResponse responseBody = response.as(ErrorResponse.class);

        assertNotNull(responseBody);
        assertEquals(400, response.getStatusCode());
        assertEquals("Required argument is null or missing.", responseBody.getMessage());
        assertEquals("The field 'password' should not be null or empty.", responseBody.getDetails().get(0));
    }
}
