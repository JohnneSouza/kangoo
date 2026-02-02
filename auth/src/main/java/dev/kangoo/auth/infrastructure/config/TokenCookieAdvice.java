package dev.kangoo.auth.infrastructure.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class TokenCookieAdvice {

    @ModelAttribute
    public void addTokenCookie(@AuthenticationPrincipal Jwt jwt, HttpServletResponse response) {

        if (jwt == null) return;

        ResponseCookie cookie = ResponseCookie.from("token", jwt.getTokenValue())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}