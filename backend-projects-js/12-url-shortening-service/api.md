# SnapRoute API

Base URL: `http://localhost:5000/api/v1`. Interactive documentation is served at `/api-docs`.

Protected endpoints require `Authorization: Bearer <accessToken>`. Login and registration return the access token in `data.accessToken`; refresh tokens are held in an HTTP-only cookie.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account (`username`, `email`, `password`) |
| `POST` | `/auth/login` | Sign in (`email`, `password`) |
| `POST` | `/auth/refresh` | Use the refresh cookie to get a new access token |
| `POST` | `/auth/logout` | Clear the refresh cookie |
| `GET` | `/auth/me` | Read the signed-in account profile (Bearer token required) |
| `POST` | `/auth/verify-email` | Verify an account using a six-digit `otp` (Bearer token required) |
| `POST` | `/auth/resend-verification` | Send a replacement verification code (Bearer token required) |
| `POST` | `/auth/forgot-password` | Request a reset email (`email`) |
| `POST` | `/auth/reset-password/:token` | Set a new `password` |
| `GET` | `/auth/google` | Begin Google OAuth (requires credentials) |
| `GET` | `/auth/google/callback` | Complete the Google OAuth handoff |

## URL management

All management endpoints require a Bearer token.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/urls` | Create a link (`originalUrl`; optionally `customAlias`, `tags`, `isFavorite`, `password`, `expiresAt`) |
| `GET` | `/urls` | List your active links; accepts `search`, `tag`, `isFavorite`, `archived`, `page`, and `limit` |
| `GET` | `/urls/check-alias/:alias` | Check whether a custom alias is available |
| `PATCH` | `/urls/:id` | Update tags, favorite state, password, or expiration |
| `PATCH` | `/urls/:id/archive` | Archive or restore using `{ "isArchived": true }` |
| `DELETE` | `/urls/:id` | Permanently delete one of your links |
| `POST` | `/urls/bulk-delete` | Delete up to 100 owned links using `{ "ids": ["..."] }` |

Link creation returns `data.shortUrl` and a QR code data URL. Short codes can also be opened directly at `http://localhost:5000/:shortCode`; valid links return a `302` redirect. Password-protected links display a password form in a browser.

## Analytics and infrastructure

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/urls/:shortCode/analytics` | Return click totals and device, browser, OS, and daily breakdowns |
| `GET` | `/health` | Report MongoDB and Redis connectivity |

Analytics are public to anyone who knows the short code. Click totals update asynchronously after redirects.
