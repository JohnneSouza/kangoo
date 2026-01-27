# Kangoo - Open Source E-commerce SaaS

Kangoo is a modern, open-source e-commerce Software as a Service (SaaS) platform built with a focus on scalability, security, and developer experience.

## Project Overview

Kangoo aims to provide a robust foundation for building and scaling e-commerce businesses. It's designed with a microservices-ready architecture, starting with a powerful authentication and user management service.

### Key Features

- **Multi-tenant Architecture:** Built from the ground up to support multiple customers/merchants.
- **Secure Authentication:** Implements JWT-based authentication using RSA (RS256) for enhanced security.
- **User Management:** Comprehensive user registration and authentication flows.
- **Developer Friendly:** Includes OpenAPI (Swagger) documentation for easy API exploration and integration.
- **Modern Tech Stack:** Leverages the latest Java and Spring Boot features.

## Architecture

The project is currently composed of the following core modules:

### Auth Service (`/auth`)
The central hub for security and identity management.
- **Authentication:** Login via `/v1/auth/login`.
- **Registration:** New user sign-up via `/v1/auth/register`.
- **Security:** Uses RSA key pairs (stored in `resources/certs`) to sign and verify tokens.
- **Data Persistence:** Uses JPA with support for H2 (development) and PostgreSQL (production).

## Tech Stack

- **Language:** Java 25
- **Framework:** Spring Boot 4.x
- **Security:** Spring Security, JSON Web Token (jjwt)
- **Data Access:** Spring Data JPA, Hibernate
- **Database:** H2 (In-memory), PostgreSQL
- **Mapping:** MapStruct
- **API Documentation:** SpringDoc OpenAPI / Swagger UI
- **Build Tool:** Maven

## Getting Started

### Prerequisites

- Java 25 or higher
- Maven 3.9+

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/kangoo.git
   cd kangoo
   ```

2. **Generate RSA Keys (if not present):**
   The auth service requires RSA keys in `auth/src/main/resources/certs/`. Ensure `jwt_private.pem` and `jwt_public.pem` are present.

3. **Build the project:**
   ```bash
   cd auth
   ./mvnw clean install
   ```

### Running the Application

You can start the auth service using the Spring Boot Maven plugin:

```bash
cd auth
./mvnw spring-boot:run
```

The service will start by default on `http://localhost:8080`.

## API Documentation

Once the application is running, you can access the OpenAPI documentation at:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

## Configuration

Core configuration for the auth service can be found in `auth/src/main/resources/application.yaml`.

Key security properties:
- `security.jwt.expiration-minutes`: Controls the lifespan of the generated tokens (default: 60 minutes).

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (or check the `OpenApiConfiguration` for the license declaration).
