# SnapRoute URL Shortening Service

SnapRoute is a full-stack URL shortener with a React and TypeScript dashboard and an Express API backed by MongoDB and Redis. Signed-in users can create and organize links, set aliases and expirations, protect links with a password, and review click analytics.

## Project layout

```text
12-url-shortening-service/
├── frontend/       React, TypeScript, Vite
├── server/         Express, TypeScript, MongoDB, Redis
├── api.md          API endpoint reference
└── README.md
```

## Requirements

- Node.js 20 or newer
- pnpm (or npm)
- Docker Compose, or local MongoDB and Redis instances

## Start locally

1. Start MongoDB and Redis from the server directory:

   ```sh
   cd server
   docker compose up -d
   ```

2. Configure and run the API:

   ```sh
   cp .env.example .env
   pnpm install
   pnpm dev
   ```

   The API runs at `http://localhost:5000`. Interactive API documentation is at `http://localhost:5000/api-docs`.

3. In another terminal, configure and run the dashboard:

   ```sh
   cd frontend
   cp .env.example .env
   pnpm install
   pnpm dev
   ```

   Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The frontend environment file points to the local API and short-link host by default.

## Environment configuration

`server/.env.example` documents the API settings. MongoDB and Redis are required. Google OAuth and Brevo email delivery are optional; configure their credentials to enable those flows. Use strong, unique JWT and session secrets in production.

`frontend/.env.example` documents `VITE_API_BASE_URL` and `VITE_SHORT_URL_BASE`. Vite variables are public and must never contain secrets.

## Build

Run these from each package directory:

```sh
pnpm build
```

For production, build the server and frontend separately, set the environment variables, and run the server with `pnpm start`. MongoDB and Redis must be reachable by the server.

## Main features

- Account registration, sign-in, Google OAuth, email verification, and password recovery
- JWT access tokens with an HTTP-only refresh-token cookie
- Custom aliases, tags, favorites, link passwords, expiration, archive/restore, and deletion
- Short-link redirects with Redis caching and asynchronous click analytics
- Owner-protected analytics dashboard
- Health endpoint at `/api/v1/health`
- OpenAPI UI at `/api-docs`

See [API reference](./api.md), [server guide](./server/README.md), and [system design](./server/docs/system-design.png).
