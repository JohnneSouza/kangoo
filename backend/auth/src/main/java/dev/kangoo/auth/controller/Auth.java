package dev.kangoo.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@RequestMapping("/v1/auth")
public interface Auth {

    @PostMapping("/signup")
    ResponseEntity<?> register(@RequestBody Map<String, String> body);

}
