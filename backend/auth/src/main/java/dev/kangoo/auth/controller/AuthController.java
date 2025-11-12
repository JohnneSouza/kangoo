package dev.kangoo.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AuthController implements Auth{

    public ResponseEntity<?> register(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        return ResponseEntity.ok(List.of(username, password));
    }
}
