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

**`auth/`** — the authentication service, NestJS + TypeORM (PostgreSQL, `synchronize: true`).
Modules: `auth` (register/login), `jwt` (refresh/logout), `check-data` (email/username availability checks), `users` (the `User` entity).
Entities: `users` (uuid, nick, username, email, password — argon2 hash via `@BeforeInsert`) and `sessions` (uuid, user_id, sha256 of the refresh token, sha256 of the device fingerprint, user_agent, expires_at, is_revoked).

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

- `auth/.env` — `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_PRIVATE_KEY_PATH`
- `backend/.env` — `PORT`
- an RSA key pair for signing tokens:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

The private key is mounted into `auth`, the public one into `gateway` (`./gateway/keys/public.pem`).
