# Kangoo — Auth Service

## Prerequisites

Java 25+, Docker, and OpenSSL.

## 1. Start the backing services

The service needs PostgreSQL, RabbitMQ and Mailpit to run properly. All three are defined in
`docker-compose.yaml` in this directory. From the `backend/` directory:

```bash
docker compose up -d
```

This creates the `auth` and `customer` databases via
`scripts/docker-entrypoint-initdb.d/01-create-databases.sql`.

## 2. Generate the JWT keys

The service signs tokens with RS256 and will not start without a signing key. Generate the
keypair **outside the repository** — it must never be committed, and must never end up inside a
build artifact:

```bash
mkdir -p ~/.kangoo/secrets && chmod 700 ~/.kangoo/secrets
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out ~/.kangoo/secrets/jwt_private.pem
openssl rsa -pubout -in ~/.kangoo/secrets/jwt_private.pem -out ~/.kangoo/secrets/jwt_public.pem
chmod 600 ~/.kangoo/secrets/jwt_private.pem
```

Keep the default PEM headers: the private key must be **PKCS#8**
(`-----BEGIN PRIVATE KEY-----`) and the public key **X.509** (`-----BEGIN PUBLIC KEY-----`).

## 3. Run

The key material is injected through the environment, not read from the classpath:

```bash
export JWT_PRIVATE_KEY_PEM="$(cat ~/.kangoo/secrets/jwt_private.pem)"
export JWT_PUBLIC_KEY_PEM="$(cat ~/.kangoo/secrets/jwt_public.pem)"
export JWT_KEY_ID="kangoo-auth-2026-09"

./mvnw spring-boot:run
```

The service starts on **http://localhost:8080** and publishes its public key at
`/.well-known/jwks.json`. If `JWT_PRIVATE_KEY_PEM` is missing or unreadable, startup fails with a
configuration error naming the variable.

## Rotating the key

Generate a new keypair as in step 2, set `JWT_KEY_ID` to a fresh value, and restart. Issued
tokens carry the `kid` that signed them, so verifiers can select the right key during the
overlap instead of falling back to a single hardcoded key.
