---
date: 2025-06-11
title: A problem with GroupedOpenApi
layout: post
description: Possible solution if your GroupedOpenApi doesn't work in Spring Boot 3
categories: notes
lang: en
tags:
  - Java
---

Yesterday I had a problem with `GroupedOpenApi` in my Spring Bot 3 project. It seemed like Swagger was completely ignoring it. Swagger was working fine, it used settings provided by `OpenAPI` bean, but it wasn't dividing my APIs into any groups. 

(I'm talking about these groups that are placed in the dropdown field, not tags)
![Groups](/data/images/posts/swagger-groups.png)

My configuration class looked like:
```java
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info().title("OpenAPI definition")
                        .description("Sample application")
                        .version("v0.0.1");
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .displayName("Administration API")
                .pathsToMatch("/api/admin/**")
                .build();
    }

    @Bean
    public GroupedOpenApi platformApi() {
        return GroupedOpenApi.builder()
                .group("app")
                .displayName("Application API")
                .pathsToExclude("/api/admin/**")
                .build();
    }
}
```

Swagger was working with the settings provided by `OpenAPI` bean, but `GroupedOpenApi` beans seemed ignored.

The solution was quite simple, but not obvious.

**Firstly**, I fixed dependencies. In my case, there was this suspicious pair in the project:
```gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'
implementation 'org.springdoc:springdoc-openapi-ui:1.7.0'
```
*(that project uses gradle, so the example also uses gradle)*

`org.springdoc:springdoc-openapi-ui` is a part of `springdoc-openapi-v1` ([docs](https://springdoc.org/#migrating-from-springdoc-v1), [mirror](https://github.com/springdoc/springdoc-openapi-demos/wiki/springdoc-openapi-2.x-migration-guide)) and shouldn't be mixed with `springdoc-openapi-starter-webmvc-ui`. Spring Boot 3 requires `springdoc-openapi-v2`, so `springdoc-openapi-starter-webmvc-ui` is the only one we need.

**In second**, I changed imports:

```java
import org.springdoc.core.GroupedOpenApi;
```
should be replaced with
```java
import org.springdoc.core.models.GroupedOpenApi;
```

After applying these fixes, I've got working API groups. It looks like the migration wasn't completed properly, even though Swagger and everything else were working fine.

### P.S.

*I don't usually write an entire post about fixing a minor issue, but some mistakes are easy to fix but hard to figure out what to fix. This was one of those mistakes for me, and I saw a few similar questions on SO and GitHub while I was solving it:*

- <https://stackoverflow.com/questions/63627462/swagger-openapi-3-0-springdoc-groupedopenapi-not-working-in-spring-mvc>
- <https://github.com/springdoc/springdoc-openapi/issues/2685>
- <https://medium.com/@leonardo.avena/the-groupedopenapi-is-totally-ignored-in-springboot-3-e390b718c163>

*So, I think it's a good idea to share my solution here.*
