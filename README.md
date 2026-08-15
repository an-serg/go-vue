# go-vue (BookTook)

**English** · [Русский](README.ru.md)

Pet project: a microservice web application with a Vue 3 SPA and a backend split into an API gateway, an authentication service and a business service. Everything runs under Docker Compose behind a single nginx.

## Stack

| Layer | Technologies |
|---|---|
| Frontend | Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, vue-router, Pinia, Tailwind CSS, FingerprintJS |
| Gateway | NestJS 10 (TypeScript), `@nestjs/axios`, `@nestjs/jwt` |
| Auth | NestJS 10 (TypeScript), TypeORM, PostgreSQL, argon2, class-validator |
| Business API | Go 1.23, stdlib `net/http` |
| Infrastructure | Docker, Docker Compose, nginx (edge + static file serving) |
| Tooling | ESLint + oxlint, Prettier, vue-tsc, tsc, Nest CLI |

## Architecture

```text
                    :80
        browser ──► nginx (edge)
                     │
        ┌────────────┴─────────────┐
        │ /                        │ /api/
        ▼                          ▼
   frontend:80              gateway:3000  (NestJS, verifies JWT)
   (nginx + dist)                 │
                     ┌────────────┴────────────┐
                     ▼                         ▼
               auth:3001                  users:3002
              (NestJS)                (not implemented)
                  │
                  ▼
             PostgreSQL           
        (external network postgre_booktook_net)
```

### Services

**`nginx/`** — the single entry point, listening on `:80`.
`/` is proxied to the `frontend` container, `/api/` to `gateway:3000`, forwarding `Cookie`, `X-Real-IP` and `X-Forwarded-For`.

**`frontend/`** — a Vue 3 + Vite SPA. Multi-stage Docker image: built on `node:22-alpine`, static files served by `nginx:alpine` with `try_files ... /index.html` for the router's history mode.
Key parts: `src/router/index.ts` (global `beforeEach` guard driven by a list of public routes), `src/composables/useAuth.ts` (session check via `/api/auth/me` with an automatic retry after `/api/auth/refresh`), `src/components/auth/` (login and registration forms with live email/username availability validation).

**`gateway/`** — a NestJS API gateway. It owns no database; its jobs are:

- verifying the access token (`JwtAuthGuard`, RS256, public key only) — the gateway is read-only and never receives the private key;
- the `GET /auth/me` endpoint — returns `sub`/`email` from a valid token;
- transparently proxying the remaining `/auth/*` calls to `auth:3001` (forwarding `Cookie` and `x-fingerprint`, and relaying `Set-Cookie` back);
- proxying `/users/*` to `users:3002` with an injected `x-user-id` — the `users` service has not been written yet.

**`auth/`** — the authentication service, NestJS + TypeORM (PostgreSQL, schema managed by migrations).
Split by domain: the `auth` module covers login, logout, sessions and email/username availability checks (`auth.controller`, `session.controller`, `availability.controller`, plus `token.service` and `cookie.service`); the `users` module owns user data.
Entities: `users` (uuid, nick, username, email, email_verified, password — argon2 hash via `@BeforeInsert`, hidden with `select: false`, bio, avatar_url, settings jsonb, created_at, last_login) and `sessions` (uuid, user_id, sha256 of the refresh token, sha256 of the device fingerprint, user_agent, expires_at, is_revoked).

**`backend/`** — a Go service on the bare standard library, a single `GET /api/hello` handler on `:8080`. A placeholder for business logic; the current nginx configuration does not route to it.

## Authentication

The scheme: **RS256 JWT in httpOnly cookies + server-side sessions bound to a device fingerprint**.

TTLs live in `auth/src/config/token.config.ts`, cookie flags in `auth/src/config/cookie.config.ts`.

## API

Behind the edge nginx every path is prefixed with `/api/`.

| Method | Path | Service | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | auth (via gateway) | none |
| POST | `/api/auth/login` | auth (via gateway) | none |
| POST | `/api/auth/refresh` | auth (via gateway) | refresh cookie |
| POST | `/api/auth/logout` | auth (via gateway) | refresh cookie |
| GET | `/api/auth/me` | gateway | access cookie |
| GET | `/api/auth/email?email=` | auth (via gateway) | none |
| GET | `/api/auth/username?username=` | auth (via gateway) | none |
| ALL | `/api/users/*` | gateway → `users:3002` | access cookie |

Validation errors are normalised to a single `{ field, message }` shape by a custom `exceptionFactory` in `ValidationPipe`, so the frontend can highlight the exact form field.

## Running

An external docker network with PostgreSQL is required:

```bash
docker network create postgre_booktook_net   # if it does not exist yet
docker compose up --build
```

The app is served at `http://localhost` (only `nginx` publishes port 80; the other services are reachable inside the network via `expose`).

Files that are not in the repository (they are in `.gitignore`) are needed:

- `auth/.env` — `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_PRIVATE_KEY_PATH`, plus `COOKIE_SECURE=true` wherever the app is served over HTTPS
- `backend/.env` — `PORT`
- `nginx/nginx.conf` — differs per environment: `:80` only locally, TLS and `:443` on the server
- an RSA key pair for signing tokens:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

The private key is mounted into `auth`, the public one into `gateway` (`./gateway/keys/public.pem`).

## Migrations

The database schema is managed by TypeORM migrations; `synchronize` is off. Migration files live in `auth/src/migrations/`, and the connection options shared by the app and the CLI are in `auth/src/data-source.ts`.

```bash
docker compose exec auth npm run migration:generate -- src/migrations/MigrationName
docker compose exec auth npm run migration:show     # [X] — applied
docker compose exec auth npm run migration:run
```

The app applies pending migrations on startup (`migrationsRun: true`), so restarting the container is usually enough. Always read a generated migration before applying it: the generator diffs entities against the live schema and cannot tell a renamed column from a drop followed by an add.
