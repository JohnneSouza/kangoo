package dev.kangoo.customers.application.usecase;

import dev.kangoo.customers.application.view.CustomerView;

public interface GetCustomerUseCase {

    CustomerView getById(String customerId);

}
