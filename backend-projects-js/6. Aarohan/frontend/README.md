# Aarohan Frontend

React and Vite client for the Aarohan blog platform. It connects to the Express
API using `VITE_API_BASE_URL`.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The app defaults to `http://localhost:5173` and expects the API at
`http://localhost:5000/api/v1`. Configure the backend's `CLIENT_URL` and
`ALLOWED_ORIGINS` to allow the frontend origin.

## Included flows

- Public story feed with search and category filters
- Registration, email OTP verification, login and password recovery
- Story reading, comments, reactions and bookmarks
- Author dashboard, profile settings, draft editor and publishing
- Cloudinary image upload in the story editor
- Admin dashboard for metrics, member roles/status and content moderation

For backend configuration, API routes and the architecture diagram, see
[`../backend/README.md`](../backend/README.md).
