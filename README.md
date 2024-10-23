# Hono REST API Startkit

Using Hono + Mysql + Drizzle ORM on Bun runtime

### Bun runtime

Make sure you have the following installed:

- [Bun](https://bun.sh)

### Installations:

To install dependencies:

```sh
bun install
```

To run:

```sh
bun dev
```

open http://localhost:3000

### Configuration

Create a .env file in the root directory of your project

```
cp .env.example .env
```

### Migrations

For Migration generate

- Update file drizzle/schema.ts
- Then run

```bash
bun migration:generate
```

Run the migration and seed scripts:

```bash
bun migration:run
```

Seed

```bash
bun src/db/seed.ts
```
