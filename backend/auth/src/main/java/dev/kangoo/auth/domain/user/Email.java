package dev.kangoo.auth.domain.user;

import java.util.Locale;

public record Email(String value) {

    public Email(String value) {
        this.value = value.toLowerCase(Locale.ROOT).trim();
    }
}
