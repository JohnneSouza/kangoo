CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   firstName VARCHAR(100) NOT NULL,
   lastName VARCHAR(100),
   email VARCHAR(255) UNIQUE NOT NULL,
   password_hash CHAR(80) NOT NULL
);