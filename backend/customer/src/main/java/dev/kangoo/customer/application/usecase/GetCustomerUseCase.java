package dev.kangoo.customer.application.usecase;

import dev.kangoo.customer.application.view.CustomerView;

public interface GetCustomerUseCase {

    CustomerView getById(String customerId);

}
