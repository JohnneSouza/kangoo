package kangoo.com.auth.adapter.http;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

}
