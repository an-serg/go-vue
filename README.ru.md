# go-vue (BookTook)

[English](README.md) · **Русский**

Пет-проект: микросервисное веб-приложение с SPA на Vue 3 и разделением бэкенда на API Gateway, сервис аутентификации и бизнес-сервис. Всё поднимается через Docker Compose за одним nginx.

## Стек

| Слой | Технологии |
|---|---|
| Frontend | Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, vue-router, Pinia, Tailwind CSS, FingerprintJS |
| Gateway | NestJS 10 (TypeScript), `@nestjs/axios`, `@nestjs/jwt` |
| Auth | NestJS 10 (TypeScript), TypeORM, PostgreSQL, argon2, class-validator |
| Business API | Go 1.23, stdlib `net/http` |
| Инфраструктура | Docker, Docker Compose, nginx (edge + отдача статики) |
| Тулинг | ESLint + oxlint, Prettier, vue-tsc, tsc, Nest CLI |

## Архитектура

```text
                    :80
        браузер ──► nginx (edge)
                     │
        ┌────────────┴─────────────┐
        │ /                        │ /api/
        ▼                          ▼
   frontend:80              gateway:3000  (NestJS, проверка JWT)
   (nginx + dist)                 │
                     ┌────────────┴────────────┐
                     ▼                         ▼
               auth:3001                  users:3002
              (NestJS)                   (не реализован)
                  │
                  ▼
             PostgreSQL           
        (внешняя сеть postgre_booktook_net)
```

### Сервисы

**`nginx/`** — единая точка входа, слушает `:80`.
`/` проксируется на контейнер `frontend`, `/api/` — на `gateway:3000` с пробросом `Cookie`, `X-Real-IP`, `X-Forwarded-For`.

**`frontend/`** — SPA на Vue 3 + Vite. Multi-stage Docker-образ: сборка на `node:22-alpine`, раздача статики через `nginx:alpine` с `try_files ... /index.html` для history-режима роутера.
Ключевые части: `src/router/index.ts` (глобальный `beforeEach`-guard по списку публичных маршрутов), `src/composables/useAuth.ts` (проверка сессии через `/api/auth/me` с автоматическим ретраем после `/api/auth/refresh`), `src/components/auth/` (формы логина/регистрации с live-валидацией доступности email/username).

**`gateway/`** — API Gateway на NestJS. Не имеет собственной БД, задачи:

- проверка access-токена (`JwtAuthGuard`, RS256, только публичный ключ) — гейт read-only, приватный ключ в контейнер не попадает;
- эндпоинт `GET /auth/me` — отдаёт `sub`/`email` из валидного токена;
- прозрачное проксирование остальных `/auth/*` в `auth:3001` (с пробросом `Cookie`, `x-fingerprint` и обратной трансляцией `Set-Cookie`);
- проксирование `/users/*` в `users:3002` с подстановкой `x-user-id` — сервис `users` ещё не написан.

**`auth/`** — сервис аутентификации на NestJS + TypeORM (PostgreSQL, `synchronize: true`).
Модули: `auth` (register/login), `jwt` (refresh/logout), `check-data` (проверка занятости email/username), `users` (сущность `User`).
Сущности: `users` (uuid, nick, username, email, password — argon2-хеш через `@BeforeInsert`) и `sessions` (uuid, user_id, sha256 refresh-токена, sha256 отпечатка устройства, user_agent, expires_at, is_revoked).

**`backend/`** — Go-сервис на чистой стдлибе, один хендлер `GET /api/hello` на `:8080`. Заготовка под бизнес-логику; в текущей конфигурации nginx на него не маршрутизирует.

## Аутентификация

Схема: **RS256 JWT в httpOnly-куках + серверные сессии с привязкой к отпечатку устройства**.

TTL заданы в `auth/src/config/token.config.ts`, флаги кук — в `auth/src/config/cookie.config.ts`.

## API

Через edge nginx все пути имеют префикс `/api/`.

| Метод | Путь | Сервис | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | auth (через gateway) | нет |
| POST | `/api/auth/login` | auth (через gateway) | нет |
| POST | `/api/auth/refresh` | auth (через gateway) | refresh-кука |
| POST | `/api/auth/logout` | auth (через gateway) | refresh-кука |
| GET | `/api/auth/me` | gateway | access-кука |
| GET | `/api/auth/email?email=` | auth (через gateway) | нет |
| GET | `/api/auth/username?username=` | auth (через gateway) | нет |
| ALL | `/api/users/*` | gateway → `users:3002` | access-кука |

Ошибки валидации приводятся к единому виду `{ field, message }` кастомным `exceptionFactory` в `ValidationPipe`, чтобы фронт подсвечивал конкретное поле формы.

## Запуск

Требуется внешняя docker-сеть с PostgreSQL:

```bash
docker network create postgre_booktook_net   # если ещё не создана
docker compose up --build
```

Приложение — на `http://localhost` (порт 80 публикует только `nginx`, остальные сервисы доступны лишь внутри сети через `expose`).

Нужны файлы, которых нет в репозитории (в `.gitignore`):

- `auth/.env` — `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_PRIVATE_KEY_PATH`
- `backend/.env` — `PORT`
- RSA-пара для подписи токенов:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Приватный ключ монтируется в `auth`, публичный — в `gateway` (`./gateway/keys/public.pem`).

