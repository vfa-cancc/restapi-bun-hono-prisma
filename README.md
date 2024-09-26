# Hono REST API Startkit

Using Hono + Mysql + Prisma on Bun runtime

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
bun run dev
```

open http://localhost:3000

### Configuration

Create a .env file in the root directory of your project

```
cp .env.example .env
```

### Migrations

Then run the migration and seed scripts:

```bash
bunx prisma migrate dev
```
