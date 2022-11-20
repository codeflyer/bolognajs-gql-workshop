CREATE TABLE "customer" (
  "id" varchar NOT NULL PRIMARY KEY,
  "email" varchar NOT NULL,
  "accept_commercials" boolean NOT NULL
);

CREATE UNIQUE INDEX "ix_customer_email" ON "customer" ("email");
