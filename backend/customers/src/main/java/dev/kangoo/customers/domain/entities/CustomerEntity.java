package dev.kangoo.customers.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity(name = "customers")
public class CustomerEntity {

    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
