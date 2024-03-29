package dev.kangoo.customers.controller.contract;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kangoo.customers.controller.CustomersController;
import dev.kangoo.customers.domain.request.CustomerRequest;
import dev.kangoo.customers.domain.request.CustomerRequestMock;
import dev.kangoo.customers.service.CustomerService;
import dev.kangoo.customers.testsconfig.TestContainersAbstractConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
public class SaveCustomerContractTest extends TestContainersAbstractConfig {

    @Autowired
    private CustomerService customerService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new CustomersController(this.customerService))
                .build();
    }

    @Test
    void givenValidRequest_whenSaveCustomer_thenReturnCreated() throws Exception {
        String requestBody = this.objectMapper.writeValueAsString(CustomerRequestMock.withAllFields());
        MockHttpServletResponse response = this.mockMvc.perform(post("/customers")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        assertEquals(HttpStatus.CREATED.value(), response.getStatus());
    }

    @ParameterizedTest
    @MethodSource("missingFieldArgumentProvider")
    void givenMissingField_whenSaveCustomer_thenReturnBadRequest(CustomerRequest request) throws Exception {
        String requestBody = this.objectMapper.writeValueAsString(request);
        MockHttpServletResponse response = this.mockMvc.perform(post("/customers")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatus());
    }

    public static Stream<Arguments> missingFieldArgumentProvider() {
        return Stream.of("email", "firstName", "password")
                .map(field -> {
            CustomerRequest customerRequest = CustomerRequestMock.withAllFields();
            switch (field) {
                case "email":
                    customerRequest.setEmail(null);
                    break;
                case "firstName":
                    customerRequest.setFirstName(null);
                    break;
                case "password":
                    customerRequest.setPassword(null);
                    break;
            }
            return Arguments.of(customerRequest);
        });
    }


}
