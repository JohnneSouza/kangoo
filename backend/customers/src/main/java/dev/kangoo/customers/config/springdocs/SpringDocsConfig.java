package dev.kangoo.customers.config.springdocs;

import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocsConfig {

    @Bean
    public GroupedOpenApi employeesOpenApi(@Value("${springdoc.version}") String appVersion) {
        String[] paths = { "/auth/**" };
        return GroupedOpenApi.builder().group("Authentication")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Authentication")
                        .version(appVersion)))
                .pathsToMatch(paths)
                .build();
    }

    @Bean
    public GroupedOpenApi userOpenApi(@Value("${springdoc.version}") String appVersion) {
        String[] paths = { "/customers/**" };
        return GroupedOpenApi.builder().group("Customers")
                .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                        .title("Customers Management")
                        .version(appVersion)))
                .pathsToMatch(paths)
                .build();
    }

}
