# SnapRoute Frontend

The SnapRoute dashboard is a React 19, TypeScript, and Vite application. It provides account flows, a link library, URL creation, and analytics views for the signed-in owner.

## Run locally

```sh
cp .env.example .env
pnpm install
pnpm dev
```

The API defaults to `http://localhost:5000/api`; the short-link host defaults to `http://localhost:5000`. Set `VITE_API_BASE_URL` or `VITE_SHORT_URL_BASE` in `.env` when using different hosts. These values are bundled into the browser, so do not put secrets in them.

## Build

```sh
pnpm build
pnpm preview
```

The production bundle is written to `dist/`, which is generated output and should not be committed.
